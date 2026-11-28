// Llançadora: llegeix jocs/jocs.json i pinta una targeta per joc.
const VERSIO_APP = '0.55.4';

// Categories dels jocs (camp "categories" de jocs.json)
const CATEGORIES = { xifres: '🔢 Xifres', lletres: '🔤 Lletres' };
let jocs = [];
let filtre = 'tots';
try { filtre = localStorage.getItem('appjocs.filtre') || 'tots'; } catch {}
if (!(filtre in CATEGORIES)) filtre = 'tots';

async function carregarJocs() {
  const llista = document.getElementById('llista-jocs');
  try {
    const resposta = await fetch('jocs/jocs.json', { cache: 'no-cache' });
    jocs = (await resposta.json()).filter(j => j.estat !== 'ocult').sort((a, b) => (a.num || 999) - (b.num || 999));
    pintarJocs();
  } catch (e) {
    console.error(e);
    llista.innerHTML = '<li class="buit">No s\'han pogut carregar els jocs.</li>';
  }
}

// Text sense accents ni majúscules, per buscar "piramide" i trobar "Piràmide"
const normal = t => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function pintarJocs() {
  const llista = document.getElementById('llista-jocs');
  const text = normal(document.getElementById('cerca').value.trim());
  document.getElementById('netejar-filtres').hidden = !text && filtre === 'tots';
  pintarRecents();
  // Si s'escriu un número («7») es busca el joc amb aquest número
  const num = /^\d+$/.test(text) ? Number(text) : null;
  const visibles = jocs.filter(j =>
    (filtre === 'tots' || (j.categories || []).includes(filtre)) &&
    (!text || (num !== null ? j.num === num
      : normal([j.nom, j.descripcio, j.objectiu, ...(j.categories || []).map(c => CATEGORIES[c])].join(' ')).includes(text))));

  llista.innerHTML = '';
  clearInterval(rellotgeT);
  // Ou de Pasqua: si es busca «hora», surt un rellotge (amb agulles i en números) en lloc dels jocs
  if (['hora', 'quina hora es', 'quina hora es?', 'hora?', 'rellotge'].includes(text)) return pintarRellotge(llista);
  if (text === 'gat') gatPasseja();
  if (!visibles.length) {
    const li = document.createElement('li');
    li.className = 'buit';
    li.textContent = !jocs.length ? 'Encara no hi ha jocs. Aviat!'
      : text ? `No hi ha cap joc amb «${document.getElementById('cerca').value.trim()}».` : 'No hi ha cap joc d\'aquest tipus.';
    llista.appendChild(li);
    return;
  }
  for (const joc of visibles) llista.appendChild(crearTargeta(joc));
  ajustarNomsTargetes();
}
// Una paraula massa llarga per a la targeta (p. ex. «DESORDENADES» a 360 px): la lletra d'aquell nom s'encongeix (v0.55.2)
function ajustarNomsTargetes() {
  document.querySelectorAll('#llista-jocs .targeta h2').forEach(h => {
    h.style.fontSize = '';
    const base = parseFloat(getComputedStyle(h).fontSize);
    for (let f = .95; f >= .7 && h.scrollWidth > h.clientWidth + 1; f -= .05) h.style.fontSize = (base * f).toFixed(1) + 'px';
  });
}
addEventListener('resize', () => requestAnimationFrame(ajustarNomsTargetes));

