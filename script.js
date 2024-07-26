let skills = JSON.parse(localStorage.getItem('skills')) || [];

function renderSkills() {
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '';
    skills.forEach((skill, index) => {
        skillList.innerHTML += `
            <div class="skill-card">
                <button class="remove-btn" onclick="removeSkill(${index})"><i class="fas fa-times"></i></button>
                <h2><i class="fas ${skill.icon}"></i> ${skill.name}</h2>
                <div id="skill-details-${index}" class="hidden" onclick="event.stopPropagation()">
                    <p>Description: ${skill.description}</p>
                    <p>Experience: <span id="experience-${index}">${skill.experience}</span> points</p>
                    <p>Level: <span id="level-${index}">${skill.level}</span></p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="experience-bar-${index}"></div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="level-progress-bar-${index}"></div>
                    </div>
                    <p>Effects:</p>
                    ${skill.effects.map((effect, effectIndex) => `
                        <div class="effect">
                            <p>${effect.name}</p>
                            <div class="progress-bar-container">
                                <div class="progress-bar" id="effect-bar-${index}-${effectIndex}"></div>
                            </div>
                            <button onclick="renameEffect(${index}, ${effectIndex})">Rename Effect</button>
                        </div>
                    `).join('')}
                    <button onclick="addExperience(${index}, 1)">Add 1 Hour</button>
                    <button onclick="addExperience(${index}, 0.5)">Add 30 Minutes</button>
                    <button onclick="removeExperience(${index}, 1)">Remove 1 Hour</button>
                    <button onclick="removeExperience(${index}, 0.5)">Remove 30 Minutes</button>
                    <button onclick="addEffect(${index})">Add Effect</button>
                </div>
            </div>
        `;
        updateProgressBar(index);
    });
}

function toggleSkillDetails(index) {
    const skillDetails = document.getElementById(`skill-details-${index}`);
    skillDetails.classList.toggle('hidden');
}

function addExperience(index, hours) {
    let skill = skills[index];
    skill.experience += hours;
    saveSkills();
    updateSkill(index);
}

function removeExperience(index, hours) {
    let skill = skills[index];
    skill.experience -= hours;
    if (skill.experience < 0) skill.experience = 0;
    saveSkills();
    updateSkill(index);
}

function updateSkill(index) {
    let skill = skills[index];
    skill.level = calculateLevel(skill.experience);
    document.getElementById(`experience-${index}`).innerText = skill.experience;
    document.getElementById(`level-${index}`).innerText = skill.level;
    updateProgressBar(index);
}

function calculateLevel(experience) {
    let level = 1;
    while (experience >= getLevelExperience(level) && level < 100) {
        level++;
    }
    return level;
}

function updateProgressBar(index) {
    let skill = skills[index];
    const levelExperience = getLevelExperience(skill.level);
    const previousLevelExperience = getLevelExperience(skill.level - 1);
    updateProgressBarElement(`experience-bar-${index}`, skill.experience - previousLevelExperience, levelExperience - previousLevelExperience);
    updateProgressBarElement(`level-progress-bar-${index}`, skill.experience, levelExperience);
    skill.effects.forEach((_, effectIndex) => {
        updateProgressBarElement(`effect-bar-${index}-${effectIndex}`, skill.experience, levelExperience); // Assuming effects use the same level experience calculation
    });
}

function updateProgressBarElement(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function getLevelExperience(level) {
    return Math.pow(level / 100, 2) * 10000;
}

function removeSkill(index) {
    skills.splice(index, 1);
    saveSkills();
    renderSkills();
}

function addSkill() {
    const name = document.getElementById('skill-name').value;
    const description = document.getElementById('skill-description').value;
    const icon = document.getElementById('skill-icon').value;
    if (name && description && icon) {
        skills.push({
            name,
            description,
            icon,
            experience: 0,
            level: 1,
            effects: []
        });
        saveSkills();
        renderSkills();
        hideAddSkillForm();
    }
}

function addEffect(index) {
    const effectName = prompt('Enter effect name:');
    if (effectName) {
        skills[index].effects.push({ name: effectName, progress: 0 });
        saveSkills();
        renderSkills();
    }
}

function renameEffect(skillIndex, effectIndex) {
    const newName = prompt('Enter new effect name:');
    if (newName) {
        skills[skillIndex].effects[effectIndex].name = newName;
        saveSkills();
        renderSkills();
    }
}

function showAddSkillForm() {
    document.getElementById('add-skill-form').classList.remove('hidden');
}

function hideAddSkillForm() {
    document.getElementById
