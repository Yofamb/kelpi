import { COUNTRIES, flagEmoji } from './countries.js';

const api = window.kelpi;
await api.ready;
const $ = (id) => document.getElementById(id);
const id = 'example.geo-trainer';

let stats = { streak: 0, bestStreak: 0, total: 0, correct: 0, misses: {} };
let current = null; // { country, type, options, answered }

function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Weighted toward countries you've missed before — the "trainer" in Geo Trainer. */
function pickCountry() {
    const weights = COUNTRIES.map((country) => 1 + (stats.misses[country.code] ?? 0) * 2);
    const total = weights.reduce((sum, w) => sum + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < COUNTRIES.length; i++) {
        r -= weights[i];
        if (r <= 0) return COUNTRIES[i];
    }
    return COUNTRIES[COUNTRIES.length - 1];
}

/** Distractors preferentially from the same confusion cluster (Kenya/Tanzania/Uganda, etc.). */
function pickDistractors(country) {
    const sameRegion = shuffle(COUNTRIES.filter((c) => c.region === country.region && c.code !== country.code));
    const others = shuffle(COUNTRIES.filter((c) => c.region !== country.region && c.code !== country.code));
    return [...sameRegion, ...others].slice(0, 3);
}

async function nextQuestion() {
    const settings = await api.settings.get();
    const mode = settings.mode ?? 'mixed';
    const country = pickCountry();
    const type = mode === 'flags' ? 'flag' : mode === 'tells' ? 'tell' : Math.random() < 0.5 ? 'flag' : 'tell';
    const options = shuffle([country, ...pickDistractors(country)]);
    current = { country, type, options, answered: false };
    render();
}

function render() {
    const stimulus = $('stimulus');
    stimulus.textContent = current.type === 'flag' ? flagEmoji(current.country.code) : current.country.tell;
    stimulus.className = current.type === 'flag' ? 'stimulus flag' : 'stimulus tell';

    const grid = $('options');
    grid.replaceChildren();
    for (const option of current.options) {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.onclick = () => choose(option);
        grid.append(button);
    }

    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('next').hidden = true;
    updateStatsLine();
}

async function choose(option) {
    if (current.answered) return;
    current.answered = true;
    const correct = option.code === current.country.code;

    for (const button of $('options').children) {
        const match = current.options.find((o) => o.name === button.textContent);
        if (match?.code === current.country.code) button.classList.add('correct');
        else if (match === option) button.classList.add('wrong');
        button.disabled = true;
    }

    const flag = flagEmoji(current.country.code);
    $('feedback').textContent = correct
        ? `Correct — ${flag} ${current.country.name}. ${current.country.tell}`
        : `Not quite — that was ${flag} ${current.country.name}. ${current.country.tell}`;
    $('feedback').className = correct ? 'feedback correct' : 'feedback wrong';
    $('next').hidden = false;

    stats = await api.commands.execute(`${id}.record`, { code: current.country.code, correct });
    updateStatsLine();
}

function updateStatsLine() {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    $('stats').textContent = `streak ${stats.streak} · best ${stats.bestStreak} · ${stats.correct}/${stats.total} (${accuracy}%)`;
}

$('next').onclick = () => nextQuestion();
$('reset').onclick = async () => {
    stats = await api.commands.execute(`${id}.reset`);
    await nextQuestion();
};
api.events.on('settings.changed', (event) => {
    if (event.pluginID === id && current?.answered !== false) void nextQuestion();
});

stats = await api.commands.execute(`${id}.stats`);
await nextQuestion();
