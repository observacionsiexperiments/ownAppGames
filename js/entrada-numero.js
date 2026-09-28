// Component reutilitzable per escriure números: caixa(es) + mode "Teclat" o "Dibuixar".
// Necessita js/reconeixedor-xifres.js (per al mode dibuix) i els estils .en-* de css/styles.css.
//
// Ús amb un número:
//   const e = EntradaNumero.crear(contenidor, {
//     maxXifres: 2,
//     clauMode: 'appjocs.meu-joc.mode',        // on es recorda el mode triat
//     enEnviar: valor => { ... },              // valor: Number
//   });
// Ús com a suma "□ + □ = 13":
//   EntradaNumero.crear(contenidor, { camps: 2, sufix: '= 13', enEnviar: ([a, b]) => { ... } });
//   e.posarSufix('= 7');
// Mètodes: buidar(), activar(bool), sacsejar(), enfocar(), ajustar(), posarSufix(text)

(function (global) {
  const ESPERA_MS = 800;

  function crear(contenidor, opcions = {}) {
    const maxX = opcions.maxXifres || 3;
    const nCamps = opcions.camps || 1;
    const suma = nCamps > 1;
    const clauMode = opcions.clauMode || 'appjocs.entrada.mode';
    const esTactil = matchMedia('(pointer: coarse)').matches;

    const tecles = suma
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'esborrar', '0', 'seguent']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'esborrar', '0', 'ok'];
    const htmlTecla = t =>
      t === 'esborrar' ? '<button type="button" class="en-esborrar" data-tecla="esborrar" aria-label="Esborrar">⌫</button>'
      : t === 'ok'     ? '<button type="submit" class="en-ok" aria-label="Comprovar">OK</button>'
      : t === 'seguent'? '<button type="button" class="en-mes" data-tecla="seguent" aria-label="Següent número">＋</button>'
      : `<button type="button" data-tecla="${t}">${t}</button>`;
    const htmlCaixa = i => `<input class="en-caixa" data-camp="${i}" type="text"
        inputmode="${esTactil ? 'none' : 'numeric'}" pattern="[0-9]*" maxlength="${maxX}" placeholder="?"
        aria-label="${suma ? (i === 0 ? 'Primer número' : 'Segon número') : 'Número'}" enterkeyhint="go">`;

    const arrel = document.createElement('form');
    arrel.className = 'en' + (suma ? ' en-suma' : '');
    arrel.autocomplete = 'off';
    arrel.innerHTML = `
      <div class="en-caixes">
        ${Array.from({ length: nCamps }, (_, i) => htmlCaixa(i)).join('<span class="en-signe">+</span>')}
        ${suma ? '<span class="en-sufix"></span>' : ''}
      </div>
      <div class="en-modes" role="group" aria-label="Com vols escriure el número">
        <button type="button" data-mode="teclat" aria-pressed="true">🔢 Teclat</button>
        <button type="button" data-mode="dibuix" aria-pressed="false">✏️ Dibuixar</button>
      </div>
      <div class="en-teclat">${tecles.map(htmlTecla).join('')}</div>
      <div class="en-dibuix" hidden>
        <div class="en-llenc-caixa">
          <canvas class="en-llenc" aria-label="Zona per dibuixar una xifra"></canvas>
          <div class="en-ajuda">Dibuixa una xifra ✏️</div>
        </div>
        <div class="en-botons">
          <button type="button" class="en-esborrar" data-accio="esborrar" aria-label="Esborrar l'última xifra">⌫</button>
          <button type="button" class="en-esborrar" data-accio="netejar">🧽 Netejar</button>
          ${suma ? '<button type="button" class="en-mes" data-accio="seguent" aria-label="Següent número">＋</button>' : ''}
          ${suma ? '' : '<button type="submit" class="en-ok" aria-label="Comprovar">OK</button>'}
        </div>
      </div>
      ${suma ? '<button type="submit" class="en-ok en-ok-ample">OK ✓</button>' : ''}`;
    contenidor.appendChild(arrel);

    const q = s => arrel.querySelector(s);
    const caixes = [...arrel.querySelectorAll('.en-caixa')];
    const llenc = q('.en-llenc'), ajuda = q('.en-ajuda');
    const ctx = llenc.getContext('2d');
    let tracos = [], actual = null, temporitzador = null, actiu = true, campActiu = 0;

    // --- Caixes
    function marcarActiva(i) {
      campActiu = i;
      caixes.forEach((c, j) => c.classList.toggle('activa', suma && j === i));
    }
    const caixa = () => caixes[campActiu];
    caixes.forEach((c, i) => {
      c.addEventListener('input', () => {
        const net = c.value.replace(/\D/g, '').slice(0, maxX);
        const volSeguent = /\+/.test(c.value);
        c.value = net;
        if (volSeguent) seguent();
      });
      c.addEventListener('focus', () => marcarActiva(i));
      c.addEventListener('pointerdown', () => marcarActiva(i));
      c.addEventListener('keydown', e => {
        if (e.key === '+' ) { e.preventDefault(); seguent(); }
        if (e.key === 'Backspace' && c.value === '' && i > 0) { e.preventDefault(); marcarActiva(i - 1); caixes[i - 1].focus(); }
      });
    });
    function afegir(x) {
      const c = caixa();
      if (c.value.length < maxX) c.value = (c.value + x).replace(/^0+(?=\d)/, '');
    }
    function esborrar() {
      const c = caixa();
      if (c.value === '' && campActiu > 0) { marcarActiva(campActiu - 1); return; }
      c.value = c.value.slice(0, -1);
    }
    function seguent() {
      if (campActiu < nCamps - 1) { marcarActiva(campActiu + 1); if (!esTactil) caixa().focus(); }
    }

    // --- Teclat
    q('.en-teclat').addEventListener('click', e => {
      const b = e.target.closest('button[data-tecla]');
      if (!b || !actiu) return;
      const t = b.dataset.tecla;
      if (t === 'esborrar') esborrar();
      else if (t === 'seguent') seguent();
      else afegir(t);
    });

    // --- Modes
    function canviarMode(mode) {
      arrel.querySelectorAll('.en-modes button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
      q('.en-teclat').hidden = mode !== 'teclat';
      q('.en-dibuix').hidden = mode !== 'dibuix';
      try { localStorage.setItem(clauMode, mode); } catch {}
      if (mode === 'dibuix') ajustar();
    }
    arrel.querySelectorAll('.en-modes button').forEach(b => b.addEventListener('click', () => canviarMode(b.dataset.mode)));

    // --- Dibuix
    function ajustar() {
      const r = llenc.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      if (!r.width) return;
      llenc.width = Math.round(r.width * dpr); llenc.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 11;
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#333';
      redibuixar();
    }
    window.addEventListener('resize', () => { if (!q('.en-dibuix').hidden) ajustar(); });
    function redibuixar() {
      const r = llenc.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      for (const t of tracos) {
        ctx.beginPath();
        t.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        if (t.length === 1) ctx.lineTo(t[0].x + .1, t[0].y);
        ctx.stroke();
      }
    }
    function netejar(msg = 'Dibuixa una xifra ✏️', error = false) {
      tracos = []; actual = null; clearTimeout(temporitzador); redibuixar();
      ajuda.textContent = msg; ajuda.hidden = false;
      llenc.classList.toggle('error', error);
    }
    const punt = e => { const r = llenc.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    llenc.addEventListener('pointerdown', e => {
      if (!actiu) return;
      e.preventDefault(); llenc.setPointerCapture(e.pointerId); clearTimeout(temporitzador);
      ajuda.hidden = true; llenc.classList.remove('error');
      actual = [punt(e)]; tracos.push(actual); redibuixar();
    });
    llenc.addEventListener('pointermove', e => {
      if (!actual) return;
      const p = punt(e), u = actual[actual.length - 1];
      if (Math.hypot(p.x - u.x, p.y - u.y) < 2) return;
      actual.push(p); ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    const fi = () => { if (!actual) return; actual = null; clearTimeout(temporitzador); temporitzador = setTimeout(reconeixer, ESPERA_MS); };
    llenc.addEventListener('pointerup', fi);
    llenc.addEventListener('pointercancel', fi);
    function reconeixer() {
      if (!tracos.length) return;
      const r = global.ReconeixedorXifres && global.ReconeixedorXifres.reconeixer(tracos);
      if (!r) { netejar("No l'he entès 🤔", true); return; }
      if (caixa().value.length >= maxX) { netejar(`Com a màxim ${maxX} xifres`, true); return; }
      afegir(r.xifra);
      netejar(suma && campActiu < nCamps - 1 ? 'Una altra xifra, o ＋ per passar al següent'
                                              : 'Una altra xifra, o OK');
    }
    q('.en-botons').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !actiu) return;
      if (b.dataset.accio === 'esborrar') { esborrar(); netejar(); }
      else if (b.dataset.accio === 'netejar') netejar();
      else if (b.dataset.accio === 'seguent') { if (tracos.length) { clearTimeout(temporitzador); reconeixer(); } seguent(); }
    });

    // --- Enviar
    arrel.addEventListener('submit', e => {
      e.preventDefault();
      if (!actiu) return;
      if (tracos.length) { clearTimeout(temporitzador); reconeixer(); }   // dibuix pendent
      const buida = caixes.findIndex(c => c.value === '');
      if (buida !== -1) { marcarActiva(buida); sacsejar(); return; }
      const valors = caixes.map(c => Number(c.value));
      opcions.enEnviar && opcions.enEnviar(suma ? valors : valors[0]);
    });

    function sacsejar() {
      const c = caixa();
      c.classList.remove('en-sacseig'); void c.offsetWidth; c.classList.add('en-sacseig');
    }
    function buidar() { caixes.forEach(c => c.value = ''); marcarActiva(0); netejar(); }
    function activar(a) {
      actiu = a; caixes.forEach(c => c.disabled = !a);
      arrel.querySelectorAll('button:not([data-mode])').forEach(b => b.disabled = !a);
    }
    function enfocar() { if (!esTactil) caixa().focus(); }
    function posarSufix(t) { const s = q('.en-sufix'); if (s) s.textContent = t; }

    let modeInicial = 'teclat';
    try { modeInicial = localStorage.getItem(clauMode) || 'teclat'; } catch {}
    canviarMode(modeInicial);
    marcarActiva(0);
    if (opcions.sufix) posarSufix(opcions.sufix);

    return { buidar, activar, sacsejar, enfocar, ajustar, posarSufix, element: arrel };
  }

  global.EntradaNumero = { crear };
})(window);
