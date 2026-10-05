'use strict';
// ===== Gym Tracker =====
// Data lives in program.js (PROGRAM, WARMUP) and exercises.js (EXERCISE_MEDIA).
// All state is local to the device (localStorage) - see README "Your data".

const APP_VERSION = '3.0.0';                              // keep in sync with CACHE_VERSION in sw.js
const STORAGE_KEY = 'nippardEssentials5x_12weeks_v1';     // never rename: holds everyone's history
const PRE_V3_BACKUP_KEY = STORAGE_KEY + '_pre_v3';        // untouched copy of data saved by v2
const GIF_CACHE = 'gif-cache-v1';                         // must match sw.js
const TOTAL_WEEKS = PROGRAM.totalWeeks;
const SESSIONS = [1, 2, 3, 4, 5];
const WEIGHT_STEPS = [1, 2.5, 5];
const DEFAULT_STEP = 2.5;
const BACKUP_STALE_DAYS = 14;
const DATA_KEY_RE = /^w(\d+)_s(\d+)_(.+)$/;
const DAY = 86400000;

// ===== Small helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const round2 = (n) => Math.round(n * 100) / 100;
const fmtNum = (n) => String(round2(n));
const fmtInt = (n) => Math.round(n).toLocaleString();
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const range = (s) => String(s).replace(/(\d)\s*-\s*(\d)/g, '$1–$2');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmtSet(s) { return s.weight === 0 ? `BW × ${s.reps}` : `${fmtNum(s.weight)} kg × ${s.reps}`; }
function fmtSetShort(s) { return s.weight === 0 ? `BW×${s.reps}` : `${fmtNum(s.weight)}×${s.reps}`; }
function fmtCompact(n) {
    if (n >= 1e6) return `${fmtNum(n / 1e6).replace(/(\.\d)\d*/, '$1')}M`;
    if (n >= 1e4) return `${Math.round(n / 1e3)}k`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
    return String(Math.round(n));
}
function localDate(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function relDay(ts) {
    const days = Math.round((new Date(localDate(Date.now())) - new Date(localDate(ts))) / DAY);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
function shortDate(ts) {
    return new Date(ts).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

// ===== Program helpers =====
const blockOf = (week) => Math.ceil(week / PROGRAM.blockLength);
const blockRange = (block) => [(block - 1) * PROGRAM.blockLength + 1, block * PROGRAM.blockLength];
const exercisesFor = (week, session) => PROGRAM.blocks[blockOf(week)]?.[session] || [];
const sessionName = (s) => PROGRAM.sessions[s]?.name || `Session ${s}`;

// "A1: EZ Bar Skull Crusher" -> { base: "EZ Bar Skull Crusher", superset: "A1", setTag: null }
function parseName(name) {
    let base = String(name);
    let superset = null;
    let setTag = null;
    const ss = /^\s*(A\d+)\s*:\s*/i.exec(base);
    if (ss) { superset = ss[1].toUpperCase(); base = base.slice(ss[0].length); }
    const tag = /\s*\((Heavy|Back off)\)\s*$/i.exec(base);
    if (tag) { setTag = /heavy/i.test(tag[1]) ? 'heavy' : 'backoff'; base = base.slice(0, tag.index); }
    return { base: base.trim(), superset, setTag };
}
function restSeconds(rest) {
    const m = /([\d.]+)\s*min/i.exec(rest || '');
    return m ? Math.round(parseFloat(m[1]) * 60) : 0;
}
function restText(rest) {
    const s = restSeconds(rest);
    return s ? `${fmtNum(s / 60)} min rest` : 'No rest';
}
function repsLow(reps) {
    const m = /\d+/.exec(reps || '');
    return m ? parseInt(m[0], 10) : null;
}
// "10-12" -> "10–12 reps", "6-8 per leg" -> "6–8 reps per leg", "Failure" -> "to failure"
function repsText(reps) {
    const r = range(reps).trim();
    const m = /^(\d+(?:–\d+)?)\s*(.*)$/.exec(r);
    if (!m) return /fail/i.test(r) ? 'to failure' : r;
    return `${m[1]} reps${m[2] ? ` ${m[2]}` : ''}`;
}
function warmupCount(w) {
    const parts = String(w || '0').split('-').map((n) => parseInt(n, 10) || 0);
    return Math.max(...parts);
}
function warmupText(w) {
    const parts = String(w || '0').split('-');
    if (warmupCount(w) === 0) return '';
    const n = parts.length === 2 && parts[0] !== parts[1] ? `${parts[0]}–${parts[1]}` : parts[0];
    return `${n} warm-up set${n === '1' ? '' : 's'}`;
}
function techniqueInfo(t) {
    if (/^rpe/i.test(t)) return { kind: 'rpe', label: range(t), cls: 'tag-rpe' };
    if (/drop/i.test(t)) return { kind: 'drop', label: 'Dropset', cls: 'tag-drop' };
    if (/super/i.test(t)) return { kind: 'super', label: 'Superset', cls: 'tag-super' };
    return { kind: 'other', label: t, cls: '' };
}
function moveFor(name) {
    const id = exerciseMoveId(name);
    return id ? { id, ...EXERCISE_MEDIA.moves[id] } : null;
}
function bestSet(sets) {
    let best = null;
    for (const s of sets || []) {
        if (!best || s.weight > best.weight || (s.weight === best.weight && s.reps > best.reps)) best = s;
    }
    return best;
}

// ===== State =====
function defaultState() {
    return {
        currentWeek: 1,
        currentSession: 1,
        workoutData: {},            // "w{week}_s{session}_{exercise name}" -> { sets: [{ weight, reps, t, as? }] }
        substitutionOverrides: {},  // same key -> name of the swapped-in exercise
        activeTab: 'workout',
        lastSavedAt: 0,
        lastBackupAt: 0,
        prefs: { sound: true, vibrate: true, keepAwake: true, steps: {} },
        timer: null,                // { endsAt, duration, label, ref: { week, session, index } }
        warmup: { date: '', done: [] },
        dismissed: {}
    };
}

function cleanSet(s) {
    if (!s || typeof s !== 'object') return null;
    const weight = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
    const reps = typeof s.reps === 'string' ? parseFloat(s.reps) : s.reps;
    if (!Number.isFinite(weight) || weight < 0 || weight > 2000) return null;
    if (!Number.isFinite(reps) || reps < 1 || reps > 1000) return null;
    const out = { weight: round2(weight), reps: Math.round(reps) };
    if (Number.isFinite(s.t) && s.t > 0) out.t = s.t;
    // `as` = the exercise this set was actually done as, when the slot was swapped
    if (typeof s.as === 'string' && s.as.trim()) out.as = s.as.slice(0, 120);
    return out;
}

// Which exercise a logged set was done as (a swap records it per set)
const doneAs = (set, ex) => set.as || ex.name;

// Accepts anything (old versions, imports, hand-edited files) and returns a valid state
function normalizeState(raw) {
    const s = defaultState();
    if (!raw || typeof raw !== 'object') return s;
    const week = parseInt(raw.currentWeek, 10);
    if (week >= 1 && week <= TOTAL_WEEKS) s.currentWeek = week;
    const session = parseInt(raw.currentSession, 10);
    if (SESSIONS.includes(session)) s.currentSession = session;
    if (raw.workoutData && typeof raw.workoutData === 'object') {
        for (const [key, entry] of Object.entries(raw.workoutData)) {
            if (!DATA_KEY_RE.test(key) || !entry || typeof entry !== 'object') continue;
            const sets = Array.isArray(entry.sets) ? entry.sets.map(cleanSet).filter(Boolean) : [];
            if (!sets.length) continue;
            // Older formats labelled the whole entry; v2 kept swaps only as per-week overrides.
            // Either way, record the label on each set that doesn't carry its own.
            let label = typeof entry.performedAs === 'string' && entry.performedAs.trim() ? entry.performedAs : null;
            const v2Swap = !raw.appVersion && raw.substitutionOverrides && raw.substitutionOverrides[key];
            if (!label && typeof v2Swap === 'string' && v2Swap.trim()) label = v2Swap;
            if (label) for (const set of sets) if (!set.as) set.as = label.slice(0, 120);
            s.workoutData[key] = { sets };
        }
    }
    if (raw.substitutionOverrides && typeof raw.substitutionOverrides === 'object') {
        for (const [key, name] of Object.entries(raw.substitutionOverrides)) {
            if (DATA_KEY_RE.test(key) && typeof name === 'string' && name.trim()) s.substitutionOverrides[key] = name.slice(0, 120);
        }
    }
    if (['workout', 'progress', 'guide'].includes(raw.activeTab)) s.activeTab = raw.activeTab;
    else if (raw.activeTab === 'tips' || raw.activeTab === 'warmup') s.activeTab = 'guide';
    if (Number.isFinite(raw.lastSavedAt)) s.lastSavedAt = raw.lastSavedAt;
    if (Number.isFinite(raw.lastBackupAt)) s.lastBackupAt = raw.lastBackupAt;
    if (raw.prefs && typeof raw.prefs === 'object') {
        for (const k of ['sound', 'vibrate', 'keepAwake']) if (typeof raw.prefs[k] === 'boolean') s.prefs[k] = raw.prefs[k];
        if (raw.prefs.steps && typeof raw.prefs.steps === 'object') {
            for (const [k, v] of Object.entries(raw.prefs.steps)) if (WEIGHT_STEPS.includes(v)) s.prefs.steps[k] = v;
        }
    }
    const t = raw.timer;
    if (t && Number.isFinite(t.endsAt) && t.endsAt > Date.now() && t.endsAt < Date.now() + 3600000 && Number.isFinite(t.duration)) {
        s.timer = { endsAt: t.endsAt, duration: t.duration, label: String(t.label || ''), ref: t.ref && typeof t.ref === 'object' ? t.ref : null };
    }
    if (raw.warmup && typeof raw.warmup.date === 'string' && Array.isArray(raw.warmup.done)) {
        s.warmup = { date: raw.warmup.date, done: raw.warmup.done.filter((x) => typeof x === 'string') };
    }
    if (raw.dismissed && typeof raw.dismissed === 'object') {
        for (const [k, v] of Object.entries(raw.dismissed)) if (v === true) s.dismissed[k] = true;
    }
    return s;
}

let unreadableText = null; // saved data that failed to parse this launch (offered as a download)

function loadState() {
    let text = null;
    try { text = localStorage.getItem(STORAGE_KEY); } catch (e) { console.error('Storage unavailable', e); }
    if (!text) return defaultState();
    let raw;
    try {
        raw = JSON.parse(text);
    } catch (e) {
        // Never overwrite data we can't read - park one copy under a side key first
        unreadableText = text;
        try {
            const prefix = `${STORAGE_KEY}_unreadable_`;
            const parked = Object.keys(localStorage).some((k) => k.startsWith(prefix) && localStorage.getItem(k) === text);
            if (!parked) localStorage.setItem(prefix + Date.now(), text);
        } catch (_) { /* full - the download offered at start-up still has it */ }
        console.error('Saved data was unreadable and has been set aside', e);
        return defaultState();
    }
    // First launch after the v3 upgrade: keep an untouched copy of the old data
    if (raw && !raw.appVersion && raw.workoutData) {
        try { if (!localStorage.getItem(PRE_V3_BACKUP_KEY)) localStorage.setItem(PRE_V3_BACKUP_KEY, text); } catch (_) { /* full */ }
    }
    return normalizeState(raw);
}

let state = defaultState();
let saveFailed = false;

function saveState() {
    state.lastSavedAt = Date.now();
    state.appVersion = APP_VERSION;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (saveFailed) { saveFailed = false; hideBanner('save'); }
        return true;
    } catch (e) {
        console.error('Save failed', e);
        saveFailed = true;
        showBanner('save', "Couldn't save on this phone. Export a backup so nothing is lost.", 'Export', () => exportBackup(), true);
        return false;
    }
}

const dataKey = (week, session, name) => `w${week}_s${session}_${name}`;
function getEntry(week, session, name) {
    return state.workoutData[dataKey(week, session, name)] || { sets: [] }; // { sets: [{ weight, reps, t, as? }] }
}
function putEntry(week, session, name, entry) {
    const key = dataKey(week, session, name);
    if (entry.sets.length) state.workoutData[key] = entry;
    else delete state.workoutData[key];
}
function shownName(week, session, ex) {
    return state.substitutionOverrides[dataKey(week, session, ex.name)] || ex.name;
}

// "Last time" for this slot: the most recent earlier week with sets done as `shown` (the
// exercise on screen now), returning only those sets - a swapped week never counts as the
// same exercise. Keys contain the exact exercise name, so this also reaches an exercise that
// repeats in an earlier block (same session, same name).
function previousEntry(week, session, ex, shown = shownName(week, session, ex)) {
    for (let w = week - 1; w >= 1; w--) {
        const e = state.workoutData[dataKey(w, session, ex.name)];
        const sets = e ? e.sets.filter((s) => doneAs(s, ex) === shown) : [];
        if (sets.length) return { week: w, sets };
    }
    return null;
}

function sessionProgress(week, session) {
    const list = exercisesFor(week, session);
    let target = 0, done = 0, logged = 0, volume = 0, finished = 0, lastT = 0;
    for (const ex of list) {
        const sets = getEntry(week, session, ex.name).sets;
        target += ex.sets;
        done += Math.min(sets.length, ex.sets);
        logged += sets.length;
        if (sets.length >= ex.sets) finished++;
        for (const s of sets) {
            volume += s.weight * s.reps;
            if (s.t > lastT) lastT = s.t;
        }
    }
    return { target, done, logged, volume, lastT, exercises: list.length, started: logged > 0, complete: list.length > 0 && finished === list.length };
}

function countSets(st = state) {
    return Object.values(st.workoutData).reduce((n, e) => n + e.sets.length, 0);
}
function backupStale() {
    return countSets() >= 10 && (!state.lastBackupAt || Date.now() - state.lastBackupAt > BACKUP_STALE_DAYS * DAY);
}

// Which exercise should come next after `index` (superset-aware)? null = session finished
function nextUp(week, session, index) {
    const list = exercisesFor(week, session);
    const done = (i) => getEntry(week, session, list[i].name).sets.length;
    const ex = list[index];
    const tag = parseName(ex.name).superset;
    if (tag) {
        const partnerIdx = tag === 'A1' ? index + 1 : index - 1;
        const partner = list[partnerIdx];
        if (partner && parseName(partner.name).superset) {
            if (tag === 'A1' && done(partnerIdx) < done(index) && done(partnerIdx) < partner.sets) return partnerIdx;
            if (tag !== 'A1' && done(partnerIdx) < partner.sets && done(partnerIdx) <= done(index)) return partnerIdx;
        }
    }
    if (done(index) < ex.sets) return index;
    for (let k = 1; k < list.length; k++) {
        const j = (index + k) % list.length;
        if (done(j) < list[j].sets) return j;
    }
    return null;
}

// ===== Transient UI state =====
const ui = {
    sheet: null,         // { week, session, index, active, draft, demoKey, startedComplete }
    progressBlock: null, // block shown in the exercise-progress card
    openHistory: new Set(),
    showVolumeTable: false,
    listDirty: false,
    mediaBusy: false,
    mediaStatus: '',
    cuesOpen: true,      // remembered open/closed state of the sheet's <details> sections
    warmupOpen: false,
    inputLockUntil: 0    // ignore repeat taps on logging controls until this time (double-tap guard)
};

// ===== Rendering: shell =====
function render() {
    renderTopbar();
    renderNav();
    renderView();
    renderRest();
    if (ui.sheet) renderExerciseSheet();
}

function renderTopbar() {
    const week = state.currentWeek;
    $('#week-main').textContent = `Week ${week}`;
    $('#week-sub').textContent = `of ${TOTAL_WEEKS} · Block ${blockOf(week)}`;
    $('[data-action="week-prev"]').disabled = week <= 1;
    $('[data-action="week-next"]').disabled = week >= TOTAL_WEEKS;
    $('#settings-dot').hidden = !backupStale();
}

function renderNav() {
    $$('.nav-btn').forEach((b) => {
        const active = b.dataset.tab === state.activeTab;
        b.classList.toggle('is-active', active);
        if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.body.classList.toggle('view-workout-hidden', state.activeTab !== 'workout');
}

function renderView() {
    for (const tab of ['workout', 'progress', 'guide']) $(`#view-${tab}`).hidden = tab !== state.activeTab;
    if (state.activeTab === 'workout') { renderSessionTabs(); renderWorkout(); }
    else if (state.activeTab === 'progress') renderProgress();
    else renderWarmup();
}

// ===== Workout view =====
function renderSessionTabs() {
    const week = state.currentWeek;
    $('#session-tabs').innerHTML = SESSIONS.map((s) => {
        const p = sessionProgress(week, s);
        const active = s === state.currentSession;
        const cls = ['stab', active && 'is-active', p.complete && 'is-done', !p.complete && p.started && 'is-started'].filter(Boolean).join(' ');
        const meta = p.complete ? `${icon('check', 'icon-xs')}Done` : p.started ? `${p.done}/${p.target}` : `${p.target} sets`;
        return `<button class="${cls}" data-action="session" data-session="${s}" aria-pressed="${active}">
            <span class="stab-name">${esc(sessionName(s))}</span><span class="stab-meta">${meta}</span></button>`;
    }).join('');
}

function thumbHtml(move, label, cls = 'thumb') {
    if (move && move.gif) {
        return `<span class="${cls}"><img src="${esc(move.gif)}" alt="" loading="lazy" decoding="async" data-fallback="${esc(move.muscle || '')}"></span>`;
    }
    return `<span class="${cls} is-placeholder" aria-hidden="true"><span class="placeholder-inner">${icon('dumbbell')}${esc(move?.muscle || label || '')}</span></span>`;
}

function renderWorkout() {
    const week = state.currentWeek;
    const session = state.currentSession;
    const list = exercisesFor(week, session);
    const p = sessionProgress(week, session);
    const firstOpen = list.findIndex((ex) => getEntry(week, session, ex.name).sets.length < ex.sets);
    // Highlight what the sheet would suggest next (A1 -> A2 within a superset round)
    const nextIdx = firstOpen >= 0 ? (nextUp(week, session, firstOpen) ?? firstOpen) : -1;

    let html = `
        <section class="hero">
            <div class="hero-row">
                <div>
                    <p class="eyebrow">Week ${week} · Block ${blockOf(week)}</p>
                    <h1 class="hero-title">${esc(sessionName(session))}</h1>
                    <p class="hero-sub">${esc(PROGRAM.sessions[session]?.focus || '')} · ${plural(list.length, 'exercise')}</p>
                </div>
                <div class="hero-count"><strong>${p.done}</strong><span>/ ${p.target} sets</span></div>
            </div>
            <div class="meter ${p.complete ? 'is-done' : ''}" role="progressbar" aria-label="Sets done" aria-valuemin="0" aria-valuemax="${p.target}" aria-valuenow="${p.done}"><span style="--p:${p.target ? (p.done / p.target) * 100 : 0}%"></span></div>
        </section>`;

    if (!countSets() && !state.dismissed.welcome) {
        html += `<div class="tip-card">${icon('info')}<div><strong>Tap an exercise to log it.</strong> Last week's numbers are filled in for you, and a rest timer starts after every set. Everything is saved on this phone.</div>
            <button class="icon-btn" data-action="dismiss" data-key="welcome" aria-label="Dismiss">${icon('x', 'icon-sm')}</button></div>`;
    }

    html += '<div class="ex-list">';
    for (let i = 0; i < list.length; i++) {
        const next = list[i + 1];
        if (parseName(list[i].name).superset === 'A1' && next && parseName(next.name).superset) {
            html += `<div class="superset" role="group" aria-label="Superset">
                <div class="superset-head">${icon('swap')}Superset <span>· alternate sets, rest after both</span></div>
                ${exerciseCard(week, session, i, nextIdx, p.started)}${exerciseCard(week, session, i + 1, nextIdx, p.started)}</div>`;
            i++;
        } else {
            html += exerciseCard(week, session, i, nextIdx, p.started);
        }
    }
    html += '</div>';
    if (p.complete) html += sessionDoneCard(week, session, p);
    $('#view-workout').innerHTML = html;
    ui.listDirty = false;
}

function exerciseCard(week, session, i, nextIdx, sessionStarted) {
    const ex = exercisesFor(week, session)[i];
    const orig = parseName(ex.name);
    const shown = shownName(week, session, ex);
    const cur = parseName(shown);
    const sets = getEntry(week, session, ex.name).sets;
    const done = sets.length >= ex.sets;
    const prev = previousEntry(week, session, ex, shown);
    const tech = techniqueInfo(ex.technique);

    const tags = [];
    if (orig.superset) tags.push(`<span class="tag tag-super">${esc(orig.superset)}</span>`);
    if (orig.setTag === 'heavy') tags.push('<span class="tag tag-heavy">Top set</span>');
    if (orig.setTag === 'backoff') tags.push('<span class="tag">Back-off</span>');
    if (shown !== ex.name) tags.push(`<span class="tag tag-swap">${icon('swap', 'icon-xs')}Swapped</span>`);

    const chips = [];
    const count = Math.max(ex.sets, sets.length);
    for (let k = 0; k < count; k++) {
        chips.push(sets[k]
            ? `<span class="set-chip is-done">${esc(fmtSetShort(sets[k]))}</span>`
            : `<span class="set-chip">${k + 1}</span>`);
    }
    const target = [`${ex.sets} × ${range(ex.reps)}`];
    if (tech.kind !== 'super') target.push(tech.label);
    target.push(restText(ex.rest));

    let last = '';
    if (prev) {
        const b = bestSet(prev.sets);
        last = `<span class="ex-last">${prev.week === week - 1 ? 'Last week' : `Week ${prev.week}`}: <strong>${esc(fmtSet(b))}</strong></span>`;
    }
    const pct = Math.min(100, (sets.length / ex.sets) * 100);
    const status = done
        ? `<span class="ring is-done" aria-label="Done">${icon('check')}</span>`
        : `<span class="ring" aria-label="${sets.length} of ${ex.sets} sets"><svg class="ring-svg" viewBox="0 0 40 40" aria-hidden="true"><circle class="ring-track" cx="20" cy="20" r="17"/>${pct > 0 ? `<circle class="ring-fill" cx="20" cy="20" r="17" pathLength="100" stroke-dasharray="${pct} 100"/>` : ''}</svg><span class="ring-text">${sets.length}/${ex.sets}</span></span>`;
    const isNext = sessionStarted && i === nextIdx;

    return `<button class="ex-card ${done ? 'is-done' : ''} ${isNext ? 'is-next' : ''}" data-action="open-exercise" data-index="${i}">
        ${thumbHtml(moveFor(shown), cur.base)}
        <span class="ex-body">
            <span class="ex-tags">${tags.join('')}</span>
            <span class="ex-name">${esc(cur.base)}</span>
            <span class="ex-target">${esc(target.join(' · '))}</span>
            <span class="ex-chips">${chips.join('')}</span>
            ${last}
        </span>
        ${status}
    </button>`;
}

function sessionDoneCard(week, session, p) {
    const nextSession = SESSIONS.find((s) => s !== session && !sessionProgress(week, s).complete);
    let action;
    if (nextSession) {
        action = `<button class="btn btn-primary btn-block" data-action="session" data-session="${nextSession}">Next: ${esc(sessionName(nextSession))} ${icon('arrow-right')}</button>`;
    } else if (week < TOTAL_WEEKS) {
        action = `<button class="btn btn-primary btn-block" data-action="start-week">Week ${week} done · start week ${week + 1} ${icon('arrow-right')}</button>`;
    } else {
        action = '<p><strong>That was the final session of the program. Massive work!</strong></p>';
    }
    return `<section class="done-card">
        <div class="done-badge">${icon('check')}</div>
        <h2>${esc(sessionName(session))} complete</h2>
        <p>${plural(p.logged, 'set')} · ${fmtInt(p.volume)} kg lifted</p>
        ${action}
    </section>`;
}

// ===== Exercise sheet =====
function currentExercise() {
    const sh = ui.sheet;
    return sh ? exercisesFor(sh.week, sh.session)[sh.index] : null;
}

function openExercise(week, session, index) {
    const ex = exercisesFor(week, session)[index];
    if (!ex) return;
    dismissToast(); // an Undo for another exercise must not follow into this sheet
    const n = getEntry(week, session, ex.name).sets.length;
    ui.sheet = {
        week, session, index, active: n < ex.sets ? n : null, draft: null, demoKey: null,
        startedComplete: sessionProgress(week, session).complete
    };
    renderExerciseSheet();
    const dialog = $('#exercise-sheet');
    openSheet(dialog);
    $('#sx-scroll').scrollTop = 0;
    requestAnimationFrame(revealActiveRow);
}

function switchExercise(index) {
    const sh = ui.sheet;
    const ex = exercisesFor(sh.week, sh.session)[index];
    if (!ex) return;
    dismissToast(); // an Undo toast would otherwise act on the exercise we just left
    const n = getEntry(sh.week, sh.session, ex.name).sets.length;
    Object.assign(sh, { index, active: n < ex.sets ? n : null, draft: null });
    renderExerciseSheet();
    $('#sx-scroll').scrollTop = 0;
    requestAnimationFrame(revealActiveRow);
}

// On short screens the set table can sit below the fold: bring the active row into view
function revealActiveRow() {
    const scroll = $('#sx-scroll');
    const row = $('#sx-sets .set-row.is-active') || $('#sx-sets .set-row:last-child');
    if (!scroll || !row) return;
    const box = scroll.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    if (r.top > box.bottom - 24) scroll.scrollTop += r.bottom - box.bottom + 12;
}

function stepFor(name) {
    return state.prefs.steps[normalizeExerciseName(name)] || DEFAULT_STEP;
}

// Values to pre-fill for set `index`: the set itself (editing), else today's previous set of
// this exercise, else last time's same set, else last time's best set.
function prefillFor(week, session, ex, index) {
    const sets = getEntry(week, session, ex.name).sets;
    if (index < sets.length) return { weight: sets[index].weight, reps: sets[index].reps };
    const shown = shownName(week, session, ex);
    const prev = previousEntry(week, session, ex, shown);
    const lastToday = sets.filter((s) => doneAs(s, ex) === shown).pop();
    const prevSame = prev?.sets[index] || null;
    const prevBest = bestSet(prev?.sets);
    const move = moveFor(shown);
    const weight = lastToday?.weight ?? prevSame?.weight ?? prevBest?.weight ?? (move?.bw ? 0 : null);
    const reps = lastToday?.reps ?? prevSame?.reps ?? repsLow(ex.reps);
    return { weight, reps };
}

function renderExerciseSheet() {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex) return;
    const { week, session, index } = sh;
    const list = exercisesFor(week, session);
    const orig = parseName(ex.name);
    const shown = shownName(week, session, ex);
    const cur = parseName(shown);
    const swapped = shown !== ex.name;
    const move = moveFor(shown);
    const sets = getEntry(week, session, ex.name).sets;
    const prev = previousEntry(week, session, ex, shown);
    const tech = techniqueInfo(ex.technique);

    // Header - the tags tell a top set from its back-off set (same exercise name)
    const tags = [];
    if (orig.superset) tags.push(`<span class="tag tag-super">Superset ${esc(orig.superset)}</span>`);
    if (orig.setTag === 'heavy') tags.push('<span class="tag tag-heavy">Top set</span>');
    if (orig.setTag === 'backoff') tags.push('<span class="tag">Back-off set</span>');
    $('#sx-head').innerHTML = `
        <div class="sheet-titles">
            <div class="sheet-eyebrow"><span class="eyebrow">${esc(sessionName(session))} · ${index + 1} of ${list.length}</span>${tags.join('')}</div>
            <h2 class="sheet-title">${esc(cur.base)}</h2>
            ${swapped ? `<p class="sheet-note">Swapped in for ${esc(orig.base)}</p>` : ''}
        </div>
        <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button>`;

    // Demo (only rebuilt when the movement changes, so the animation doesn't restart)
    const demoKey = move?.gif || `none:${cur.base}`;
    if (sh.demoKey !== demoKey) {
        sh.demoKey = demoKey;
        const demo = $('#sx-demo');
        if (move?.gif) {
            demo.className = 'demo';
            demo.innerHTML = `<img src="${esc(move.gif)}" alt="${esc(`${cur.base} demonstration`)}" decoding="async" data-fallback="${esc(move.muscle || '')}">
                <button class="demo-zoom" data-action="open-media" data-gif="${esc(move.gif)}" data-title="${esc(cur.base)}" data-note="${esc(move.note || '')}" aria-label="Enlarge demo">${icon('expand')}</button>`;
        } else {
            demo.className = 'demo is-placeholder';
            demo.innerHTML = `<span class="placeholder-inner">${icon('dumbbell')}${esc(move?.muscle || '')}<br>No demo available</span>`;
        }
    }

    // Info chips
    const chips = [`<span class="chip"><strong>${ex.sets}</strong>${ex.sets === 1 ? 'set' : 'sets'} × <strong>${esc(range(ex.reps))}</strong></span>`];
    chips.push(`<span class="chip ${tech.cls}">${esc(tech.label)}</span>`);
    const restS = restSeconds(ex.rest);
    const partner = orig.superset === 'A1' ? list[index + 1] : null;
    chips.push(`<span class="chip">${icon('timer')}${restS ? esc(restText(ex.rest)) : partner ? `Straight into ${esc(parseName(partner.name).superset || 'A2')}` : 'No rest'}</span>`);
    const wu = warmupText(ex.warmup);
    if (wu) chips.push(`<span class="chip">${icon('flame')}${esc(wu)}</span>`);
    if (move?.bw) chips.push('<span class="chip">Bodyweight · log added kg, 0 = BW</span>');
    const caption = move?.gif && move.note ? `<p class="demo-caption">${icon('info', 'icon-xs')}${esc(move.note)}</p>` : '';
    $('#sx-info').innerHTML = `${caption}<div class="chip-row">${chips.join('')}</div>`;

    // Set table
    const rowsCount = Math.max(ex.sets, sets.length + (sh.active !== null && sh.active >= sets.length && sh.active >= ex.sets ? 1 : 0));
    let rows = '';
    for (let i = 0; i < rowsCount; i++) {
        const set = sets[i];
        const p = prev?.sets[i];
        const active = sh.active === i;
        const extra = i >= ex.sets;
        const prevTxt = p ? fmtSetShort(p) : '—';
        if (set) {
            // A set done before switching exercise keeps its own label
            const other = doneAs(set, ex) !== shown ? parseName(doneAs(set, ex)).base : '';
            rows += `<button class="set-row set-cols is-done ${active ? 'is-active' : ''}" data-action="pick-set" data-set="${i}" aria-label="Set ${i + 1}: ${esc(fmtSet(set))}${other ? `, done as ${esc(other)}` : ''}. Tap to edit">
                <span class="set-no">${i + 1}</span><span class="set-prev">${esc(prevTxt)}</span><span class="set-now">${esc(fmtSet(set))}${other ? `<small class="set-as">${esc(other)}</small>` : ''}</span>${icon('check')}</button>`;
        } else if (i === sets.length) {
            rows += `<button class="set-row set-cols ${active ? 'is-active' : ''} ${extra ? 'is-extra' : ''}" data-action="pick-set" data-set="${i}">
                <span class="set-no">${i + 1}</span><span class="set-prev">${extra ? 'extra' : esc(prevTxt)}</span><span class="set-now">${active ? 'Now' : '—'}</span><span></span></button>`;
        } else {
            rows += `<div class="set-row set-cols is-locked"><span class="set-no">${i + 1}</span><span class="set-prev">${esc(prevTxt)}</span><span class="set-now">—</span><span></span></div>`;
        }
    }
    const prevLabel = prev ? (prev.week === week - 1 ? 'Last week' : `Week ${prev.week}`) : 'Last time';
    $('#sx-sets').innerHTML = `
        <div class="set-table">
            <div class="set-head set-cols"><span>Set</span><span>${esc(prevLabel)}</span><span>Today</span><span></span></div>
            ${rows}
        </div>`;

    // Extras: warm-up ramp, cues, swap
    let extra = '';
    if (warmupCount(ex.warmup) > 0) {
        extra += `<details class="cues cues-warmup" ${ui.warmupOpen ? 'open' : ''}><summary>${icon('flame')}Warm-up · ${esc(warmupText(ex.warmup).replace(/ warm-up/, ''))}${icon('chev-down')}</summary>
            ${warmupRampBody(ex, workingWeight(), shown)}</details>`;
    }
    extra += `<details class="cues cues-notes" ${ui.cuesOpen ? 'open' : ''}><summary>${icon('info')}Coaching cues${icon('chev-down')}</summary><div class="cues-body">${esc(ex.notes)}</div></details>`;
    if (ex.subs?.length) {
        extra += `<div class="link-row"><button class="btn" data-action="open-swap">${icon('swap')}${swapped ? 'Change or revert swap' : 'Swap exercise'}</button></div>`;
    }
    $('#sx-extra').innerHTML = extra;

    renderSheetFooter();
}

// The weight the warm-up ramp is based on: what's in the input now, else the pre-fill
function workingWeight() {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex) return null;
    return sh.draft?.weight ?? prefillFor(sh.week, sh.session, ex, sh.active ?? 0).weight;
}

function warmupRampBody(ex, workW, shown) {
    const n = warmupCount(ex.warmup);
    const plan = n >= 3 ? [[0.5, 10], [0.7, 6], [0.85, 3]] : n === 2 ? [[0.5, 10], [0.75, 5]] : [[0.7, 6]];
    const step = stepFor(shown);
    const rows = plan.map(([pct, reps]) => {
        const w = workW > 0 ? `${fmtNum(Math.max(step, Math.round((workW * pct) / step) * step))} kg` : `${Math.round(pct * 100)}%`;
        return `<li><span>${Math.round(pct * 100)}% × ${reps}</span><span>${w}</span></li>`;
    }).join('');
    const note = workW > 0 ? `Based on ${fmtNum(workW)} kg working weight.` : 'Percent of your working weight.';
    return `<div class="cues-body"><ul>${rows}</ul><p class="muted">${note}${ex.warmup === '2-3' ? ' The 85% set is optional.' : ''}</p></div>`;
}

// Keep the warm-up weights in step with the weight being entered (without touching the footer)
function refreshWarmupRamp() {
    const ex = currentExercise();
    const body = $('#sx-extra .cues-warmup .cues-body');
    if (!ex || !body) return;
    body.outerHTML = warmupRampBody(ex, workingWeight(), shownName(ui.sheet.week, ui.sheet.session, ex));
}

function renderSheetFooter() {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex) return;
    const foot = $('#sx-foot');
    // Re-rendering replaces the buttons: remember which control had focus (keyboard users)
    const focusedAction = foot.contains(document.activeElement) ? document.activeElement.dataset?.action : null;
    const { week, session, index } = sh;
    const sets = getEntry(week, session, ex.name).sets;
    const shown = shownName(week, session, ex);
    const move = moveFor(shown);
    const list = exercisesFor(week, session);
    const next = nextUp(week, session, index);
    let html = restStripHtml();

    if (sh.active === null) {
        html += `<div class="all-done"><span class="done-dot">${icon('check')}</span><span>${ex.sets === 1 ? 'Set done' : `All ${ex.sets} sets done`}</span></div>`;
        if (next !== null) html += nextButtonHtml(list, next);
        else html += `<button class="btn btn-primary btn-big btn-block" data-action="close-sheet">${icon('check')}${esc(sessionName(session))} complete</button>`;
        html += `<div class="logger-alt"><button class="btn btn-ghost" data-action="add-set">${icon('plus')}Add a set</button></div>`;
    } else {
        const editing = sh.active < sets.length;
        const extra = sh.active >= ex.sets;
        // Only real superset partners get the nudge (never for an extra set of a normal exercise)
        const partner = next !== null && next !== index && Math.abs(next - index) === 1
            && parseName(ex.name).superset && parseName(list[next].name).superset;
        if (!editing && !extra && partner) html += supersetNudgeHtml(list, index, next);
        const pf = sh.draft || prefillFor(week, session, ex, sh.active);
        const step = stepFor(shown);
        const title = editing ? `Edit set ${sh.active + 1}` : extra ? `Extra set ${sh.active + 1}` : `Set ${sh.active + 1} of ${ex.sets}`;
        html += `
        <div class="logger-head">
            <span><strong>${title}</strong> <span class="muted">· ${esc(repsText(ex.reps))}</span></span>
            <button class="step-chip" data-action="cycle-step" aria-label="Weight step: ${step} kg. Tap to change">±${fmtNum(step)} kg</button>
        </div>
        <div class="steppers">
            <div class="stepper" data-field="weight">
                <button type="button" data-step="-1" aria-label="Less weight">${icon('minus')}</button>
                <label class="stepper-field"><input id="in-weight" type="number" inputmode="decimal" step="any" min="0" enterkeyhint="next" value="${pf.weight ?? ''}" placeholder="–" aria-label="${move?.bw ? 'Added weight in kilograms, 0 for bodyweight' : 'Weight in kilograms'}"><span class="stepper-unit">${move?.bw ? '+kg' : 'kg'}</span></label>
                <button type="button" data-step="1" aria-label="More weight">${icon('plus')}</button>
            </div>
            <div class="stepper" data-field="reps">
                <button type="button" data-step="-1" aria-label="Fewer reps">${icon('minus')}</button>
                <label class="stepper-field"><input id="in-reps" type="number" inputmode="numeric" step="1" min="1" enterkeyhint="done" value="${pf.reps ?? ''}" placeholder="–" aria-label="Reps"><span class="stepper-unit">reps</span></label>
                <button type="button" data-step="1" aria-label="More reps">${icon('plus')}</button>
            </div>
        </div>`;
        html += `<button class="btn btn-primary btn-big btn-block" data-action="log-set">${editing ? 'Save changes' : `${icon('check')}Log set ${sh.active + 1}`}</button>`;
        const prevSame = previousEntry(week, session, ex, shown)?.sets[sh.active] || null;
        if (!editing && prevSame && (prevSame.weight !== pf.weight || prevSame.reps !== pf.reps)) {
            html += `<button class="fill-btn" data-action="log-same">${icon('history', 'icon-sm')}Log same as last time · <strong>${esc(fmtSet(prevSame))}</strong></button>`;
        }
        if (editing) {
            html += `<div class="logger-alt"><button class="btn btn-danger" data-action="delete-set">${icon('trash')}Delete set</button><button class="btn btn-ghost" data-action="cancel-edit">Cancel</button></div>`;
        } else if (extra) {
            html += `<div class="logger-alt"><button class="btn btn-ghost" data-action="cancel-edit">Cancel extra set</button></div>`;
        }
    }
    foot.innerHTML = html;
    if (focusedAction) (foot.querySelector(`[data-action="${focusedAction}"]`) || foot.querySelector('.btn-primary'))?.focus({ preventScroll: true });
}

function supersetNudgeHtml(list, index, next) {
    const sh = ui.sheet;
    const cur = parseName(list[index].name);
    const target = parseName(list[next].name);
    const name = parseName(shownName(sh.week, sh.session, list[next])).base;
    const curDone = getEntry(sh.week, sh.session, list[index].name).sets.length;
    let title, sub;
    if (cur.superset === 'A1') { title = `Now ${target.superset}: ${name}`; sub = 'Go straight into it, rest after'; }
    else if (curDone > 0) { title = `Next round: ${target.superset} · ${name}`; sub = 'After your rest'; }
    else { title = `Start with ${target.superset}: ${name}`; sub = `Then come back to ${cur.superset}`; }
    return `<button class="superset-nudge" data-action="goto-exercise" data-index="${next}">${icon('swap')}
        <span>${esc(title)}<small>${esc(sub)}</small></span>${icon('arrow-right')}</button>`;
}

function nextButtonHtml(list, next) {
    const ex = list[next];
    const p = parseName(ex.name);
    const tag = p.setTag === 'heavy' ? ' · top set' : p.setTag === 'backoff' ? ' · back-off' : '';
    const shown = parseName(shownName(ui.sheet.week, ui.sheet.session, ex)).base + tag;
    return `<button class="btn btn-primary btn-big btn-block next-btn" data-action="goto-exercise" data-index="${next}">
        <span class="next-text"><small>Next up${p.superset ? ` · ${esc(p.superset)}` : ''}</small><span>${esc(shown)}</span></span>${icon('arrow-right')}</button>`;
}

function readInputs() {
    const w = $('#in-weight')?.value.trim().replace(',', '.');
    const r = $('#in-reps')?.value.trim();
    return { weight: w === '' || w === undefined ? NaN : parseFloat(w), reps: r === '' || r === undefined ? NaN : parseFloat(r) };
}

function saveDraft() {
    if (!ui.sheet) return;
    const { weight, reps } = readInputs();
    ui.sheet.draft = { weight: Number.isFinite(weight) ? weight : null, reps: Number.isFinite(reps) ? reps : null };
    refreshWarmupRamp();
}

// Shown instead of a success message when localStorage refused the write
function warnNotSaved() {
    showToast("Not saved on this phone. Export a backup now", { action: 'Export', onAction: exportBackup, duration: 12000, error: true });
}

function logSet(values = readInputs()) {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex || sh.active === null) return;
    let { weight, reps } = values;
    // Focus first: focusing a logger input dismisses toasts, and this message must stay
    if (!Number.isFinite(weight) || weight < 0) { $('#in-weight')?.focus(); showToast('Enter the weight (0 = bodyweight)'); return; }
    if (!Number.isFinite(reps) || reps < 1) { $('#in-reps')?.focus(); showToast('Enter how many reps you did'); return; }
    if (weight > 1000 || reps > 200) { showToast('That looks too high, check the numbers'); return; }
    weight = round2(weight);
    reps = Math.round(reps);

    const { week, session, index } = sh;
    const stored = getEntry(week, session, ex.name);
    const entry = { ...stored, sets: [...stored.sets] };
    const editing = sh.active < entry.sets.length;
    const setIndex = editing ? sh.active : entry.sets.length;
    const shown = shownName(week, session, ex);
    const set = { weight, reps, t: editing ? (entry.sets[setIndex].t || Date.now()) : Date.now() };
    // Label the set with the exercise it was done as; an edited set keeps its original label
    const as = editing ? entry.sets[setIndex].as : (shown !== ex.name ? shown : undefined);
    if (as) set.as = as;
    entry.sets[setIndex] = set;
    putEntry(week, session, ex.name, entry);
    const saved = saveState();
    unlockAudio();
    haptic(12);

    const n = entry.sets.length;
    sh.active = n < ex.sets ? n : null;
    sh.draft = null;
    let timerStarted = false;
    const sessionDone = nextUp(week, session, index) === null;
    if (sessionDone && state.timer) stopRest(); // the workout is over - no "time for the next set"
    if (!editing) {
        const secs = restSeconds(ex.rest);
        // No countdown after the last set of the whole session
        if (secs > 0 && !sessionDone) {
            startRest(secs, parseName(shown).base, { week, session, index });
            timerStarted = true;
        }
    }
    ui.listDirty = true;
    renderExerciseSheet();
    requestAnimationFrame(revealActiveRow);
    if (!saved) {
        warnNotSaved();
    } else if (editing) {
        showToast(`Set ${setIndex + 1} updated`);
    } else {
        showToast(`Set ${setIndex + 1} logged · ${fmtSet(set)}`, {
            action: 'Undo',
            onAction: () => {
                const now = getEntry(week, session, ex.name);
                if (now.sets[setIndex] !== set) return;
                const undone = { ...now, sets: now.sets.filter((_, i) => i !== setIndex) };
                putEntry(week, session, ex.name, undone);
                if (timerStarted && state.timer) stopRest();
                const ok = saveState();
                if (ui.sheet && ui.sheet.index === index && ui.sheet.week === week && ui.sheet.session === session) {
                    ui.sheet.active = setIndex;
                    ui.sheet.draft = { weight: set.weight, reps: set.reps };
                }
                refreshAfterDataChange();
                if (!ok) warnNotSaved();
            }
        });
    }
}

