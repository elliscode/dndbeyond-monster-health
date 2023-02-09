const healthLabel = Array.from(document.querySelectorAll('span.mon-stat-block__attribute-label')).find(element => element.innerText.includes('Hit Points'));
const healthValueSpan = healthLabel.nextElementSibling.querySelector('span.mon-stat-block__attribute-data-value');
const parsedHealth = parseInt(healthValueSpan.innerText);
const title = document.querySelector('h1.page-title');
const intRegex = /^[-]*\d+$/;
// https://stackoverflow.com/a/7616484/9313980
const hashCode = (input) => {
    var hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
        chr = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
const colors = [
    'monster-health-red',
    'monster-health-blue',
    'monster-health-green',
    'monster-health-brown',
    'monster-health-purple',
    'monster-health-pink',
    'monster-health-yellow'
];
const pageTitle = 'monster-health-data-' + hashCode(title.innerHTML);
const div = document.createElement('div');
div.classList.add('monster-health-container');
document.body.appendChild(div);
const addButton = document.createElement('button');
addButton.classList.add('monster-health-add-another-button');
addButton.innerHTML = '&plus;';
div.appendChild(addButton);
let healthBars = [];
const loadFromLocalStorage = () => {
    try {
        const storedValue = JSON.parse(localStorage.getItem(pageTitle));
        if (Array.isArray(storedValue) && storedValue.length > 0) {
            let goodData = [];
            for (const item of storedValue) {
                if (item.hasOwnProperty('current') && intRegex.exec(item.current)) {
                    goodData.push(item)
                }
            }
            if (goodData) {
                return goodData;
            }
        }
    } catch (e) {
        localStorage.removeItem(pageTitle)
    }
    return [];
};
healthBars = loadFromLocalStorage();
const add = (event) => {
    let parent = event.target;
    while (parent && !parent.classList.contains('monster-health-block')) {
        parent = parent.parentElement;
    }
    const currentHealth = parent.getElementsByClassName('monster-health-current-health')[0];
    const value = parseInt(currentHealth.value);
    const change = parent.getElementsByClassName('monster-health-change-health')[0];
    const modifier = parseInt(change.value);
    if (isFinite(modifier)) {
        const newValue = value + modifier;
        currentHealth.value = newValue;
        save();
    }
    change.value = '';
};
const remove = (event) => {
    let parent = event.target;
    while (parent && !parent.classList.contains('monster-health-block')) {
        parent = parent.parentElement;
    }
    const currentHealth = parent.getElementsByClassName('monster-health-current-health')[0];
    const value = parseInt(currentHealth.value);
    const change = parent.getElementsByClassName('monster-health-change-health')[0];
    const modifier = parseInt(change.value);
    if (isFinite(modifier)) {
        const newValue = value - modifier;
        currentHealth.value = newValue;
        save();
    }
    change.value = '';
};
const deleteHealthBlock = (event) => {
    let parent = event.target;
    while (parent && !parent.classList.contains('monster-health-block')) {
        parent = parent.parentElement;
    }
    parent.remove();
    save();
};
const numbersOnly = (event) => {
    const newValue = event.target.value;
    const cleanValue = newValue.replace(/[^\-0-9]/g,'');
    const startsWithNegative = cleanValue.startsWith('-');
    const doubleCleanValue = cleanValue.replace(/[^0-9]/g,'');
    event.target.value = (startsWithNegative ? '-' : '') + doubleCleanValue;
    save();
};
let saveTimeout = undefined;
const save = (e) => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(actuallySave, 1000);
};
const actuallySave = () => {
    let saveTheseBlocks = [];
    const blocks = document.querySelectorAll('div.monster-health-block');
    for (const block of blocks) {
        const inputs = block.getElementsByClassName('monster-health-current-health');
        if (inputs && inputs.length == 1) {
            const input = inputs[0];
            let value = 0;
            if (intRegex.exec(input.value)) {
                value = parseInt(input.value);
            }
            let color = '';
            const button = block.getElementsByClassName('monster-health-item-indicator')[0];
            for(const classItem of Array.of(...button.classList)) {
                if(colors.includes(classItem)) {
                    color = classItem;
                    break;
                }
            }
            saveTheseBlocks.push({ 'current': value, 'color': color });
        }
    }
    localStorage.setItem(pageTitle, JSON.stringify(saveTheseBlocks));
};
const generateMonsterHealth = (event, healthBar) => {
    if (!healthBar) {
        healthBar = { 'current': parsedHealth };
    }
    const index = document.getElementsByClassName('monster-health-block').length;
    const healthDiv = document.createElement('div');
    healthDiv.classList.add('monster-health-block');
    {
        const p = document.createElement('p');
        p.innerText = 'MAX';
        p.classList.add('monster-health-total-health-label')
        healthDiv.appendChild(p);
    }
    {
        const p = document.createElement('p');
        p.innerText = parsedHealth;
        p.classList.add('monster-health-total-health')
        healthDiv.appendChild(p);
    }
    {
        const p = document.createElement('p');
        p.innerText = 'CURRENT';
        p.classList.add('monster-health-current-health-label')
        healthDiv.appendChild(p);
    }
    {
        const input = document.createElement('input');
        input.innerText = parsedHealth;
        input.classList.add('monster-health-current-health')
        input.value = healthBar.current;
        input.addEventListener('input', numbersOnly);
        input.addEventListener('change', numbersOnly);
        healthDiv.appendChild(input);
    }
    {
        const button = document.createElement('button');
        button.innerText = 'HEAL';
        button.classList.add('monster-health-add-button');
        button.addEventListener('click', add);
        healthDiv.appendChild(button);
    }
    {
        const input = document.createElement('input');
        input.innerText = parsedHealth;
        input.classList.add('monster-health-change-health');
        input.addEventListener('input', numbersOnly);
        input.addEventListener('change', numbersOnly);
        healthDiv.appendChild(input);
    }
    {
        const button = document.createElement('button');
        button.innerText = 'DAMAGE';
        button.classList.add('monster-health-remove-button')
        button.addEventListener('click', remove);
        healthDiv.appendChild(button);
    }
    {
        const button = document.createElement('button');
        button.innerHTML = '&times;';
        button.classList.add('monster-health-delete-bar')
        button.addEventListener('click', deleteHealthBlock);
        healthDiv.appendChild(button);
    }
    {
        const button = document.createElement('button');
        button.classList.add('monster-health-item-indicator');
        if(healthBar.hasOwnProperty('color') && colors.includes(healthBar.color)) {
            button.classList.add(healthBar.color);
        } else {
            button.classList.add(colors[index % colors.length]);
        }
        button.addEventListener('click', showColorSelector);
        healthDiv.appendChild(button);
    }
    div.appendChild(healthDiv);
    save();
};
const closeColorSelector = (event) => {
    let picker = document.getElementById('monster-health-color-picker');
    if(picker) {
        picker.remove();
    }
};
const showColorSelector = (event) => {
    const right = (window.innerWidth - event.x) + 'px'
    const top = event.y + 'px';
    let picker = document.getElementById('monster-health-color-picker');
    if(picker) {
        picker.remove();
    }
    picker = document.createElement('div');
    picker.id = 'monster-health-color-picker';
    picker.style.top = top;
    picker.style.right = right;

    {
        const button = document.createElement('button');
        button.innerHTML = '&times;';
        button.classList.add('monster-health-delete-bar')
        button.addEventListener('click', closeColorSelector);
        picker.appendChild(button);
    }

    for(const color of colors) {
        const button = document.createElement('button');
        button.classList.add('monster-health-color-button')
        button.classList.add(color);
        button.addEventListener('click', function () { changeColor(event.target, color); });
        picker.appendChild(button);
    }
    
    document.body.appendChild(picker);
};
const changeColor = (button, color) => {
    closeColorSelector();
    for(const classItem of Array.of(...button.classList)) {
        if(colors.includes(classItem)) {
            button.classList.remove(classItem);
            index = colors.indexOf(classItem);
            break;
        }
    }
    button.classList.add(color);
    save();
};
addButton.addEventListener('click', generateMonsterHealth);
if (healthBars.length == 0) {
    healthBars.push({ 'current': parsedHealth });
};
for (const healthBar of healthBars) {
    generateMonsterHealth(undefined, healthBar);
};
