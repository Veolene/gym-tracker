// ===== Jeff Nippard's Essentials Program - 5x/Week =====
// 12 Weeks, 3 Blocks (exercises change each block)
// Block 1: Weeks 1-4, Block 2: Weeks 5-8, Block 3: Weeks 9-12
// 5 Sessions per week: Upper, Lower, Push, Pull, Legs
// All weights in KG

// ===== Exercise GIFs from fitnessprogramer.com =====
// Hand-picked GIFs for each exercise (corrected URLs)
const exerciseGifs = {
    // Chest Exercises
    "low incline smith machine press": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Smith-Machine-Incline-Bench-Press.gif",
    "low incline db press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif",
    "flat db press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif",
    "flat db press (heavy)": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif",
    "flat db press (back off)": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif",
    "dumbbell bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif",
    "cable chest press": "https://fitnessprogramer.com/wp-content/uploads/2022/01/Band-Standing-Chest-Press.gif",
    "close-grip push up": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    "flat machine chest press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Press-Machine.gif",
    "decline machine chest press": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Smith-Machine-Decline-Bench-Press.gif",
    "bottom-half low incline db press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif",
    "pec deck": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "pec deck (integrated partials)": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "bent-over cable pec flye": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "bottom-half seated cable flye": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "cable crossover ladder": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "paused assisted dip": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif",
    
    // Back - Lat Exercises
    "cross-body lat pull-around": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    "chest-supported machine row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-T-bar-Row.gif",
    "chest-supported t-bar row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-T-bar-Row.gif",
    "straight-bar lat prayer": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Rope-Straight-Arm-Pulldown.gif",
    "machine lat pullover": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif",
    "half-kneeling 1-arm lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Half-Kneeling-Lat-Pulldown.gif",
    "1-arm half-kneeling lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Half-Kneeling-Lat-Pulldown.gif",
    "assisted pull-up": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Assisted-Pull-up.gif",
    "wide-grip pull-up": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif",
    "lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    "neutral-grip lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/06/V-bar-Lat-Pulldown.gif",
    "super-rom overhand cable row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "overhand machine row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-T-bar-Row.gif",
    "smith machine deficit row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    "moto cable row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "seated cable row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "pendlay row": "https://fitnessprogramer.com/wp-content/uploads/2022/07/Barbell-Pendlay-Row.gif",
    "machine pendlay row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-T-bar-Row.gif",
    
    // Shoulders
    "cuffed behind-the-back lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif",
    "cross-body cable y-raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif",
    "super-rom db lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "db lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "meadows incline db lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "high-cable cuffed lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif",
    "machine shoulder press": "https://fitnessprogramer.com/wp-content/uploads/2022/04/Plate-Loaded-Shoulder-Press.gif",
    "seated db shoulder press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif",
    "cable shoulder press": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Cable-Shoulder-Press.gif",
    "cable reverse flye": "https://fitnessprogramer.com/wp-content/uploads/2021/02/cable-rear-delt-fly.gif",
    "reverse pec deck": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Rear-Delt-Machine-Flys.gif",
    "lying paused rope face pull": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    "rope facepull": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    
    // Triceps
    "overhead cable triceps extension": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Cable-Rope-Overhead-Triceps-Extension.gif",
    "db skull crusher": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Skull-Crusher.gif",
    "ez-bar skull crusher": "https://fitnessprogramer.com/wp-content/uploads/2022/02/Barbell-Reverse-Grip-Skullcrusher-1.gif",
    "seated db french press": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Dumbbell-Triceps-Extension.gif",
    "cable triceps kickback": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Tricep-Kickback.gif",
    "katana triceps extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif",
    "triceps pressdown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif",
    "bench dip": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif",
    
    // Biceps
    "bayesian cable curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Cable-Curl.gif",
    "bottom-2/3 preacher curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Preacher-Curl.gif",
    "hammer preacher curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Preacher-Curl.gif",
    "inverse db zottman curl": "https://fitnessprogramer.com/wp-content/uploads/2021/04/zottman-curl.gif",
    "db incline curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Incline-Dumbbell-Curl.gif",
    "spider curl": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Preacher-Curl.gif",
    "slow-eccentric db curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif",
    "ez-bar cable curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/cable-curl.gif",
    "bottom-half incline db curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Incline-Dumbbell-Curl.gif",
    "db hammer curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
    
    // Legs - Quads
    "hack squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Sled-Hack-Squat.gif",
    "machine squat": "https://fitnessprogramer.com/wp-content/uploads/2024/10/smith-machine-squat.gif",
    "bottom-half smith machine squat": "https://fitnessprogramer.com/wp-content/uploads/2024/10/smith-machine-squat.gif",
    "leg extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif",
    "leg press": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
    "super-rom leg press": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
    "belt squat": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif",
    "reverse nordic": "https://fitnessprogramer.com/wp-content/uploads/2022/10/sissy-squat.gif",
    "sissy squat": "https://fitnessprogramer.com/wp-content/uploads/2022/10/sissy-squat.gif",
    "a2: sissy squat": "https://fitnessprogramer.com/wp-content/uploads/2022/10/sissy-squat.gif",
    "goblet squat": "https://fitnessprogramer.com/wp-content/uploads/2021/06/kettlebell-goblet-squat.gif",
    "a2: goblet squat": "https://fitnessprogramer.com/wp-content/uploads/2021/06/kettlebell-goblet-squat.gif",
    "smith machine reverse lunge": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Barbell-Bulgarian-Split-Squat.gif",
    
    // Legs - Hamstrings
    "seated leg curl": "https://fitnessprogramer.com/wp-content/uploads/2021/08/Seated-Leg-Curl.gif",
    "lying leg curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif",
    "snatch-grip rdl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif",
    "paused barbell rdl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif",
    "barbell rdl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif",
    "glute-ham raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Lever-Single-Leg-Curl.gif",
    "weighted 45deg hyperextension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/hyperextension.gif",
    
    // Legs - Adductors/Abductors
    "machine hip adduction": "https://fitnessprogramer.com/wp-content/uploads/2021/02/HIP-ADDUCTION-MACHINE.gif",
    "a1: machine hip adduction": "https://fitnessprogramer.com/wp-content/uploads/2021/02/HIP-ADDUCTION-MACHINE.gif",
    "cable hip adduction": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Cable-Hip-Adduction.gif",
    "a1: cable hip adduction": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Cable-Hip-Adduction.gif",
    "machine hip abduction": "https://fitnessprogramer.com/wp-content/uploads/2021/02/HiP-ABDUCTION-MACHINE.gif",
    
    // Calves
    "leg press calf press": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Leg-Press-Calf-Raise.gif",
    "standing calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif",
    "bottom-half standing calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif",
    "donkey calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif",
    "seated calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Lever-Seated-Calf-Raise.gif",
    
    // Abs
    "cable crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Kneeling-Cable-Crunch.gif",
    "machine crunch": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif",
    "roman chair leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Captains-Chair-Leg-Raise.gif",
    "decline weighted crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Weighted-Crunch.gif",
    
    // Weak Points - generic exercises
    "weak point exercise 1": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "weak point exercise 2": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Shoulder-Press.gif",
    "weak point exercise 2 (optional)": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Shoulder-Press.gif",
    
    // ===== SUPERSET EXERCISES (A1/A2) - Hand-picked GIFs =====
    // Block 1 Upper - Triceps/Biceps superset
    "a1: ez bar skull crusher": "https://fitnessprogramer.com/wp-content/uploads/2022/02/Barbell-Reverse-Grip-Skullcrusher-1.gif",
    "a2: ez bar curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
    
    // Block 1 Lower - Calves/Abs superset  
    "a1: standing calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif",
    "a2: hanging leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/08/Hanging-Leg-Raises.gif",
    "hanging leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/08/Hanging-Leg-Raises.gif",
    "hanging leg raise knees": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raises.gif",
    
    // Block 1 Legs - Calves/Abs superset
    "a1: seated calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Lever-Seated-Calf-Raise.gif",
    "a2: cable crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Kneeling-Cable-Crunch.gif",
    
    // Block 2 Upper - Biceps/Triceps superset
    "a1: db incline curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Incline-Dumbbell-Curl.gif",
    "a2: db french press": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Dumbbell-Triceps-Extension.gif",
    
    // Block 2 Lower - Abs/Calves superset
    "a1: roman chair crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Captains-Chair-Leg-Raise.gif",
    "a2: seated calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Lever-Seated-Calf-Raise.gif",
    
    // Block 2 Legs - Calves/Abs superset
    "a1: leg press toe press": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Leg-Press-Calf-Raise.gif",
    "a2: machine crunch": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif",
    
    // Block 3 Upper - Triceps/Biceps superset
    "a1: overhead cable triceps extension": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Cable-Rope-Overhead-Triceps-Extension.gif",
    "a2: cable ez curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/cable-curl.gif",
    
    // Block 3 Lower - Calves/Abs superset
    "a2: two-arms two-legs dead bug": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif",
    
    // Block 3 Legs - Calves/Abs superset
    "a2: plate-weighted crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Weighted-Crunch.gif",
    "plate-weighted crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Weighted-Crunch.gif",
    
    // Stripped versions without A1:/A2: (only names not already defined above)
    "ez bar skull crusher": "https://fitnessprogramer.com/wp-content/uploads/2022/02/Barbell-Reverse-Grip-Skullcrusher-1.gif",
    "ez bar curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
    "roman chair crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Captains-Chair-Leg-Raise.gif"
};