function deleteSet() {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex || sh.active === null) return;
    const { week, session, index } = sh;
    const stored = getEntry(week, session, ex.name);
    const at = sh.active;
    const removed = stored.sets[at];
    if (!removed) return;
    const entry = { ...stored, sets: stored.sets.filter((_, i) => i !== at) };
    putEntry(week, session, ex.name, entry);
    const saved = saveState();
    sh.active = entry.sets.length < ex.sets ? entry.sets.length : null;
    sh.draft = null;
    ui.listDirty = true;
    renderExerciseSheet();
    if (!saved) { warnNotSaved(); return; }
    showToast(`Set ${at + 1} deleted`, {
        action: 'Undo',
        onAction: () => {
            const now = getEntry(week, session, ex.name);
            if (now.sets.includes(removed)) return; // already restored
            const sets = [...now.sets];
            sets.splice(Math.min(at, sets.length), 0, removed);
            putEntry(week, session, ex.name, { ...now, sets }); // the set carries its own `as` label
            const ok = saveState();
            if (ui.sheet && ui.sheet.index === index && ui.sheet.week === week && ui.sheet.session === session) {
                ui.sheet.active = sets.length < ex.sets ? sets.length : null;
                ui.sheet.draft = null;
            }
            refreshAfterDataChange();
            if (!ok) warnNotSaved();
        }
    });
}

