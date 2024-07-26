let experience = 0;
let level = 1;
const maxLevel = 100;
const maxExperience = 10000;
const effects = {
    retention: 0,
    speed: 0
};

let interval;

function toggleSkillDetails() {
    const skillDetails = document.getElementById('skill-details');
    skillDetails.classList.toggle('hidden');
}

function addExperience(hours) {
    experience += hours;
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}

function startAddingPoints(hours) {
    addExperience(hours);
    interval = setInterval(() => addExperience(hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function updateLevel() {
    let newLevel = 1;
    while (experience >= getLevelExperience(newLevel) && newLevel < maxLevel) {
        newLevel++;
    }
    level = newLevel;
    document.getElementById('level').innerText = level;

    updateEffectProgress('retention-bar', level, effects.retention);
    updateEffectProgress('speed-bar', level, effects.speed);
}

function getLevelExperience(level) {
    // Using an exponential growth formula with normalization
    return Math.pow(level / maxLevel, 2) * maxExperience;
}

function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function updateEffectProgress(id, level, effectLevel) {
    const effectStage = getEffectStage(level);
    const progressBar = document.getElementById(id);
    const stages = { beginner: 33, intermediate: 66, advanced: 100 };
    progressBar.style.width = `${stages[effectStage]}%`;
}

function getEffectStage(level) {
    if (level < 34) return 'beginner';
    if (level < 67) return 'intermediate';
    return 'advanced';
}

// Initial setup
updateLevel();
