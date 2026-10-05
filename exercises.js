// ===== Exercise catalog: demo animations =====
// Every exercise name in program.js (including swap options) maps to exactly one
// movement here - no fuzzy keyword matching, so a demo can never silently show the
// wrong exercise. `node audit.js` fails if any name is unmapped.
//
// gif:  animation hot-linked from fitnessprogramer.com (cached on-device by sw.js)
//       null = no trustworthy demo exists; the app shows a neutral placeholder.
// demo: what the animation actually shows (used as its description)
// note: shown under the demo when it is only a close variant: says what to do differently
// bw:   bodyweight movement - weight is logged as *added* kg (0 = bodyweight)
const GIF_BASE = 'https://fitnessprogramer.com/wp-content/uploads/';

const EXERCISE_MEDIA = {
    moves: {
        // Chest
        db_bench_press: { muscle: 'Chest', gif: GIF_BASE + '2021/02/Dumbbell-Press.gif', demo: 'Dumbbell bench press' },
        machine_chest_press: { muscle: 'Chest', gif: GIF_BASE + '2021/02/Chest-Press-Machine.gif', demo: 'Machine chest press' },
        weighted_dip: { muscle: 'Chest', bw: true, gif: GIF_BASE + '2021/06/Chest-Dips.gif', demo: 'Chest dip',
            note: 'Demo shows a bodyweight dip. Add weight with a dip belt or a dumbbell between your feet.' },
        cable_chest_press: { muscle: 'Chest', gif: GIF_BASE + '2022/02/Seated-Cable-Chest-Press.gif', demo: 'Seated cable chest press' },
        close_grip_push_up: { muscle: 'Chest', bw: true, gif: GIF_BASE + '2021/02/Diamond-Push-up.gif', demo: 'Diamond push-up',
            note: 'Demo shows the diamond variant. Keep your hands just inside shoulder width, elbows tucked.' },
        incline_close_grip_push_up: { muscle: 'Chest', bw: true, gif: GIF_BASE + '2021/06/Incline-Push-Up.gif', demo: 'Incline push-up',
            note: 'Demo uses a normal grip. Bring your hands closer together and keep your elbows tucked.' },
        kneeling_push_up: { muscle: 'Chest', bw: true, gif: GIF_BASE + '2022/01/Kneeling-Push-up.gif', demo: 'Kneeling push-up' },

        // Back - vertical pulls
        lat_pulldown: { muscle: 'Back', gif: GIF_BASE + '2021/02/Lat-Pulldown.gif', demo: 'Lat pulldown' },
        machine_pulldown: { muscle: 'Back', gif: GIF_BASE + '2021/05/Front-Pulldown.gif', demo: 'Lever front pulldown' },
        neutral_grip_lat_pulldown: { muscle: 'Back', gif: GIF_BASE + '2021/06/V-bar-Lat-Pulldown.gif', demo: 'V-bar lat pulldown' },
        half_kneeling_1arm_pulldown: { muscle: 'Back', gif: GIF_BASE + '2021/06/Half-Kneeling-Lat-Pulldown.gif', demo: 'Half-kneeling one-arm lat pulldown' },
        one_arm_lat_pull_in: { muscle: 'Back', gif: GIF_BASE + '2021/06/Cable-One-Arm-Lat-Pulldown.gif', demo: 'One-arm cable lat pulldown',
            note: 'Demo shows a one-arm pulldown. For the pull-in, sweep your elbow down and in toward your hip.' },
        cable_lat_pullover: { muscle: 'Back', gif: GIF_BASE + '2021/06/Rope-Straight-Arm-Pulldown.gif', demo: 'Straight-arm rope pulldown' },
        weighted_pull_up: { muscle: 'Back', bw: true, gif: GIF_BASE + '2021/04/Weighted-Pull-up.gif', demo: 'Weighted pull-up' },
        pull_up: { muscle: 'Back', bw: true, gif: GIF_BASE + '2021/02/Pull-up.gif', demo: 'Pull-up' },
        neutral_grip_pull_up: { muscle: 'Back', bw: true, gif: GIF_BASE + '2021/02/Pull-up.gif', demo: 'Pull-up',
            note: 'Demo shows an overhand grip. Use parallel handles with your palms facing each other.' },

        // Back - rows
        pendlay_row: { muscle: 'Back', gif: GIF_BASE + '2022/07/Barbell-Pendlay-Row.gif', demo: 'Barbell Pendlay row' },
        machine_row: { muscle: 'Back', gif: GIF_BASE + '2022/02/Plate-Loaded-Seated-Row.gif', demo: 'Plate-loaded seated row' },
        seated_cable_row: { muscle: 'Back', gif: GIF_BASE + '2021/02/Seated-Cable-Row.gif', demo: 'Seated cable row' },
        incline_db_row: { muscle: 'Back', gif: GIF_BASE + '2022/02/Incline-Dumbbell-Hammer-Row.gif', demo: 'Chest-supported incline dumbbell row' },
        chest_supported_tbar_row: { muscle: 'Back', gif: GIF_BASE + '2021/08/Lever-Reverse-T-Bar-Row.gif', demo: 'Chest-supported lever T-bar row' },
        tbar_row: { muscle: 'Back', gif: GIF_BASE + '2021/04/t-bar-rows.gif', demo: 'Landmine T-bar row' },
        meadows_row: { muscle: 'Back', gif: GIF_BASE + '2021/10/One-Arm-Landmine-Row.gif', demo: 'One-arm landmine (Meadows) row' },
        one_arm_db_row: { muscle: 'Back', gif: GIF_BASE + '2021/02/Dumbbell-Row.gif', demo: 'One-arm dumbbell row' },

        // Shoulders
        seated_db_shoulder_press: { muscle: 'Shoulders', gif: GIF_BASE + '2021/02/Dumbbell-Shoulder-Press.gif', demo: 'Seated dumbbell shoulder press' },
        machine_shoulder_press: { muscle: 'Shoulders', gif: GIF_BASE + '2021/04/Lever-Shoulder-Press.gif', demo: 'Machine shoulder press' },
        arnold_press: { muscle: 'Shoulders', gif: GIF_BASE + '2021/02/Arnold-Press.gif', demo: 'Seated Arnold press',
            note: 'Demo is seated. The program does it standing.' },
        cable_shoulder_press: { muscle: 'Shoulders', gif: GIF_BASE + '2021/04/Cable-Shoulder-Press.gif', demo: 'Cable shoulder press' },
        db_lateral_raise: { muscle: 'Shoulders', gif: GIF_BASE + '2021/02/Dumbbell-Lateral-Raise.gif', demo: 'Dumbbell lateral raise' },
        cable_lateral_raise: { muscle: 'Shoulders', gif: GIF_BASE + '2021/07/one-arm-Cable-Lateral-Raise.gif', demo: 'One-arm cable lateral raise' },
        machine_lateral_raise: { muscle: 'Shoulders', gif: GIF_BASE + '2021/06/Lateral-Raise-Machine.gif', demo: 'Lateral raise machine' },
        face_pull: { muscle: 'Rear delts', gif: GIF_BASE + '2021/02/Face-Pull.gif', demo: 'Rope face pull' },
        reverse_pec_deck: { muscle: 'Rear delts', gif: GIF_BASE + '2021/02/Rear-Delt-Machine-Flys.gif', demo: 'Reverse pec deck' },
        reverse_cable_fly: { muscle: 'Rear delts', gif: GIF_BASE + '2021/02/cable-rear-delt-fly.gif', demo: 'Reverse cable fly' },
        bent_over_reverse_db_fly: { muscle: 'Rear delts', gif: GIF_BASE + '2021/02/Bent-Over-Lateral-Raise.gif', demo: 'Bent-over dumbbell rear delt raise' },

        // Triceps
        ez_bar_skull_crusher: { muscle: 'Triceps', gif: GIF_BASE + '2021/02/Barbell-Triceps-Extension.gif', demo: 'Lying barbell triceps extension' },
        overhead_cable_triceps_extension: { muscle: 'Triceps', gif: GIF_BASE + '2021/04/Cable-Rope-Overhead-Triceps-Extension.gif', demo: 'Overhead cable rope triceps extension' },
        db_french_press: { muscle: 'Triceps', gif: GIF_BASE + '2021/06/Seated-Dumbbell-Triceps-Extension.gif', demo: 'Seated dumbbell triceps extension' },
        triceps_pushdown: { muscle: 'Triceps', gif: GIF_BASE + '2021/02/Pushdown.gif', demo: 'Cable triceps pushdown' },
        cable_kickback: { muscle: 'Triceps', gif: GIF_BASE + '2022/10/Low-Cable-Tricep-Kickback.gif', demo: 'Cable triceps kickback' },
        db_kickback: { muscle: 'Triceps', gif: GIF_BASE + '2021/02/Dumbbell-Kickback.gif', demo: 'Dumbbell triceps kickback' },

        // Biceps
        ez_bar_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/Z-Bar-Curl.gif', demo: 'EZ-bar curl' },
        db_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/Dumbbell-Curl.gif', demo: 'Dumbbell curl' },
        cable_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/cable-curl.gif', demo: 'Cable bar curl' },
        bayesian_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/One-Arm-Cable-Curl.gif', demo: 'Behind-the-body one-arm cable curl' },
        incline_db_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/Seated-Incline-Dumbbell-Curl.gif', demo: 'Incline dumbbell curl' },
        spider_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/04/Prone-Incline-Biceps-Curl.gif', demo: 'Prone incline (spider) curl' },
        db_preacher_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/Dumbbell-Preacher-Curl.gif', demo: 'Dumbbell preacher curl' },
        zottman_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/04/zottman-curl.gif', demo: 'Zottman curl',
            note: 'Demo shows a regular Zottman curl. Inverse version: curl up with a hammer grip, lower with palms up.' },
        hammer_curl: { muscle: 'Biceps', gif: GIF_BASE + '2021/02/Hammer-Curl.gif', demo: 'Hammer curl' },

        // Quads
        hack_squat: { muscle: 'Quads', gif: GIF_BASE + '2021/02/Sled-Hack-Squat.gif', demo: 'Hack squat' },
        machine_squat: { muscle: 'Quads', gif: GIF_BASE + '2024/10/smith-machine-squat.gif', demo: 'Smith machine squat' },
        leg_press: { muscle: 'Quads', gif: GIF_BASE + '2015/11/Leg-Press.gif', demo: 'Leg press' },
        single_leg_leg_press: { muscle: 'Quads', gif: GIF_BASE + '2022/04/Single-Leg-Press.gif', demo: 'Single-leg leg press' },
        leg_extension: { muscle: 'Quads', gif: GIF_BASE + '2021/02/LEG-EXTENSION.gif', demo: 'Leg extension' },
        goblet_squat: { muscle: 'Quads', gif: GIF_BASE + '2023/01/Dumbbell-Goblet-Squat.gif', demo: 'Dumbbell goblet squat' },
        bulgarian_split_squat: { muscle: 'Quads', gif: GIF_BASE + '2021/05/Dumbbell-Bulgarian-Split-Squat.gif', demo: 'Dumbbell Bulgarian split squat' },
        walking_lunge: { muscle: 'Quads', gif: GIF_BASE + '2023/09/dumbbell-lunges.gif', demo: 'Dumbbell walking lunge' },
        step_up: { muscle: 'Quads', gif: GIF_BASE + '2021/12/Dumbeel-Step-Up.gif', demo: 'Dumbbell step-up' },

        // Hamstrings, glutes & lower back
        barbell_rdl: { muscle: 'Hamstrings', gif: GIF_BASE + '2021/02/Barbell-Romanian-Deadlift.gif', demo: 'Barbell Romanian deadlift' },
        db_rdl: { muscle: 'Hamstrings', gif: GIF_BASE + '2021/02/Dumbbell-Romanian-Deadlift.gif', demo: 'Dumbbell Romanian deadlift' },
        seated_leg_curl: { muscle: 'Hamstrings', gif: GIF_BASE + '2021/08/Seated-Leg-Curl.gif', demo: 'Seated leg curl' },
        lying_leg_curl: { muscle: 'Hamstrings', gif: GIF_BASE + '2021/02/Leg-Curl.gif', demo: 'Lying leg curl' },
        nordic_curl: { muscle: 'Hamstrings', bw: true, gif: GIF_BASE + '2021/06/Nordic-Hamstring-Curl.gif', demo: 'Nordic hamstring curl' },
        glute_ham_raise: { muscle: 'Hamstrings', bw: true, gif: GIF_BASE + '2023/07/Glute-Ham-Raise.gif', demo: 'Glute-ham raise' },
        hyperextension_45: { muscle: 'Lower back', bw: true, gif: GIF_BASE + '2021/02/hyperextension.gif', demo: '45-degree hyperextension' },

        // Calves
        standing_calf_raise: { muscle: 'Calves', gif: GIF_BASE + '2022/04/Standing-Barbell-Calf-Raise.gif', demo: 'Standing barbell calf raise' },
        seated_calf_raise: { muscle: 'Calves', gif: GIF_BASE + '2021/06/Lever-Seated-Calf-Raise.gif', demo: 'Seated calf raise machine' },
        leg_press_calf_raise: { muscle: 'Calves', gif: GIF_BASE + '2021/05/Leg-Press-Calf-Raise.gif', demo: 'Leg press calf raise' },

        // Abs
        hanging_leg_raise: { muscle: 'Abs', bw: true, gif: GIF_BASE + '2021/08/Hanging-Leg-Raises.gif', demo: 'Hanging leg raise' },
        captains_chair_leg_raise: { muscle: 'Abs', bw: true, gif: GIF_BASE + '2021/05/Captains-Chair-Leg-Raise.gif', demo: 'Captain\'s chair leg raise' },
        reverse_crunch: { muscle: 'Abs', bw: true, gif: GIF_BASE + '2021/02/Reverse-Crunch-1.gif', demo: 'Reverse crunch' },
        cable_crunch: { muscle: 'Abs', gif: GIF_BASE + '2021/02/Kneeling-Cable-Crunch.gif', demo: 'Kneeling cable crunch' },
        machine_crunch: { muscle: 'Abs', gif: GIF_BASE + '2021/09/Seated-Crunch-Machine.gif', demo: 'Seated crunch machine' },
        weighted_crunch: { muscle: 'Abs', gif: GIF_BASE + '2022/07/Medicine-Ball-Crunch.gif', demo: 'Medicine ball crunch',
            note: 'Demo uses a medicine ball. Hold a plate or dumbbell to your chest the same way.' },
        dead_bug: { muscle: 'Abs', bw: true, gif: GIF_BASE + '2021/05/Dead-Bug.gif', demo: 'Dead bug (alternating)',
            note: 'Demo alternates one arm and one leg. For the two-arms, two-legs version, extend both arms and both legs together.' },

        // Warm-up & mobility
        wu_jumping_jacks: { muscle: 'Warm-up', gif: GIF_BASE + '2021/05/Jumping-jack.gif', demo: 'Jumping jacks' },
        wu_arm_circles: { muscle: 'Warm-up', gif: GIF_BASE + '2021/07/Arm-Circles_Shoulders.gif', demo: 'Arm circles' },
        wu_leg_swings: { muscle: 'Warm-up', gif: GIF_BASE + '2025/07/Leg-Swings-Front-to-Back.gif', demo: 'Front-to-back leg swings' },
        wu_hip_circles: { muscle: 'Warm-up', gif: GIF_BASE + '2021/01/hip-circles.gif', demo: 'Hip circles',
            note: 'Move your hips in full circles.' },
        wu_walking_lunge_bw: { muscle: 'Warm-up', gif: GIF_BASE + '2023/09/bodyweight-walking-lunge.gif', demo: 'Bodyweight walking lunge' },
        wu_high_knees: { muscle: 'Warm-up', gif: GIF_BASE + '2021/08/High-Knee-Run.gif', demo: 'High knees' },
        wu_butt_kicks: { muscle: 'Warm-up', gif: GIF_BASE + '2021/10/Butt-Kicks.gif', demo: 'Butt kicks' },
        wu_torso_twists: { muscle: 'Warm-up', gif: GIF_BASE + '2021/05/Standing-Rotation.gif', demo: 'Standing torso rotation' },
        wu_shoulder_dislocates: { muscle: 'Mobility', gif: null, demo: '' },
        wu_cat_cow: { muscle: 'Mobility', gif: GIF_BASE + '2021/02/cat-cow.gif', demo: 'Cat-cow' },
        wu_deep_squat_hold: { muscle: 'Mobility', gif: GIF_BASE + '2021/05/bodyweight-squat-full-version.gif', demo: 'Bodyweight squat',
            note: 'Sink as deep as you can and hold the bottom position.' },
        wu_foam_roll_quads: { muscle: 'Mobility', gif: GIF_BASE + '2022/02/Foam-Roller-Quads.gif', demo: 'Foam rolling the quads' }
    },

    // Normalized exercise name -> movement id (see normalizeExerciseName)
    names: {
        'flat db press': 'db_bench_press',
        'machine chest press': 'machine_chest_press',
        'weighted dip': 'weighted_dip',
        'cable chest press': 'cable_chest_press',
        'close-grip push up': 'close_grip_push_up',
        'incline close-grip push up': 'incline_close_grip_push_up',
        'kneeling modified push up': 'kneeling_push_up',

        '2-grip lat pulldown': 'lat_pulldown',
        'lat pulldown': 'lat_pulldown',
        'machine pulldown': 'machine_pulldown',
        'neutral-grip lat pulldown': 'neutral_grip_lat_pulldown',
        '1-arm half-kneeling lat pulldown': 'half_kneeling_1arm_pulldown',
        '1-arm lat pull-in': 'one_arm_lat_pull_in',
        'cable lat pullover': 'cable_lat_pullover',
        'weighted pullup': 'weighted_pull_up',
        '2-grip pullup': 'pull_up',
        '2-grip pull-up': 'pull_up',
        'neutral-grip pullup': 'neutral_grip_pull_up',

        'pendlay row': 'pendlay_row',
        'machine pendlay row': 'machine_row',
        'machine row': 'machine_row',
        'seated cable row': 'seated_cable_row',
        'incline chest-supported db row': 'incline_db_row',
        'helms db row': 'incline_db_row',
        'chest-supported t-bar row': 'chest_supported_tbar_row',
        't-bar row': 'tbar_row',
        'meadows row': 'meadows_row',
        'single-arm db row': 'one_arm_db_row',

        'seated db shoulder press': 'seated_db_shoulder_press',
        'machine shoulder press': 'machine_shoulder_press',
        'standing db arnold press': 'arnold_press',
        'cable shoulder press': 'cable_shoulder_press',
        'db lateral raise': 'db_lateral_raise',
        'cable lateral raise': 'cable_lateral_raise',
        'machine lateral raise': 'machine_lateral_raise',
        'rope facepull': 'face_pull',
        'reverse pec deck': 'reverse_pec_deck',
        'reverse cable flye': 'reverse_cable_fly',
        'bent-over reverse db flye': 'bent_over_reverse_db_fly',

        'ez bar skull crusher': 'ez_bar_skull_crusher',
        'overhead cable triceps extension': 'overhead_cable_triceps_extension',
        'db french press': 'db_french_press',
        'triceps pressdown': 'triceps_pushdown',
        'cable triceps kickback': 'cable_kickback',
        'db triceps kickback': 'db_kickback',

        'ez bar curl': 'ez_bar_curl',
        'db curl': 'db_curl',
        'cable ez curl': 'cable_curl',
        'bayesian cable curl': 'bayesian_curl',
        'db incline curl': 'incline_db_curl',
        'spider curl': 'spider_curl',
        'db preacher curl': 'db_preacher_curl',
        'inverse zottman curl': 'zottman_curl',
        'hammer curl': 'hammer_curl',

        'hack squat': 'hack_squat',
        'machine squat': 'machine_squat',
        'leg press': 'leg_press',
        'single-leg leg press': 'single_leg_leg_press',
        'leg extension': 'leg_extension',
        'goblet squat': 'goblet_squat',
        'db bulgarian split squat': 'bulgarian_split_squat',
        'db walking lunge': 'walking_lunge',
        'db step-up': 'step_up',
        'step-up': 'step_up',

        'romanian deadlift': 'barbell_rdl',
        'db romanian deadlift': 'db_rdl',
        'seated hamstring curl': 'seated_leg_curl',
        'lying leg curl': 'lying_leg_curl',
        'nordic ham curl': 'nordic_curl',
        'glute-ham raise': 'glute_ham_raise',
        '45° hyperextension': 'hyperextension_45',

        'standing calf raise': 'standing_calf_raise',
        'seated calf raise': 'seated_calf_raise',
        'leg press toe press': 'leg_press_calf_raise',

        'hanging leg raise': 'hanging_leg_raise',
        'roman chair crunch': 'captains_chair_leg_raise',
        'reverse crunch': 'reverse_crunch',
        'cable crunch': 'cable_crunch',
        'machine crunch': 'machine_crunch',
        'plate-weighted crunch': 'weighted_crunch',
        'two-arms two-legs dead bug': 'dead_bug'
    }
};

// "A1: Flat DB Press (Heavy)" -> "flat db press"
function normalizeExerciseName(name) {
    return String(name)
        .replace(/^\s*a\d+\s*:\s*/i, '')
        .replace(/\s*\((heavy|back off)\)\s*$/i, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function exerciseMoveId(name) {
    return EXERCISE_MEDIA.names[normalizeExerciseName(name)] || null;
}