function refreshAfterDataChange() {
    if (ui.sheet && $('#exercise-sheet').open) { renderExerciseSheet(); ui.listDirty = true; }
    else render();
    renderTopbar();
}

function stepField(field, dir) {
    const input = field === 'weight' ? $('#in-weight') : $('#in-reps');
    if (!input) return;
    const cur = parseFloat(String(input.value).replace(',', '.'));
    const base = Number.isFinite(cur) ? cur : 0;
    let next;
    if (field === 'weight') {
        // Snap to the step grid: 3 kg +2.5 -> 5 kg, not 5.5 kg
        const step = stepFor(shownName(ui.sheet.week, ui.sheet.session, currentExercise()));
        const k = base / step;
        const nk = dir > 0 ? Math.floor(k + 1e-9) + 1 : Math.ceil(k - 1e-9) - 1;
        next = Math.max(0, round2(nk * step));
    } else {
        next = Math.max(1, Math.round(base) + dir);
    }
    input.value = fmtNum(next);
    saveDraft();
}

// ===== Swap =====
function openSwap() {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex) return;
    const shown = shownName(sh.week, sh.session, ex);
    const [, end] = blockRange(blockOf(sh.week));
    const weeks = sh.week === end ? `week ${end}` : `weeks ${sh.week}–${end}`;
    const options = [ex.name, ...(ex.subs || [])];
    const items = options.map((name) => {
        const p = parseName(name);
        const current = name === shown;
        const move = moveFor(name);
        return `<button class="option ${current ? 'is-current' : ''}" data-action="choose-swap" data-name="${esc(name)}">
            ${thumbHtml(move, p.base)}
            <span class="option-text"><span class="option-name">${esc(p.base)}</span>
            <span class="option-meta">${name === ex.name ? 'Program exercise' : 'Alternative'}${move?.muscle ? ` · ${esc(move.muscle)}` : ''}</span></span>
            ${current ? icon('check') : ''}</button>`;
    }).join('');
    setSheetHtml($('#swap-sheet'), `
        <div class="sheet-grab" data-drag aria-hidden="true"></div>
        <header class="sheet-head"><div class="sheet-titles"><h2 class="sheet-title">Swap exercise</h2>
            <p class="sheet-note">Applies to ${sessionName(sh.session)}, ${weeks}. Sets you've logged stay with this slot.</p></div>
            <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></header>
        <div class="sheet-body"><div class="option-list">${items}</div></div>`);
    openSheet($('#swap-sheet'));
}