function getExerciseGif(exerciseName) {
    let name = exerciseName.toLowerCase();
    
    // Strip A1:/A2: prefix for superset exercises
    if (name.startsWith("a1: ") || name.startsWith("a2: ")) {
        name = name.substring(4);
    }
    
    // Direct match (try with original name first, then stripped)
    if (exerciseGifs[exerciseName.toLowerCase()]) return exerciseGifs[exerciseName.toLowerCase()];
    if (exerciseGifs[name]) return exerciseGifs[name];
    
    // Partial matches - check both ways
    for (const [key, url] of Object.entries(exerciseGifs)) {
        if (name.includes(key) || key.includes(name)) return url;
    }
    
    // Keyword matching for common exercise types
    if (name.includes("leg curl") || name.includes("hamstring curl")) return exerciseGifs["seated leg curl"];
    if (name.includes("preacher")) return exerciseGifs["bottom-2/3 preacher curl"];
    if (name.includes("incline") && name.includes("curl")) return exerciseGifs["db incline curl"];
    if (name.includes("hammer")) return exerciseGifs["db hammer curl"];
    if (name.includes("spider")) return exerciseGifs["spider curl"];
    if (name.includes("zottman")) return exerciseGifs["inverse db zottman curl"];
    if (name.includes("curl") && !name.includes("leg")) return exerciseGifs["bayesian cable curl"];
    if (name.includes("incline") && name.includes("press")) return exerciseGifs["low incline db press"];
    if (name.includes("chest") && name.includes("press")) return exerciseGifs["flat machine chest press"];
    if (name.includes("shoulder") && name.includes("press")) return exerciseGifs["machine shoulder press"];
    if (name.includes("french") || name.includes("skull")) return exerciseGifs["ez-bar skull crusher"];
    if (name.includes("tricep") && name.includes("extension")) return exerciseGifs["overhead cable triceps extension"];
    if (name.includes("pressdown") || name.includes("pushdown")) return exerciseGifs["triceps pressdown"];
    if (name.includes("kickback")) return exerciseGifs["cable triceps kickback"];
    if (name.includes("pulldown") || name.includes("pull-down") || name.includes("lat pull")) return exerciseGifs["lat pulldown"];
    if (name.includes("pull-up") || name.includes("pullup") || name.includes("chin")) return exerciseGifs["assisted pull-up"];
    if (name.includes("pullover")) return exerciseGifs["machine lat pullover"];
    if (name.includes("t-bar") || name.includes("tbar")) return exerciseGifs["chest-supported t-bar row"];
    if (name.includes("row")) return exerciseGifs["chest-supported machine row"];
    if (name.includes("lateral") || name.includes("y-raise")) return exerciseGifs["db lateral raise"];
    if (name.includes("rear delt") || name.includes("reverse fly")) return exerciseGifs["reverse pec deck"];
    if (name.includes("flye") || name.includes("fly") || name.includes("crossover") || name.includes("pec deck")) return exerciseGifs["pec deck"];
    if (name.includes("extension") && name.includes("leg")) return exerciseGifs["leg extension"];
    if (name.includes("press") && name.includes("leg")) return exerciseGifs["leg press"];
    if (name.includes("hack") || name.includes("squat machine")) return exerciseGifs["hack squat"];
    if (name.includes("belt squat")) return exerciseGifs["belt squat"];
    if (name.includes("goblet")) return exerciseGifs["goblet squat"];
    if (name.includes("sissy")) return exerciseGifs["sissy squat"];
    if (name.includes("nordic")) return exerciseGifs["reverse nordic"];
    if (name.includes("squat") || name.includes("lunge")) return exerciseGifs["hack squat"];
    if (name.includes("rdl") || name.includes("deadlift") || name.includes("romanian")) return exerciseGifs["barbell rdl"];
    if (name.includes("hyperextension") || name.includes("back extension")) return exerciseGifs["weighted 45deg hyperextension"];
    if (name.includes("glute") && name.includes("ham")) return exerciseGifs["glute-ham raise"];
    if (name.includes("calf") && name.includes("seated")) return exerciseGifs["seated calf raise"];
    if (name.includes("calf") && name.includes("donkey")) return exerciseGifs["donkey calf raise"];
    if (name.includes("calf")) return exerciseGifs["standing calf raise"];
    if (name.includes("dip")) return exerciseGifs["paused assisted dip"];
    if (name.includes("crunch") || name.includes("ab")) return exerciseGifs["cable crunch"];
    if (name.includes("leg raise")) return exerciseGifs["roman chair leg raise"];
    if (name.includes("adduction")) return exerciseGifs["machine hip adduction"];
    if (name.includes("abduction")) return exerciseGifs["machine hip abduction"];
    if (name.includes("weak point")) return exerciseGifs["weak point exercise 1"];
    
    // Default fallback
    return "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif";
}

// ===== Exercise Images (Detailed SVG Illustrations) =====
const exerciseImages = {
    curl: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="10" r="6" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 16v14" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 30v18" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M26 48l-4 12M38 48l4 12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 20l-8 4l2 10" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 20l8 8v6" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <circle cx="26" cy="34" r="3" fill="#4CAF50"/>
        <rect x="22" y="32" width="8" height="4" rx="2" fill="#666"/>
    </svg>`,
    benchPress: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="36" width="48" height="6" rx="2" fill="#8B4513"/>
        <rect x="4" y="42" width="4" height="16" fill="#666"/>
        <rect x="56" y="42" width="4" height="16" fill="#666"/>
        <ellipse cx="32" cy="32" rx="6" ry="4" fill="#FFD5B5"/>
        <path d="M26 32h-12M38 32h12" stroke="#333" stroke-width="2.5"/>
        <rect x="10" y="28" width="4" height="8" rx="2" fill="#666"/>
        <rect x="50" y="28" width="4" height="8" rx="2" fill="#666"/>
        <circle cx="8" cy="32" r="5" fill="#333"/>
        <circle cx="56" cy="32" r="5" fill="#333"/>
        <path d="M28 36l-4 8M36 36l4 8" stroke="#333" stroke-width="2"/>
    </svg>`,
    squat: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="8" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <rect x="20" y="6" width="24" height="4" rx="2" fill="#666"/>
        <circle cx="18" cy="8" r="4" fill="#333"/>
        <circle cx="46" cy="8" r="4" fill="#333"/>
        <path d="M32 13v8" stroke="#333" stroke-width="3"/>
        <path d="M32 21l-6 12l-4 4v10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 21l6 12l4 4v10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 57h8M38 57h8" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M26 21l-10 4M38 21l10 4" stroke="#333" stroke-width="2.5"/>
    </svg>`,
    row: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="16" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M24 20l20 8" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M44 28l8 20" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M40 48h12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M52 28l-4 20" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 24l-4 14l12 1" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="8" y="38" width="30" height="3" rx="1.5" fill="#666"/>
        <circle cx="8" cy="39.5" r="4" fill="#333"/>
        <circle cx="38" cy="39.5" r="4" fill="#333"/>
    </svg>`,
    lateralRaise: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="10" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 15v16" stroke="#333" stroke-width="3"/>
        <path d="M32 31v16" stroke="#333" stroke-width="3"/>
        <path d="M28 47l-4 12M36 47l4 12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 19l-16 6" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 19l16 6" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="16" cy="25" r="4" fill="#4CAF50" stroke="#333"/>
        <circle cx="48" cy="25" r="4" fill="#4CAF50" stroke="#333"/>
    </svg>`,
    tricepExtension: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="18" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 23v14" stroke="#333" stroke-width="3"/>
        <path d="M32 37v14" stroke="#333" stroke-width="3"/>
        <path d="M28 51l-4 10M36 51l4 10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 23l4-12l4 12" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="28" y="6" width="8" height="6" rx="2" fill="#666"/>
        <ellipse cx="32" cy="6" rx="6" ry="3" fill="#4CAF50" stroke="#333"/>
    </svg>`,
    pulldown: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="28" y="2" width="8" height="4" fill="#666"/>
        <path d="M12 6h40" stroke="#666" stroke-width="3"/>
        <circle cx="32" cy="20" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 25v12" stroke="#333" stroke-width="3"/>
        <rect x="24" y="37" width="16" height="6" rx="2" fill="#8B4513"/>
        <path d="M28 43v12M36 43v12" stroke="#333" stroke-width="3"/>
        <path d="M24 55h6M34 55h6" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M14 6l14 10M50 6l-14 10" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <rect x="10" y="4" width="6" height="4" rx="1" fill="#333"/>
        <rect x="48" y="4" width="6" height="4" rx="1" fill="#333"/>
    </svg>`,
    legExtension: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="32" height="12" rx="3" fill="#8B4513"/>
        <rect x="4" y="32" width="8" height="24" fill="#666"/>
        <circle cx="28" cy="18" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M28 23v9" stroke="#333" stroke-width="3"/>
        <path d="M40 26l16 16" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M40 32l16 10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <rect x="54" y="38" width="6" height="8" rx="2" fill="#666"/>
        <path d="M24 23l-8 1M32 23l8 1" stroke="#333" stroke-width="2"/>
    </svg>`,
    crunch: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="40" width="48" height="6" rx="2" fill="#8B4513"/>
        <circle cx="20" cy="28" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M24 32l12 8" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M36 40l12-1" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M48 39l8 1" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 32l-4 6l6 2" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    calfRaise: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="8" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 13v18" stroke="#333" stroke-width="3"/>
        <path d="M32 31v12" stroke="#333" stroke-width="3"/>
        <path d="M28 43v10M36 43v10" stroke="#333" stroke-width="3"/>
        <rect x="22" y="53" width="20" height="4" rx="2" fill="#666"/>
        <rect x="18" y="57" width="28" height="4" fill="#8B4513"/>
        <path d="M28 13l-10 1M36 13l10 1" stroke="#333" stroke-width="2"/>
        <rect x="14" y="10" width="36" height="4" rx="2" fill="#666"/>
        <ellipse cx="32" cy="50" rx="4" ry="6" fill="#FFD5B5" stroke="#333"/>
    </svg>`,
    deadlift: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="12" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M28 16l14 16" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M42 32l6 16" stroke="#333" stroke-width="3"/>
        <path d="M36 48h12M50 32l-2 16" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M24 18l-6 16" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 16l6 18" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="6" y="34" width="32" height="3" rx="1.5" fill="#666"/>
        <circle cx="6" cy="35.5" r="5" fill="#333"/>
        <circle cx="38" cy="35.5" r="5" fill="#333"/>
    </svg>`,
    dip: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="4" height="36" fill="#666"/>
        <rect x="52" y="20" width="4" height="36" fill="#666"/>
        <rect x="4" y="18" width="12" height="4" rx="2" fill="#666"/>
        <rect x="48" y="18" width="12" height="4" rx="2" fill="#666"/>
        <circle cx="32" cy="16" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 21v12" stroke="#333" stroke-width="3"/>
        <path d="M28 21l-12-1M36 21l12-1" stroke="#333" stroke-width="2.5"/>
        <path d="M32 33l-6 10l-4 12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 33l6 10l4 12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    fly: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="32" width="32" height="6" rx="2" fill="#8B4513"/>
        <ellipse cx="32" cy="28" rx="5" ry="4" fill="#FFD5B5"/>
        <path d="M32 32v12" stroke="#333" stroke-width="3"/>
        <path d="M28 44v10M36 44v10" stroke="#333" stroke-width="2.5"/>
        <path d="M28 28l-16 4" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M36 28l16 4" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="12" cy="32" r="4" fill="#4CAF50" stroke="#333"/>
        <circle cx="52" cy="32" r="4" fill="#4CAF50" stroke="#333"/>
    </svg>`,
    facePull: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="4" height="48" fill="#666"/>
        <rect x="2" y="24" width="8" height="8" rx="2" fill="#333"/>
        <circle cx="32" cy="20" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 25v14" stroke="#333" stroke-width="3"/>
        <path d="M32 39v14" stroke="#333" stroke-width="3"/>
        <path d="M28 53l-4 8M36 53l4 8" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M10 28l18-4" stroke="#666" stroke-width="2"/>
        <path d="M28 24l-6-1l6-4M36 24l6-1l-6-4" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    legCurl: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="28" width="40" height="8" rx="3" fill="#8B4513"/>
        <rect x="4" y="36" width="8" height="20" fill="#666"/>
        <circle cx="20" cy="24" r="4" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M20 28h24" stroke="#333" stroke-width="3"/>
        <path d="M44 28l8-10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M52 18l-4-6" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <rect x="44" y="10" width="8" height="4" rx="2" fill="#666"/>
        <path d="M16 24l-6 1M24 24l6-1" stroke="#333" stroke-width="2"/>
    </svg>`,
    lunge: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="8" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M28 13v12" stroke="#333" stroke-width="3"/>
        <path d="M28 25l-10 18v12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 25l14 8l6 12" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M14 55h8M44 45l8 10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M24 13l-8 1M32 13l8 1" stroke="#333" stroke-width="2"/>
        <rect x="12" y="10" width="32" height="4" rx="2" fill="#666"/>
        <circle cx="10" cy="12" r="4" fill="#333"/>
        <circle cx="46" cy="12" r="4" fill="#333"/>
    </svg>`,
    hipMachine: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="24" width="32" height="10" rx="3" fill="#8B4513"/>
        <rect x="12" y="34" width="8" height="20" fill="#666"/>
        <rect x="44" y="34" width="8" height="20" fill="#666"/>
        <circle cx="32" cy="18" r="5" fill="#FFD5B5" stroke="#333" stroke-width="1.5"/>
        <path d="M32 23v11" stroke="#333" stroke-width="3"/>
        <path d="M28 34l-10 16M36 34l10 16" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 18l-6 1M36 18l6 1" stroke="#333" stroke-width="2"/>
        <path d="M16 50h6M42 50h6" stroke="#333" stroke-width="3"/>
    </svg>`,
    target: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" stroke="#e74c3c" stroke-width="3" fill="none"/>
        <circle cx="32" cy="32" r="18" stroke="#e74c3c" stroke-width="2.5" fill="none"/>
        <circle cx="32" cy="32" r="10" stroke="#e74c3c" stroke-width="2" fill="none"/>
        <circle cx="32" cy="32" r="4" fill="#e74c3c"/>
        <path d="M32 2v8M32 54v8M2 32h8M54 32h8" stroke="#e74c3c" stroke-width="2"/>
    </svg>`,
    default: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="28" width="24" height="8" rx="2" fill="#666"/>
        <rect x="8" y="24" width="14" height="16" rx="3" fill="#333"/>
        <rect x="42" y="24" width="14" height="16" rx="3" fill="#333"/>
        <rect x="4" y="22" width="6" height="20" rx="2" fill="#222"/>
        <rect x="54" y="22" width="6" height="20" rx="2" fill="#222"/>
    </svg>`
};

