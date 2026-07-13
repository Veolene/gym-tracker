# Gym Tracker

Installable, offline-first PWA for tracking Jeff Nippard's **Essentials Program 5x/Week** — 12 weeks, 3 blocks (exercises change every 4 weeks), 5 sessions per week (Upper / Lower / Push / Pull / Legs). All weights in kg.

## Features

- **Workout tab** — week selector (1–12), 5 session buttons, exercise cards with animated demos, target sets/reps/rest, technique (RPE / dropset / superset), coaching notes, warm-up set counts, and logged-set pills. Exercises can be swapped to listed substitutions and reverted.
- **Set logging** — tap a card, log weight x reps with hold-to-repeat steppers, or use the one-tap "Same as last week" button. Weight `0` logs a bodyweight set (shown as `BW x reps`).
- **Rest timer** — starts automatically after saving a set, based on the exercise's rest target; vibrates and beeps when done. Screen stays awake while the app is open.
- **Progress tab** — volume, sets, completion rate, best set, and recent history.
- **Offline** — the whole app works with no connection once installed. Exercise animations show offline after viewing them once, or all at once via *Settings → Download all exercise media*.

## Install on your phone (Android)

1. Open the app URL in Chrome.
2. Tap the **Install app** prompt (or ⋮ menu → *Add to Home screen*).
3. Launch it from the home screen — it runs fullscreen like a native app.

## Your data

All data lives **on the device** in localStorage (persistent storage is requested automatically, so the browser won't clean it up).

- **Backup:** Settings (gear icon) → *Export data* — saves a JSON file to Downloads. Do this now and then.
- **Restore / move devices:** transfer the JSON file to the new device → Settings → *Import data*. Importing auto-exports the current data first, so it can't silently destroy anything.

## Development

No build step — plain HTML/CSS/JS. Serve the folder over HTTP (the service worker needs it):

```
python -m http.server 8080
```

Then open http://localhost:8080.

### Releasing an update

1. Bump `CACHE_VERSION` in `sw.js` and `APP_VERSION` in `app.js` (keep them in sync).
2. Commit and push to `main` — GitHub Pages redeploys automatically (~1 min).
3. On the phone, reopen the app: an "Update available — tap to reload" toast appears once the new version has downloaded (or it activates on the next launch).

### Files

| File | Purpose |
|---|---|
| `index.html` | App shell: header, tabs, modals, rest-timer bar |
| `app.js` | Program data (3 blocks), state, rendering, logging, settings, SW registration |
| `styles.css` | Dark theme, responsive layout |
| `sw.js` | Service worker: app-shell precache + runtime GIF cache |
| `manifest.json` | PWA manifest (installability) |
| `icons/` | Launcher icons |
| `audit.js` | Dev-only: checks every exercise has a GIF mapping (`node audit.js`) |

### Notes

- Exercise animations are hot-linked from fitnessprogramer.com and cached on-device at runtime only — they are not redistributed in this repo.
- `progress.json` (personal workout data from the old server-sync setup) is gitignored; it can be loaded via Settings → Import data.
