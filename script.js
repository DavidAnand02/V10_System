const maxLevel = 100;
const maxExperience = 10000;

let skills = [];

document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
});

function addSkill() {
    const skillName = prompt("Enter the name of the new skill:");
    if (!skillName) return;
    
    const icon = prompt("Enter the FontAwesome icon name (e.g., 'brain'):");
    if (!icon) return;

    skills.push({
        name: skillName,
        icon: icon,
        experience: 0,
        level: 1,
        effects: {
            retention: 0,
            speed: 0
        }
    });
    
    renderSkills();
}

function removeSkill(index) {
    skills.splice(index, 1);
    saveSkills();
    renderSkills();
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    skills.forEach((skill, index) => {
        const skillCard = document.createElement('div');
        skillCard.classList.add('skill-card');
        skillCard.onclick = () => toggleSkillDetails(index);

        const icon = `<i class="fas fa-${skill.icon}"></i>`;
        skillCard.innerHTML = `
            <h2>${icon} ${skill.name}</h2>
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
                <button onmousedown="startRemovingPoints(${index}, 1)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 1 Hour</button>
                <button onmousedown="startRemovingPoints(${index}, 0.5)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 30 Minutes</button>
                <button onclick="removeSkill(${index})">Remove Skill</button>
            </div>
        `;
        container.appendChild(skillCard);
    });
}

function toggleSkillDetails(index) {
    const skillDetails = document.getElementById(`skill-details-${index}`);
    skillDetails.classList.toggle('hidden');
}

function addExperience(index, hours) {
    const skill = skills[index];
    skill.experience += hours;
    updateSkill(index);
}

function removeExperience(index, hours) {
    const skill = skills[index];
    skill.experience -= hours;
    if (skill.experience < 0) skill.experience = 0;
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
    skill.level = calculateLevel(skill.experience);
    document.getElementById(`experience-${index}`).innerText = skill.experience;
    document.getElementById(`level-${index}`).innerText = skill.level;

    const expBar = document.getElementById(`experience-bar-${index}`);
    updateProgressBar(expBar, skill.experience - getLevelExperience(skill.level - 1), getLevelExperience(skill.level) - getLevelExperience(skill.level - 1));

    updateEffectProgress(`retention-bar-${index}`, skill.level, skill.effects.retention);
    updateEffectProgress(`speed-bar-${index}`, skill.level, skill.effects.speed);

    saveSkills();
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