// ---------------- Ous de Pasqua: el rellotge i el gat ----------------
let rellotgeT = null;
function pintarRellotge(llista) {
  const li = document.createElement('li');
  li.className = 'rellotge-ou';
  const marques = Array.from({ length: 12 }, (_, i) => {
    const a = i * Math.PI / 6, n = i || 12;
    return `<line x1="${50 + 40 * Math.sin(a)}" y1="${50 - 40 * Math.cos(a)}" x2="${50 + 44 * Math.sin(a)}" y2="${50 - 44 * Math.cos(a)}"/>`
      + `<text x="${50 + 33 * Math.sin(a)}" y="${50 - 33 * Math.cos(a) + 3.5}">${n}</text>`;
  }).join('');
  li.innerHTML = `<svg viewBox="0 0 100 100" class="rl-cara" aria-hidden="true"><circle cx="50" cy="50" r="47"/>${marques}
    <line class="rl-hora" x1="50" y1="50" x2="50" y2="28"/><line class="rl-minut" x1="50" y1="50" x2="50" y2="16"/><line class="rl-segon" x1="50" y1="54" x2="50" y2="14"/><circle class="rl-centre" cx="50" cy="50" r="2.5"/></svg>
    <p class="rl-text" aria-live="off"></p>`;
  llista.appendChild(li);
  const posar = () => {
    const d = new Date(), h = d.getHours(), m = d.getMinutes(), sg = d.getSeconds();
    li.querySelector('.rl-hora').setAttribute('transform', `rotate(${(h % 12) * 30 + m / 2} 50 50)`);
    li.querySelector('.rl-minut').setAttribute('transform', `rotate(${m * 6 + sg / 10} 50 50)`);
    li.querySelector('.rl-segon').setAttribute('transform', `rotate(${sg * 6} 50 50)`);
    li.querySelector('.rl-text').innerHTML = `🕒 ${h === 1 ? 'És la' : 'Són les'} <b>${h}:${String(m).padStart(2, '0')}</b>`;
  };
  posar();
  rellotgeT = setInterval(() => { if (li.isConnected) posar(); else clearInterval(rellotgeT); }, 1000);
}
// Escriure «gat» (al buscador o amb el teclat, a qualsevol lloc de la pantalla d'inici): un gat negre petit surt a dalt a l'esquerra,
// avança saltant, diu «miau!» i torna enrere
let lletresGat = '';
const GAT_SVG = `<svg viewBox="0 0 64 48" width="44" height="33" aria-hidden="true">
  <path d="M10 30 C2 28 2 14 9 12" fill="none" stroke="#1f1b2d" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="27" cy="30" rx="17" ry="10" fill="#1f1b2d"/>
  <rect x="14" y="34" width="5" height="12" rx="2.5" fill="#1f1b2d"/><rect x="22" y="35" width="5" height="11" rx="2.5" fill="#1f1b2d"/>
  <rect x="32" y="35" width="5" height="11" rx="2.5" fill="#1f1b2d"/><rect x="39" y="34" width="5" height="12" rx="2.5" fill="#1f1b2d"/>
  <circle cx="47" cy="19" r="11" fill="#1f1b2d"/>
  <path d="M38 13 L39 1 L46 9 Z M48 9 L56 1 L57 13 Z" fill="#1f1b2d"/>
  <ellipse cx="45" cy="18" rx="2.3" ry="3" fill="#FDFFB6"/><ellipse cx="53" cy="18" rx="2.3" ry="3" fill="#FDFFB6"/>
  <circle cx="45.6" cy="18.6" r="1.1" fill="#1f1b2d"/><circle cx="53.6" cy="18.6" r="1.1" fill="#1f1b2d"/>
  <path d="M49 22.5 l-1.4 1.6 h2.8 z" fill="#FFADAD"/>
</svg>`;
function gatPasseja() {
  if (document.querySelector('.gat-passeja')) return;
  const g = document.createElement('div');
  g.className = 'gat-passeja';
  g.setAttribute('aria-hidden', 'true');
  // Gat dibuixat (mira a la dreta): l'emoji 🐈‍⬛ mira a un costat diferent segons el sistema i podia anar d'esquenes
  g.innerHTML = '<span class="gp-miau">miau!</span><span class="gp-cos"><span class="gp-gat">' + GAT_SVG + '</span></span>';
  document.body.appendChild(g);
  g.addEventListener('animationend', e => { if (e.target === g) g.remove(); });
  setTimeout(() => g.remove(), 12000);
}
document.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea') || e.key.length !== 1) return;
  lletresGat = (lletresGat + e.key.toLowerCase()).slice(-3);
  if (lletresGat === 'gat') { lletresGat = ''; gatPasseja(); }
});

