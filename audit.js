// Dev-only consistency check for the program data and exercise demos.
//   node audit.js         check that every exercise and swap option maps to a demo
//   node audit.js --net   also check that every demo URL responds with a GIF
// Exits with code 1 when something is wrong.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = vm.createContext({ console });
for (const file of ['program.js', 'exercises.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), ctx, { filename: file });
}
const { PROGRAM, PROGRAM_CHANGES, WARMUP, EXERCISE_MEDIA, exerciseMoveId } =
    vm.runInContext('({ PROGRAM, PROGRAM_CHANGES, WARMUP, EXERCISE_MEDIA, exerciseMoveId })', ctx);

const errors = [];
const warnings = [];
const used = new Set();

for (const [block, sessions] of Object.entries(PROGRAM.blocks)) {
    for (const [session, list] of Object.entries(sessions)) {
        const seen = new Set();
        for (const ex of list) {
            const where = `block ${block} / ${PROGRAM.sessions[session].name}`;
            if (seen.has(ex.name)) errors.push(`${where}: duplicate exercise "${ex.name}" (its saved data would collide)`);
            seen.add(ex.name);
            if (!(ex.sets > 0)) errors.push(`${where}: "${ex.name}" has no sets`);
            if (!/\d/.test(ex.reps) && !/failure/i.test(ex.reps)) errors.push(`${where}: "${ex.name}" has odd reps "${ex.reps}"`);
            if (!/min/.test(ex.rest)) errors.push(`${where}: "${ex.name}" has odd rest "${ex.rest}"`);
            for (const name of [ex.name, ...(ex.subs || [])]) {
                const id = exerciseMoveId(name);
                if (!id) { errors.push(`${where}: no demo mapping for "${name}"`); continue; }
                if (!EXERCISE_MEDIA.moves[id]) { errors.push(`"${name}" maps to unknown movement "${id}"`); continue; }
                used.add(id);
            }
        }
    }
}
// Replaced exercises: saved data is moved from `from` to `to` in that block/session, so `to`
// must exist there and `from` must be gone. A misspelt `from` can't be caught here (it would
// just leave the old data behind), so copy it exactly from the old program.
for (const c of PROGRAM_CHANGES) {
    const list = PROGRAM.blocks[c.block]?.[c.session];
    const where = `change block ${c.block} / session ${c.session}`;
    if (!list) { errors.push(`${where}: no such session`); continue; }
    if (!list.some((ex) => ex.name === c.to)) errors.push(`${where}: replacement "${c.to}" is not in the program`);
    if (list.some((ex) => ex.name === c.from)) errors.push(`${where}: replaced "${c.from}" is still in the program`);
    if (PROGRAM_CHANGES.filter((o) => o.block === c.block && o.session === c.session && o.from === c.from).length > 1) errors.push(`${where}: "${c.from}" listed twice`);
}

for (const section of WARMUP) {
    for (const item of section.items) {
        if (!EXERCISE_MEDIA.moves[item.move]) errors.push(`warm-up "${item.name}" points at unknown movement "${item.move}"`);
        else used.add(item.move);
    }
}

const noDemo = [];
for (const [id, move] of Object.entries(EXERCISE_MEDIA.moves)) {
    if (!used.has(id)) warnings.push(`movement "${id}" is not used by any exercise`);
    if (move.gif === null) noDemo.push(id);
    else if (typeof move.gif !== 'string' || !/^https:\/\/fitnessprogramer\.com\/wp-content\/uploads\/.+\.gif$/i.test(move.gif)) {
        errors.push(`movement "${id}" has an invalid gif URL: ${move.gif}`);
    }
    if (!move.muscle) warnings.push(`movement "${id}" has no muscle label`);
}
for (const [name, id] of Object.entries(EXERCISE_MEDIA.names)) {
    if (!EXERCISE_MEDIA.moves[id]) errors.push(`name "${name}" maps to unknown movement "${id}"`);
}

// Releases must bump both versions together, or phones never see the update banner
const appVersion = /const APP_VERSION = '([^']+)'/.exec(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'))?.[1];
const cacheVersion = /const CACHE_VERSION = 'gym-tracker-v([^']+)'/.exec(fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8'))?.[1];
if (!appVersion || appVersion !== cacheVersion) errors.push(`APP_VERSION (${appVersion}) and sw.js CACHE_VERSION (${cacheVersion}) differ`);

async function checkUrls() {
    const urls = [...new Set(Object.values(EXERCISE_MEDIA.moves).map((m) => m.gif).filter(Boolean))];
    let bad = 0;
    await Promise.all(urls.map(async (url, i) => {
        await new Promise((r) => setTimeout(r, i * 60)); // be gentle with the host
        try {
            const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0 gym-tracker-audit' } });
            const type = res.headers.get('content-type') || '';
            if (!res.ok || !type.includes('gif')) { bad++; errors.push(`URL check failed (${res.status} ${type}): ${url}`); }
        } catch (e) {
            bad++;
            errors.push(`URL unreachable: ${url} (${e.message})`);
        }
    }));
    console.log(`Checked ${urls.length} demo URLs, ${bad} failed`);
}

(async () => {
    if (process.argv.includes('--net')) await checkUrls();
    const exerciseCount = Object.values(PROGRAM.blocks).reduce((n, s) => n + Object.values(s).reduce((m, l) => m + l.length, 0), 0);
    console.log(`${exerciseCount} program exercises, ${Object.keys(EXERCISE_MEDIA.moves).length} movements, ${used.size} in use`);
    if (noDemo.length) console.log(`Without a demo (placeholder shown): ${noDemo.join(', ')}`);
    for (const w of warnings) console.log(`warning: ${w}`);
    for (const e of errors) console.log(`ERROR: ${e}`);
    console.log(errors.length ? `FAILED with ${errors.length} error(s)` : 'OK');
    process.exit(errors.length ? 1 : 0);
})();