function chooseSwap(name) {
    const sh = ui.sheet;
    const ex = currentExercise();
    if (!sh || !ex) return;
    const [, end] = blockRange(blockOf(sh.week));
    for (let w = sh.week; w <= end; w++) {
        const key = dataKey(w, sh.session, ex.name);
        if (name === ex.name) delete state.substitutionOverrides[key];
        else state.substitutionOverrides[key] = name;
    }
    const saved = saveState();
    sh.draft = null;
    ui.listDirty = true;
    // Focus can only move once the swap sheet has really closed (until then the exercise
    // sheet behind it is inert)
    if (ui.keyboardNav) {
        $('#swap-sheet').addEventListener('close', () => $('#sx-extra [data-action="open-swap"]')?.focus({ preventScroll: true }), { once: true });
    }
    closeSheet($('#swap-sheet'));
    renderExerciseSheet();
    const base = parseName(name).base;
    if (!saved) warnNotSaved();
    else showToast(name === ex.name ? `Back to ${base}` : `Swapped to ${base}`);
}

// ===== Week picker =====
function openWeeks() {
    let html = '';
    for (let b = 1; b <= Math.ceil(TOTAL_WEEKS / PROGRAM.blockLength); b++) {
        const [start, end] = blockRange(b);
        let tiles = '';
        for (let w = start; w <= end; w++) {
            const done = SESSIONS.filter((s) => sessionProgress(w, s).complete).length;
            const started = SESSIONS.some((s) => sessionProgress(w, s).started);
            tiles += `<button class="week-tile ${w === state.currentWeek ? 'is-current' : ''} ${done === SESSIONS.length ? 'is-complete' : ''}" data-action="pick-week" data-week="${w}">
                <span class="week-tile-name">Week ${w}</span>
                <span class="week-tile-meta">${done === SESSIONS.length ? 'Done' : started ? `${done}/5 done` : '—'}</span>
                <span class="meter ${done === SESSIONS.length ? 'is-done' : ''}"><span style="--p:${(done / SESSIONS.length) * 100}%"></span></span></button>`;
        }
        html += `<div class="week-block"><div class="section-label">Block ${b} · weeks ${start}–${end}</div><div class="week-grid">${tiles}</div></div>`;
    }
    setSheetHtml($('#week-sheet'), `
        <div class="sheet-grab" data-drag aria-hidden="true"></div>
        <header class="sheet-head"><div class="sheet-titles"><h2 class="sheet-title">Choose week</h2>
            <p class="sheet-note">Exercises change at the start of each block.</p></div>
            <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></header>
        <div class="sheet-body">${html}</div>`);
    openSheet($('#week-sheet'));
}

function setWeek(week) {
    week = clamp(week, 1, TOTAL_WEEKS);
    if (week === state.currentWeek) return;
    state.currentWeek = week;
    dismissToast();
    saveState();
    render();
    window.scrollTo({ top: 0 });
}

function setSession(session) {
    state.currentSession = session;
    if (state.activeTab !== 'workout') state.activeTab = 'workout';
    saveState();
    render();
    const p = sessionProgress(state.currentWeek, session);
    const nextCard = p.started && !p.complete ? $('.ex-card.is-next') : null;
    if (nextCard) nextCard.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
    else window.scrollTo({ top: 0 });
}

function switchTab(tab) {
    if (!['workout', 'progress', 'guide'].includes(tab)) return;
    state.activeTab = tab;
    saveState();
    render();
    window.scrollTo({ top: 0 });
}

// ===== Rest timer =====
let restTick = null;

function startRest(seconds, label, ref) {
    state.timer = { endsAt: Date.now() + seconds * 1000, duration: seconds, label, ref };
    saveState();
    renderRest();
}
function stopRest() {
    state.timer = null;
    saveState();
    renderRest();
}
function adjustRest(delta) {
    const t = state.timer;
    if (!t) return;
    t.endsAt += delta * 1000;
    t.duration = Math.max(1, t.duration + delta);
    if (t.endsAt <= Date.now()) { stopRest(); return; }
    saveState();
    tickRest();
}
function restLeft() {
    return state.timer ? Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000)) : 0;
}
const fmtClock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function restStripHtml() {
    const t = state.timer;
    if (!t) return '';
    return `<div class="rest-strip" role="timer" aria-live="off">
        ${icon('timer', 'rest-icon')}
        <div class="rest-info"><span class="rest-title">Rest</span><span class="rest-time js-rest-time">${fmtClock(restLeft())}</span></div>
        <button class="btn btn-sm" data-action="rest-adjust" data-delta="-15" aria-label="15 seconds less">−15</button>
        <button class="btn btn-sm" data-action="rest-adjust" data-delta="15" aria-label="15 seconds more">+15</button>
        <button class="btn btn-sm" data-action="rest-skip">Skip</button>
        <div class="rest-progress"><span class="js-rest-progress"></span></div>
    </div>`;
}

