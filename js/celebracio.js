// Celebracions comunes a tots els jocs (sense dependències).
//
//   Celebracio.petita(element)      → esclat de confeti i estrelles des d'un element (encert intermedi)
//   Celebracio.gran({ titol, subtitol, estrelles: 1..3, emoji, boto, enTancar })
//                                   → pantalla de premi: confeti, trofeu, estrelles i so (joc acabat).
//                                     Amb js/preferencies.js: afegeix el nom al títol i, si no es compten
//                                     errors, no mostra estrelles.
//
// Respecta "reduir moviment" del sistema (menys animació). El so es pot silenciar amb
// localStorage 'appjocs.so' = 'no'.

(function (global) {
  // Colors del confeti: la paleta de l'app (és la firma de celebració, com la franja del títol)
  const COLORS = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#F2B56B', '#45D6E6'];
  const menysMoviment = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function capa() {
    let c = document.getElementById('celebracio-capa');
    if (!c) {
      c = document.createElement('div');
      c.id = 'celebracio-capa';
      c.setAttribute('aria-hidden', 'true');
      document.body.appendChild(c);
    }
    return c;
  }

  // ---------- So curt de celebració (Web Audio, sense fitxers) ----------
  let audio = null;
  function so(tipus = 'petit') {
    try {
      if (localStorage.getItem('appjocs.so') === 'no') return;
    } catch {}
    try {
      audio = audio || new (global.AudioContext || global.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const notes = tipus === 'gran' ? [523, 659, 784, 1047, 784, 1047] : [659, 988];
      const pas = tipus === 'gran' ? 0.12 : 0.09;
      notes.forEach((f, i) => {
        const o = audio.createOscillator(), g = audio.createGain();
        const t = audio.currentTime + i * pas;
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (tipus === 'gran' && i === notes.length - 1 ? 0.6 : 0.22));
        o.connect(g).connect(audio.destination);
        o.start(t); o.stop(t + 0.7);
      });
    } catch {}
  }

  // ---------- Petita: esclat des d'un element ----------
  function petita(element) {
    const r = element && element.getBoundingClientRect
      ? element.getBoundingClientRect()
      : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const c = capa();
    const n = menysMoviment() ? 6 : 22;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      const estrella = i % 4 === 0;
      p.className = 'cel-particula' + (estrella ? ' cel-estrella' : '');
      if (estrella) p.textContent = '⭐';
      else p.style.background = COLORS[i % COLORS.length];
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const dist = 60 + Math.random() * 70;
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist - 30 + 'px');
      p.style.setProperty('--gir', (Math.random() * 720 - 360) + 'deg');
      c.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
    if (element && element.classList) {
      element.classList.remove('cel-bot'); void element.getBoundingClientRect(); element.classList.add('cel-bot');
      setTimeout(() => element.classList.remove('cel-bot'), 700);
    }
    so('petit');
  }

  // ---------- Gran: pantalla de premi ----------
  function gran(opcions = {}) {
    let { titol = 'Molt bé!', subtitol = '', estrelles = 3, emoji = '🏆', boto = 'Continuar', enTancar } = opcions;
    // Preferències (js/preferencies.js): el nom al títol; sense comptar errors, no hi ha estrelles
    const P = global.Preferencies;
    if (P) titol = P.ambNom(titol);
    const ambEstrelles = !P || P.errors();
    tancarGran();
    const fons = document.createElement('div');
    fons.className = 'cel-fons';
    fons.setAttribute('role', 'dialog');
    fons.setAttribute('aria-modal', 'true');
    fons.setAttribute('aria-label', titol);
    fons.innerHTML = `
      <canvas class="cel-confeti"></canvas>
      <div class="cel-targeta">
        <div class="cel-trofeu" aria-hidden="true"></div>
        <h2 class="cel-titol"></h2>
        ${ambEstrelles ? `<div class="cel-estrelles" aria-label="${estrelles} de 3 estrelles">
          ${[1, 2, 3].map(i => `<span class="cel-e ${i <= estrelles ? 'guanyada' : ''}" style="--i:${i}">⭐</span>`).join('')}
        </div>` : ''}
        <p class="cel-subtitol"></p>
        <button type="button" class="btn cel-boto"></button>
      </div>`;
    fons.querySelector('.cel-trofeu').textContent = emoji;
    fons.querySelector('.cel-titol').textContent = titol;
    fons.querySelector('.cel-subtitol').textContent = subtitol;
    fons.querySelector('.cel-boto').textContent = boto;
    document.body.appendChild(fons);
    const boto_ = fons.querySelector('.cel-boto');
    boto_.addEventListener('click', () => { tancarGran(); enTancar && enTancar(); });
    setTimeout(() => boto_.focus(), 50);
    so('gran');
    if (!menysMoviment()) confeti(fons.querySelector('.cel-confeti'));
  }

  function tancarGran() {
    document.querySelectorAll('.cel-fons').forEach(f => { f._aturar && f._aturar(); f.remove(); });
  }

  // Confeti que cau per tota la pantalla durant uns segons
  function confeti(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = global.devicePixelRatio || 1;
    const W = innerWidth, H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    const peces = Array.from({ length: Math.min(180, Math.round(W / 6)) }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * H * 0.6,
      w: 7 + Math.random() * 7, h: 10 + Math.random() * 8,
      vy: 2.2 + Math.random() * 3, vx: -1.2 + Math.random() * 2.4,
      rot: Math.random() * Math.PI, vr: -0.15 + Math.random() * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    const inici = performance.now();
    let viu = true;
    canvas.parentElement._aturar = () => { viu = false; };
    (function marc(t) {
      if (!viu) return;
      const temps = t - inici;
      ctx.clearRect(0, 0, W, H);
      for (const p of peces) {
        p.x += p.vx + Math.sin((t / 400) + p.y / 60) * 0.6; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 20 && temps < 2600) { p.y = -20; p.x = Math.random() * W; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (temps < 6000) requestAnimationFrame(marc); else ctx.clearRect(0, 0, W, H);
    })(inici);
  }

  global.Celebracio = { petita, gran, tancar: tancarGran };
})(window);
