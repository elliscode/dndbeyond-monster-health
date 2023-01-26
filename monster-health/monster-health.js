const healthLabel = Array.from(document.querySelectorAll('span.mon-stat-block__attribute-label')).find(element=>element.innerText.includes('Hit Points'));
const healthValueSpan = healthLabel.nextElementSibling.querySelector('span.mon-stat-block__attribute-data-value');
const parsedHealth = parseInt(healthValueSpan.innerText);
const div = document.createElement('div');
const add = (e) => {
    const currentHealth = document.querySelector('.monster-health-current-health');
    const value = parseInt(currentHealth.value);
    const change = document.querySelector('.monster-health-change-health');
    const modifier = parseInt(change.value);
    const newValue = value + modifier;
    currentHealth.value = newValue;
    change.value = '';
};
const remove = (e) => {
    const currentHealth = document.querySelector('.monster-health-current-health');
    const value = parseInt(currentHealth.value);
    const change = document.querySelector('.monster-health-change-health');
    const modifier = parseInt(change.value);
    const newValue = value - modifier;
    currentHealth.value = newValue;
    change.value = '';
};
const numbersOnly = (e) => {
    if(/^\d$/.exec(e.key)) {

    } else {
        e.preventDefault();
    }
};
{
    const p = document.createElement('p');
    p.innerText = 'MAX';
    p.classList.add('monster-health-total-health-label')
    div.appendChild(p);
}
{
    const p = document.createElement('p');
    p.innerText = parsedHealth;
    p.classList.add('monster-health-total-health')
    div.appendChild(p);
}
{
    const p = document.createElement('p');
    p.innerText = 'CURRENT';
    p.classList.add('monster-health-current-health-label')
    div.appendChild(p);
}
{
    const input = document.createElement('input');
    input.innerText = parsedHealth;
    input.classList.add('monster-health-current-health')
    input.value = parsedHealth;
    input.addEventListener('keypress', numbersOnly);
    div.appendChild(input);
}
{
    const button = document.createElement('button');
    button.innerText = 'HEAL';
    button.classList.add('monster-health-add-button');
    button.addEventListener('click', add);
    div.appendChild(button);
}
{
    const input = document.createElement('input');
    input.innerText = parsedHealth;
    input.classList.add('monster-health-change-health');
    input.addEventListener('keypress', numbersOnly);
    div.appendChild(input);
}
{
    const button = document.createElement('button');
    button.innerText = 'DAMAGE';
    button.classList.add('monster-health-remove-button')
    button.addEventListener('click', remove);
    div.appendChild(button);
}
div.classList.add('monster-health-addon-health');
document.body.appendChild(div);
