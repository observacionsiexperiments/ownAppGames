// Llançadora: llegeix jocs/jocs.json i pinta una targeta per joc.
const VERSIO_APP = '0.7.0';

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
    <p class="objectiu"><b>Objectiu:</b> <span></span></p>
    ${joc.estat === 'properament' ? '<span class="etiqueta">Properament</span>' : ''}
  `;
  // textContent per evitar injectar HTML des del JSON
  a.querySelector('.icona').textContent = joc.icona || '🎲';
  a.querySelector('h2').textContent = joc.nom;
  a.querySelector('.descripcio').textContent = joc.descripcio || '';
  a.querySelector('.objectiu span').textContent = joc.objectiu || '';
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

document.getElementById('versio').textContent = `v${VERSIO_APP}`;
carregarJocs();