function renderRest() {
    const t = state.timer;
    const sheetOpen = $('#exercise-sheet').open;
    const bar = $('#rest-bar');
    if (t && !sheetOpen) {
        bar.innerHTML = `
            <button class="rest-open" data-action="open-rest-exercise" aria-label="Open exercise">
                ${icon('timer', 'rest-icon')}
                <span class="rest-info"><span class="rest-label">Rest · ${esc(t.label)}</span><span class="rest-time js-rest-time">${fmtClock(restLeft())}</span></span>
            </button>
            <button class="btn btn-sm" data-action="rest-adjust" data-delta="-15" aria-label="15 seconds less">−15</button>
            <button class="btn btn-sm" data-action="rest-adjust" data-delta="15" aria-label="15 seconds more">+15</button>
            <button class="btn btn-sm" data-action="rest-skip">Skip</button>
            <div class="rest-progress"><span class="js-rest-progress"></span></div>`;
        bar.hidden = false;
    } else {
        bar.hidden = true;
        bar.innerHTML = '';
    }
    document.body.classList.toggle('has-rest-bar', !!t && !sheetOpen);
    if (sheetOpen && ui.sheet) {
        // Add/remove only the strip: rebuilding the footer would drop focus mid-typing
        const foot = $('#sx-foot');
        const strip = $('.rest-strip', foot);
        if (strip && !t) strip.remove();
        else if (!strip && t) foot.insertAdjacentHTML('afterbegin', restStripHtml());
    }
    if (t && !restTick) restTick = setInterval(tickRest, 250);
    if (!t && restTick) { clearInterval(restTick); restTick = null; }
    if (t) tickRest();
}

function tickRest() {
    const t = state.timer;
    if (!t) return;
    const left = restLeft();
    if (left <= 0) { finishRest(); return; }
    const pct = clamp(100 - ((t.endsAt - Date.now()) / (t.duration * 1000)) * 100, 0, 100);
    $$('.js-rest-time').forEach((el) => { el.textContent = fmtClock(left); });
    $$('.js-rest-progress').forEach((el) => { el.style.width = `${pct}%`; });
}

function finishRest() {
    state.timer = null;
    saveState();
    renderRest();
    if (state.prefs.vibrate) haptic([220, 120, 220]);
    if (state.prefs.sound) beep();
    showToast('Rest over · time for the next set');
}

let audioCtx = null;
function unlockAudio() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { audioCtx = null; }
}
function beep() {
    unlockAudio();
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        for (const at of [0, 0.22]) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = 880;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0.0001, now + at);
            gain.gain.exponentialRampToValueAtTime(0.35, now + at + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.18);
            osc.start(now + at);
            osc.stop(now + at + 0.2);
        }
    } catch (e) { /* audio unavailable - vibration and toast still fire */ }
}
function haptic(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* unsupported */ }
}

// ===== Progress view =====
function computeStats() {
    const weeks = [];
    const sessions = [];
    let totalSets = 0, totalVolume = 0, sessionsDone = 0;
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        let sets = 0, volume = 0, done = 0;
        for (const s of SESSIONS) {
            const p = sessionProgress(w, s);
            sets += p.logged;
            volume += p.volume;
            if (p.complete) done++;
            if (p.logged) sessions.push({ week: w, session: s, ...p });
        }
        weeks.push({ week: w, sets, volume, done });
        totalSets += sets;
        totalVolume += volume;
        sessionsDone += done;
    }
    return { weeks, sessions, totalSets, totalVolume, sessionsDone };
}

function niceCeil(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

function volumeChartHtml(weeks, current) {
    const W = 320, H = 170, L = 36, R = 4, T = 20, B = 24;
    const maxVol = Math.max(...weeks.map((w) => w.volume));
    if (maxVol <= 0) return '<p class="chart-empty">Log some sets to see your weekly volume.</p>';
    const top = niceCeil(maxVol);
    const plotH = H - T - B;
    const band = (W - L - R) / weeks.length;
    const bw = Math.min(18, band - 6);
    let grid = '', bars = '', axis = '', labels = '';
    for (const f of [0, 0.5, 1]) {
        const y = T + plotH * (1 - f);
        grid += `<line class="grid-line" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/>`;
        axis += `<text class="axis-text" x="${L - 6}" y="${y + 4}" text-anchor="end">${fmtCompact(top * f)}</text>`;
    }
    const maxIdx = weeks.findIndex((w) => w.volume === maxVol);
    weeks.forEach((w, i) => {
        const cx = L + band * i + band / 2;
        const isCur = w.week === current;
        axis += `<text class="axis-text ${isCur ? 'is-current' : ''}" x="${cx}" y="${H - 6}" text-anchor="middle">${w.week}</text>`;
        if (w.volume <= 0) return;
        const h = Math.max(3, (plotH * w.volume) / top);
        const x = cx - bw / 2;
        const y = T + plotH - h;
        const r = Math.min(4, h, bw / 2);
        bars += `<rect class="hit" x="${L + band * i}" y="${T - 14}" width="${band}" height="${plotH + 14}" tabindex="0" role="img"
            aria-label="Week ${w.week}: ${fmtInt(w.volume)} kg, ${w.sets} sets" data-i="${i}"/>`;
        bars += `<path class="bar" d="M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${y + h}Z"/>`;
        if (isCur || i === maxIdx) labels += `<text class="value-text" x="${cx}" y="${y - 5}" text-anchor="middle">${fmtCompact(w.volume)}</text>`;
    });
    return `<div class="chart" id="volume-chart"><svg viewBox="0 0 ${W} ${H}" aria-label="Volume lifted per week">${grid}${axis}${bars}${labels}</svg></div>`;
}

function sparkHtml(points) {
    if (points.length < 2) return '';
    const W = 64, H = 26, P = 5;
    const vals = points.map((p) => p.v);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const span = hi - lo || 1;
    const xs = (i) => P + (i * (W - 2 * P)) / (points.length - 1);
    const ys = (v) => (hi === lo ? H / 2 : H - P - ((v - lo) / span) * (H - 2 * P));
    const pts = points.map((p, i) => `${xs(i).toFixed(1)},${ys(p.v).toFixed(1)}`).join(' ');
    const last = points.length - 1;
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts}"/><circle cx="${xs(last).toFixed(1)}" cy="${ys(points[last].v).toFixed(1)}" r="4"/></svg>`;
}

function deltaHtml(cur, prev) {
    if (!cur || !prev) return '';
    if (cur.weight !== prev.weight) {
        const d = round2(cur.weight - prev.weight);
        return d > 0 ? `<span class="delta is-up">▲ ${fmtNum(d)} kg</span>` : `<span class="delta is-down">▼ ${fmtNum(-d)} kg</span>`;
    }
    const d = cur.reps - prev.reps;
    if (d > 0) return `<span class="delta is-up">▲ ${plural(d, 'rep')}</span>`;
    if (d < 0) return `<span class="delta is-down">▼ ${plural(-d, 'rep')}</span>`;
    return '<span class="delta is-same">= same</span>';
}

function renderProgress() {
    const stats = computeStats();
    const week = state.currentWeek;
    const totalSessions = TOTAL_WEEKS * SESSIONS.length;
    const block = ui.progressBlock || blockOf(week);

    let html = '<h1 class="view-title">Progress</h1>';

    // Program progress
    let blocks = '';
    for (let b = 1; b <= 3; b++) {
        const [s, e] = blockRange(b);
        const done = stats.weeks.slice(s - 1, e).reduce((n, w) => n + w.done, 0);
        blocks += `<div class="program-block ${b === blockOf(week) ? 'is-current' : ''}"><div class="meter ${done === 20 ? 'is-done' : ''}"><span style="--p:${(done / 20) * 100}%"></span></div>Block ${b} · ${done}/20</div>`;
    }
    html += `<section class="card">
        <div class="program-row"><div><p class="eyebrow">Program</p><strong>Week ${week} of ${TOTAL_WEEKS}</strong></div>
        <span class="muted">${stats.sessionsDone} of ${totalSessions} sessions</span></div>
        <div class="meter" role="progressbar" aria-label="Sessions completed" aria-valuemin="0" aria-valuemax="${totalSessions}" aria-valuenow="${stats.sessionsDone}"><span style="--p:${(stats.sessionsDone / totalSessions) * 100}%"></span></div>
        <div class="program-blocks">${blocks}</div></section>`;

    // KPIs
    html += `<div class="kpis">
        <div class="kpi"><div class="kpi-label">Workouts</div><div class="kpi-value">${stats.sessionsDone}</div></div>
        <div class="kpi"><div class="kpi-label">Sets logged</div><div class="kpi-value">${fmtInt(stats.totalSets)}</div></div>
        <div class="kpi"><div class="kpi-label">Volume</div><div class="kpi-value">${fmtCompact(stats.totalVolume)}<small>kg</small></div></div>
    </div>`;

    // This week
    const rows = SESSIONS.map((s) => {
        const p = sessionProgress(week, s);
        const cls = p.complete ? 'is-done' : p.started ? 'is-started' : '';
        const meta = p.complete ? `${p.logged} sets · ${fmtCompact(p.volume)} kg` : p.started ? `${p.done}/${p.target} sets` : `${p.target} sets planned`;
        return `<button class="ws-row ${cls}" data-action="session" data-session="${s}">
            <span class="ws-status">${p.complete ? icon('check') : ''}</span>
            <span class="ws-name">${esc(sessionName(s))}</span><span class="ws-meta">${meta}</span>${icon('chev-right', 'icon-sm')}</button>`;
    }).join('');
    html += `<section class="card"><div class="card-head"><h2 class="card-title">Week ${week}</h2>
        <span class="muted">${stats.weeks[week - 1].done}/5 done</span></div><div class="week-sessions">${rows}</div></section>`;

    // Weekly volume chart (+ table twin)
    const table = `<table class="data-table"><thead><tr><th>Week</th><th class="num">Sets</th><th class="num">Volume (kg)</th></tr></thead><tbody>
        ${stats.weeks.filter((w) => w.sets > 0).map((w) => `<tr><td>Week ${w.week}</td><td class="num">${w.sets}</td><td class="num">${fmtInt(w.volume)}</td></tr>`).join('')}</tbody></table>`;
    html += `<section class="card"><div class="card-head"><h2 class="card-title">Weekly volume</h2><span class="muted">kg lifted (weight × reps)</span></div>
        ${volumeChartHtml(stats.weeks, week)}
        ${stats.totalSets ? `<button class="btn btn-sm btn-ghost table-toggle" data-action="toggle-volume-table">${ui.showVolumeTable ? 'Hide table' : 'Show as table'}</button>${ui.showVolumeTable ? table : ''}` : ''}
    </section>`;

    // Exercise progress for a block
    const seg = [1, 2, 3].map((b) => `<button class="${b === block ? 'is-active' : ''}" data-action="progress-block" data-block="${b}" aria-pressed="${b === block}">Block ${b}</button>`).join('');
    const [bs, be] = blockRange(block);
    let groups = '';
    for (const s of SESSIONS) {
        let items = '';
        for (const ex of PROGRAM.blocks[block][s]) {
            const weeksData = [];
            for (let w = bs; w <= be; w++) {
                const e = state.workoutData[dataKey(w, s, ex.name)];
                if (e && e.sets.length) weeksData.push({ week: w, sets: e.sets });
            }
            if (!weeksData.length) continue;
            const key = `${block}|${s}|${ex.name}`;
            const open = ui.openHistory.has(key);
            // Best, trend and delta only compare sets done as the exercise done most recently
            const lastWeek = weeksData[weeksData.length - 1];
            const latestAs = doneAs(lastWeek.sets[lastWeek.sets.length - 1], ex);
            const same = weeksData
                .map((d) => ({ week: d.week, sets: d.sets.filter((x) => doneAs(x, ex) === latestAs) }))
                .filter((d) => d.sets.length)
                .map((d) => ({ ...d, best: bestSet(d.sets) }));
            const latest = same[same.length - 1];
            const before = same[same.length - 2];
            const best = bestSet(same.flatMap((d) => d.sets));
            const shownBase = parseName(latestAs).base;
            const setsText = (sets) => sets.map((x) => esc(fmtSetShort(x)) + (doneAs(x, ex) !== latestAs ? ` <span class="muted">(${esc(parseName(doneAs(x, ex)).base)})</span>` : '')).join(', ');
            const detail = open ? `<div class="hist-detail"><table class="data-table"><thead><tr><th>Week</th><th>Sets</th></tr></thead><tbody>
                ${weeksData.map((d) => `<tr><td>Week ${d.week}</td><td>${setsText(d.sets)}</td></tr>`).join('')}
                </tbody></table></div>` : '';
            items += `<div class="hist-item"><button class="hist-row" data-action="toggle-history" data-key="${esc(key)}" aria-expanded="${open}">
                <span><span class="hist-name">${esc(shownBase)}${parseName(ex.name).setTag === 'heavy' ? ' · top set' : parseName(ex.name).setTag === 'backoff' ? ' · back-off' : ''}</span>
                <span class="hist-meta">Best ${esc(fmtSet(best))} · W${latest.week}: ${latest.sets.map((x) => esc(fmtSetShort(x))).join(', ')}</span></span>
                <span class="hist-right">${sparkHtml(same.map((d) => ({ v: d.best.weight || d.best.reps })))}${deltaHtml(latest.best, before?.best)}</span>
            </button>${detail}</div>`;
        }
        if (items) groups += `<div class="hist-group"><div class="hist-group-title">${esc(sessionName(s))}</div>${items}</div>`;
    }
    html += `<section class="card"><div class="card-head"><h2 class="card-title">Exercise progress</h2></div>
        <div class="seg" role="group" aria-label="Block">${seg}</div>
        ${groups || `<p class="empty-note">Nothing logged in block ${block} (weeks ${bs}–${be}) yet.</p>`}
        ${groups ? '<p class="empty-note">Arrows compare your best set with the previous week. Tap an exercise for every set.</p>' : ''}</section>`;

    // Recent sessions
    const recent = stats.sessions
        .slice()
        .sort((a, b) => (b.lastT - a.lastT) || (b.week - a.week) || (b.session - a.session))
        .slice(0, 6);
    if (recent.length) {
        html += `<section class="card"><h2 class="card-title">Recent sessions</h2>${recent.map((r) => `
            <div class="recent-row"><span class="recent-when">${r.lastT ? esc(shortDate(r.lastT)) : '—'}</span>
            <span class="recent-what">${esc(sessionName(r.session))}<small>Week ${r.week}${r.complete ? ' · complete' : ` · ${r.done}/${r.target} sets`}</small></span>
            <span class="recent-vol">${r.logged} sets · ${fmtCompact(r.volume)} kg</span></div>`).join('')}</section>`;
    }

    $('#view-progress').innerHTML = html;
    bindChart(stats.weeks);
}

