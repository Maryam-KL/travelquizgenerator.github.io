/* ============================================================
   contact.js — haalt contactgegevens op via de Fetch API
   en toont ze in een geanimeerde glas-kaart (GSAP)
   ============================================================ */

const DATA_SOURCES = {
    sport:   'https://dvg-2526-webscripting.github.io/webscripting-eindopdracht-api/assets/contact-1.json',
    voeding: 'https://dvg-2526-webscripting.github.io/webscripting-eindopdracht-api/assets/contact-2.json',
    mentaal: 'https://dvg-2526-webscripting.github.io/webscripting-eindopdracht-api/assets/contact-3.json'
};

const ACCENT = {
    sport: 'var(--c-sport)',
    voeding: 'var(--c-voeding)',
    mentaal: 'var(--c-mentaal)'
};

const DAY_KEYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const DAY_ORDER = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const DAY_LABELS = {
    maandag: 'Maandag', dinsdag: 'Dinsdag', woensdag: 'Woensdag', donderdag: 'Donderdag',
    vrijdag: 'Vrijdag', zaterdag: 'Zaterdag', zondag: 'Zondag'
};

const card = document.getElementById('contactCard');
const chips = Array.from(document.querySelectorAll('.chip'));
const indicator = document.querySelector('.chip-indicator');
const accentWord = document.querySelector('[data-word]');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cache = {};

/* ---------- kleine helpers ---------- */

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function getStatus(openingsuren) {
    const now = new Date();
    const todayKey = DAY_KEYS[now.getDay()];
    const todayHours = (openingsuren && openingsuren[todayKey]) || 'gesloten';

    if (todayHours.toLowerCase() === 'gesloten') {
        return { open: false, label: 'Nu gesloten' };
    }

    const [start, end] = todayHours.split('-').map(s => s.trim());
    const toMinutes = t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const isOpen = nowMinutes >= toMinutes(start) && nowMinutes <= toMinutes(end);

    return { open: isOpen, label: isOpen ? 'Nu open' : 'Nu gesloten' };
}

const SOCIAL_ICONS = {
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.9 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.3-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.9a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.9z"/></svg>'
};

const FIELD_ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6 8 7 8-7"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>'
};

/* ---------- rendering ---------- */

function buildSkeleton() {
    card.innerHTML = `
        <div class="card-bar" style="transform:scaleX(1); background:rgba(255,255,255,0.15);"></div>
        <div class="card-skeleton">
            <div class="skel-row">
                <div class="skel-avatar"></div>
                <div style="flex:1; display:grid; gap:.5rem;">
                    <div class="skel-line w-60" style="height:18px;"></div>
                    <div class="skel-line w-40"></div>
                </div>
            </div>
            <div class="skel-line w-80"></div>
            <div class="skel-line w-60"></div>
            <div class="skel-line w-80"></div>
        </div>
    `;
    const skelLines = card.querySelectorAll('.skel-line, .skel-avatar');
    if (!reduceMotion) {
        gsap.to(skelLines, { opacity: 0.35, duration: 0.7, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.05 });
    }
}

function buildError(cat) {
    card.innerHTML = `
        <div class="card-bar" style="transform:scaleX(1); background:hsl(6,70%,55%);"></div>
        <div class="card-error">
            <h2 class="card-name">Gegevens niet beschikbaar</h2>
            <p>De contactgegevens konden niet worden opgehaald. Controleer je internetverbinding en probeer opnieuw.</p>
            <button class="retry-btn" type="button" data-retry="${cat}">Opnieuw proberen</button>
        </div>
    `;
    card.querySelector('[data-retry]').addEventListener('click', () => loadCategory(cat, true));
}

function buildCard(data, cat) {
    const status = getStatus(data.openingsuren);
    const socials = Object.entries(data.sociale_media || {}).filter(([, url]) => url);

    const hoursRows = DAY_ORDER.map(k => {
        const isToday = k === DAY_KEYS[new Date().getDay()];
        const hours = (data.openingsuren && data.openingsuren[k]) || '—';
        return `<li class="${isToday ? 'is-today' : ''}"><span>${DAY_LABELS[k]}</span><span>${escapeHTML(hours)}</span></li>`;
    }).join('');

    const socialLinks = socials.map(([key, url]) => `
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener" aria-label="${escapeHTML(data.naam)} op ${key}">
            ${SOCIAL_ICONS[key] || ''}
        </a>
    `).join('');

    card.innerHTML = `
        <div class="card-bar" style="background:${ACCENT[cat]}"></div>
        <div class="card-top">
            <img class="card-logo" src="${escapeHTML(data.logo_url)}" alt="Logo van ${escapeHTML(data.naam)}">
            <div>
                <h2 class="card-name">${escapeHTML(data.naam)}</h2>
                <p class="card-person">${escapeHTML(data.contactpersoon?.naam)} — ${escapeHTML(data.contactpersoon?.functie)}</p>
            </div>
            <span class="status-badge ${status.open ? 'is-open' : 'is-closed'}">
                <span class="status-dot"></span><span class="status-text">${status.label}</span>
            </span>
        </div>

        <dl class="card-data">
            <div class="data-row">
                <dt>${FIELD_ICONS.pin} Adres</dt>
                <dd>${escapeHTML(data.adres?.straat)} ${escapeHTML(data.adres?.nummer)}, ${escapeHTML(data.adres?.postcode)} ${escapeHTML(data.adres?.stad)}</dd>
            </div>
            <div class="data-row">
                <dt>${FIELD_ICONS.phone} Telefoon</dt>
                <dd><a href="tel:${escapeHTML(data.telefoon).replace(/\s/g, '')}">${escapeHTML(data.telefoon)}</a></dd>
            </div>
            <div class="data-row">
                <dt>${FIELD_ICONS.mail} E-mail</dt>
                <dd><a href="mailto:${escapeHTML(data.email)}">${escapeHTML(data.email)}</a></dd>
            </div>
            <div class="data-row">
                <dt>${FIELD_ICONS.globe} Website</dt>
                <dd><a href="${escapeHTML(data.website)}" target="_blank" rel="noopener">${escapeHTML((data.website || '').replace(/^https?:\/\//, ''))}</a></dd>
            </div>
        </dl>

        <details class="card-hours">
            <summary><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg> Openingsuren</summary>
            <ul class="hours-list">${hoursRows}</ul>
        </details>

        ${socialLinks ? `<div class="card-social">${socialLinks}</div>` : ''}
    `;
}

