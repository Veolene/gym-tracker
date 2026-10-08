// ===== Jeff Nippard's Essentials Program - 5x/week =====
// 12 weeks in 3 blocks; the exercises change every 4 weeks.
// IMPORTANT: exercise `name`s are part of the saved-data keys (w{week}_s{session}_{name}).
// Renaming one orphans everything already logged for it - add a migration if you must.
const PROGRAM = {
    totalWeeks: 12,
    blockLength: 4,
    sessions: {
        1: { name: 'Upper', focus: 'Full upper body' },
        2: { name: 'Lower', focus: 'Full lower body' },
        3: { name: 'Push', focus: 'Chest, shoulders & triceps' },
        4: { name: 'Pull', focus: 'Back, rear delts & biceps' },
        5: { name: 'Legs', focus: 'Quads, hamstrings & calves' }
    },
    // warmup = number of warm-up sets before the working sets
    blocks: {
        1: {
            1: [ // Upper
                { name: "Flat DB Press (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.",
                    subs: ["Machine Chest Press", "Smith Machine Decline Press"] },
                { name: "Flat DB Press (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 9-10", warmup: "0",
                    notes: "Focus on mind-muscle connection with pecs. Drop the weight back and focus on stretch and squeeze!",
                    subs: ["Machine Chest Press", "Smith Machine Decline Press"] },
                { name: "2-Grip Lat Pulldown", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Do first set wide overhand (1.5x shoulder width), second set underhand (1x shoulder width)",
                    subs: ["Machine Pulldown", "Neutral-Grip Lat Pulldown"] },
                { name: "Seated DB Shoulder Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "1",
                    notes: "Bring the dumbbells all the way down, keep your torso upright",
                    subs: ["Machine Shoulder Press", "Standing DB Arnold Press"] },
                { name: "Seated Cable Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", warmup: "1",
                    notes: "Focus on squeezing your shoulder blades together, drive your elbows down and back. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Incline Chest-supported DB Row", "Chest-Supported T-Bar Row"] },
                { name: "A1: EZ Bar Skull Crusher", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Arc the bar behind your head, constant tension on triceps",
                    subs: ["Overhead Cable Triceps Extension", "DB French Press"] },
                { name: "A2: EZ Bar Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Arc the bar 'out' not 'up', focus on squeezing your biceps",
                    subs: ["DB Curl", "Cable EZ Curl"] }
            ],
            2: [ // Lower
                { name: "Hack Squat (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.",
                    subs: ["Machine Squat", "Leg Press"] },
                { name: "Hack Squat (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 8-9", warmup: "0",
                    notes: "Drop the weight back and focus on controlling the negative. Smooth and consistent rep tempo.",
                    subs: ["Machine Squat", "Leg Press"] },
                { name: "Seated Hamstring Curl", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps. Do seated if available.",
                    subs: ["Lying Leg Curl"] },
                { name: "A1: Standing Calf Raise", sets: 2, reps: "10-12", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Seated Calf Raise", "Leg Press Toe Press"] },
                { name: "A2: Machine Crunch", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Curl your ribcage down toward your pelvis and pause in the squeeze. Let your abs move the weight, don't pull with your arms.",
                    subs: ["Cable Crunch"] }
            ],
            3: [ // Push
                { name: "Machine Shoulder Press", sets: 3, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Don't stop in between reps, keep smooth and controlled tension on the delts",
                    subs: ["Seated DB Shoulder Press", "Standing DB Arnold Press"] },
                { name: "Cable Chest Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", warmup: "2",
                    notes: "Can be performed seated or standing. Focus on squeezing your chest. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Machine Chest Press", "Flat DB Press"] },
                { name: "Triceps Pressdown", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Focus on squeezing your triceps to move the weight. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.",
                    subs: ["Cable Triceps Kickback", "DB Triceps Kickback"] },
                { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!",
                    subs: ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"] },
                { name: "DB Lateral Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Raise the dumbbells 'out' not 'up', mind muscle connection with middle fibers",
                    subs: ["Cable Lateral Raise", "Machine Lateral Raise"] }
            ],
            4: [ // Pull
                { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", warmup: "1",
                    notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight",
                    subs: ["Cable Lat Pullover", "1-Arm Lat Pull-In"] },
                { name: "Lat Pulldown", sets: 3, reps: "6-8", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "1.5x shoulder width overhand grip, pull the bar to your upper chest. Lock your thighs under the pad and drive your elbows down, no swinging.",
                    subs: ["Machine Pulldown", "Neutral-Grip Lat Pulldown"] },
                { name: "Pendlay Row", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Initiate the movement by squeezing your shoulder blades together, pull to your lower chest, avoid using momentum",
                    subs: ["Machine Pendlay Row", "Seated Cable Row"] },
                { name: "Bayesian Cable Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Keep your elbow behind your torso throughout the range of motion, focus on squeezing your bicep. Sets are per arm",
                    subs: ["DB Incline Curl", "DB Curl"] },
                { name: "Rope Facepull", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Pull your elbows up and out, squeeze your shoulder blades together. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Reverse Pec Deck", "Reverse Cable Flye"] }
            ],
            5: [ // Legs
                { name: "Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Maintain a neutral lower back, set your hips back, don't allow your spine to round",
                    subs: ["DB Romanian Deadlift", "Cable Pull-Through"] },
                { name: "Leg Press", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Medium width feet placement on the platform, don't allow your lower back to round",
                    subs: ["Goblet Squat", "DB Walking Lunge"] },
                { name: "Leg Extension", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps. Focus on squeezing your quads to make the weight move.",
                    subs: ["DB Step-Up", "Goblet Squat"] },
                { name: "A1: Seated Calf Raise", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Standing Calf Raise", "Leg Press Toe Press"] },
                { name: "A2: Cable Crunch", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Round your back as you crunch",
                    subs: ["Machine Crunch"] }
            ]
        },
        2: {
            1: [ // Upper
                { name: "2-Grip Lat Pulldown", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "1-1",
                    notes: "First set overhand at 1.5x shoulder width, second set underhand at shoulder width (the same grips as block 1). Pull to your upper chest by driving your elbows down.",
                    subs: ["Machine Pulldown", "Neutral-Grip Lat Pulldown"] },
                { name: "Smith Machine Decline Press (Heavy)", sets: 1, reps: "6-8", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "Set a slight decline (15-30°) so the bar touches your lower chest, grip just outside shoulder width, elbows tucked at 45°. Focus on strength: add weight or reps each week.",
                    subs: ["Machine Chest Press", "Flat DB Press"] },
                { name: "Smith Machine Decline Press (Back off)", sets: 1, reps: "10-12", rest: "~3 min", technique: "RPE 9-10", warmup: "0",
                    notes: "Drop the weight back and focus on the stretch and squeeze, lowering under control to your lower chest. Set the safety stops so you can push close to failure.",
                    subs: ["Machine Chest Press", "Flat DB Press"] },
                { name: "Incline Chest-Supported DB Row", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "1",
                    notes: "Keep elbows at ~30° angle from torso. Pull the weight towards your navel",
                    subs: ["Chest-Supported T-Bar Row", "Seated Cable Row"] },
                { name: "Standing DB Arnold Press", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "1",
                    notes: "Start with your elbows in front of you and palms facing in. Rotate the dumbbells so that your palms face forward as you press.",
                    subs: ["Machine Shoulder Press", "Seated DB Shoulder Press"] },
                { name: "A1: DB Incline Curl", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Brace upper back against bench, 45 degree incline, keep shoulders back as you curl",
                    subs: ["Cable EZ Curl", "EZ Bar Curl"] },
                { name: "A2: DB French Press", sets: 2, reps: "15-20", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Can perform seated or standing. Press the dumbbell straight up and down behind your head.",
                    subs: ["Overhead Cable Triceps Extension", "EZ Bar Skull Crusher"] }
            ],
            2: [ // Lower
                { name: "Single-Leg Leg Press (Heavy)", sets: 1, reps: "6-8 per leg", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "High and wide foot positioning, start with weaker leg",
                    subs: ["Machine Squat", "Hack Squat"] },
                { name: "Single-Leg Leg Press (Back off)", sets: 1, reps: "10-12 per leg", rest: "~3 min", technique: "RPE 8-9", warmup: "0",
                    notes: "High and wide foot positioning, start with weaker leg",
                    subs: ["Machine Squat", "Hack Squat"] },
                { name: "Lying Leg Curl", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Keep your hips pinned to the pad and curl all the way up, squeezing your hamstrings. Lower under control to a full stretch and take the set to failure.",
                    subs: ["Seated Hamstring Curl"] },
                { name: "A1: Cable Crunch", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Kneel with the rope beside your head and keep your hips still. Round your back as you crunch, pulling your ribs toward your pelvis.",
                    subs: ["Machine Crunch"] },
                { name: "A2: Seated Calf Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Standing Calf Raise", "Leg Press Toe Press"] }
            ],
            3: [ // Push
                { name: "Machine Chest Press", sets: 2, reps: "8-10", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Focus on squeezing your chest",
                    subs: ["Smith Machine Decline Press", "Flat DB Press"] },
                { name: "Seated DB Shoulder Press", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Bring the dumbbells all the way down, keep your torso upright",
                    subs: ["Standing DB Arnold Press", "Machine Shoulder Press"] },
                { name: "Cable Triceps Kickback", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Lean slightly forward, lock your elbow behind your torso (shoulder hyperextension). Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.",
                    subs: ["DB Triceps Kickback", "Triceps Pressdown"] },
                { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!",
                    subs: ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"] },
                { name: "Cable Lateral Raise", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Lean away from the cable. Focus on squeezing your delts.",
                    subs: ["Machine Lateral Raise", "DB Lateral Raise"] }
            ],
            4: [ // Pull
                { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", warmup: "1",
                    notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight",
                    subs: ["Cable Lat Pullover", "1-Arm Lat Pull-In"] },
                { name: "T-Bar Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Focus on squeezing your shoulder blades together as you pull the weight towards you. Keep your shoulders down (avoid shrugging).",
                    subs: ["Seated Cable Row", "Pendlay Row"] },
                { name: "Lat Pulldown", sets: 3, reps: "8-10", rest: "~2 min", technique: "Dropset", warmup: "2",
                    notes: "Think about pulling your elbows 'down' and 'in'. Last set only do a dropset: perform 8-10 reps, drop the weight by ~50%, perform an additional 8-10 reps.",
                    subs: ["Neutral-Grip Lat Pulldown", "Machine Pulldown"] },
                { name: "Reverse Pec Deck", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Swing the weight 'out', not 'back'. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.",
                    subs: ["Reverse Cable Flye", "Rope Facepull"] },
                { name: "Spider Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Brace your chest against an incline bench, curl with your elbows slightly in front of you. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.",
                    subs: ["DB Preacher Curl", "Bayesian Cable Curl"] }
            ],
            5: [ // Legs
                { name: "DB Bulgarian Split Squat", sets: 3, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Start with your weaker leg. Squat deep",
                    subs: ["Goblet Squat", "Leg Press"] },
                { name: "DB Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Emphasize the stretch in your hamstrings, prevent your lower back from rounding",
                    subs: ["Romanian Deadlift", "Cable Pull-Through"] },
                { name: "Goblet Squat", sets: 1, reps: "12-15", rest: "~1.5 min", technique: "RPE 9-10", warmup: "1",
                    notes: "Hold the dumbbell underneath your chin, sit back and down, push your knees out laterally",
                    subs: ["Leg Extension", "Step-Up"] },
                { name: "A1: Leg Press Toe Press", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Standing Calf Raise", "Seated Calf Raise"] },
                { name: "A2: Machine Crunch", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Squeeze your abs to move the weight, don't use your arms to help",
                    subs: ["Cable Crunch"] }
            ]
        },
        3: {
            1: [ // Upper
                { name: "Machine Chest Press (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "Focus on squeezing your chest",
                    subs: ["Flat DB Press", "Smith Machine Decline Press"] },
                { name: "Machine Chest Press (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 9-10", warmup: "0",
                    notes: "Focus on squeezing your chest",
                    subs: ["Flat DB Press", "Smith Machine Decline Press"] },
                { name: "Machine Pulldown", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", warmup: "2",
                    notes: "Think about pulling your elbows 'down' and 'in'. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["2-Grip Lat Pulldown", "Neutral-Grip Lat Pulldown"] },
                { name: "Cable Shoulder Press", sets: 2, reps: "12-15", rest: "~2 min", technique: "Dropset", warmup: "1",
                    notes: "Bring cables all the way down to shoulder height, keep torso upright. Last set only do a dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps.",
                    subs: ["Machine Shoulder Press", "Seated DB Shoulder Press"] },
                { name: "Helms DB Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "1",
                    notes: "Be ultra strict with form, drive elbows out and back at 45 degree angle",
                    subs: ["Chest-Supported T-Bar Row", "Machine Row"] },
                { name: "A1: Overhead Cable Triceps Extension", sets: 2, reps: "12-15", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Do both arms at once, resist the negative",
                    subs: ["EZ Bar Skull Crusher", "DB French Press"] },
                { name: "A2: Cable EZ Curl", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Focus on squeezing your biceps. Control the negative",
                    subs: ["EZ Bar Curl", "DB Curl"] }
            ],
            2: [ // Lower
                { name: "Machine Squat (Heavy)", sets: 1, reps: "4-6", rest: "~3 min", technique: "RPE 8-9", warmup: "2-3",
                    notes: "Focus on strength here. Each week add weight or reps. Keep form consistent.",
                    subs: ["Hack Squat", "Leg Press"] },
                { name: "Machine Squat (Back off)", sets: 1, reps: "8-10", rest: "~3 min", technique: "RPE 8-9", warmup: "0",
                    notes: "Drop the weight back and focus on controlling the negative. Smooth and consistent rep tempo.",
                    subs: ["Hack Squat", "Leg Press"] },
                { name: "Lying Leg Curl", sets: 1, reps: "8-10", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Take 3-4 seconds to lower every rep to keep the Nordic curl's hard negative, then curl up hard. Keep your hips pinned to the pad and go to failure.",
                    subs: ["Seated Hamstring Curl"] },
                { name: "A1: Seated Calf Raise", sets: 2, reps: "10-12", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Standing Calf Raise", "Leg Press Toe Press"] },
                { name: "A2: Machine Crunch", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Go slow and controlled: exhale and curl your ribs toward your pelvis, pausing in the squeeze. Don't pull with your arms.",
                    subs: ["Cable Crunch"] }
            ],
            3: [ // Push
                { name: "Standing DB Arnold Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Start with your elbows in front of you and palms facing in. Rotate the dumbbells so that your palms face forward as you press.",
                    subs: ["Seated DB Shoulder Press", "Machine Shoulder Press"] },
                { name: "Cable Chest Press", sets: 2, reps: "10-12", rest: "~2 min", technique: "Dropset", warmup: "2",
                    notes: "Can be performed seated or standing. Focus on squeezing your chest. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Machine Chest Press", "Flat DB Press"] },
                { name: "DB Triceps Kickback", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Lean slightly forward, lock your elbow behind your torso (shoulder hyperextension). Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Triceps Pressdown", "Cable Triceps Kickback"] },
                { name: "Close-Grip Push Up", sets: 1, reps: "Failure", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Hands slightly narrower than shoulder width. Keep your elbows tucked in close to your torso. As many reps as possible!",
                    subs: ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"] },
                { name: "Machine Lateral Raise", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Focus on squeezing your lateral delt to move the weight",
                    subs: ["DB Lateral Raise", "Cable Lateral Raise"] }
            ],
            4: [ // Pull
                { name: "1-Arm Half-Kneeling Lat Pulldown", sets: 1, reps: "10-12", rest: "~1.5 min", technique: "RPE 7-8", warmup: "1",
                    notes: "Keep chest tall, keep elbow tucked in close to your torso, focus on squeezing your lat to move the weight",
                    subs: ["Cable Lat Pullover", "1-Arm Lat Pull-In"] },
                { name: "Neutral-Grip Lat Pulldown", sets: 3, reps: "8-10", rest: "~2 min", technique: "Dropset", warmup: "2",
                    notes: "Pull your elbows down against your sides. Last set only do a dropset: perform 8-10 reps, drop the weight by ~50%, perform an additional 8-10 reps.",
                    subs: ["Lat Pulldown", "Machine Pulldown"] },
                { name: "Meadows Row", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 9-10", warmup: "2",
                    notes: "Brace with your non-working hand against your knee, stay light, emphasize form",
                    subs: ["Single-Arm DB Row", "Pendlay Row"] },
                { name: "Inverse Zottman Curl", sets: 2, reps: "10-12", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Hammer curl on concentric, supinated curl (palms up) on the eccentric. Last set only do a dropset: perform 10-12 reps, drop the weight by ~50%, perform an additional 10-12 reps.",
                    subs: ["Hammer Curl", "DB Curl"] },
                { name: "Bent-Over Reverse DB Flye", sets: 2, reps: "15-20", rest: "~1.5 min", technique: "RPE 10", warmup: "1",
                    notes: "Mind-muscle connection with rear delts, sweep the weight out",
                    subs: ["Reverse Cable Flye", "Rope Facepull"] }
            ],
            5: [ // Legs
                { name: "Romanian Deadlift", sets: 2, reps: "10-12", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Maintain a neutral lower back, set your hips back, don't allow your spine to round",
                    subs: ["DB Romanian Deadlift", "Cable Pull-Through"] },
                { name: "DB Walking Lunge", sets: 3, reps: "8-10", rest: "~2 min", technique: "RPE 8-9", warmup: "2",
                    notes: "Take medium strides, minimize the amount you push off your rear leg",
                    subs: ["DB Step-Up", "DB Bulgarian Split Squat"] },
                { name: "Leg Extension", sets: 1, reps: "12-15", rest: "~1.5 min", technique: "Dropset", warmup: "1",
                    notes: "Dropset: perform 12-15 reps, drop the weight by ~50%, perform an additional 12-15 reps. Focus on squeezing your quads to make the weight move.",
                    subs: ["Goblet Squat", "DB Step-Up"] },
                { name: "A1: Standing Calf Raise", sets: 2, reps: "15-20", rest: "0 min", technique: "Superset", warmup: "1",
                    notes: "Press all the way up to your toes, stretch your calves at the bottom, don't bounce",
                    subs: ["Seated Calf Raise", "Leg Press Toe Press"] },
                { name: "A2: Cable Crunch", sets: 2, reps: "12-15", rest: "~1.5 min", technique: "Superset", warmup: "1",
                    notes: "Round your back as you crunch and keep your hips still so your abs do the work. Same exercise as block 1 Legs, so aim to beat those numbers.",
                    subs: ["Machine Crunch"] }
            ]
        }
    }
};

// ===== Replaced exercises (v3.1: bodyweight defaults swapped for machine/cable work) =====
// On load, sets and swaps saved under `from` move to `to` in the same block and session.
// Moved sets keep their old name as a "done as" label, unless `doneAsNew` says they were
// really done as the new exercise. `node audit.js` checks these entries.
const PROGRAM_CHANGES = [
    { block: 1, session: 2, from: 'A2: Hanging Leg Raise', to: 'A2: Machine Crunch' },
    { block: 1, session: 4, from: 'Weighted Pullup', to: 'Lat Pulldown', doneAsNew: true }, // logged here, but done as lat pulldowns
    { block: 2, session: 1, from: '2-Grip Pullup', to: '2-Grip Lat Pulldown' },
    { block: 2, session: 1, from: 'Weighted Dip (Heavy)', to: 'Smith Machine Decline Press (Heavy)' },
    { block: 2, session: 1, from: 'Weighted Dip (Back off)', to: 'Smith Machine Decline Press (Back off)' },
    { block: 2, session: 2, from: 'Glute-Ham Raise', to: 'Lying Leg Curl' },
    { block: 2, session: 2, from: 'A1: Roman Chair Crunch', to: 'A1: Cable Crunch' },
    { block: 3, session: 2, from: 'Nordic Ham Curl', to: 'Lying Leg Curl' },
    { block: 3, session: 2, from: 'A2: Two-Arms Two-Legs Dead Bug', to: 'A2: Machine Crunch' },
    { block: 3, session: 5, from: 'A2: Plate-Weighted Crunch', to: 'A2: Cable Crunch' }
];

// ===== Warm-up routine (Guide tab) =====
// `move` points at a demo in exercises.js; ids are stored in the daily checklist.
const WARMUP = [
    {
        title: 'General (5 min)',
        items: [
            { id: 'wu1', name: 'Light cardio', detail: '3 min · bike, treadmill or jumping jacks', move: 'wu_jumping_jacks' },
            { id: 'wu2', name: 'Arm circles', detail: '20 each direction, full circles', move: 'wu_arm_circles' },
            { id: 'wu3', name: 'Leg swings', detail: '15 each leg, front to back', move: 'wu_leg_swings' },
            { id: 'wu4', name: 'Hip circles', detail: '10 each direction, full circles', move: 'wu_hip_circles' }
        ]
    },
    {
        title: 'Dynamic stretches',
        items: [
            { id: 'wu5', name: 'Walking lunges', detail: '10 each leg · bodyweight', move: 'wu_walking_lunge_bw' },
            { id: 'wu6', name: 'High knees', detail: '20 seconds', move: 'wu_high_knees' },
            { id: 'wu7', name: 'Butt kicks', detail: '20 seconds', move: 'wu_butt_kicks' },
            { id: 'wu8', name: 'Torso twists', detail: '15 each side', move: 'wu_torso_twists' }
        ]
    },
    {
        title: 'Mobility (optional)',
        items: [
            { id: 'wu12', name: 'Shoulder dislocates', detail: '15 reps · band, stick or towel', move: 'wu_shoulder_dislocates' },
            { id: 'wu13', name: 'Cat-cow', detail: '10 slow reps', move: 'wu_cat_cow' },
            { id: 'wu14', name: 'Deep squat hold', detail: 'Hold the bottom for 30 seconds', move: 'wu_deep_squat_hold' },
            { id: 'wu15', name: 'Foam rolling', detail: 'About 2 min per tight muscle', move: 'wu_foam_roll_quads' }
        ]
    }
];