function getExerciseIcon(exerciseName) {
    const name = exerciseName.toLowerCase();
    if (name.includes("curl") && name.includes("leg")) return exerciseImages.legCurl;
    if (name.includes("curl") || name.includes("bicep") || name.includes("preacher") || name.includes("zottman")) return exerciseImages.curl;
    if (name.includes("bench") || name.includes("chest press") || (name.includes("press") && (name.includes("incline") || name.includes("decline") || name.includes("flat")) && !name.includes("leg"))) return exerciseImages.benchPress;
    if (name.includes("squat") || name.includes("hack") || name.includes("leg press")) return exerciseImages.squat;
    if (name.includes("row") || name.includes("t-bar") || name.includes("pull-around")) return exerciseImages.row;
    if (name.includes("lateral") || name.includes("y-raise") || (name.includes("raise") && !name.includes("calf") && !name.includes("leg"))) return exerciseImages.lateralRaise;
    if (name.includes("tricep") && (name.includes("extension") || name.includes("overhead"))) return exerciseImages.tricepExtension;
    if (name.includes("pressdown") || name.includes("pushdown") || name.includes("kickback")) return exerciseImages.tricepExtension;
    if (name.includes("skull") || name.includes("french press") || name.includes("jm press")) return exerciseImages.tricepExtension;
    if (name.includes("pulldown") || name.includes("pull-down") || name.includes("lat pull") || name.includes("pull-up") || name.includes("pullup") || name.includes("chin") || name.includes("prayer")) return exerciseImages.pulldown;
    if (name.includes("leg extension")) return exerciseImages.legExtension;
    if (name.includes("crunch") || name.includes("ab") || name.includes("rollout") || name.includes("leg raise")) return exerciseImages.crunch;
    if (name.includes("calf")) return exerciseImages.calfRaise;
    if (name.includes("rdl") || name.includes("deadlift") || name.includes("hyperextension")) return exerciseImages.deadlift;
    if (name.includes("dip")) return exerciseImages.dip;
    if (name.includes("fly") || name.includes("flye") || name.includes("pec deck") || name.includes("crossover")) return exerciseImages.fly;
    if (name.includes("face pull") || name.includes("reverse flye") || name.includes("reverse pec")) return exerciseImages.facePull;
    if (name.includes("lunge") || name.includes("step-up") || name.includes("split")) return exerciseImages.lunge;
    if (name.includes("adduction") || name.includes("abduction") || name.includes("hip thrust")) return exerciseImages.hipMachine;
    if (name.includes("weak point") || name.includes("target")) return exerciseImages.target;
    if (name.includes("shoulder") && name.includes("press")) return exerciseImages.lateralRaise;
    if (name.includes("press")) return exerciseImages.benchPress;
    return exerciseImages.default;
}

// ===== Program Structure =====
// Jeff Nippard's Essentials Program - 5x/Week
// 12 Weeks, 3 Blocks (exercises change each block)
// Block 1: Weeks 1-4, Block 2: Weeks 5-8, Block 3: Weeks 9-12
const TOTAL_WEEKS = 12;
const SESSIONS_PER_WEEK = 5;

const sessionTypes = {
    1: { name: "Upper", focus: "Full Upper Body" },
    2: { name: "Lower", focus: "Full Lower Body" },
    3: { name: "Push", focus: "Push Muscles" },
    4: { name: "Pull", focus: "Pull Muscles" },
    5: { name: "Legs", focus: "Leg Focus" }
};

function getPhaseInfo(week) {
    if (week <= 4) {
        return { block: 1, phaseName: "Block 1", blockName: "Weeks 1-4" };
    } else if (week <= 8) {
        return { block: 2, phaseName: "Block 2", blockName: "Weeks 5-8" };
    } else {
        return { block: 3, phaseName: "Block 3", blockName: "Weeks 9-12" };
    }
}

