# 💪 Gym Tracker - Bodybuilding Transformation System

A mobile-friendly workout tracking web app optimized for use at the gym on your phone.

## Features

- 📱 **Mobile-First Design** - Optimized for Oppo X9 Pro and other smartphones
- 📊 **Progress Tracking** - See last week's performance and track improvements
- 💾 **Offline Storage** - All data saved locally in your browser
- 🏋️ **5-Day Split Program** - Push/Pull/Legs/Upper/Lower routine
- ⏱️ **Quick Input** - Large touch targets for easy gym use
- 🔥 **Warm-Up Guide** - Built-in warm-up checklist
- 💡 **Training Tips** - Progressive overload, form tips, and more

## How to Use

### Option 1: Open Directly
Simply open `index.html` in your browser. On your phone, you can add it to your home screen for an app-like experience.

### Option 2: Local Server (for all features)
Run a simple HTTP server:

**Python 3:**
```bash
cd gym-tracker
python -m http.server 8000
```

**Python 2:**
```bash
cd gym-tracker
python -m SimpleHTTPServer 8000
```

**Node.js (if you have npx):**
```bash
npx serve gym-tracker
```

Then open `http://localhost:8000` in your browser.

## Workout Program

### Day 1 - Push
- Barbell Bench Press (4×6-8)
- Incline Dumbbell Press (3×8-10)
- Overhead Press (3×8-10)
- Lateral Raises (3×12-15)
- Tricep Pushdowns (3×10-12)
- Overhead Tricep Extension (2×12-15)

### Day 2 - Pull
- Conventional Deadlift (4×5-6)
- Barbell Rows (4×6-8)
- Lat Pulldowns (3×8-10)
- Face Pulls (3×15-20)
- Barbell Curls (3×8-10)
- Hammer Curls (2×10-12)

### Day 3 - Legs
- Barbell Back Squat (4×6-8)
- Romanian Deadlift (3×8-10)
- Leg Press (3×10-12)
- Lying Leg Curls (3×10-12)
- Leg Extensions (3×12-15)
- Standing Calf Raises (4×12-15)

### Day 4 - Upper Body
- Incline Barbell Press (4×6-8)
- Seated Cable Rows (4×8-10)
- Dumbbell Shoulder Press (3×8-10)
- Cable Chest Flyes (3×12-15)
- Rear Delt Flyes (3×15-20)
- Tricep Dips (3×8-12)

### Day 5 - Lower Body
- Front Squat (4×6-8)
- Sumo Deadlift (3×6-8)
- Walking Lunges (3×10 each)
- Hip Thrusts (3×10-12)
- Seated Leg Curls (3×12-15)
- Seated Calf Raises (4×15-20)

## Progressive Overload

The app shows your previous week's performance so you can aim to:
- Add 2.5-5 lbs to the bar, OR
- Add 1-2 extra reps

Small consistent progress = BIG gains over time!

## Tips for Best Results

1. **Complete the warm-up** before each session
2. **Log every set** immediately after completing it
3. **Check last week's numbers** before each exercise
4. **Rest appropriately:**
   - Compound exercises: 2-3 minutes
   - Isolation exercises: 60-90 seconds
5. **Stay consistent** - Progress takes time!

## Browser Support

Works on all modern browsers including:
- Chrome (Android/iOS)
- Safari (iOS)
- Firefox
- Edge

## Data Storage

All your workout data is stored locally in your browser's localStorage. To backup your data, you can export it from the browser's developer tools.

---

Built with ❤️ for gainz! 💪
