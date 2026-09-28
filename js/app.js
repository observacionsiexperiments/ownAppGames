// Llançadora: llegeix jocs/jocs.json i pinta una targeta per joc.
const VERSIO_APP = '0.11.0';

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

// Botó d'instal·lació (Chrome/Edge/Android)
let promptInstal = null;
const btnInstal = document.getElementById('btn-instal');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  promptInstal = e;
  btnInstal.hidden = false;
});
btnInstal.addEventListener('click', async () => {
  if (!promptInstal) return;
  promptInstal.prompt();
  await promptInstal.userChoice;
  promptInstal = null;
  btnInstal.hidden = true;
});

// iPad / iPhone: Safari no té avís d'instal·lació; mostrem com fer-ho manualment
(function avisIOS() {
  const ua = navigator.userAgent;
  // L'iPad modern es presenta com a "Mac", però té pantalla tàctil
  const esIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const esIOS = esIPad || /iPhone|iPod/.test(ua);
  const jaInstal = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  let tancat = false;
  try { tancat = localStorage.getItem('appjocs.avis-ios-tancat') === '1'; } catch {}
  if (!esIOS || jaInstal || tancat) return;
  const avis = document.getElementById('avis-ios');
  // A l'iPhone el botó Compartir és a baix; a l'iPad, a dalt a la dreta
  // On és el botó Compartir depèn del navegador (a iPad tots fan servir el motor de Safari)
  const esChrome = /CriOS/.test(ua), esAltre = /FxiOS|EdgiOS/.test(ua);
  document.getElementById('on-es').textContent =
    esChrome ? "(a la barra d'adreces, a dalt a la dreta; si no hi és, obre el menú ··· i tria Compartir)"
    : esAltre ? '(dins del menú del navegador)'
    : esIPad ? '(a dalt a la dreta, o dins del menú ···)' : '(a la barra de baix, o dins del menú ···)';
  avis.hidden = false;
  document.getElementById('avis-tancar').addEventListener('click', () => {
    avis.hidden = true;
    try { localStorage.setItem('appjocs.avis-ios-tancat', '1'); } catch {}
  });
})();

document.getElementById('versio').textContent = `v${VERSIO_APP}`;
carregarJocs();
