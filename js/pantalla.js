// Utilitats de pantalla comunes a tots els jocs.
//
// Pantalla.dalt(el): posició vertical d'un element com si el joc no estigués centrat a la pantalla.
//   Els jocs que calculen la mida del tauler segons l'alçada disponible l'han de fer servir: si no,
//   com més petit el tauler, més avall queda (centrat) i cada redibuix l'encongiria una mica més.
//
// Pantalla.sota(el): alçada del contingut que hi ha per sota de l'element (per calcular l'espai del tauler).
//
// Pantalla.avisOrientacio(joc, {dins, abans, mobil, tauleta}): franja blava "Aquest joc es veu millor
//   en horitzontal/vertical" quan el dispositiu està en l'orientació que pitjor li va.
//   Per defecte: mòbil → vertical, tauleta i ordinador → horitzontal. Es pot tancar ("Entesos") i
//   aleshores no torna a sortir per a aquell joc. Si es gira el dispositiu, s'actualitza sola.

(function (global) {
  function dalt(el) {
    const h = document.documentElement;
    h.classList.add('sense-centrar');
    const t = el.getBoundingClientRect().top + window.scrollY;
    h.classList.remove('sense-centrar');
    return t;
  }

  // Alçada del contingut de la pàgina que queda per sota d'un element (sense el centrat)
  function sota(el) {
    const h = document.documentElement;
    h.classList.add('sense-centrar');
    const main = el.closest('main') || document.body;
    const r = el.getBoundingClientRect();
    let fons = r.bottom;
    // Només compten els elements que es veuen: no el que queda amagat dins d'una caixa amb desplaçament
    const retallat = new Map();
    const dinsRetall = x => {
      for (let p = x.parentElement; p && p !== main; p = p.parentElement) {
        if (!retallat.has(p)) retallat.set(p, getComputedStyle(p).overflowY !== 'visible');
        if (retallat.get(p)) return true;
      }
      return false;
    };
    for (const x of main.querySelectorAll('*')) {
      if (x === el || el.contains(x) || dinsRetall(x)) continue;
      const b = x.getBoundingClientRect();
      if (b.height && b.bottom > fons) fons = b.bottom;
    }
    h.classList.remove('sense-centrar');
    return Math.max(0, fons - r.bottom);
  }

  const esMobil = () => Math.min(screen.width, screen.height) < 600;
  const MQ_HORITZONTAL = matchMedia('(orientation: landscape)');

  function avisOrientacio(joc, op = {}) {
    const clau = `appjocs.avis-orientacio.${joc}`;
    try { if (localStorage.getItem(clau) === '1') return; } catch {}
    const millor = esMobil() ? (op.mobil || 'vertical') : (op.tauleta || 'horitzontal');

    const avis = document.createElement('div');
    avis.className = 'avis-orientacio';
    avis.setAttribute('role', 'note');
    avis.innerHTML = `<span class="ao-icona" aria-hidden="true">📱↻</span>
      <span class="ao-text">Aquest joc es veu millor en <b>${millor}</b>. Gira la ${esMobil() ? 'pantalla' : 'tauleta'} 🙂</span>
      <button type="button" class="ao-tancar">Entesos</button>`;
    if (op.abans) op.abans.before(avis); else (op.dins || document.querySelector('main')).prepend(avis);

    const pintar = () => {
      const ara = MQ_HORITZONTAL.matches ? 'horitzontal' : 'vertical';
      avis.hidden = ara === millor;
    };
    const canvi = () => pintar();
    MQ_HORITZONTAL.addEventListener ? MQ_HORITZONTAL.addEventListener('change', canvi) : MQ_HORITZONTAL.addListener(canvi);
    avis.querySelector('.ao-tancar').addEventListener('click', () => {
      avis.remove();
      try { localStorage.setItem(clau, '1'); } catch {}
    });
    pintar();
  }

  global.Pantalla = { dalt, sota, avisOrientacio };
})(window);
