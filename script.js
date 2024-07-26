const maxLevel = 100;
const maxExperience = 10000;

let skills = [];

document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    renderSkills();
});

function showAddSkillForm() {
    document.getElementById('add-skill-form').classList.remove('hidden');
}

function hideAddSkillForm() {
    document.getElementById('add-skill-form').classList.add('hidden');
}

function addSkill() {
    const name = document.getElementById('skill-name').value;
    const icon = document.getElementById('skill-icon').value;
    const description = document.getElementById('skill-description').value;
    
    if (name && icon && description) {
        const newSkill = {
            name,
            icon,
            description,
            experience: 0,
            level: 1,
            effects: {
                retention: 0,
                speed: 0
            }
        };
        skills.push(newSkill);
        saveSkills();
        renderSkills();
        hideAddSkillForm();
    }
}

function removeSkill(index) {
    skills.splice(index, 1);
    saveSkills();
    renderSkills();
}

function toggleSkillDetails(index) {
    const skillDetails = document.getElementById(`skill-details-${index}`);
    skillDetails.classList.toggle('hidden');
}

function addExperience(index, hours) {
    skills[index].experience += hours;
    saveSkills();
    updateSkill(index);
}

function removeExperience(index, hours) {
    skills[index].experience -= hours;
    if (skills[index].experience < 0) skills[index].experience = 0;
    saveSkills();
    updateSkill(index);
}

function startAddingPoints(index, hours) {
    addExperience(index, hours);
    interval = setInterval(() => addExperience(index, hours), 100);
}

function startRemovingPoints(index, hours) {
    removeExperience(index, hours);
    interval = setInterval(() => removeExperience(index, hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

function updateSkill(index) {
    const skill = skills[index];
    const level = calculateLevel(skill.experience);
    skill.level = level;
    document.getElementById(`level-${index}`).innerText = skill.level;
    updateProgressBar(`experience-bar-${index}`, skill.experience - getLevelExperience(skill.level - 1), getLevelExperience(skill.level) - getLevelExperience(skill.level - 1));
    updateEffectProgress(`retention-bar-${index}`, skill.level, skill.effects.retention);
    updateEffectProgress(`speed-bar-${index}`, skill.level, skill.effects.speed);
}

function calculateLevel(experience) {
    let level = 1;
    while (experience >= getLevelExperience(level) && level < maxLevel) {
        level++;
    }
    return level;
}

function getLevelExperience(level) {
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

function saveSkills() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

function loadSkills() {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    }
}

function renderSkills() {
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '';
    skills.forEach((skill, index) => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <h2 onclick="toggleSkillDetails(${index})"><i class="${skill.icon}"></i> ${skill.name}</h2>
            <div id="skill-details-${index}" class="hidden" onclick="event.stopPropagation()">
                <p>Experience: <span id="experience-${index}">${skill.experience}</span> points</p>
                <p>Level: <span id="level-${index}">${skill.level}</span></p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="experience-bar-${index}"></div>
                </div>
                <p>Effects:</p>
                <div class="effect">
                    <p>Better Retention</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="retention-bar-${index}"></div>
                    </div>
                </div>
                <div class="effect">
                    <p>Speed Learning</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="speed-bar-${index}"></div>
                    </div>
                </div>
                <button onmousedown="startAddingPoints(${index}, 1)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 1 Hour</button>
                <button onmousedown="startAddingPoints(${index}, 0.5)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 30 Minutes</button>
                <button onmousedown="startRemovingPoints(${index}, 1)" onmouseup="stop
