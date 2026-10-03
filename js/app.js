// Llançadora: llegeix jocs/jocs.json i pinta una targeta per joc.
const VERSIO_APP = '0.25.0';

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
    jocs = (await resposta.json()).filter(j => j.estat !== 'ocult');
    mides();
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
  const visibles = jocs.filter(j =>
    (filtre === 'tots' || (j.categories || []).includes(filtre)) &&
    (!text || normal([j.nom, j.descripcio, j.objectiu, ...(j.categories || []).map(c => CATEGORIES[c])].join(' ')).includes(text)));

  llista.innerHTML = '';
  // Mateixa mida de targeta sempre; només canvia quantes columnes es fan servir (per centrar-les)
  llista.style.setProperty('--cols', Math.max(1, Math.min(columnes, visibles.length)));
  if (!visibles.length) {
    const li = document.createElement('li');
    li.className = 'buit';
    li.textContent = !jocs.length ? 'Encara no hi ha jocs. Aviat!'
      : text ? `No hi ha cap joc amb «${document.getElementById('cerca').value.trim()}».` : 'No hi ha cap joc d\'aquest tipus.';
    llista.appendChild(li);
    return;
  }
  for (const joc of visibles) llista.appendChild(crearTargeta(joc));
}

// Mida de les targetes: proporció fixa 3:4 i la més gran possible perquè hi càpiguen TOTS els jocs
// (no només els filtrats) sense desplaçar. Així la mida no canvia en filtrar ni en girar la pantalla
// (només canvia com es reparteixen).
const PROPORCIO = 4 / 3, AMPLE_MIN = 70, AMPLE_MAX = 270;
let columnes = 3;
function mides() {
  const g = document.getElementById('llista-jocs');
  const n = Math.max(1, jocs.length);
  const cs = getComputedStyle(g);
  const gap = parseFloat(cs.columnGap) || 16;
  const W = g.clientWidth;
  const dalt = g.getBoundingClientRect().top + window.scrollY;
  const H = Math.min(innerHeight, document.documentElement.clientHeight) - dalt - document.querySelector('.peu').offsetHeight - parseFloat(cs.marginBottom) - 6;
  let millor = null;
  for (let c = 1; c <= n; c++) {
    const r = Math.ceil(n / c);
    const w = Math.min((W - (c - 1) * gap) / c, (H - (r - 1) * gap) / r / PROPORCIO, AMPLE_MAX);
    const buits = c * r - n;
    if (!millor || w > millor.w + 1 || (Math.abs(w - millor.w) <= 1 && buits < millor.buits)) millor = { c, r, w, buits };
  }
  const w = Math.max(AMPLE_MIN, Math.floor(millor.w));
  columnes = millor.c;
  g.style.setProperty('--card-w', w + 'px');
  // Centrat vertical calculat amb tots els jocs: en filtrar, les targetes no es mouen de lloc
  const alt = millor.r * w * PROPORCIO + (millor.r - 1) * gap;
  g.style.paddingTop = Math.max(0, Math.floor((H - alt) / 2)) + 'px';
  g.style.setProperty('--cols', columnes);
}
let esperaMides;
window.addEventListener('resize', () => { clearTimeout(esperaMides); esperaMides = setTimeout(() => { mides(); pintarJocs(); }, 80); });

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
    <span class="icona" aria-hidden="true"></span>
    <h2></h2>
    <p class="descripcio"></p>
    <p class="objectiu"><span class="rotul">🎯 Objectiu</span><span class="text-objectiu"></span></p>
    <span class="peu-targeta"><span class="categories"></span>${joc.estat === 'properament' ? '<span class="etiqueta">Properament</span>' : '<span class="jugar">Jugar →</span>'}</span>
  `;
  // textContent per evitar injectar HTML des del JSON
  a.querySelector('.icona').textContent = joc.icona || '🎲';
  a.querySelector('h2').textContent = joc.nom;
  a.querySelector('.descripcio').textContent = joc.descripcio || '';
  a.querySelector('.text-objectiu').textContent = joc.objectiu || '';
  a.querySelector('.categories').textContent = (joc.categories || []).map(c => CATEGORIES[c] || c).join(' · ');
  li.appendChild(a);
  return li;
}

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
      "Toca <b>Afegeix</b>. La icona d'AppJocs apareixerà a l'última pàgina de la pantalla d'inici."];
  }
  if (esAndroid) {
    const esSamsung = /SamsungBrowser/.test(ua), esFirefox = /Firefox/.test(ua);
    return [esSamsung ? 'Toca el menú <b>☰</b> (a baix a la dreta).' : 'Toca el menú <b>⋮</b> (a dalt a la dreta).',
      esFirefox ? "Tria <b>«Instal·la»</b> o <b>«Afegeix a la pantalla d'inici»</b>."
        : "Tria <b>«Instal·la l'aplicació»</b> o <b>«Afegeix a la pantalla d'inici»</b>.",
      'Confirma amb <b>Instal·la</b>. La icona d\'AppJocs apareixerà amb les altres apps.'];
  }
  return null;   // PC: només el botó directe, si el navegador el dona
}

function pintarAvis() {
  pintarAvisSense();
  if (jocs.length) { mides(); pintarJocs(); }
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
  if (jocs.length) { mides(); pintarJocs(); }
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
  finestraOp.querySelectorAll('.op-sino').forEach(g => g.querySelectorAll('button').forEach(b =>
    b.setAttribute('aria-pressed', (b.dataset.v === 'si') === triaOp[g.dataset.clau])));
}
function obrirOpcions() {
  const p = Preferencies.llegir();
  triaOp = { temps: p.temps !== false, errors: p.errors !== false };
  document.getElementById('op-nom').value = p.nom || '';
  pintarSiNo();
  finestraOp.hidden = false;
  document.documentElement.classList.add('fe-oberta');   // la pàgina del darrere no es mou
  setTimeout(() => document.getElementById('op-nom').focus(), 50);
}
function tancarOpcions() {
  finestraOp.hidden = true;
  document.documentElement.classList.remove('fe-oberta');
  document.getElementById('btn-opcions').focus();
}
document.getElementById('btn-opcions').addEventListener('click', obrirOpcions);
document.getElementById('op-cancela').addEventListener('click', tancarOpcions);
finestraOp.addEventListener('click', e => { if (e.target === finestraOp) tancarOpcions(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !finestraOp.hidden) tancarOpcions(); });
finestraOp.querySelectorAll('.op-sino').forEach(g => g.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  triaOp[g.dataset.clau] = b.dataset.v === 'si'; pintarSiNo();
}));
document.getElementById('form-opcions').addEventListener('submit', e => {
  e.preventDefault();
  Preferencies.desar({ nom: document.getElementById('op-nom').value, ...triaOp });
  pintarSalutacio();
  tancarOpcions();
  if (jocs.length) { mides(); pintarJocs(); }
});
pintarSalutacio();

document.getElementById('versio').textContent = `v${VERSIO_APP}`;
carregarJocs();