// «Hi vas jugar fa poc»: els 3 darrers jocs començats. Només sense cerca ni filtre, perquè no molesti quan es busca
function pintarRecents() {
  const sec = document.getElementById('recents');
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem('appjocs.recents') || '[]'); } catch {}
  const r = (Array.isArray(ids) ? ids : []).map(id => jocs.find(j => j.id === id && j.estat !== 'properament')).filter(Boolean);
  const cercant = document.getElementById('cerca').value.trim() || filtre !== 'tots';
  sec.hidden = !r.length || !!cercant;
  const ul = document.getElementById('llista-recents');
  ul.innerHTML = '';
  for (const joc of r) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'recent';
    a.href = `jocs/${joc.id}/`;
    a.innerHTML = '<span class="icona" aria-hidden="true"></span><span class="nom"></span><span class="num"></span>';
    a.querySelector('.icona').textContent = joc.icona || '🎲';
    a.querySelector('.nom').textContent = joc.nom;
    a.querySelector('.num').textContent = joc.num || '';
    a.querySelector('.num').setAttribute('aria-label', `Joc ${joc.num}`);
    li.appendChild(a); ul.appendChild(li);
  }
}

function triarFiltre(f) {
  filtre = f;
  document.querySelectorAll('#filtres button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f));
  try { localStorage.setItem('appjocs.filtre', f); } catch {}
  pintarJocs();
}
document.getElementById('filtres').addEventListener('click', e => {
  const b = e.target.closest('button[data-f]'); if (b) triarFiltre(b.dataset.f);
});
document.getElementById('cerca').addEventListener('input', pintarJocs);
// Restaurar: tots els jocs i cerca buida
document.getElementById('netejar-filtres').addEventListener('click', () => {
  document.getElementById('cerca').value = '';
  triarFiltre('tots');
});
document.querySelectorAll('#filtres button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === filtre));

function crearTargeta(joc) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.className = 'targeta';
  a.href = `jocs/${joc.id}/`;
  if (joc.estat === 'properament') a.setAttribute('aria-disabled', 'true');

  a.innerHTML = `
    <span class="dalt"><span class="num"></span><span class="icona" aria-hidden="true"></span></span>
    <h2></h2>
    <p class="descripcio"></p>
    <span class="peu-targeta"><span class="categories"></span>${joc.estat === 'properament' ? '<span class="etiqueta">Properament</span>' : '<span class="jugar">Jugar →</span>'}</span>
  `;
  // textContent per evitar injectar HTML des del JSON
  a.querySelector('.icona').textContent = joc.icona || '🎲';
  a.querySelector('h2').textContent = joc.nom;
  a.querySelector('.descripcio').textContent = joc.descripcio || '';
  a.querySelector('.num').textContent = joc.num || '';
  a.querySelector('.num').setAttribute('aria-label', `Joc ${joc.num}`);
  a.querySelector('.categories').textContent = (joc.categories || []).map(c => CATEGORIES[c] || c).join(' · ');
  li.appendChild(a);
  return li;
}

// ---------------- Ou de Pasqua ----------------
// Tocar 5 cops seguits el títol «🧩 Juguem?» posa (o treu) un degradat lila → rosa als números de les targetes. Es recorda.
const CLAU_OU = 'appjocs.ou-pasqua';
try { if (localStorage.getItem(CLAU_OU) === '1') document.documentElement.classList.add('ou-pasqua'); } catch {}
let tocsOu = 0, ultimTocOu = 0;
document.querySelector('.capcalera h1').addEventListener('click', () => {
  const ara = Date.now();
  tocsOu = ara - ultimTocOu < 1200 ? tocsOu + 1 : 1;
  ultimTocOu = ara;
  if (tocsOu < 5) return;
  tocsOu = 0;
  const html = document.documentElement;
  const posat = html.classList.toggle('ou-pasqua');
  try { localStorage.setItem(CLAU_OU, posat ? '1' : '0'); } catch {}
  html.classList.remove('ou-pasqua-ara'); void html.offsetWidth; html.classList.add('ou-pasqua-ara');
  setTimeout(() => html.classList.remove('ou-pasqua-ara'), 700);
});

window.addEventListener('pageshow', e => { if (e.persisted && jocs.length) pintarRecents(); });

// Service worker (només funciona sota HTTPS o localhost)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW:', err));
  });
}