/* ---------- GSAP: kaartovergang ---------- */

function animateCardOut() {
    return new Promise(resolve => {
        if (reduceMotion) return resolve();
        gsap.to(card, { opacity: 0, y: -10, duration: 0.2, ease: 'power1.in', onComplete: resolve });
    });
}

function animateCardIn() {
    gsap.set(card, { opacity: 1, y: 0 });
    if (reduceMotion) return;

    const bar = card.querySelector('.card-bar');
    const logo = card.querySelector('.card-logo');
    const rows = card.querySelectorAll('.card-top > *:not(.card-logo), .data-row, .card-hours, .card-social, .card-error > *');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' });
    if (logo) tl.fromTo(logo, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, '-=0.3');
    if (rows.length) tl.fromTo(rows, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 }, '-=0.25');
}

function moveIndicator(chip, animate = true) {
    if (!indicator || !chip) return;
    const target = { x: chip.offsetLeft, width: chip.offsetWidth };
    if (animate && !reduceMotion) {
        gsap.to(indicator, { ...target, duration: 0.45, ease: 'power3.inOut' });
    } else {
        gsap.set(indicator, target);
    }
}

/* ---------- data ophalen ---------- */

async function loadCategory(cat, forceReload = false) {
    document.documentElement.style.setProperty('--accent', ACCENT[cat]);
    if (accentWord) accentWord.textContent = cat;

    if (!forceReload && cache[cat]) {
        await animateCardOut();
        buildCard(cache[cat], cat);
        animateCardIn();
        return;
    }

    await animateCardOut();
    buildSkeleton();
    gsap.set(card, { opacity: 1, y: 0 });

    try {
        const response = await fetch(DATA_SOURCES[cat]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        cache[cat] = data;
        buildCard(data, cat);
        animateCardIn();
    } catch (err) {
        console.error('Kon contactgegevens niet ophalen:', err);
        buildError(cat);
        animateCardIn();
    }
}

/* ---------- chip-events ---------- */

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        chips.forEach(c => c.setAttribute('aria-selected', String(c === chip)));
        moveIndicator(chip);

        const url = new URL(window.location);
        url.searchParams.set('categorie', cat);
        window.history.replaceState({}, '', url);

        loadCategory(cat);
    });
});

window.addEventListener('resize', () => {
    const active = chips.find(c => c.getAttribute('aria-selected') === 'true');
    moveIndicator(active, false);
});

/* ---------- zwevende achtergrond-blobs ---------- */

function animateBlobs() {
    if (reduceMotion) return;
    document.querySelectorAll('.contact-blob').forEach((blob, i) => {
        gsap.to(blob, {
            x: (i % 2 === 0 ? 1 : -1) * gsap.utils.random(30, 70),
            y: gsap.utils.random(-40, 40),
            duration: gsap.utils.random(7, 11),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.4
        });
    });
}

/* ---------- hero-intro ---------- */

function animateHero() {
    const eyebrow = document.querySelector('[data-anim="eyebrow"]');
    const heading = document.querySelector('[data-anim="heading"]');
    const lead = document.querySelector('[data-anim="lead"]');
    const extras = document.querySelectorAll('[data-anim="extra"]');

    if (reduceMotion) {
        gsap.set([eyebrow, heading, lead, ...extras], { clearProps: 'all' });
        return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.5 });
    tl.from(heading, { opacity: 0, y: 22, duration: 0.65 }, '-=0.25');
    if (lead) tl.from(lead, { opacity: 0, y: 16, duration: 0.5 }, '-=0.35');
    if (extras.length) tl.from(extras, { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, '-=0.3');
}

/* ---------- init ---------- */

document.addEventListener('DOMContentLoaded', () => {
    animateHero();
    animateBlobs();

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('categorie');
    const initialCat = DATA_SOURCES[requested] ? requested : 'sport';
    const initialChip = chips.find(c => c.dataset.cat === initialCat) || chips[0];

    chips.forEach(c => c.setAttribute('aria-selected', String(c === initialChip)));
    moveIndicator(initialChip, false);
    loadCategory(initialCat);
});



