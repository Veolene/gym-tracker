const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');

// Extract all exercise names from the program data
const exerciseNameRegex = /name:\s*["']([^"']+)["']/g;
const exercises = new Set();
let match;
while ((match = exerciseNameRegex.exec(content)) !== null) {
    exercises.add(match[1].toLowerCase());
}

// Extract mapped GIFs
const gifMapRegex = /["']([^"']+)["']:\s*["']https:\/\/fitnessprogramer/g;
const mappedExercises = new Set();
while ((match = gifMapRegex.exec(content)) !== null) {
    mappedExercises.add(match[1].toLowerCase());
}

console.log('=== ALL EXERCISES IN PROGRAM ===');
const sortedExercises = Array.from(exercises).sort();
sortedExercises.forEach(e => console.log(e));
console.log('\n=== TOTAL:', exercises.size, 'unique exercises ===');
console.log('\n=== MAPPED GIFS:', mappedExercises.size, '===');
console.log('\n=== EXERCISES WITHOUT DIRECT MAPPING (relies on fallback) ===');
sortedExercises.forEach(e => {
    if (!mappedExercises.has(e)) {
        console.log('  MISSING:', e);
    }
});