// ===== BLOCK 1: Weeks 1-4 =====
const block1 = {
    1: [ // Upper
        { name: "Flat DB Press (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.", sub1: "Machine Chest Press", sub2: "Weighted Dip" },
        { name: "Flat DB Press (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 9-10", notes: "Focus on mind-muscle connection with pecs. Drop the weight back and focus on stretch and squeeze!", sub1: "Machine Chest Press", sub2: "Weighted Dip" },
        { name: "2-Grip Lat Pulldown", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Do first set wide overhand (1.5x shoulder width), second set underhand (1x shoulder width)", sub1: "2-Grip Pull-up", sub2: "Machine Pulldown" },
        { name: "Seated DB Shoulder Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Bring the dumbbells all the way down, keep your torso upright", sub1: "Machine Shoulder Press", sub2: "Standing DB Arnold Press" },
        { name: "Seated Cable Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", notes: "Focus on squeezing your shoulder blades together, drive your elbows down and back. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Incline Chest-supported DB Row", sub2: "Chest-Supported T-Bar Row" },
        { name: "A1: EZ Bar Skull Crusher", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", notes: "Arc the bar behind your head, constant tension on triceps", sub1: "Overhead Cable Triceps Extension", sub2: "DB French Press" },
        { name: "A2: EZ Bar Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", notes: "Arc the bar 'out' not 'up', focus on squeezing your biceps", sub1: "DB Curl", sub2: "Cable EZ Curl" }
    ],
    2: [ // Lower
        { name: "Hack Squat (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.", sub1: "Machine Squat", sub2: "Leg Press" },
        { name: "Hack Squat (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 8-9", notes: "Drop the weight back and focus on controlling the negative. Smooth and consistent rep tempo.", sub1: "Machine Squat", sub2: "Leg Press" },
        { name: "Seated Hamstring Curl", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "Dropset", notes: "Dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps. Do seated if available.", sub1: "Nordic Ham Curl", sub2: "Lying Leg Curl" },
        { name: "A1: Standing Calf Raise", sets: 2, reps: "10-12", rest: "0 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Seated Calf Raise", sub2: "Leg Press Toe Press" },
        { name: "A2: Hanging Leg Raise", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", notes: "Knees to chest, controlled reps, straighten legs more to increase difficulty", sub1: "Roman Chair Crunch", sub2: "Reverse Crunch" }
    ],
    3: [ // Push
        { name: "Machine Shoulder Press", sets: 3, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "Don't stop in between reps, keep smooth and controlled tension on the delts", sub1: "Seated DB Shoulder Press", sub2: "Standing DB Arnold Press" },
        { name: "Cable Chest Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", notes: "Can be performed seated or standing. Focus on squeezing your chest. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Weighted Dip", sub2: "Flat DB Press" },
        { name: "Triceps Pressdown", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", notes: "Focus on squeezing your triceps to move the weight. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.", sub1: "Cable Triceps Kickback", sub2: "DB Triceps Kickback" },
        { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!", sub1: "Incline Close-Grip Push Up", sub2: "Kneeling Modified Push Up" },
        { name: "DB Lateral Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", notes: "Raise the dumbbells 'out' not 'up', mind muscle connection with middle fibers", sub1: "Cable Lateral Raise", sub2: "Machine Lateral Raise" }
    ],
    4: [ // Pull
        { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight", sub1: "Cable Lat Pullover", sub2: "1-Arm Lat Pull-In" },
        { name: "Weighted Pullup", sets: 3, reps: "6-8", rest: "~2 min", technique: "RPE 9-10", notes: "1.5x shoulder width grip, pull your chest to the bar", sub1: "Lat Pulldown", sub2: "Neutral-Grip Pullup" },
        { name: "Pendlay Row", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "Initiate the movement by squeezing your shoulder blades together, pull to your lower chest, avoid using momentum", sub1: "Machine Pendlay Row", sub2: "Seated Cable Row" },
        { name: "Bayesian Cable Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", notes: "Keep your elbow behind your torso throughout the range of motion, focus on squeezing your bicep. Sets are per arm", sub1: "DB Incline Curl", sub2: "DB Curl" },
        { name: "Rope Facepull", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", notes: "Pull your elbows up and out, squeeze your shoulder blades together. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Reverse Pec Deck", sub2: "Reverse Cable Flye" }
    ],
    5: [ // Legs
        { name: "Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", notes: "Maintain a neutral lower back, set your hips back, don't allow your spine to round", sub1: "DB Romanian Deadlift", sub2: "45° Hyperextension" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", notes: "Medium width feet placement on the platform, don't allow your lower back to round", sub1: "Goblet Squat", sub2: "DB Walking Lunge" },
        { name: "Leg Extension", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "Dropset", notes: "Dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps. Focus on squeezing your quads to make the weight move.", sub1: "DB Step-Up", sub2: "Goblet Squat" },
        { name: "A1: Seated Calf Raise", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Standing Calf Raise", sub2: "Leg Press Toe Press" },
        { name: "A2: Cable Crunch", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", notes: "Round your back as you crunch", sub1: "Machine Crunch", sub2: "Plate-Weighted Crunch" }
    ]
};

// ===== BLOCK 2: Weeks 5-8 =====
const block2 = {
    1: [ // Upper
        { name: "2-Grip Pullup", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "First set 1.5x shoulder width grip. Second set 1.0x shoulder width grip", sub1: "Machine Pulldown", sub2: "2-Grip Lat Pulldown" },
        { name: "Weighted Dip (Heavy)", sets: 1, reps: "6-8", rest: "~3 min", technique: "RPE 8-9", notes: "Tuck your elbows at 45°, lean your torso forward 15°, shoulder width or slightly wider grip", sub1: "Machine Chest Press", sub2: "Flat DB Press" },
        { name: "Weighted Dip (Back off)", sets: 1, reps: "10-12", rest: "~3 min", technique: "RPE 9-10", notes: "Tuck your elbows at 45°, lean your torso forward 15°, shoulder width or slightly wider grip", sub1: "Machine Chest Press", sub2: "Flat DB Press" },
        { name: "Incline Chest-Supported DB Row", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "Keep elbows at ~30° angle from torso. Pull the weight towards your navel", sub1: "Chest-Supported T-Bar Row", sub2: "Seated Cable Row" },
        { name: "Standing DB Arnold Press", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "Start with your elbows in front of you and palms facing in. Rotate the dumbbells so that your palms face forward as you press.", sub1: "Machine Shoulder Press", sub2: "Seated DB Shoulder Press" },
        { name: "A1: DB Incline Curl", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", notes: "Brace upper back against bench, 45 degree incline, keep shoulders back as you curl", sub1: "Cable EZ Curl", sub2: "EZ Bar Curl" },
        { name: "A2: DB French Press", sets: 2, reps: "15-20", rest: "~1.5 min", technique: "Superset", notes: "Can perform seated or standing. Press the dumbbell straight up and down behind your head.", sub1: "Overhead Cable Triceps Extension", sub2: "EZ Bar Skull Crusher" }
    ],
    2: [ // Lower
        { name: "Single-Leg Leg Press (Heavy)", sets: 1, reps: "6-8 per leg", rest: "~3 min", technique: "RPE 8-9", notes: "High and wide foot positioning, start with weaker leg", sub1: "Machine Squat", sub2: "Hack Squat" },
        { name: "Single-Leg Leg Press (Back off)", sets: 1, reps: "10-12 per leg", rest: "~3 min", technique: "RPE 8-9", notes: "High and wide foot positioning, start with weaker leg", sub1: "Machine Squat", sub2: "Hack Squat" },
        { name: "Glute-Ham Raise", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 10", notes: "Keep your hips straight, do Nordic ham curls if no GHR machine", sub1: "Nordic Ham Curl", sub2: "Lying Leg Curl" },
        { name: "A1: Roman Chair Crunch", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", notes: "Don't swing your legs at the bottom, minimize momentum, tuck your knees towards your chest if lifting your legs straight out is too challenging", sub1: "Reverse Crunch", sub2: "Hanging Leg Raise" },
        { name: "A2: Seated Calf Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Standing Calf Raise", sub2: "Leg Press Toe Press" }
    ],
    3: [ // Push
        { name: "Machine Chest Press", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", notes: "Focus on squeezing your chest", sub1: "Weighted Dip", sub2: "Flat DB Press" },
        { name: "Seated DB Shoulder Press", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Bring the dumbbells all the way down, keep your torso upright", sub1: "Standing DB Arnold Press", sub2: "Machine Shoulder Press" },
        { name: "Cable Triceps Kickback", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", notes: "Lean slightly forward, lock your elbow behind your torso (shoulder hyperextension). Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.", sub1: "DB Triceps Kickback", sub2: "Triceps Pressdown" },
        { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!", sub1: "Incline Close-Grip Push Up", sub2: "Kneeling Modified Push Up" },
        { name: "Cable Lateral Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", notes: "Lean away from the cable. Focus on squeezing your delts.", sub1: "Machine Lateral Raise", sub2: "DB Lateral Raise" }
    ],
    4: [ // Pull
        { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight", sub1: "Cable Lat Pullover", sub2: "1-Arm Lat Pull-In" },
        { name: "T-Bar Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Focus on squeezing your shoulder blades together as you pull the weight towards you. Keep your shoulders down (avoid shrugging).", sub1: "Seated Cable Row", sub2: "Pendlay Row" },
        { name: "Lat Pulldown", sets: 3, reps: "8-10", rest: "~2 min", technique: "Dropset", notes: "Think about pulling your elbows 'down' and 'in'. Last set only do a dropset: perform 8-10 reps, drop the weight by ~50%, perform an additional 8-10 reps.", sub1: "Neutral-Grip Lat Pulldown", sub2: "Weighted Pullup" },
        { name: "Reverse Pec Deck", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", notes: "Swing the weight 'out', not 'back'. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.", sub1: "Reverse Cable Flye", sub2: "Rope Facepull" },
        { name: "Spider Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", notes: "Brace your chest against an incline bench, curl with your elbows slightly in front of you. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.", sub1: "DB Preacher Curl", sub2: "Bayesian Cable Curl" }
    ],
    5: [ // Legs
        { name: "DB Bulgarian Split Squat", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", notes: "Start with your weaker leg. Squat deep", sub1: "Goblet Squat", sub2: "Leg Press" },
        { name: "DB Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", notes: "Emphasize the stretch in your hamstrings, prevent your lower back from rounding", sub1: "Romanian Deadlift", sub2: "45° Hyperextension" },
        { name: "Goblet Squat", sets: 1, reps: "12-15", rest: "~1.5 min", technique: "RPE 9-10", notes: "Hold the dumbbell underneath your chin, sit back and down, push your knees out laterally", sub1: "Leg Extension", sub2: "Step-Up" },
        { name: "A1: Leg Press Toe Press", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Standing Calf Raise", sub2: "Seated Calf Raise" },
        { name: "A2: Machine Crunch", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", notes: "Squeeze your abs to move the weight, don't use your arms to help", sub1: "Plate-Weighted Crunch", sub2: "Cable Crunch" }
    ]
};

// ===== BLOCK 3: Weeks 9-12 =====
const block3 = {
    1: [ // Upper
        { name: "Machine Chest Press (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", notes: "Focus on squeezing your chest", sub1: "Flat DB Press", sub2: "Weighted Dip" },
        { name: "Machine Chest Press (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 9-10", notes: "Focus on squeezing your chest", sub1: "Flat DB Press", sub2: "Weighted Dip" },
        { name: "Machine Pulldown", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", notes: "Think about pulling your elbows 'down' and 'in'. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "2-Grip Lat Pulldown", sub2: "Weighted Pullup" },
        { name: "Cable Shoulder Press", sets: 2, reps: "12-15", rest: "~2 min", technique: "Dropset", notes: "Bring cables all the way down to shoulder height, keep torso upright. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.", sub1: "Machine Shoulder Press", sub2: "Seated DB Shoulder Press" },
        { name: "Helms DB Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Be ultra strict with form, drive elbows out and back at 45 degree angle", sub1: "Chest-Supported T-Bar Row", sub2: "Machine Row" },
        { name: "A1: Overhead Cable Triceps Extension", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", notes: "Do both arms at once, resist the negative", sub1: "EZ Bar Skull Crusher", sub2: "DB French Press" },
        { name: "A2: Cable EZ Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", notes: "Focus on squeezing your biceps. Control the negative", sub1: "EZ Bar Curl", sub2: "DB Curl" }
    ],
    2: [ // Lower
        { name: "Machine Squat (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.", sub1: "Hack Squat", sub2: "Leg Press" },
        { name: "Machine Squat (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 8-9", notes: "Drop the weight back and focus on controlling the negative. Smooth and consistent rep tempo.", sub1: "Hack Squat", sub2: "Leg Press" },
        { name: "Nordic Ham Curl", sets: 1, reps: "8-10", rest: "~1.5 min", technique: "RPE 10", notes: "Keep your hips as straight as you can, can sub for lying leg curl", sub1: "Lying Leg Curl", sub2: "Glute-Ham Raise" },
        { name: "A1: Seated Calf Raise", sets: 2, reps: "10-12", rest: "0 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Standing Calf Raise", sub2: "Leg Press Toe Press" },
        { name: "A2: Two-Arms Two-Legs Dead Bug", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", notes: "Perform these slowly, focus on keeping your lower back against the ground throughout the set", sub1: "Reverse Crunch", sub2: "Roman Chair Crunch" }
    ],
    3: [ // Push
        { name: "Standing DB Arnold Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Start with your elbows in front of you and palms facing in. Rotate the dumbbells so that your palms face forward as you press.", sub1: "Seated DB Shoulder Press", sub2: "Machine Shoulder Press" },
        { name: "Cable Chest Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", notes: "Can be performed seated or standing. Focus on squeezing your chest. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Weighted Dip", sub2: "Flat DB Press" },
        { name: "DB Triceps Kickback", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", notes: "Lean slightly forward, lock your elbow behind your torso (shoulder hyperextension). Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Triceps Pressdown", sub2: "Cable Triceps Kickback" },
        { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!", sub1: "Incline Close-Grip Push Up", sub2: "Kneeling Modified Push Up" },
        { name: "Machine Lateral Raise", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "RPE 10", notes: "Focus on squeezing your lateral delt to move the weight", sub1: "DB Lateral Raise", sub2: "Cable Lateral Raise" }
    ],
    4: [ // Pull
        { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight", sub1: "Cable Lat Pullover", sub2: "1-Arm Lat Pull-In" },
        { name: "Neutral-Grip Lat Pulldown", sets: 3, reps: "8-10", rest: "~2 min", technique: "Dropset", notes: "Pull your elbows down against your sides. Last set only do a dropset: perform 8-10 reps, drop the weight by ~50%, perform an additional 8-10 reps.", sub1: "Weighted Pullup", sub2: "Lat Pulldown" },
        { name: "Meadows Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", notes: "Brace with your non-working hand against your knee, stay light, emphasize form", sub1: "Single-Arm DB Row", sub2: "Pendlay Row" },
        { name: "Inverse Zottman Curl", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", notes: "Hammer curl on concentric, supinated curl (palms up) on the eccentric. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.", sub1: "Hammer Curl", sub2: "DB Curl" },
        { name: "Bent-Over Reverse DB Flye", sets: 2, reps: "15-20", rest: "~1.5 min", technique: "RPE 10", notes: "Mind-muscle connection with rear delts, sweep the weight out", sub1: "Reverse Cable Flye", sub2: "Rope Facepull" }
    ],
    5: [ // Legs
        { name: "Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", notes: "Maintain a neutral lower back, set your hips back, don't allow your spine to round", sub1: "DB Romanian Deadlift", sub2: "45° Hyperextension" },
        { name: "DB Walking Lunge", sets: 3, reps: "8-10", rest: "~2 min", technique: "RPE 8-9", notes: "Take medium strides, minimize the amount you push off your rear leg", sub1: "DB Step-Up", sub2: "DB Bulgarian Split Squat" },
        { name: "Leg Extension", sets: 1, reps: "12-15", rest: "~1.5 min", technique: "Dropset", notes: "Dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps. Focus on squeezing your quads to make the weight move.", sub1: "Goblet Squat", sub2: "DB Step-Up" },
        { name: "A1: Standing Calf Raise", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce", sub1: "Seated Calf Raise", sub2: "Leg Press Toe Press" },
        { name: "A2: Plate-Weighted Crunch", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", notes: "Hold a plate or DB to your chest and crunch hard!", sub1: "Cable Crunch", sub2: "Machine Crunch" }
    ]
};

const warmupSetsByBlock = {
    1: {
        "Flat DB Press (Heavy)": "2-3",
        "Flat DB Press (Back off)": "0",
        "2-Grip Lat Pulldown": "2",
        "Seated DB Shoulder Press": "1",
        "Seated Cable Row": "1",
        "A1: EZ Bar Skull Crusher": "1",
        "A2: EZ Bar Curl": "1",
        "Hack Squat (Heavy)": "2-3",
        "Hack Squat (Back off)": "0",
        "Seated Hamstring Curl": "1",
        "A1: Standing Calf Raise": "1",
        "A2: Hanging Leg Raise": "1",
        "Machine Shoulder Press": "2",
        "Cable Chest Press": "2",
        "Triceps Pressdown": "1",
        "Close-Grip Push Up": "1",
        "DB Lateral Raise": "1",
        "1-Arm Half-Kneeling Lat Pulldown": "1",
        "Weighted Pullup": "2",
        "Pendlay Row": "2",
        "Bayesian Cable Curl": "1",
        "Rope Facepull": "1",
        "Romanian Deadlift": "2",
        "Leg Press": "2",
        "Leg Extension": "1",
        "A1: Seated Calf Raise": "1",
        "A2: Cable Crunch": "1"
    },
    2: {
        "2-Grip Pullup": "1-1",
        "Weighted Dip (Heavy)": "2-3",
        "Weighted Dip (Back off)": "0",
        "Incline Chest-Supported DB Row": "1",
        "Standing DB Arnold Press": "1",
        "A1: DB Incline Curl": "1",
        "A2: DB French Press": "1",
        "Single-Leg Leg Press (Heavy)": "2-3",
        "Single-Leg Leg Press (Back off)": "0",
        "Glute-Ham Raise": "1",
        "A1: Roman Chair Crunch": "1",
        "A2: Seated Calf Raise": "1",
        "Machine Chest Press": "2",
        "Seated DB Shoulder Press": "2",
        "Cable Triceps Kickback": "1",
        "Close-Grip Push Up": "1",
        "Cable Lateral Raise": "1",
        "1-Arm Half-Kneeling Lat Pulldown": "1",
        "T-Bar Row": "2",
        "Lat Pulldown": "2",
        "Reverse Pec Deck": "1",
        "Spider Curl": "1",
        "DB Bulgarian Split Squat": "2",
        "DB Romanian Deadlift": "2",
        "Goblet Squat": "1",
        "A1: Leg Press Toe Press": "1",
        "A2: Machine Crunch": "1"
    },
    3: {
        "Machine Chest Press (Heavy)": "2-3",
        "Machine Chest Press (Back off)": "0",
        "Machine Pulldown": "2",
        "Cable Shoulder Press": "1",
        "Helms DB Row": "1",
        "A1: Overhead Cable Triceps Extension": "1",
        "A2: Cable EZ Curl": "1",
        "Machine Squat (Heavy)": "2-3",
        "Machine Squat (Back off)": "0",
        "Nordic Ham Curl": "1",
        "A1: Seated Calf Raise": "1",
        "A2: Two-Arms Two-Legs Dead Bug": "1",
        "Standing DB Arnold Press": "2",
        "Cable Chest Press": "2",
        "DB Triceps Kickback": "1",
        "Close-Grip Push Up": "1",
        "Machine Lateral Raise": "1",
        "1-Arm Half-Kneeling Lat Pulldown": "1",
        "Neutral-Grip Lat Pulldown": "2",
        "Meadows Row": "2",
        "Inverse Zottman Curl": "1",
        "Bent-Over Reverse DB Flye": "1",
        "Romanian Deadlift": "2",
        "DB Walking Lunge": "2",
        "Leg Extension": "1",
        "A1: Standing Calf Raise": "1",
        "A2: Plate-Weighted Crunch": "1"
    }
};

function getWarmupSetsForExercise(week, exerciseName) {
    const block = week <= 4 ? 1 : week <= 8 ? 2 : 3;
    return warmupSetsByBlock[block]?.[exerciseName] ?? null;
}

function getExercisesForWeek(week, session) {
    if (week <= 4) return block1[session] || [];
    if (week <= 8) return block2[session] || [];
    return block3[session] || [];
}

// ===== State Management =====
const APP_VERSION = '2.0.0';
const GIF_CACHE = 'gif-cache-v1'; // must match sw.js
const STORAGE_KEY = 'nippardEssentials5x_12weeks_v1';
const defaultState = {
    currentWeek: 1,
    currentSession: 1,
    currentExercise: null,
    currentSetIndex: 0,
    workoutData: {},
    substitutionOverrides: {},
    activeTab: 'workout',
    lastSavedAt: 0
};
let state = { ...defaultState };

function normalizeState(loaded) {
    if (!loaded || typeof loaded !== 'object') return { ...defaultState };
    const merged = { ...defaultState, ...loaded };
    // Transient modal state must never survive a load/import
    merged.currentExercise = null;
    merged.currentSetIndex = 0;
    return merged;
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) state = normalizeState(JSON.parse(saved));
    } catch (e) { console.error('Error loading local state:', e); }
}

function saveState() {
    state.lastSavedAt = Date.now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.error('Error saving local state:', e); }
}

// Weight 0 means a bodyweight set (e.g. push-ups to failure)
function formatSet(weight, reps) {
    return weight === 0 ? `BW x ${reps}` : `${weight}kg x ${reps}`;
}

// Last week's same set index, falling back to last week's heaviest set
function getLastWeekSetFor(lastWeekData, setIndex) {
    if (!lastWeekData?.sets?.length) return null;
    return lastWeekData.sets[setIndex]
        || lastWeekData.sets.reduce((max, s) => (s.weight > max.weight) ? s : max, lastWeekData.sets[0]);
}

// ===== Backup: Export / Import =====
function exportData(filenamePrefix = 'gym-tracker-backup') {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenamePrefix}-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(reader.result);
            const valid = parsed && typeof parsed === 'object'
                && parsed.workoutData && typeof parsed.workoutData === 'object'
                && Object.keys(parsed.workoutData).every(k => /^w\d+_s\d+_/.test(k));
            if (!valid) {
                showToast('Not a valid backup file');
                return;
            }
            // Don't let a bad import silently destroy current data
            const hasLoggedSets = Object.values(state.workoutData).some(d => d.sets && d.sets.length > 0);
            if (hasLoggedSets) exportData('gym-tracker-pre-import');
            state = normalizeState(parsed);
            saveState();
            renderWeekDisplay();
            renderExercises();
            renderProgress();
            closeSettings();
            showToast('Data imported');
        } catch (e) {
            showToast('Could not read backup file');
        }
    };
    reader.readAsText(file);
}

// ===== Persistent Storage =====
function requestPersistentStorage() {
    if (navigator.storage?.persist) {
        navigator.storage.persist().catch(() => {});
    }
}

async function renderStorageStatus() {
    const el = document.getElementById('storage-status');
    if (!el || !navigator.storage?.persisted) return;
    try {
        const persisted = await navigator.storage.persisted();
        const est = await navigator.storage.estimate();
        const usedMb = ((est.usage || 0) / 1048576).toFixed(1);
        el.textContent = `Storage: ${persisted ? 'protected against cleanup' : 'not yet protected'} · ${usedMb} MB used`;
    } catch (e) {
        el.textContent = '';
    }
}

// ===== Offline media download =====
async function downloadAllMedia() {
    const progressEl = document.getElementById('media-progress');
    if (!('caches' in window)) {
        showToast('Offline cache not supported in this browser');
        return;
    }
    const urls = [...new Set(Object.values(exerciseGifs))];
    urls.push('https://fitnessprogramer.com/wp-content/uploads/2022/02/Foam-Rolling-Quadriceps.gif');
    const cache = await caches.open(GIF_CACHE);
    let done = 0, failed = 0;
    for (const url of urls) {
        try {
            const existing = await cache.match(url);
            if (!existing) {
                const resp = await fetch(url, { mode: 'no-cors' });
                await cache.put(url, resp);
            }
        } catch (e) {
            failed++;
        }
        done++;
        if (progressEl) progressEl.textContent = `Downloading… ${done}/${urls.length}`;
    }
    if (progressEl) {
        progressEl.textContent = failed > 0
            ? `Done, but ${failed} of ${urls.length} failed — retry later`
            : `All ${urls.length} animations saved for offline use`;
    }
}

// ===== Rest Timer =====
const restTimer = { endTime: 0, intervalId: null };

function parseRestSeconds(restStr) {
    const m = /([\d.]+)\s*min/.exec(restStr || '');
    if (!m) return 0;
    return Math.round(parseFloat(m[1]) * 60);
}

function startRestTimer(seconds, label) {
    if (seconds <= 0) return;
    stopRestTimer();
    restTimer.endTime = Date.now() + seconds * 1000;
    const labelEl = document.getElementById('rest-timer-label');
    if (labelEl) labelEl.textContent = label || '';
    document.getElementById('rest-timer')?.classList.add('active');
    updateRestTimer();
    // Anchored to endTime, so throttled intervals can't drift the countdown
    restTimer.intervalId = setInterval(updateRestTimer, 250);
}

function updateRestTimer() {
    const remaining = Math.max(0, Math.ceil((restTimer.endTime - Date.now()) / 1000));
    const timeEl = document.getElementById('rest-timer-time');
    if (timeEl) timeEl.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
    if (remaining <= 0) {
        stopRestTimer();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        playBeep();
        showToast('Rest over — next set!');
    }
}

function stopRestTimer() {
    if (restTimer.intervalId) clearInterval(restTimer.intervalId);
    restTimer.intervalId = null;
    document.getElementById('rest-timer')?.classList.remove('active');
}

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        osc.onended = () => ctx.close();
    } catch (e) { /* audio unavailable — vibration and toast still fire */ }
}

// ===== Screen Wake Lock =====
async function acquireWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
        await navigator.wakeLock.request('screen');
    } catch (e) { /* denied or unsupported — not critical */ }
}

// ===== Service worker & updates =====
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    // 'installed' with an active controller = an update is waiting
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast(newWorker);
                    }
                });
            });
            let reloading = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (reloading) return;
                reloading = true;
                window.location.reload();
            });
        } catch (e) {
            console.error('Service worker registration failed:', e);
        }
    });
}

function showUpdateToast(worker) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast update-toast show';
    toast.textContent = 'Update available — tap to reload';
    toast.addEventListener('click', () => worker.postMessage({ type: 'SKIP_WAITING' }));
    document.body.appendChild(toast);
}

// ===== Settings modal =====
function openSettings() {
    renderStorageStatus();
    document.getElementById('settings-modal')?.classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-modal')?.classList.remove('active');
}

function getExerciseData(week, session, exerciseName) {
    return state.workoutData[`w${week}_s${session}_${exerciseName}`] || { sets: [] };
}

function setExerciseData(week, session, exerciseName, data) {
    state.workoutData[`w${week}_s${session}_${exerciseName}`] = data;
    saveState();
}

function getSubstitutionOverride(week, session, originalName) {
    return state.substitutionOverrides[`w${week}_s${session}_${originalName}`] || null;
}

function setSubstitutionOverride(week, session, originalName, newName) {
    state.substitutionOverrides[`w${week}_s${session}_${originalName}`] = newName;
    saveState();
}

function clearSubstitutionOverride(week, session, originalName) {
    delete state.substitutionOverrides[`w${week}_s${session}_${originalName}`];
    saveState();
}

// ===== UI Elements =====
const elements = {};
function initElements() {
    elements.currentWeek = document.getElementById('currentWeek');
    elements.prevWeek = document.getElementById('prevWeek');
    elements.nextWeek = document.getElementById('nextWeek');
    elements.exerciseList = document.getElementById('exerciseList');
    elements.modal = document.getElementById('input-modal');
    elements.modalExerciseName = document.getElementById('modal-exercise-name');
    elements.lastWeekInfo = document.getElementById('last-week-info');
    elements.warmupInfo = document.getElementById('warmup-info');
    elements.setButtons = document.getElementById('set-buttons');
    elements.weightInput = document.getElementById('weight-input');
    elements.repsInput = document.getElementById('reps-input');
    elements.progressStats = document.getElementById('progressStats');
    elements.progressHistory = document.getElementById('progressHistory');
    elements.sessionBtns = document.querySelectorAll('.session-btn');
    elements.tabs = document.querySelectorAll('.tab');
    elements.tabContents = document.querySelectorAll('.tab-content');
}

// ===== Render Functions =====
function renderWeekDisplay() {
    if (!elements.currentWeek) return;
    const info = getPhaseInfo(state.currentWeek);
    elements.currentWeek.innerHTML = `
        <div class="week-main">Week ${state.currentWeek}/${TOTAL_WEEKS}</div>
        <div class="week-sub">${info.phaseName} - ${info.blockName}</div>
    `;
    if (elements.prevWeek) elements.prevWeek.disabled = state.currentWeek <= 1;
    if (elements.nextWeek) elements.nextWeek.disabled = state.currentWeek >= TOTAL_WEEKS;
}

function updateSessionButtons() {
    elements.sessionBtns?.forEach(btn => {
        const session = parseInt(btn.dataset.session);
        btn.classList.remove('active', 'completed');
        if (session === state.currentSession) btn.classList.add('active');
        
        const exercises = getExercisesForWeek(state.currentWeek, session);
        if (exercises.length > 0) {
            const allCompleted = exercises.every(ex => {
                const data = getExerciseData(state.currentWeek, session, ex.name);
                return data.sets && data.sets.length >= ex.sets;
            });
            if (allCompleted) btn.classList.add('completed');
        }
    });
}

function renderExercises() {
    const sessionType = sessionTypes[state.currentSession] || { name: 'Unknown Session', focus: '' };
    const exercises = getExercisesForWeek(state.currentWeek, state.currentSession);
    if (!elements.exerciseList) return;

    if (!exercises || exercises.length === 0) {
        elements.exerciseList.innerHTML = `
            <div class="rest-day-card">
                <div class="rest-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg></div>
                <h2>Rest Day</h2>
                <p>Take it easy! Your muscles grow during rest.</p>
            </div>`;
        return;
    }

    const info = getPhaseInfo(state.currentWeek);
    let html = `
        <div class="day-header">
            <h2>${sessionType.name}</h2>
            <span class="day-focus">${sessionType.focus}</span>
            <span class="block-badge">${info.phaseName} - ${info.blockName}</span>
        </div>
    `;

    exercises.forEach((exercise, index) => {
        const currentData = getExerciseData(state.currentWeek, state.currentSession, exercise.name);
        let lastWeekData = null;
        
        if (state.currentWeek > 1) {
            const prevWeek = state.currentWeek - 1;
            const prevInfo = getPhaseInfo(prevWeek);
            if (info.block === prevInfo.block) {
                lastWeekData = getExerciseData(prevWeek, state.currentSession, exercise.name);
            }
        }

        const targetSets = exercise.sets;
        const completedSets = currentData.sets?.length || 0;
        const isComplete = completedSets >= targetSets;
        const warmupSets = getWarmupSetsForExercise(state.currentWeek, exercise.name);
        const warmupHtml = warmupSets !== null ? `<div class="exercise-warmup">Warm-up sets: ${warmupSets}</div>` : '';

        let setPillsHtml = '';
        for (let i = 0; i < targetSets; i++) {
            const setData = currentData.sets?.[i];
            if (setData) {
                setPillsHtml += `<div class="set-pill completed"><span class="set-number">S${i + 1}</span>${formatSet(setData.weight, setData.reps)}</div>`;
            } else {
                setPillsHtml += `<div class="set-pill"><span class="set-number">S${i + 1}</span>--</div>`;
            }
        }

        let lastWeekHtml = '';
        if (lastWeekData?.sets?.length > 0) {
            const best = lastWeekData.sets.reduce((max, s) => (s.weight > max.weight) ? s : max, lastWeekData.sets[0]);
            lastWeekHtml = `<div class="last-week-preview">Last week: <strong>${formatSet(best.weight, best.reps)}</strong></div>`;
        }

        // Check for substitution override
        const subOverride = getSubstitutionOverride(state.currentWeek, state.currentSession, exercise.name);
        const displayName = subOverride || exercise.name;
        const isSubstituted = subOverride !== null;
        
        const gifUrl = getExerciseGif(displayName);
        const svgIcon = getExerciseIcon(displayName);

        const svgIconEncoded = btoa(svgIcon);

        // Build substitution options HTML with clickable options
        let subsHtml = '';
        if (exercise.sub1 || exercise.sub2) {
            subsHtml = `<div class="exercise-subs" onclick="event.stopPropagation()">
                <span class="subs-label">Swap to:</span>
                ${exercise.sub1 ? `<span class="sub-option clickable" data-original="${exercise.name}" data-sub="${exercise.sub1}">${exercise.sub1}</span>` : ''}
                ${exercise.sub2 ? `<span class="sub-option clickable" data-original="${exercise.name}" data-sub="${exercise.sub2}">${exercise.sub2}</span>` : ''}
                ${isSubstituted ? `<span class="sub-option revert" data-original="${exercise.name}">↩ Revert</span>` : ''}
            </div>`;
        }

        html += `
            <div class="exercise-card ${isComplete ? 'completed' : ''}${isSubstituted ? ' substituted' : ''}" data-exercise-index="${index}">
                <div class="exercise-gif">
                    <img src="${gifUrl}" alt="" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml;base64,${svgIconEncoded}';">
                </div>
                <div class="exercise-content">
                    <div class="exercise-header">
                        <div>
                            <div class="exercise-name selectable">${displayName}</div>
                            ${isSubstituted ? `<div class="original-exercise">Originally: ${exercise.name}</div>` : ''}
                            <div class="exercise-target">${targetSets} sets x ${exercise.reps} | Rest: ${exercise.rest}</div>
                            ${warmupHtml}
                            ${exercise.technique !== 'N/A' ? `<div class="exercise-technique">${exercise.technique}</div>` : ''}
                        </div>
                        <span class="exercise-badge">${completedSets}/${targetSets}</span>
                    </div>
                    <div class="sets-display">${setPillsHtml}</div>
                    ${lastWeekHtml}
                    <div class="exercise-notes">${exercise.notes}</div>
                    ${subsHtml}
                </div>
            </div>`;
    });

    elements.exerciseList.innerHTML = html;

    document.querySelectorAll('.exercise-card').forEach(card => {
        let touchMoved = false;
        
        card.addEventListener('touchstart', () => {
            touchMoved = false;
        }, { passive: true });
        
        card.addEventListener('touchmove', () => {
            touchMoved = true;
        }, { passive: true });
        
        card.addEventListener('click', (e) => {
            // Don't trigger if tapping on subs area
            if (e.target.closest('.exercise-subs')) return;
            // Don't trigger if user was scrolling
            if (touchMoved) return;
            // Don't trigger if user is selecting text
            if (window.getSelection().toString()) return;
            
            const index = parseInt(card.dataset.exerciseIndex);
            openExerciseModal(index);
        });
    });

    // Handle substitution clicks
    document.querySelectorAll('.sub-option.clickable').forEach(sub => {
        sub.addEventListener('click', (e) => {
            e.stopPropagation();
            const originalName = sub.dataset.original;
            const newName = sub.dataset.sub;
            setSubstitutionOverride(state.currentWeek, state.currentSession, originalName, newName);
            renderExercises();
        });
    });

    // Handle revert clicks
    document.querySelectorAll('.sub-option.revert').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const originalName = btn.dataset.original;
            clearSubstitutionOverride(state.currentWeek, state.currentSession, originalName);
            renderExercises();
        });
    });

    updateSessionButtons();
}

function openExerciseModal(exerciseIndex) {
    const exercises = getExercisesForWeek(state.currentWeek, state.currentSession);
    const exercise = exercises[exerciseIndex];
    if (!exercise) return;

    // Check for substitution override
    const subOverride = getSubstitutionOverride(state.currentWeek, state.currentSession, exercise.name);
    const displayName = subOverride || exercise.name;

    state.currentExercise = { ...exercise, index: exerciseIndex, displayName: displayName };
    const currentData = getExerciseData(state.currentWeek, state.currentSession, exercise.name);

    let lastWeekData = null;
    if (state.currentWeek > 1) {
        const prevWeek = state.currentWeek - 1;
        const info = getPhaseInfo(state.currentWeek);
        const prevInfo = getPhaseInfo(prevWeek);
        if (info.block === prevInfo.block) {
            lastWeekData = getExerciseData(prevWeek, state.currentSession, exercise.name);
        }
    }

    if (elements.modalExerciseName) elements.modalExerciseName.textContent = displayName;

    // Parse default reps from exercise.reps (e.g., "10-12" -> 10, "8" -> 8)
    const repsStr = exercise.reps.toString();
    const defaultReps = parseInt(repsStr.split('-')[0]) || parseInt(repsStr) || 10;

    if (lastWeekData?.sets?.length > 0 && elements.lastWeekInfo) {
        const lastSets = lastWeekData.sets.map((s, i) => `S${i+1}: ${formatSet(s.weight, s.reps)}`).join(' | ');
        elements.lastWeekInfo.innerHTML = `<h4>Last Week</h4><div class="values">${lastSets}</div>`;
        elements.lastWeekInfo.style.display = 'block';
        const prefill = getLastWeekSetFor(lastWeekData, currentData.sets?.length || 0);
        if (elements.weightInput) elements.weightInput.value = prefill.weight;
        if (elements.repsInput) elements.repsInput.value = prefill.reps || defaultReps;
    } else {
        if (elements.lastWeekInfo) elements.lastWeekInfo.style.display = 'none';
        if (elements.weightInput) elements.weightInput.value = 0;
        if (elements.repsInput) elements.repsInput.value = defaultReps;
    }

    if (elements.warmupInfo) {
        const warmupSets = getWarmupSetsForExercise(state.currentWeek, exercise.name);
        if (warmupSets !== null) {
            elements.warmupInfo.textContent = `Warm-up sets: ${warmupSets}`;
            elements.warmupInfo.style.display = 'block';
        } else {
            elements.warmupInfo.style.display = 'none';
        }
    }

    const targetSets = exercise.sets;
    let setBtnsHtml = '';
    for (let i = 0; i < targetSets; i++) {
        const setData = currentData.sets?.[i];
        const isCompleted = setData ? 'completed' : '';
        const isActive = i === (currentData.sets?.length || 0) ? 'active' : '';
        const label = setData ? formatSet(setData.weight, setData.reps) : `Set ${i + 1}`;
        setBtnsHtml += `<button class="set-btn ${isCompleted} ${isActive}" data-set="${i}">${label}</button>`;
    }

    if (elements.setButtons) elements.setButtons.innerHTML = setBtnsHtml;

    const repeatBtn = document.getElementById('repeat-set');
    const updateRepeatBtn = () => {
        if (!repeatBtn) return;
        const target = getLastWeekSetFor(lastWeekData, state.currentSetIndex);
        const alreadyLogged = currentData.sets?.[state.currentSetIndex];
        if (target && !alreadyLogged) {
            repeatBtn.style.display = 'block';
            repeatBtn.textContent = `↻ Same as last week — ${formatSet(target.weight, target.reps)}`;
            repeatBtn.onclick = () => {
                if (elements.weightInput) elements.weightInput.value = target.weight;
                if (elements.repsInput) elements.repsInput.value = target.reps;
                saveSet();
            };
        } else {
            repeatBtn.style.display = 'none';
            repeatBtn.onclick = null;
        }
    };

    document.querySelectorAll('.set-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentSetIndex = parseInt(btn.dataset.set);
            document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const setData = currentData.sets?.[state.currentSetIndex];
            if (setData) {
                if (elements.weightInput) elements.weightInput.value = setData.weight;
                if (elements.repsInput) elements.repsInput.value = setData.reps;
            }
            updateRepeatBtn();
        });
    });

    state.currentSetIndex = currentData.sets?.length || 0;
    updateRepeatBtn();
    if (elements.modal) elements.modal.classList.add('active');
}

function closeModal() {
    if (elements.modal) elements.modal.classList.remove('active');
    state.currentExercise = null;
}

function saveSet() {
    if (!state.currentExercise) return;
    const weight = parseFloat(elements.weightInput?.value) || 0;
    const reps = parseInt(elements.repsInput?.value) || 0;

    if (weight < 0 || reps <= 0) {
        showToast('Please enter valid reps (weight 0 = bodyweight)');
        return;
    }

    const restSeconds = parseRestSeconds(state.currentExercise.rest);
    const restLabel = state.currentExercise.displayName || state.currentExercise.name;

    const currentData = getExerciseData(state.currentWeek, state.currentSession, state.currentExercise.name);
    if (!currentData.sets) currentData.sets = [];
    currentData.sets[state.currentSetIndex] = { weight, reps };
    setExerciseData(state.currentWeek, state.currentSession, state.currentExercise.name, currentData);

    showToast(`Set ${state.currentSetIndex + 1} saved: ${formatSet(weight, reps)}`);
    closeModal();
    startRestTimer(restSeconds, restLabel);
    renderExercises();
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

function renderProgress() {
    if (!elements.progressStats || !elements.progressHistory) return;

    let totalSets = 0, totalVolume = 0, totalReps = 0;
    let workoutsCompleted = 0, workoutsLogged = 0, totalExercisesLogged = 0;
    let totalScheduledWorkouts = 0;
    let bestSetVolume = 0, bestSetWeight = 0, bestSetReps = 0, maxWeight = 0;

    for (let week = 1; week <= state.currentWeek; week++) {
        for (let session = 1; session <= SESSIONS_PER_WEEK; session++) {
            const exercises = getExercisesForWeek(week, session);
            if (!exercises || exercises.length === 0) continue;
            totalScheduledWorkouts++;

            let sessionComplete = true;
            let sessionLogged = false;
            exercises.forEach(ex => {
                const data = getExerciseData(week, session, ex.name);
                if (data.sets) {
                    data.sets.forEach(set => {
                        totalSets++;
                        totalVolume += (set.weight * set.reps);
                        totalReps += set.reps;
                        sessionLogged = true;
                        if (set.weight > maxWeight) maxWeight = set.weight;
                        const setVolume = set.weight * set.reps;
                        if (setVolume > bestSetVolume) {
                            bestSetVolume = setVolume;
                            bestSetWeight = set.weight;
                            bestSetReps = set.reps;
                        }
                    });
                    if (data.sets.length > 0) totalExercisesLogged++;
                }
                if (!data.sets || data.sets.length < ex.sets) sessionComplete = false;
            });
            if (sessionComplete) workoutsCompleted++;
            if (sessionLogged) workoutsLogged++;
        }
    }

    const info = getPhaseInfo(state.currentWeek);
    const avgRepsPerSet = totalSets > 0 ? (totalReps / totalSets) : 0;
    const avgVolumePerSet = totalSets > 0 ? (totalVolume / totalSets) : 0;
    const avgVolumePerWorkout = workoutsLogged > 0 ? (totalVolume / workoutsLogged) : 0;
    const consistency = totalScheduledWorkouts > 0 ? Math.round((workoutsCompleted / totalScheduledWorkouts) * 100) : 0;

    elements.progressStats.innerHTML = `
        <div class="stat-card"><div class="stat-value">${state.currentWeek}/${TOTAL_WEEKS}</div><div class="stat-label">Current Week</div></div>
        <div class="stat-card"><div class="stat-value">${info.phaseName}</div><div class="stat-label">${info.blockName}</div></div>
        <div class="stat-card"><div class="stat-value">${workoutsCompleted}</div><div class="stat-label">Workouts Done</div></div>
        <div class="stat-card"><div class="stat-value">${consistency}%</div><div class="stat-label">Completion Rate</div></div>
        <div class="stat-card"><div class="stat-value">${totalSets}</div><div class="stat-label">Total Sets</div></div>
        <div class="stat-card"><div class="stat-value">${totalReps}</div><div class="stat-label">Total Reps</div></div>
        <div class="stat-card"><div class="stat-value">${Math.round(totalVolume).toLocaleString()}</div><div class="stat-label">Volume (kg)</div></div>
        <div class="stat-card"><div class="stat-value">${Math.round(avgVolumePerWorkout).toLocaleString()}</div><div class="stat-label">Avg Volume / Workout</div></div>
        <div class="stat-card"><div class="stat-value">${avgRepsPerSet.toFixed(1)}</div><div class="stat-label">Avg Reps / Set</div></div>
        <div class="stat-card"><div class="stat-value">${Math.round(avgVolumePerSet).toLocaleString()}</div><div class="stat-label">Avg Volume / Set</div></div>
        <div class="stat-card"><div class="stat-value">${maxWeight > 0 ? maxWeight : 0}</div><div class="stat-label">Max Weight (kg)</div></div>
        <div class="stat-card"><div class="stat-value">${bestSetWeight > 0 ? `${bestSetWeight}×${bestSetReps}` : '0×0'}</div><div class="stat-label">Best Set</div></div>
        <div class="stat-card"><div class="stat-value">${totalExercisesLogged}</div><div class="stat-label">Exercises Logged</div></div>
    `;

    let historyHtml = '<h3>Recent Workouts</h3>';
    for (let week = state.currentWeek; week >= Math.max(1, state.currentWeek - 2); week--) {
        const weekInfo = getPhaseInfo(week);
        historyHtml += `<div class="week-history"><h4>Week ${week} - ${weekInfo.blockName}</h4>`;
        for (let session = 1; session <= SESSIONS_PER_WEEK; session++) {
            const exercises = getExercisesForWeek(week, session);
            if (!exercises || exercises.length === 0) continue;
            let sessionSets = 0;
            exercises.forEach(ex => {
                const data = getExerciseData(week, session, ex.name);
                if (data.sets) sessionSets += data.sets.length;
            });
            if (sessionSets > 0) {
                const sessionType = sessionTypes[session];
                historyHtml += `<div class="history-item"><span>${sessionType.name}</span><span>${sessionSets} sets logged</span></div>`;
            }
        }
        historyHtml += '</div>';
    }

    elements.progressHistory.innerHTML = historyHtml;
}

// ===== Event Handlers =====
function init() {
    initElements();
    loadState();

    if (elements.prevWeek) {
        elements.prevWeek.addEventListener('click', () => {
            if (state.currentWeek > 1) {
                state.currentWeek--;
                saveState();
                renderWeekDisplay();
                renderExercises();
                renderProgress();
            }
        });
    }

    if (elements.nextWeek) {
        elements.nextWeek.addEventListener('click', () => {
            if (state.currentWeek < TOTAL_WEEKS) {
                state.currentWeek++;
                saveState();
                renderWeekDisplay();
                renderExercises();
                renderProgress();
            }
        });
    }

    elements.sessionBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentSession = parseInt(btn.dataset.session);
            saveState();
            updateSessionButtons();
            renderExercises();
            document.querySelector('.exercise-card:not(.completed)')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    elements.tabs?.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            elements.tabContents?.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.dataset.tab;
            document.getElementById(targetId)?.classList.add('active');
            if (targetId === 'progress') renderProgress();
        });
    });

    if (elements.modal) {
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });
    }

    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const saveBtn = document.getElementById('save-set');
    if (saveBtn) saveBtn.addEventListener('click', saveSet);

    // Settings modal
    document.getElementById('settings-btn')?.addEventListener('click', openSettings);
    document.getElementById('close-settings')?.addEventListener('click', closeSettings);
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }
    document.getElementById('export-data')?.addEventListener('click', () => exportData());
    document.getElementById('import-data')?.addEventListener('click', () => document.getElementById('import-file')?.click());
    document.getElementById('import-file')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) importData(file);
        e.target.value = '';
    });
    document.getElementById('download-media')?.addEventListener('click', downloadAllMedia);
    const versionEl = document.getElementById('app-version');
    if (versionEl) versionEl.textContent = APP_VERSION;
    requestPersistentStorage();

    // +/- steppers: tap steps once, holding auto-repeats
    function bindStepper(btn, input, direction) {
        let holdTimeout = null;
        let holdInterval = null;
        const step = () => {
            const stepVal = parseFloat(input.step) || 1;
            const currentVal = parseFloat(input.value) || 0;
            const next = Math.max(0, currentVal + direction * stepVal);
            input.value = Math.round(next * 100) / 100;
        };
        const stopHold = () => {
            clearTimeout(holdTimeout);
            clearInterval(holdInterval);
            holdTimeout = null;
            holdInterval = null;
        };
        btn.addEventListener('pointerdown', () => {
            step();
            holdTimeout = setTimeout(() => {
                holdInterval = setInterval(step, 100);
            }, 450);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stopHold));
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    document.querySelectorAll('.number-input').forEach(container => {
        const input = container.querySelector('input');
        const minusBtn = container.querySelector('.minus');
        const plusBtn = container.querySelector('.plus');
        if (minusBtn && input) bindStepper(minusBtn, input, -1);
        if (plusBtn && input) bindStepper(plusBtn, input, 1);
    });

    // Rest timer skip
    document.getElementById('rest-timer-skip')?.addEventListener('click', stopRestTimer);

    // Keep the screen awake while the app is open (re-acquired on return)
    acquireWakeLock();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') acquireWakeLock();
    });

    renderWeekDisplay();
    renderExercises();
}

document.addEventListener('DOMContentLoaded', init);
registerServiceWorker();