function bindChart(weeks) {
    const chart = $('#volume-chart');
    if (!chart) return;
    const tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    chart.append(tip);
    const show = (hit) => {
        const w = weeks[+hit.dataset.i];
        const svg = chart.querySelector('svg');
        const box = svg.getBoundingClientRect();
        const scale = box.width / svg.viewBox.baseVal.width;
        const x = (parseFloat(hit.getAttribute('x')) + parseFloat(hit.getAttribute('width')) / 2) * scale;
        const barTop = hit.nextElementSibling.getBBox().y * scale;
        tip.innerHTML = `<strong>${fmtInt(w.volume)} kg</strong>Week ${w.week} · ${plural(w.sets, 'set')}`;
        tip.hidden = false;
        const half = tip.offsetWidth / 2;
        tip.style.left = `${clamp(x, half, box.width - half)}px`;
        tip.style.top = `${Math.max(barTop - 6, tip.offsetHeight)}px`;
        chart.querySelectorAll('.bar.is-hover').forEach((b) => b.classList.remove('is-hover'));
        hit.nextElementSibling.classList.add('is-hover');
    };
    const hide = () => { tip.hidden = true; chart.querySelectorAll('.bar.is-hover').forEach((b) => b.classList.remove('is-hover')); };
    chart.querySelectorAll('.hit').forEach((hit) => {
        hit.addEventListener('pointerenter', () => show(hit));
        hit.addEventListener('pointerdown', () => show(hit));
        hit.addEventListener('focus', () => show(hit));
        hit.addEventListener('blur', hide);
    });
    chart.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hide(); });
}

// ===== Guide: warm-up checklist =====
function renderWarmup() {
    const today = localDate(Date.now());
    const done = new Set(state.warmup.date === today ? state.warmup.done : []);
    let html = WARMUP.map((sec) => `<div class="wu-section"><div class="section-label">${esc(sec.title)}</div><div class="wu-list">
        ${sec.items.map((it) => {
            const move = EXERCISE_MEDIA.moves[it.move];
            const checked = done.has(it.id);
            return `<div class="wu-item ${checked ? 'is-checked' : ''}">
                ${move?.gif ? `<button class="thumb-btn" data-action="open-media" data-gif="${esc(move.gif)}" data-title="${esc(it.name)}" data-note="${esc(move.note || '')}" aria-label="Show ${esc(it.name)} demo">${thumbHtml(move, it.name)}</button>` : thumbHtml(move, it.name)}
                <button class="wu-toggle" data-action="toggle-warmup" data-id="${esc(it.id)}" aria-pressed="${checked}">
                    <span class="wu-text"><span class="wu-name">${esc(it.name)}</span><span class="wu-detail">${esc(it.detail)}</span></span>
                    <span class="check">${icon('check')}</span>
                </button></div>`;
        }).join('')}</div></div>`).join('');
    if (done.size) html += `<button class="btn btn-sm btn-ghost wu-reset" data-action="reset-warmup">Clear ticks</button>`;
    $('#warmup-list').innerHTML = html;
}

function toggleWarmup(id) {
    const today = localDate(Date.now());
    const done = new Set(state.warmup.date === today ? state.warmup.done : []);
    if (done.has(id)) done.delete(id); else done.add(id);
    state.warmup = { date: today, done: [...done] };
    saveState();
    renderWarmup();
}

// ===== Media viewer =====
function openMedia(gif, title, note) {
    setSheetHtml($('#media-sheet'), `
        <div class="sheet-grab" data-drag aria-hidden="true"></div>
        <header class="sheet-head"><div class="sheet-titles"><h2 class="sheet-title">${esc(title)}</h2></div>
            <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></header>
        <div class="media-full"><img src="${esc(gif)}" alt="${esc(`${title} demonstration`)}" data-fallback="${esc(title)}"></div>
        ${note ? `<p class="demo-caption media-note">${icon('info', 'icon-xs')}${esc(note)}</p>` : ''}
        <p class="media-credit">Animation: fitnessprogramer.com</p>`);
    openSheet($('#media-sheet'));
}

// ===== Settings =====
function renderSettings() {
    const stale = backupStale();
    const last = state.lastBackupAt ? `Last backup ${relDay(state.lastBackupAt)}` : 'No backup yet';
    setSheetHtml($('#settings-sheet'), `
        <div class="sheet-grab" data-drag aria-hidden="true"></div>
        <header class="sheet-head"><div class="sheet-titles"><h2 class="sheet-title">Settings</h2></div>
            <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></header>
        <div class="sheet-body">
            <div class="settings-group">
                <div class="section-label">Your data</div>
                <div class="settings-card">
                    <button class="settings-row ${stale ? 'is-warn' : ''}" data-action="export">${icon('download')}
                        <span class="settings-row-text"><span class="settings-row-title">Export backup</span>
                        <span class="settings-row-sub">${esc(last)}${stale ? ' · export one now' : ''}</span></span></button>
                    <button class="settings-row" data-action="import">${icon('upload')}
                        <span class="settings-row-text"><span class="settings-row-title">Restore from backup</span>
                        <span class="settings-row-sub">Load a backup file (your current data is downloaded first)</span></span></button>
                </div>
            </div>
            <div class="settings-group">
                <div class="section-label">Workout</div>
                <div class="settings-card">
                    ${switchRow('sound', 'Rest timer sound', 'Beep when the rest is over')}
                    ${switchRow('vibrate', 'Vibration', 'Buzz when the rest is over')}
                    ${switchRow('keepAwake', 'Keep screen on', 'While the app is open')}
                </div>
            </div>
            <div class="settings-group">
                <div class="section-label">Offline</div>
                <div class="settings-card">
                    <button class="settings-row" data-action="download-media" ${ui.mediaBusy ? 'aria-busy="true"' : ''}>${icon('cloud-off')}
                        <span class="settings-row-text"><span class="settings-row-title">Save all exercise demos</span>
                        <span class="settings-row-sub" id="media-status">${esc(ui.mediaStatus || 'So every animation shows without internet. Best on Wi-Fi.')}</span></span></button>
                </div>
            </div>
            ${parkedKeys().length ? `<div class="settings-group">
                <div class="section-label">Recovered data</div>
                <div class="settings-card">
                    <button class="settings-row is-warn" data-action="download-parked">${icon('download')}
                        <span class="settings-row-text"><span class="settings-row-title">Download unreadable data</span>
                        <span class="settings-row-sub">Saved data that couldn't be read was kept aside</span></span></button>
                </div>
            </div>` : ''}
            <div class="settings-group">
                <div class="settings-card">
                    <button class="settings-row is-danger" data-action="reset-all">${icon('trash')}
                        <span class="settings-row-text"><span class="settings-row-title">Reset all data</span>
                        <span class="settings-row-sub">Downloads a backup first</span></span></button>
                </div>
            </div>
            <p class="settings-foot">Gym Tracker ${APP_VERSION} · <span id="storage-status">Data is stored on this phone only</span><br>Exercise animations by fitnessprogramer.com</p>
        </div>`);
    renderStorageStatus();
}

function switchRow(pref, title, sub) {
    return `<label class="settings-row"><span class="settings-row-text"><span class="settings-row-title">${esc(title)}</span>
        <span class="settings-row-sub">${esc(sub)}</span></span>
        <span class="switch"><input type="checkbox" data-pref="${pref}" ${state.prefs[pref] ? 'checked' : ''}><span></span></span></label>`;
}

async function renderStorageStatus() {
    const el = $('#storage-status');
    if (!el || !navigator.storage?.persisted) return;
    try {
        const persisted = await navigator.storage.persisted();
        el.textContent = persisted ? 'Storage protected from cleanup' : 'Storage not yet protected (install the app)';
    } catch (e) { /* keep default text */ }
}

function requestPersistentStorage() {
    try { navigator.storage?.persist?.().catch(() => {}); } catch (e) { /* unsupported */ }
}

// ===== Backup =====
function downloadText(text, prefix) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}-${localDate(Date.now())}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}
// Backup file = the state, always stamped with this version (a restore must never mistake it
// for v2 data). `extra` carries copies the app kept aside, so a reset loses nothing.
function downloadJson(prefix, extra) {
    downloadText(JSON.stringify({ ...state, appVersion: APP_VERSION, ...(extra || {}) }, null, 2), prefix);
}

// Copies of saved data the app set aside: the pre-v3 original and any unreadable data
function keptCopies() {
    const out = {};
    try {
        const pre = localStorage.getItem(PRE_V3_BACKUP_KEY);
        if (pre) out.preUpdateCopy = pre;
        const parked = parkedKeys().map((k) => localStorage.getItem(k)).filter(Boolean);
        if (parked.length) out.unreadableCopies = parked;
    } catch (e) { /* storage unavailable */ }
    return out;
}
function parkedKeys() {
    try {
        return Object.keys(localStorage).filter((k) => k.startsWith(`${STORAGE_KEY}_unreadable_`));
    } catch (e) {
        return [];
    }
}
function downloadParked() {
    const texts = parkedKeys().map((k) => localStorage.getItem(k)).filter(Boolean);
    if (!texts.length) { showToast('Nothing to download'); return; }
    downloadText(texts.length === 1 ? texts[0] : JSON.stringify(texts, null, 2), 'gym-tracker-unreadable-data');
    showToast('Saved to Downloads');
}

function exportBackup() {
    downloadJson('gym-tracker-backup');
    state.lastBackupAt = Date.now();
    saveState();
    renderTopbar();
    const row = $('#settings-sheet [data-action="export"]');
    if (row) {
        row.classList.remove('is-warn');
        $('.settings-row-sub', row).textContent = 'Last backup today';
    }
    showToast('Backup saved to Downloads');
}

function looksLikeBackup(p) {
    return !!p && typeof p === 'object' && p.workoutData && typeof p.workoutData === 'object'
        && Object.keys(p.workoutData).every((k) => DATA_KEY_RE.test(k));
}

async function importBackup(file) {
    let parsed;
    try { parsed = JSON.parse(await file.text()); } catch (e) { showToast("That file isn't a valid backup"); return; }
    if (!looksLikeBackup(parsed)) { showToast("That file isn't a Gym Tracker backup"); return; }
    const incoming = normalizeState(parsed);
    const n = countSets(incoming);
    const when = Number.isFinite(parsed.lastSavedAt) && parsed.lastSavedAt > 0 ? ` from ${new Date(parsed.lastSavedAt).toLocaleDateString()}` : '';
    const ok = await confirmDialog({
        title: 'Restore this backup?',
        message: `It has ${plural(n, 'logged set')}${when}. It replaces what's on this phone now${countSets() ? ' (a copy of your current data is downloaded first)' : ''}.`,
        confirm: 'Restore'
    });
    if (!ok) return;
    if (countSets()) downloadJson('gym-tracker-before-restore');
    incoming.lastBackupAt = Date.now();
    state = incoming;
    const saved = saveState();
    closeAllSheets();
    render();
    window.scrollTo({ top: 0 });
    if (!saved) warnNotSaved();
    else showToast(`Backup restored · ${plural(n, 'set')}`);
}

async function resetAll() {
    const extra = keptCopies();
    const hasCopies = Object.keys(extra).length > 0;
    const ok = await confirmDialog({
        title: 'Reset all data?',
        message: `This deletes every logged set and swap on this phone${hasCopies ? ', including the copies the app kept aside' : ''}.${countSets() || hasCopies ? ' Everything is downloaded as a backup file first, just in case.' : ''}`,
        confirm: 'Reset all',
        danger: true
    });
    if (!ok) return;
    // One safety file with the current data plus any kept copies - nothing is lost by a reset
    if (countSets() || hasCopies) downloadJson('gym-tracker-before-reset', extra);
    try {
        localStorage.removeItem(PRE_V3_BACKUP_KEY);
        for (const k of parkedKeys()) localStorage.removeItem(k);
    } catch (e) { /* storage unavailable */ }
    const prefs = state.prefs;
    state = defaultState();
    state.prefs = prefs;
    const saved = saveState();
    closeAllSheets();
    render();
    window.scrollTo({ top: 0 });
    if (!saved) warnNotSaved();
    else showToast('All data reset');
}

// ===== Offline media =====
function allGifUrls() {
    return [...new Set(Object.values(EXERCISE_MEDIA.moves).map((m) => m.gif).filter(Boolean))];
}

// Loads a URL as an image (through the service worker): true only if it really decodes.
// The GIF host sends no CORS headers, so a fetch can't see the HTTP status - decoding can.
function imageDecodes(url) {
    return new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => resolve(false), 30000);
        img.onload = () => { clearTimeout(timer); resolve(img.naturalWidth > 0); };
        img.onerror = () => { clearTimeout(timer); resolve(false); };
        img.src = url;
    });
}

function setMediaStatus(text) {
    ui.mediaStatus = text;
    const el = $('#media-status');
    if (el) el.textContent = text;
}

