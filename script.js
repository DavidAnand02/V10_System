const milestones = [10, 50, 100, 200]; // Example milestone thresholds
let skills = JSON.parse(localStorage.getItem('skills')) || [];

function renderSkills() {
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '';
    skills.forEach((skill, index) => {
        skillList.innerHTML += `
            <div class="skill-card" onclick="toggleSkillDetails(${index})">
                <h2><i class="fas fa-brain"></i> ${skill.name}</h2>
                <div id="skill-details-${index}" class="hidden" onclick="event.stopPropagation()">
                    <p>Experience: <span id="experience-${index}">${skill.experience}</span> points</p>
                    <p>Level: <span id="level-${index}">${skill.level}</span></p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="experience-bar-${index}"></div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="level-progress-bar-${index}"></div>
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
                    <button onclick="addExperience(${index}, 1)">Add 1 Hour</button>
                    <button onclick="addExperience(${index}, 0.5)">Add 30 Minutes</button>
                    <button onclick="removeExperience(${index}, 1)">Remove 1 Hour</button>
                    <button onclick="removeExperience(${index}, 0.5)">Remove 30 Minutes</button>
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
    checkMilestones(index);
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
}

function updateProgressBarElement(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function getLevelExperience(level) {
    return Math.pow(level / 100, 2) * 10000;
}

function checkMilestones(index) {
    let skill = skills[index];
    for (let milestone of milestones) {
        if (skill.experience >= milestone) {
            alert(`Milestone reached: ${milestone} experience points!`);
        }
    }
}

function saveSkills() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

function loadSkills() {
    renderSkills();
}

function showAddSkillForm() {
    document.getElementById('add-skill-form').classList.remove('hidden');
}

function hideAddSkillForm() {
    document.getElementById('add-skill-form').classList.add('hidden');
}

function addSkill() {
    const name = document.getElementById('skill-name').value;
    const description = document.getElementById('skill-description').value;
    if (name && description) {
        skills.push({
            name,
            description,
            experience: 0,
            level: 1
        });
        saveSkills();
        renderSkills();
        hideAddSkillForm();
    }
}

document.addEventListener('DOMContentLoaded', loadSkills);
