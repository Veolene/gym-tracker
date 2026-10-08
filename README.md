# Gym Tracker

Installable, offline-first PWA for logging Jeff Nippard's **Essentials Program 5x/Week**: 12 weeks in 3 blocks (the exercises change every 4 weeks), 5 sessions per week (Upper / Lower / Push / Pull / Legs). All weights in kg. Built for one-handed use on a phone between sets.

The program's bodyweight exercises (pull-ups, dips, leg raises, Nordic and glute-ham curls, hyperextensions, floor crunches) are replaced with machine and cable exercises for the same muscles: lat pulldowns, Smith machine decline press, lying leg curls, cable pull-throughs, and machine and cable crunches. That goes for the default exercises and the swap options. Push-ups stay.

## Features

- **Workout tab**: week switcher (tap the week for a 12-week overview), one tab per session showing its progress, and a card per exercise with its demo animation, target (sets × reps · intensity · rest), today's logged sets and last week's best. Supersets (A1/A2) are grouped, and the next exercise to do is highlighted.
- **Exercise screen** (tap a card):
  - a large demo animation (tap to enlarge)
  - a set table showing last week's numbers next to today's
  - big +/- steppers. Hold to repeat; the weight step (±1 / 2.5 / 5 kg) is remembered per exercise.
  - **Log set** pre-fills from your previous set or last week. *Log same as last time* repeats last week in one tap.
  - tap a logged set to edit or delete it, with **Undo** on every log and delete. Accidental double taps are ignored, so a second tap can't log a phantom set.
  - superset guidance (go to A2 now, then back to A1) and a **Next up** button
  - a warm-up ramp calculated from your working weight
  - coaching cues
  - **Swap exercise**: switch to one of the program's alternatives for the rest of the block. Each set remembers which exercise it was done as, so "last time" and progress only ever compare the same exercise.
- **Rest timer**: starts on its own after each set, using the exercise's rest time. Adjust it ±15 s or skip it. It beeps and vibrates when rest is over and survives an app restart. The screen stays on while the app is open (can be turned off).
- **Progress tab**: program progress, totals, this week's sessions, a weekly volume chart (with a table view), per-exercise progress for each block (best set, trend vs the previous week, full history) and recent sessions.
- **Guide tab**: how the program works, what RPE / dropset / superset / top set mean, a daily warm-up checklist with demos, warm-up set percentages and recovery basics.
- **Offline**: once installed, the whole app works with no connection. Demos are cached as you view them, or all at once via *Settings → Save all exercise demos*.

## Install on your phone (Android)

1. Open the app URL in Chrome.
2. Tap **Install app** (or ⋮ menu → *Add to Home screen*).
3. Launch it from the home screen. It runs fullscreen like a native app.

## Your data

All data lives **on the device** in localStorage. Persistent storage is requested so the browser won't clear it.

- **Backup:** Settings (gear icon) → *Export backup* saves a JSON file to Downloads. A dot on the gear reminds you when your last backup is more than 2 weeks old.
- **Restore / move devices:** copy the JSON file to the new device → Settings → *Restore from backup*. Restoring downloads a copy of the current data first, so nothing can be silently destroyed.
- **Upgrading from v2:** the first launch of v3 keeps an untouched copy of the old data in localStorage (`nippardEssentials5x_12weeks_v1_pre_v3`). Logged data keeps its exact keys, except sets under the exercises replaced in v3.1, which move on load (next point).
- **Replaced exercises (v3.1):** sets logged under a bodyweight exercise that was replaced move to its replacement. Each moved set is labelled with the exercise it was really done as (the old name, or the swap it was done with), so nothing is lost and progress never mixes the two exercises. The exception is Weighted Pullup: those sets were really lat pulldowns, so they count as Lat Pulldown. A swap to an option the program no longer offers goes back to the program exercise, and sets done with it keep their label.

## Development

No build step: plain HTML/CSS/JS. Serve the folder over HTTP (the service worker needs it):

```
python -m http.server 8080
```

Then open http://localhost:8080.

```
node audit.js         # every exercise + swap option maps to a demo; data sanity checks
node audit.js --net   # ...and every demo URL responds with a GIF
```

### Releasing an update

1. Bump `CACHE_VERSION` in `sw.js` and `APP_VERSION` in `app.js` (keep them in sync; `audit.js` checks this).
2. Run `node audit.js --net`.
3. Commit and push to `main`. GitHub Pages redeploys automatically (~1 min).
4. On the phone, open the app (or switch back to it): an "A new version is ready" banner appears once it has downloaded. Tap **Update**.

The first upgrade from v2 to v3 is automatic: the app reloads itself into v3 a few seconds after you open it, and all logged sets are kept.

### Files

| File | Purpose |
|---|---|
| `index.html` | App shell: top bar, session tabs, views, bottom navigation, sheets, icon sprite, Guide content |
| `app.js` | State and storage, rendering, set logging, rest timer, progress stats, backup, service-worker registration |
| `program.js` | The program: 3 blocks × 5 sessions of exercises (sets, reps, rest, technique, warm-up sets, cues, swaps) and the warm-up routine |
| `exercises.js` | Exercise catalog: every exercise name → one movement → its verified demo animation |
| `styles.css` | Dark, mobile-first design system |
| `sw.js` | Service worker: app-shell precache + long-lived runtime GIF cache |
| `manifest.json` | PWA manifest (installability) |
| `icons/` | Launcher icons |
| `audit.js` | Dev-only consistency check (see above) |

### Notes

- **Exercise names are data keys.** Logged sets are stored under `w{week}_s{session}_{exercise name}`, so renaming an exercise in `program.js` orphans its history. To replace one, add the change to `PROGRAM_CHANGES` in `program.js`: the app moves the logged sets on load, and `audit.js` checks every entry.
- **Demos are mapped explicitly**, not guessed from keywords. Each animation was checked frame by frame against the exercise. Where the source has no exact match, the closest true variant is used and the exercise screen says what's different. Where nothing trustworthy exists, a neutral placeholder is shown rather than a wrong exercise.
- Exercise animations are hot-linked from fitnessprogramer.com and cached on-device at runtime only. They are not redistributed in this repo.
- `progress.json` (personal workout data from the old server-sync setup) is gitignored. It can be loaded via Settings → Restore from backup.