async function downloadMedia() {
    if (ui.mediaBusy) { showToast('Already saving the demos…'); return; }
    if (!('caches' in window)) { showToast("Offline storage isn't available in this browser"); return; }
    ui.mediaBusy = true;
    $('#settings-sheet [data-action="download-media"]')?.setAttribute('aria-busy', 'true');
    const urls = allGifUrls();
    let done = 0, failed = 0;
    try {
        const cache = await caches.open(GIF_CACHE);
        for (const url of urls) {
            let ok = false;
            for (let attempt = 0; attempt < 2 && !ok; attempt++) {
                try {
                    if (!(await cache.match(url))) await cache.put(url, await fetch(url, { mode: 'no-cors' }));
                    ok = await imageDecodes(url);
                } catch (e) { ok = false; }
                if (!ok) await cache.delete(url).catch(() => {}); // never keep an error page
            }
            if (!ok) failed++;
            done++;
            setMediaStatus(`Saving… ${done}/${urls.length}`);
        }
    } finally {
        ui.mediaBusy = false;
        $('#settings-sheet [data-action="download-media"]')?.removeAttribute('aria-busy');
    }
    const msg = failed ? `${urls.length - failed} saved, ${failed} failed · try again on Wi-Fi` : `All ${urls.length} demos saved for offline use`;
    setMediaStatus(msg);
    showToast(msg);
}

// ===== Wake lock =====
let wakeLock = null;
async function updateWakeLock() {
    if (!('wakeLock' in navigator)) return;
    const want = state.prefs.keepAwake && document.visibilityState === 'visible';
    try {
        if (want && !wakeLock) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => { wakeLock = null; });
        } else if (!want && wakeLock) {
            await wakeLock.release();
            wakeLock = null;
        }
    } catch (e) { wakeLock = null; /* denied (e.g. battery saver) - not critical */ }
}

// ===== Sheets: native <dialog> + Android back button =====
const sheetStack = [];
let popGuard = 0;
const OPEN_GRACE_MS = 350; // ignore taps landing on a sheet while it slides in (double-tap protection)

// Replace a sheet's content without destroying the toast host that may live inside it
function setSheetHtml(dialog, html) {
    if (dialog.contains(TOAST_HOST)) document.body.append(TOAST_HOST);
    dialog.innerHTML = html;
    if (dialog.open) placeToastHost();
}

function openSheet(dialog) {
    if (dialog.open) return;
    clearTimeout(dialog._closeTimer);
    dialog._closing = false;
    dialog._openedAt = performance.now();
    dialog.classList.remove('is-closing');
    dialog.style.transition = '';
    dialog.style.transform = '';
    dialog.showModal();
    if (!sheetStack.length && !history.state?.gtModal) history.pushState({ gtModal: 1 }, '');
    sheetStack.push(dialog);
    placeToastHost();
    if (dialog.id === 'exercise-sheet') renderRest();
}

function closeSheet(dialog) {
    if (!dialog || !dialog.open || dialog._closing) return;
    dialog._closing = true;
    armShield(); // whatever is revealed underneath must not catch a second tap
    // Move a visible toast out of the sheet first - but nothing may stop the sheet from closing
    try { placeToastHost(); } catch (e) { console.error(e); }
    const finish = () => {
        dialog._closeTimer = null;
        dialog.classList.remove('is-closing');
        dialog.style.transition = '';
        dialog.style.transform = '';
        if (dialog.open) dialog.close();
    };
    clearTimeout(dialog._closeTimer);
    if (reducedMotion()) { finish(); return; }
    if (dialog.style.transform) {
        // Mid-drag: continue the slide from where the finger left it
        dialog.style.transition = 'transform 0.18s ease-in';
        dialog.style.transform = 'translateY(100%)';
        dialog._closeTimer = setTimeout(finish, 180);
    } else {
        dialog.classList.add('is-closing');
        dialog._closeTimer = setTimeout(finish, 190);
    }
}

function closeAllSheets() {
    for (const d of [...sheetStack].reverse()) closeSheet(d);
}

function onDialogClosed(dialog) {
    clearTimeout(dialog._closeTimer);
    dialog._closeTimer = null;
    dialog._closing = false;
    dialog.classList.remove('is-closing');
    dialog.style.transition = '';
    dialog.style.transform = '';
    const i = sheetStack.lastIndexOf(dialog);
    if (i === -1) return;
    sheetStack.splice(i, 1);
    try { placeToastHost(); } catch (e) { console.error(e); }
    if (dialog.id === 'exercise-sheet') afterExerciseSheetClosed();
    if (!sheetStack.length && history.state?.gtModal && !dialog._viaPop) {
        popGuard++;
        history.back();
    }
    dialog._viaPop = false;
}

function afterExerciseSheetClosed() {
    const sh = ui.sheet;
    ui.sheet = null;
    if (ui.listDirty) render(); else renderRest();
    if (!sh || state.activeTab !== 'workout' || sh.week !== state.currentWeek || sh.session !== state.currentSession) return;
    // The re-render replaced the card the dialog would return focus to (keyboard users only,
    // so touch users don't get a stray focus ring)
    if (ui.keyboardNav) $(`.ex-card[data-index="${sh.index}"]`)?.focus({ preventScroll: true });
    // Just finished the session: bring the "complete / next session" card into view, without an
    // Undo toast sitting on top of its button
    const doneCard = $('.done-card');
    if (doneCard && !sh.startedComplete) {
        dismissToast();
        doneCard.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
}

window.addEventListener('popstate', () => {
    if (popGuard > 0) {
        popGuard--;
        if (sheetStack.length && !history.state?.gtModal) history.pushState({ gtModal: 1 }, '');
        return;
    }
    const alert = $('#confirm-dialog');
    if (alert.open) {
        alert._resolve?.(false);
        if (sheetStack.length) history.pushState({ gtModal: 1 }, '');
        return;
    }
    // A sheet that is already sliding away doesn't count: back closes the next one down
    const open = sheetStack.filter((d) => !d._closing);
    const top = open[open.length - 1];
    if (top) {
        top._viaPop = true;
        closeSheet(top);
        if (open.length > 1) history.pushState({ gtModal: 1 }, '');
    }
});

function confirmDialog({ title, message, confirm = 'OK', cancel = 'Cancel', danger = false }) {
    return new Promise((resolve) => {
        const d = $('#confirm-dialog');
        setSheetHtml(d, `<h2>${esc(title)}</h2><p>${esc(message)}</p>
            <div class="btn-row"><button class="btn" data-answer="no">${esc(cancel)}</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-answer="yes">${esc(confirm)}</button></div>`);
        let settled = false;
        const done = (answer) => {
            if (settled) return;
            settled = true;
            d._resolve = null;
            resolve(answer); // settle first so a later UI error can never leave the caller hanging
            try {
                if (d.open) d.close();
                placeToastHost();
            } catch (e) { console.error(e); }
        };
        d._resolve = done;
        d.querySelector('[data-answer="no"]').onclick = () => done(false);
        d.querySelector('[data-answer="yes"]').onclick = () => done(true);
        d.oncancel = (e) => { e.preventDefault(); done(false); };
        d.showModal();
        d.querySelector('[data-answer="no"]').focus();
    });
}

// Drag a sheet down by its handle/header to dismiss it
let drag = null;
document.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('.sheet-grab, .sheet-head');
    if (!handle || e.target.closest('button, input, a, label')) return;
    const dialog = handle.closest('dialog.sheet');
    if (!dialog || !dialog.open) return;
    drag = { dialog, y0: e.clientY, dy: 0, t0: performance.now() };
    dialog.style.transition = 'none';
});
document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dy = Math.max(0, e.clientY - drag.y0);
    drag.dialog.style.transform = drag.dy ? `translateY(${drag.dy}px)` : '';
});
function endDrag() {
    if (!drag) return;
    const { dialog, dy, t0 } = drag;
    drag = null;
    const fast = dy > 40 && dy / (performance.now() - t0) > 0.6;
    if (dy > 120 || fast) { closeSheet(dialog); return; }
    dialog.style.transition = 'transform 0.2s var(--ease)';
    dialog.style.transform = '';
    setTimeout(() => { dialog.style.transition = ''; }, 220);
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

// ===== Toasts & banners =====
// Kept as a reference so it can always be re-attached, wherever it was moved to.
const TOAST_HOST = document.getElementById('toast-host');
let toastTimer = null;
let dismissCurrentToast = null;

// A modal <dialog> makes everything outside it inert, so a toast with an Undo button
// must live inside the topmost open sheet to stay tappable.
function placeToastHost() {
    const host = TOAST_HOST;
    const alert = $('#confirm-dialog');
    const open = sheetStack.filter((d) => !d._closing);
    const container = alert.open ? alert : open[open.length - 1] || document.body;
    const visible = host.children.length > 0;
    if (host.parentElement !== container) {
        try { if (host.matches(':popover-open')) host.hidePopover(); } catch (e) { /* not open */ }
        container.append(host);
    }
    const inSheet = container !== document.body;
    host.classList.toggle('is-top', inSheet);
    host.style.setProperty('--toast-top', `${toastTop(container)}px`);
    if (visible) {
        // Re-show so it sits above the sheet's own content in the top layer
        try {
            if (host.showPopover) {
                if (host.matches(':popover-open')) host.hidePopover();
                host.showPopover();
            }
        } catch (e) { /* popover unsupported - plain fixed element */ }
    }
}

// Where a toast goes inside a sheet: just below the sheet's header, so the handle, title and
// close button stay usable. Measured from layout (offsets), not getBoundingClientRect, because
// the sheet may still be mid slide-in. On short screens (small phone, keyboard open) the space
// below the header is the logger itself, so the toast goes to the very top instead.
function toastTop(container) {
    const head = container.querySelector?.('.sheet-head');
    const vh = window.innerHeight;
    if (!head || vh < 600) return 8;
    const sheetTop = container.classList.contains('sheet') ? vh - container.offsetHeight : container.offsetTop;
    return Math.max(8, Math.min(sheetTop + head.offsetTop + head.offsetHeight + 6, vh - 120));
}

function dismissToast() {
    dismissCurrentToast?.();
}

function showToast(message, { action, onAction, duration, error = false } = {}) {
    const host = TOAST_HOST;
    clearTimeout(toastTimer);
    host.replaceChildren();
    const toast = document.createElement('div');
    toast.className = `toast${error ? ' is-error' : ''}`;
    toast.setAttribute('role', error ? 'alert' : 'status');
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(text);
    let gone = false;
    const dismiss = () => {
        if (gone) return;
        gone = true;
        clearTimeout(toastTimer);
        if (dismissCurrentToast === dismiss) dismissCurrentToast = null;
        toast.classList.add('is-leaving');
        setTimeout(() => {
            toast.remove();
            if (!host.children.length) { try { host.hidePopover?.(); } catch (e) { /* not open */ } }
        }, 180);
    };
    if (action) {
        const btn = document.createElement('button');
        btn.textContent = action;
        btn.addEventListener('click', () => {
            if (gone) return; // one shot: a double tap must not undo twice
            armShield();
            dismiss();
            onAction();
        });
        toast.append(btn);
    }
    host.append(toast);
    dismissCurrentToast = dismiss;
    placeToastHost();
    toastTimer = setTimeout(dismiss, duration || (action ? 4500 : 2400));
}

function showBanner(id, message, actionLabel, onAction, isError = false) {
    hideBanner(id);
    const el = document.createElement('div');
    el.className = `banner ${isError ? 'is-error' : ''}`;
    el.dataset.banner = id;
    el.setAttribute('role', isError ? 'alert' : 'status');
    const text = document.createElement('span');
    text.textContent = message;
    el.append(text);
    if (actionLabel) {
        const btn = document.createElement('button');
        btn.textContent = actionLabel;
        btn.addEventListener('click', () => { armShield(); onAction(); });
        el.append(btn);
    }
    const close = document.createElement('button');
    close.className = 'banner-close';
    close.setAttribute('aria-label', 'Dismiss');
    close.innerHTML = icon('x', 'icon-sm');
    close.addEventListener('click', () => {
        armShield(); // the card under the banner must not catch the second tap of a double tap
        el.classList.add('is-leaving');
        setTimeout(() => el.remove(), 200);
    });
    el.append(close);
    $('#banner-host').append(el);
}
function hideBanner(id) {
    $(`#banner-host [data-banner="${id}"]`)?.remove();
}

// ===== Service worker & updates =====
let swRegistration = null;
let lastUpdateCheck = 0;

// An installed PWA resumes from the app switcher without reloading, so the browser never
// re-checks sw.js on its own; check when the app comes back to the foreground (throttled).
function checkForUpdate() {
    if (!swRegistration || !navigator.onLine || Date.now() - lastUpdateCheck < 10 * 60000) return;
    // Only a check that actually reached the server counts against the throttle
    swRegistration.update().then(() => { lastUpdateCheck = Date.now(); }, () => { /* offline */ });
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
        try {
            const hadController = !!navigator.serviceWorker.controller;
            const reg = await navigator.serviceWorker.register('./sw.js');
            if (!reg) return;
            swRegistration = reg;
            lastUpdateCheck = Date.now(); // the browser checks on load itself
            const offer = (worker) => showBanner('update', 'A new version of the app is ready.', 'Update', () => worker.postMessage({ type: 'SKIP_WAITING' }));
            if (reg.waiting && hadController) offer(reg.waiting);
            reg.addEventListener('updatefound', () => {
                const worker = reg.installing;
                worker?.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
                });
            });
            let reloading = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!hadController || reloading) return; // first install: nothing to reload
                reloading = true;
                window.location.reload();
            });
        } catch (e) {
            console.error('Service worker registration failed:', e);
        }
    });
}