// ---------------- Instal·lació com a app ----------------
// Chrome/Edge (Android i PC) avisen amb 'beforeinstallprompt' només quan ho creuen oportú;
// iPad/iPhone no avisen mai. Per això mostrem sempre un avís amb els passos, i un botó directe si es pot.
let promptInstal = null;
const btnInstal = document.getElementById('btn-instal');
const avis = document.getElementById('avis-instal');
const ua = navigator.userAgent;
const esIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const esIOS = esIPad || /iPhone|iPod/.test(ua);
const esAndroid = /Android/.test(ua);
const jaInstal = () => window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const avisTancat = () => { try { return localStorage.getItem('appjocs.avis-instal-tancat') === '1'; } catch { return false; } };

const COMPARTIR = '<svg class="ico-compartir" viewBox="0 0 24 24" aria-label="Compartir" role="img"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function passos() {
  if (esIOS) {
    const esChrome = /CriOS/.test(ua), esAltre = /FxiOS|EdgiOS/.test(ua);
    const on = esChrome ? "a la barra d'adreces, a dalt a la dreta; si no hi és, obre el menú ··· i tria Compartir"
      : esAltre ? 'dins del menú del navegador'
      : esIPad ? 'a dalt a la dreta, o dins del menú ···' : 'a la barra de baix, o dins del menú ···';
    return [`Toca el botó <b>Compartir</b> ${COMPARTIR} <span class="on-es">(${on})</span>`,
      "Tria <b>«Afegeix a la pantalla d'inici»</b> (desplaça't cap avall si no el veus).",
      "Toca <b>Afegeix</b>. La icona de «Juguem?» apareixerà a l'última pàgina de la pantalla d'inici."];
  }
  if (esAndroid) {
    const esSamsung = /SamsungBrowser/.test(ua), esFirefox = /Firefox/.test(ua);
    return [esSamsung ? 'Toca el menú <b>☰</b> (a baix a la dreta).' : 'Toca el menú <b>⋮</b> (a dalt a la dreta).',
      esFirefox ? "Tria <b>«Instal·la»</b> o <b>«Afegeix a la pantalla d'inici»</b>."
        : "Tria <b>«Instal·la l'aplicació»</b> o <b>«Afegeix a la pantalla d'inici»</b>.",
      'Confirma amb <b>Instal·la</b>. La icona de «Juguem?» apareixerà amb les altres apps.'];
  }
  return null;   // PC: només el botó directe, si el navegador el dona
}

function pintarAvis() {
  pintarAvisSense();
}
function pintarAvisSense() {
  if (jaInstal() || avisTancat()) { avis.hidden = true; return; }
  const llista = passos();
  document.getElementById('avis-directe').hidden = !promptInstal;
  const ol = document.getElementById('passos-instal');
  ol.innerHTML = llista ? llista.map(t => `<li>${t}</li>`).join('') : '';
  ol.hidden = !llista || !!promptInstal;          // si hi ha botó directe, no calen els passos
  avis.hidden = !llista && !promptInstal;
}

