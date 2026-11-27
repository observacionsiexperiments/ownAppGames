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

  // ─── Dins de cada joc (v0.43.0) ───
  // · Botó «❓» a la barra de dalt: obre el «Com es juga» d'aquest joc (del manual) en una finestra, sense sortir del joc.
  // · Abans de deixar una partida començada («↺ Nova partida», «← Inici») es pregunta si de debò es vol deixar.
  //   Una partida és «començada» quan ja s'ha tocat alguna cosa a la pantalla de joc i encara no s'ha acabat
  //   (quan surt la celebració final ja no es pregunta).
  function finestra(classe, html) {
    const fons = document.createElement('div');
    fons.className = 'fj-fons ' + classe; fons.hidden = true;
    fons.innerHTML = html;
    document.body.appendChild(fons);
    let tornar = null;
    const obrir = () => { tornar = document.activeElement; fons.hidden = false; document.documentElement.classList.add('fe-oberta');
      const f = fons.querySelector('[data-focus]'); if (f) setTimeout(() => f.focus(), 30); };
    const tancar = () => { fons.hidden = true; document.documentElement.classList.remove('fe-oberta'); if (tornar && tornar.focus) tornar.focus(); };
    fons.addEventListener('click', e => { if (e.target === fons) tancar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !fons.hidden) { e.stopPropagation(); tancar(); } }, true);
    return { fons, obrir, tancar };
  }

  // Darrers jocs on s'ha començat una partida (els mostra la pantalla d'inici: «Hi vas jugar fa poc»)
  function desaRecent(id) {
    try {
      const k = 'appjocs.recents';
      let r = JSON.parse(localStorage.getItem(k) || '[]');
      if (!Array.isArray(r)) r = [];
      localStorage.setItem(k, JSON.stringify([id, ...r.filter(x => x !== id)].slice(0, 3)));
    } catch {}
  }

  function dinsDelJoc() {
    const barra = document.querySelector('nav.barra-joc');
    if (!barra || !/\/jocs\/[^/]+\/(index\.html)?$/.test(location.pathname)) return;
    const id = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean).pop();

    // ❓ Com es juga
    const ajuda = document.createElement('button');
    ajuda.type = 'button'; ajuda.className = 'ajuda-joc'; ajuda.title = 'Com es juga';
    ajuda.setAttribute('aria-label', 'Com es juga a aquest joc'); ajuda.textContent = '❓';
    barra.appendChild(ajuda);
    const fa = finestra('fj-ajuda', `<div class="fj-finestra fj-gran" role="dialog" aria-modal="true" aria-label="Com es juga">
        <div class="fj-cap"><b>❓ Com es juga</b><button type="button" class="fj-tanca" data-focus>✕ Tanca</button></div>
        <iframe title="Com es juga" loading="lazy"></iframe></div>`);
    fa.fons.querySelector('.fj-tanca').addEventListener('click', fa.tancar);
    ajuda.addEventListener('click', () => {
      const fr = fa.fons.querySelector('iframe');
      if (!fr.src) fr.src = `../../manual.html?dins=1#joc-${id}`;
      fa.obrir();
    });

    // Sortir d'una partida començada
    const zona = () => document.getElementById('pantalla-joc') || document.querySelector('main');
    let tocat = false;
    const visible = el => el && !el.hidden && !el.closest('[hidden]');
    document.addEventListener('pointerdown', e => {
      const z = zona();
      if (visible(z) && z.contains(e.target) && !e.target.closest('#btn-nova, #btn-nou')) tocat = true;
    }, true);
    document.addEventListener('keydown', e => {
      const z = zona();
      if (visible(z) && z.contains(e.target) && !e.target.closest('#btn-nova, #btn-nou') && !['Tab', 'Shift', 'Escape'].includes(e.key)) tocat = true;
    }, true);
    const acabada = () => !!document.querySelector('.cel-fons');
    const enCurs = () => tocat && visible(zona()) && !acabada();
    const fs = finestra('fj-sortir', `<div class="fj-finestra" role="alertdialog" aria-modal="true" aria-labelledby="fj-sortir-t">
        <h2 id="fj-sortir-t">Vols deixar aquesta partida?</h2>
        <p>Si la deixes, es perd el que portes fet.</p>
        <div class="fj-botons"><button type="button" class="fj-segueix" data-focus>Continuo jugant</button><button type="button" class="fj-deixa">Sí, la deixo</button></div></div>`);
    let pendent = null;
    fs.fons.querySelector('.fj-segueix').addEventListener('click', () => { pendent = null; fs.tancar(); });
    fs.fons.querySelector('.fj-deixa').addEventListener('click', () => {
      const el = pendent; pendent = null; tocat = false; fs.tancar();
      if (!el) return;
      if (el.tagName === 'A') location.href = el.href; else el.click();
    });
    document.addEventListener('click', e => {
      const el = e.target.closest('#btn-nova, #btn-nou, nav.barra-joc a');
      if (!el) return;
      if (el.matches('#btn-nova, #btn-nou') && !el.closest('#pantalla-joc, main')) return;
      if (!enCurs()) { tocat = false; return; }
      e.preventDefault(); e.stopImmediatePropagation();
      pendent = el; fs.obrir();
    }, true);
    // Començar una partida nova: encara no s'ha tocat res
    document.addEventListener('click', e => { if (e.target.closest('#btn-comencar')) { tocat = false; desaRecent(id); } }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dinsDelJoc); else dinsDelJoc();

  // ─── Passar a la següent (v0.43.0) ───
  // Pantalla.despres(fn, ms, ambExplicacio): si hi ha una explicació per llegir (normalment, després d'un error),
  // surt el botó «Següent ▶» al missatge i s'espera que l'infant el premi; si no, passa sol al cap de ms.
  // Torna un identificador que el joc pot aturar amb clearTimeout(), com sempre.
  let espera = null;
  const clearOriginal = global.clearTimeout.bind(global);
  global.clearTimeout = id => { if (espera && id === espera.id) cancelarEspera(); clearOriginal(id); };
  function cancelarEspera() { if (!espera) return; espera.boto.remove(); clearOriginal(espera.id); espera = null; }
  function despres(fn, ms, ambExplicacio) {
    if (!ambExplicacio) return setTimeout(fn, ms);
    cancelarEspera();
    const lloc = document.getElementById('missatge') || document.querySelector('main');
    const boto = document.createElement('button');
    boto.type = 'button'; boto.className = 'btn btn-seguent-auto'; boto.textContent = 'Següent ▶';
    const id = setTimeout(() => {}, 2147483000);
    espera = { id, boto };
    boto.addEventListener('click', () => { if (!espera || espera.boto !== boto) return; cancelarEspera(); fn(); });
    lloc.appendChild(boto);
    setTimeout(() => { if (espera && espera.boto === boto) boto.focus({ preventScroll: true }); }, 50);
    return id;
  }
  // Nova partida, Inici o Comença: el botó «Següent» pendent desapareix
  document.addEventListener('click', e => { if (e.target.closest('#btn-nova, #btn-nou, #btn-comencar')) setTimeout(() => { if (espera && !espera.boto.isConnected) espera = null; }, 0); }, true);

  // ─── L'error no es queda enganxat (v0.49.4) ───
  // Després d'una errada el missatge surt en rosa. En quant l'infant torna a tocar el joc (treu o posa una fitxa,
  // escriu, tria una altra targeta…), el missatge torna al color normal: si ho torna a fer malament, el joc el
  // tornarà a posar en rosa (aquest avís va abans, en fase de captura). Mentre s'espera «Següent ▶» no es toca.
  function calmarErrors(e) {
    if (espera) return;
    if (e.target.closest && e.target.closest('#celebracio-capa, .fj-fons, dialog')) return;
    document.querySelectorAll('main .es-error').forEach(m => { if (!m.contains(e.target)) m.classList.remove('es-error'); });
  }
  document.addEventListener('pointerdown', calmarErrors, true);
  document.addEventListener('keydown', e => { if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) calmarErrors(e); }, true);

  global.Pantalla = { dalt, sota, avisOrientacio, despres };
})(window);