// ===== Event wiring =====
const ACTIONS = {
    'week-prev': () => setWeek(state.currentWeek - 1),
    'week-next': () => setWeek(state.currentWeek + 1),
    'start-week': () => {
        const next = state.currentWeek + 1;
        if (next > TOTAL_WEEKS) return;
        state.currentSession = SESSIONS.find((s) => !sessionProgress(next, s).complete) || 1;
        setWeek(next);
    },
    'open-weeks': openWeeks,
    'pick-week': (el) => { setWeek(+el.dataset.week); closeSheet($('#week-sheet')); },
    'open-settings': () => { renderSettings(); openSheet($('#settings-sheet')); },
    session: (el) => setSession(+el.dataset.session),
    tab: (el) => switchTab(el.dataset.tab),
    dismiss: (el) => { state.dismissed[el.dataset.key] = true; saveState(); render(); },
    'open-exercise': (el) => openExercise(state.currentWeek, state.currentSession, +el.dataset.index),
    'close-sheet': (el) => closeSheet(el.closest('dialog')),
    'goto-exercise': (el) => switchExercise(+el.dataset.index),
    'pick-set': (el) => {
        const sh = ui.sheet;
        const i = +el.dataset.set;
        if (!sh || sh.active === i) return;
        sh.active = i;
        sh.draft = null;
        renderExerciseSheet();
    },
    'add-set': () => {
        const sh = ui.sheet;
        if (!sh) return;
        sh.active = getEntry(sh.week, sh.session, currentExercise().name).sets.length;
        sh.draft = null;
        renderExerciseSheet();
        requestAnimationFrame(revealActiveRow);
    },
    'cancel-edit': () => {
        const sh = ui.sheet;
        const ex = currentExercise();
        if (!sh || !ex) return;
        const n = getEntry(sh.week, sh.session, ex.name).sets.length;
        sh.active = n < ex.sets ? n : null;
        sh.draft = null;
        renderExerciseSheet();
    },
    'log-set': () => logSet(),
    'log-same': () => {
        const sh = ui.sheet;
        const p = previousEntry(sh.week, sh.session, currentExercise())?.sets[sh.active];
        if (p) logSet({ weight: p.weight, reps: p.reps });
    },
    'delete-set': deleteSet,
    'cycle-step': () => {
        const name = normalizeExerciseName(shownName(ui.sheet.week, ui.sheet.session, currentExercise()));
        const cur = state.prefs.steps[name] || DEFAULT_STEP;
        state.prefs.steps[name] = WEIGHT_STEPS[(WEIGHT_STEPS.indexOf(cur) + 1) % WEIGHT_STEPS.length];
        saveState();
        saveDraft();
        renderSheetFooter();
    },
    'open-swap': openSwap,
    'choose-swap': (el) => chooseSwap(el.dataset.name),
    'open-media': (el) => openMedia(el.dataset.gif, el.dataset.title, el.dataset.note),
    'rest-adjust': (el) => adjustRest(+el.dataset.delta),
    'rest-skip': stopRest,
    'open-rest-exercise': () => {
        const ref = state.timer?.ref;
        if (ref && exercisesFor(ref.week, ref.session)[ref.index]) {
            if (state.currentWeek !== ref.week || state.currentSession !== ref.session || state.activeTab !== 'workout') {
                state.currentWeek = ref.week;
                state.currentSession = ref.session;
                state.activeTab = 'workout';
                saveState();
                render();
            }
            // Land the list on that exercise, so it is in view when the sheet closes again
            $(`.ex-card[data-index="${ref.index}"]`)?.scrollIntoView({ block: 'center' });
            openExercise(ref.week, ref.session, ref.index);
        }
    },
    'toggle-warmup': (el) => toggleWarmup(el.dataset.id),
    'reset-warmup': () => { state.warmup = { date: '', done: [] }; saveState(); renderWarmup(); },
    'progress-block': (el) => { ui.progressBlock = +el.dataset.block; renderProgress(); },
    'toggle-history': (el) => {
        const key = el.dataset.key;
        if (ui.openHistory.has(key)) ui.openHistory.delete(key); else ui.openHistory.add(key);
        renderProgress();
    },
    'toggle-volume-table': () => { ui.showVolumeTable = !ui.showVolumeTable; renderProgress(); },
    export: exportBackup,
    import: () => $('#import-file').click(),
    'download-parked': downloadParked,
    'download-media': downloadMedia,
    'reset-all': resetAll
};

// ===== Tap shield =====
// Most taps change what is under the finger (a sheet closes, the footer re-lays out, a new
// week renders). The second tap of a quick double tap must then not land on whatever took the
// first one's place - e.g. a Log button. After such a tap every tap is swallowed briefly.
// Controls that are meant to be tapped repeatedly stay live.
// (pick-set: a second tap lands on the same set row, which is a no-op)
const FREE_ACTIONS = new Set(['rest-adjust', 'cycle-step', 'week-prev', 'week-next', 'pick-set', 'toggle-warmup', 'toggle-history', 'progress-block', 'toggle-volume-table']);
const SHIELD_MS = 450;
// Actions that put a whole new screen or sheet under the finger get a longer window; e.g. a
// swap option sits right above the exercise sheet's Log button.
const SHIELD_FOR = { 'choose-swap': 750, 'start-week': 650, 'open-rest-exercise': 650, 'open-exercise': 600 };
const shieldActive = () => performance.now() < ui.inputLockUntil;
function armShield(ms = SHIELD_MS) {
    ui.inputLockUntil = Math.max(ui.inputLockUntil, performance.now() + ms);
}

// Taps on a sheet that is still sliding in (or already sliding out) are stray second taps
function sheetBusy(el) {
    const dialog = el.closest('dialog.sheet');
    return !!dialog && (dialog._closing || performance.now() - (dialog._openedAt || 0) < OPEN_GRACE_MS);
}

// Is this pointer/click target a control the shield should let through?
function isFreeTarget(target) {
    const el = target.closest?.('[data-action]');
    return !!el && FREE_ACTIONS.has(el.dataset.action);
}

function wireEvents() {
    // Capture phase: runs before anything else, so a shielded tap can't focus an input,
    // toggle a <summary>, step a stepper or start a drag either.
    // A tap is one gesture: if its press was swallowed, its click (which arrives ~100 ms later,
    // possibly after the window has ended) is swallowed too.
    let swallowClickUntil = 0;
    const block = (e) => { e.preventDefault(); e.stopPropagation(); };
    const shield = (e) => {
        // Only real user input: the app's own programmatic clicks (backup download link,
        // file picker) must never be swallowed
        if (!e.isTrusted || !(e.target instanceof Element)) return;
        if (e.type === 'click' && performance.now() < swallowClickUntil) {
            swallowClickUntil = 0;
            block(e);
            return;
        }
        const shielded = (shieldActive() || sheetBusy(e.target)) && !isFreeTarget(e.target);
        if (e.type === 'pointerdown') swallowClickUntil = shielded ? performance.now() + 1500 : 0;
        if (shielded) block(e);
    };
    document.addEventListener('pointerdown', shield, true);
    document.addEventListener('click', shield, true);

    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el || el.disabled) return;
        const action = el.dataset.action;
        const fn = ACTIONS[action];
        if (!fn) return;
        if (!FREE_ACTIONS.has(action)) armShield(SHIELD_FOR[action]);
        fn(el, e);
    });

    // Steppers: a tap (released without moving) = one step, a still hold = repeat.
    // A swipe that starts on a stepper scrolls the footer instead (touch-action: pan-y)
    // and changes nothing - the step only happens on release.
    let holdTimeout = null, holdInterval = null, stepGesture = null;
    const stopHold = () => {
        clearTimeout(holdTimeout);
        clearInterval(holdInterval);
        holdTimeout = holdInterval = null;
        stepGesture = null;
    };
    document.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest('[data-step]');
        if (!btn) return;
        e.preventDefault(); // keep focus (and the on-screen keyboard) where it is
        stopHold();
        const field = btn.closest('.stepper').dataset.field;
        const dir = +btn.dataset.step;
        stepGesture = { field, dir, x: e.clientX, y: e.clientY, repeating: false };
        holdTimeout = setTimeout(() => {
            if (!stepGesture) return;
            stepGesture.repeating = true;
            stepField(field, dir);
            holdInterval = setInterval(() => stepField(field, dir), 90);
        }, 420);
    });
    document.addEventListener('pointermove', (e) => {
        if (stepGesture && Math.hypot(e.clientX - stepGesture.x, e.clientY - stepGesture.y) > 10) stopHold();
    });
    document.addEventListener('pointerup', () => {
        if (stepGesture && !stepGesture.repeating) stepField(stepGesture.field, stepGesture.dir);
        stopHold();
    });
    ['pointercancel', 'blur'].forEach((ev) => window.addEventListener(ev, stopHold));
    document.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-step]')) e.preventDefault(); });

    // Logger inputs
    document.addEventListener('input', (e) => {
        if (e.target.id === 'in-weight' || e.target.id === 'in-reps') saveDraft();
    });
    document.addEventListener('focusin', (e) => {
        if (e.target.id !== 'in-weight' && e.target.id !== 'in-reps') return;
        setTimeout(() => e.target.select(), 0);
        dismissToast(); // typing the next set: an Undo toast would sit over the logger with the keyboard open
    });
    // The on-screen keyboard resizes the viewport: keep a visible toast clear of the logger
    window.addEventListener('resize', () => { if (TOAST_HOST.children.length) placeToastHost(); });
    // Keyboard vs touch: only keyboard users get focus moved back to where they were
    document.addEventListener('keydown', (e) => { if (['Tab', 'Enter', ' ', 'Escape', 'ArrowDown', 'ArrowUp'].includes(e.key)) ui.keyboardNav = true; }, true);
    document.addEventListener('pointerdown', () => { ui.keyboardNav = false; }, true);
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        if (e.target.id === 'in-weight') { e.preventDefault(); $('#in-reps')?.focus(); }
        else if (e.target.id === 'in-reps') { e.preventDefault(); e.target.blur(); }
    });

    // Settings switches
    document.addEventListener('change', (e) => {
        const pref = e.target.dataset?.pref;
        if (pref) {
            state.prefs[pref] = e.target.checked;
            saveState();
            if (pref === 'keepAwake') updateWakeLock();
        }
    });
    $('#import-file').addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (file) importBackup(file);
    });

    // Remember whether the sheet's warm-up / coaching-cue sections were opened or closed
    document.addEventListener('toggle', (e) => {
        if (e.target.classList?.contains('cues-notes')) ui.cuesOpen = e.target.open;
        else if (e.target.classList?.contains('cues-warmup')) ui.warmupOpen = e.target.open;
    }, true);

    // Broken/offline animation -> neutral placeholder (never a different exercise)
    document.addEventListener('error', (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || !img.hasAttribute('data-fallback')) return;
        // A cached error response would otherwise be served forever: drop it so the next view retries
        if ('caches' in window) caches.open(GIF_CACHE).then((c) => c.delete(img.src)).catch(() => {});
        const box = img.parentElement;
        const label = img.dataset.fallback;
        box.classList.add('is-placeholder');
        box.querySelector('.demo-zoom')?.remove();
        img.replaceWith(Object.assign(document.createElement('span'), {
            className: 'placeholder-inner',
            innerHTML: `${icon('cloud-off')}${esc(label)}`
        }));
    }, true);

    // Dialogs: backdrop tap closes, Escape / back animates, close bookkeeping
    for (const dialog of $$('dialog.sheet')) {
        dialog.addEventListener('click', (e) => {
            if (e.target !== dialog || sheetBusy(dialog)) return;
            const r = dialog.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) closeSheet(dialog);
        });
        dialog.addEventListener('cancel', (e) => {
            if (dialog._closing) {
                // A second quick back press while this one slides away: close the next sheet down
                e.preventDefault();
                const below = sheetStack.filter((d) => d !== dialog && !d._closing).pop();
                if (below) closeSheet(below);
                return;
            }
            if (!e.cancelable) return; // the browser closes it right away; 'close' does the bookkeeping
            e.preventDefault();
            closeSheet(dialog);
        });
        dialog.addEventListener('close', () => onDialogClosed(dialog));
    }

    document.addEventListener('visibilitychange', () => {
        updateWakeLock();
        if (document.visibilityState === 'visible') {
            tickRest();
            checkForUpdate();
        }
    });

    // Another tab/window changed the data: pick it up instead of overwriting it later
    window.addEventListener('storage', (e) => {
        if (e.key !== STORAGE_KEY || !e.newValue) return;
        try {
            state = normalizeState(JSON.parse(e.newValue));
            render();
        } catch (err) { /* ignore malformed */ }
    });
}

function init() {
    state = loadState();
    // Scroll positions are managed by the app; the sheets' history entries must not restore old ones
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // Reloaded while a sheet was open: drop its leftover history entry, or Back would do nothing once
    if (history.state?.gtModal) { popGuard++; history.back(); }
    wireEvents();
    render();
    requestPersistentStorage();
    updateWakeLock();
    if (unreadableText !== null) {
        showBanner('unreadable', "Saved workout data couldn't be read. It was kept aside on this phone.", 'Download', () => downloadText(unreadableText, 'gym-tracker-unreadable-data'), true);
    }
}

document.addEventListener('DOMContentLoaded', init);
registerServiceWorker();