async function installar() {
  if (!promptInstal) return;
  promptInstal.prompt();
  await promptInstal.userChoice;
  promptInstal = null;
  btnInstal.hidden = true;
  pintarAvis();
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  promptInstal = e;
  pintarAvis();
  btnInstal.hidden = !avis.hidden;   // si l'avís ja mostra el botó, no en cal un altre
});
window.addEventListener('appinstalled', () => { promptInstal = null; avis.hidden = true; btnInstal.hidden = true; });
btnInstal.addEventListener('click', installar);
document.getElementById('btn-instal-avis').addEventListener('click', installar);
document.getElementById('avis-tancar').addEventListener('click', () => {
  avis.hidden = true;
  try { localStorage.setItem('appjocs.avis-instal-tancat', '1'); } catch {}
  if (promptInstal) btnInstal.hidden = false;   // encara es pot installar amb el botó petit
});
pintarAvis();

// ---------------- Opcions (⚙️) ----------------
const finestraOp = document.getElementById('opcions');
let triaOp = {};
function pintarSalutacio() {
  const nom = Preferencies.nom();
  document.getElementById('subtitol').textContent = nom ? `Hola, ${nom}! Tria un minijoc per començar` : 'Tria un minijoc per començar';
}
function pintarSiNo() {
  finestraOp.querySelectorAll('.op-sino[data-clau]').forEach(g => g.querySelectorAll('button').forEach(b =>
    b.setAttribute('aria-pressed', (b.dataset.v === 'si') === triaOp[g.dataset.clau])));
  document.querySelectorAll('#op-aparenca button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === triaOp.aparenca));
}
function obrirOpcions() {
  const p = Preferencies.llegir();
  triaOp = { temps: p.temps !== false, errors: p.errors !== false, aparenca: Preferencies.aparenca() };
  document.getElementById('op-nom').value = p.nom || '';
  pintarSiNo();
  finestraOp.hidden = false;
  document.documentElement.classList.add('fe-oberta');   // la pàgina del darrere no es mou
  setTimeout(() => document.getElementById('op-nom').focus(), 50);
}
function tancarOpcions() {
  Preferencies.aplicarAparenca();   // si s'ha cancel·lat, torna a l'aparença desada
  finestraOp.hidden = true;
  document.documentElement.classList.remove('fe-oberta');
  document.getElementById('btn-opcions').focus();
}
document.getElementById('btn-opcions').addEventListener('click', obrirOpcions);
document.getElementById('op-cancela').addEventListener('click', tancarOpcions);
finestraOp.addEventListener('click', e => { if (e.target === finestraOp) tancarOpcions(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !finestraOp.hidden) tancarOpcions(); });
finestraOp.querySelectorAll('.op-sino[data-clau]').forEach(g => g.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  triaOp[g.dataset.clau] = b.dataset.v === 'si'; pintarSiNo();
}));
// Aparença: es veu de seguida (si es cancel·la, es desfà)
document.getElementById('op-aparenca').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  triaOp.aparenca = b.dataset.v; pintarSiNo(); Preferencies.aplicarAparenca(triaOp.aparenca);
});
document.getElementById('form-opcions').addEventListener('submit', e => {
  e.preventDefault();
  Preferencies.desar({ nom: document.getElementById('op-nom').value, ...triaOp });
  pintarSalutacio();
  tancarOpcions();
});
pintarSalutacio();

document.getElementById('versio').textContent = `v${VERSIO_APP}`;

// Un altre ou de Pasqua: dos tocs seguits a la versió → ❤️ (3 s) i després un gat negre 🐈‍⬛ (1 s)
(() => {
  const v = document.getElementById('versio');
  let ultim = 0, enMarxa = false;
  v.addEventListener('click', () => {
    const ara = Date.now();
    const doble = ara - ultim < 450;
    ultim = doble ? 0 : ara;
    if (!doble || enMarxa) return;
    enMarxa = true;
    v.classList.add('versio-sorpresa');
    v.textContent = '❤️';
    setTimeout(() => { v.textContent = '🐈‍⬛'; }, 3000);
    setTimeout(() => { v.textContent = `v${VERSIO_APP}`; v.classList.remove('versio-sorpresa'); enMarxa = false; }, 4000);
  });
})();
carregarJocs();
