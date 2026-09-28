// Llançadora: llegeix jocs/jocs.json i pinta una targeta per joc.
const VERSIO_APP = '0.14.0';

async function carregarJocs() {
  const llista = document.getElementById('llista-jocs');
  try {
    const resposta = await fetch('jocs/jocs.json', { cache: 'no-cache' });
    const jocs = await resposta.json();
    const visibles = jocs.filter(j => j.estat !== 'ocult');

    if (!visibles.length) {
      llista.innerHTML = '<li class="buit">Encara no hi ha jocs. Aviat!</li>';
      return;
    }
    llista.innerHTML = '';
    for (const joc of visibles) llista.appendChild(crearTargeta(joc));
  } catch (e) {
    console.error(e);
    llista.innerHTML = '<li class="buit">No s\'han pogut carregar els jocs.</li>';
  }
}

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
    <span class="peu-targeta">${joc.estat === 'properament' ? '<span class="etiqueta">Properament</span>' : '<span class="jugar">Jugar →</span>'}</span>
  `;
  // textContent per evitar injectar HTML des del JSON
  a.querySelector('.icona').textContent = joc.icona || '🎲';
  a.querySelector('h2').textContent = joc.nom;
  a.querySelector('.descripcio').textContent = joc.descripcio || '';
  a.querySelector('.text-objectiu').textContent = joc.objectiu || '';
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

document.getElementById('versio').textContent = `v${VERSIO_APP}`;
carregarJocs();
