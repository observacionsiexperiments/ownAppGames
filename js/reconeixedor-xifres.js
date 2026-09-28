// Reconeixedor de xifres dibuixades (0-9) sense dependències.
// Basat en l'algorisme "$P Point-Cloud Recognizer" (Vatavu, Anthony, Wobbrock, 2012):
// compara el núvol de punts del dibuix amb unes plantilles. No importa l'ordre
// ni la direcció dels traços, i admet xifres de més d'un traç (4, 5, 7…).
//
// Ús:  const r = ReconeixedorXifres.reconeixer(tracos)
//      tracos = [[{x,y}, {x,y}, …], …]  (un array per traç)
//      → { xifra: '7', distancia: 1.8 }  o  null si no s'assembla a res

(function (global) {
  const N = 32;              // punts després de remostrejar
  const LLINDAR = 1.9;       // distància màxima per acceptar un resultat

  // ---------- Utilitats per construir plantilles (caixa: x -0.5..0.5, y 0..1) ----------
  function arc(cx, cy, rx, ry, a0, a1, passos = 24) {
    const p = [];
    for (let i = 0; i <= passos; i++) {
      const a = (a0 + (a1 - a0) * i / passos) * Math.PI / 180;
      p.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
    }
    return p;
  }
  const ln = (...pts) => pts.map(([x, y]) => ({ x, y }));

  // Cada xifra té diverses maneres habituals d'escriure-la. Cada variant és una llista de traços.
  const DEFINICIONS = {
    '0': [
      [arc(0, .5, .3, .5, -90, 270)],
      [arc(0, .5, .38, .5, -90, 270)],
    ],
    '1': [
      [ln([0, 0], [0, 1])],
      [ln([-.22, .22], [0, 0], [0, 1])],
      [ln([-.22, .22], [0, 0], [0, 1]), ln([-.22, 1], [.22, 1])],
    ],
    '2': [
      [[...arc(0, .28, .28, .26, -170, 30), ...ln([-.3, 1], [.32, 1])]],
      [[...arc(0, .3, .3, .3, -180, 45), ...ln([-.3, 1], [.32, 1])]],
    ],
    '3': [
      [[...arc(0, .25, .27, .24, -160, 90), ...arc(0, .75, .3, .26, -90, 160)]],
      [[...ln([-.28, 0], [.28, 0], [0, .42]), ...arc(0, .7, .3, .3, -90, 160)]],
    ],
    '4': [
      [ln([.12, 0], [-.35, .65], [.35, .65]), ln([.15, .3], [.15, 1])],
      [ln([.18, 0], [-.35, .65], [.35, .65]), ln([.18, 0], [.18, 1])],
      [ln([-.25, 0], [-.3, .6], [.35, .6]), ln([.15, 0], [.15, 1])],
      [ln([-.18, 0], [-.22, .55], [.28, .55]), ln([.1, .15], [.1, 1])],        // "L" estreta + pal
      [ln([.15, 0], [-.28, .6], [.3, .6], [.15, .6], [.15, 0], [.15, 1])],      // d'un sol traç
    ],
    '5': [
      [[...ln([.3, 0], [-.25, 0], [-.27, .42]), ...arc(0, .7, .3, .3, -130, 150)]],
      [[...ln([-.25, 0], [-.27, .42]), ...arc(0, .7, .3, .3, -130, 150)], ln([-.25, 0], [.3, 0])],
    ],
    '6': [
      [[...ln([.22, 0], [0, .13], [-.18, .35], [-.27, .66]), ...arc(0, .72, .27, .28, 180, 540)]],
      [[...arc(.25, .6, .52, .6, -100, -180, 12), ...arc(0, .72, .27, .28, 180, 540)]],
    ],
    '7': [
      [ln([-.3, 0], [.3, 0], [-.05, 1])],
      [ln([-.3, 0], [.3, 0], [0, 1]), ln([-.18, .5], [.22, .5])],
      [ln([-.3, .15], [-.3, 0], [.3, 0], [-.05, 1])],
    ],
    '8': [
      [arc(0, .25, .22, .25, 90, 450), arc(0, .74, .28, .26, -90, 270)],
      [[...arc(0, .25, .22, .25, 90, -270), ...arc(0, .74, .28, .26, -90, 270)]],
    ],
    '9': [
      [[...arc(0, .28, .27, .28, 0, 360), ...ln([.27, .28], [.25, 1])]],
      [[...arc(0, .28, .27, .28, 0, 360), ...ln([.27, .28], [.2, .75], [0, 1])]],
    ],
  };

  // ---------- Algorisme $P ----------
  function aplanar(tracos) {
    const pts = [];
    tracos.forEach((t, id) => t.forEach(p => pts.push({ x: p.x, y: p.y, id })));
    return pts;
  }

  function longitud(pts) {
    let d = 0;
    for (let i = 1; i < pts.length; i++)
      if (pts[i].id === pts[i - 1].id) d += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return d;
  }

  function remostrejar(pts, n) {
    const I = longitud(pts) / (n - 1);
    if (!I) return Array.from({ length: n }, () => ({ ...pts[0] }));
    let D = 0;
    const res = [{ ...pts[0] }];
    pts = pts.map(p => ({ ...p }));
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].id !== pts[i - 1].id) continue;
      const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (D + d >= I) {
        const t = (I - D) / d;
        const q = { x: pts[i - 1].x + t * (pts[i].x - pts[i - 1].x),
                    y: pts[i - 1].y + t * (pts[i].y - pts[i - 1].y), id: pts[i].id };
        res.push(q);
        pts.splice(i, 0, q);
        D = 0;
      } else D += d;
    }
    while (res.length < n) res.push({ ...pts[pts.length - 1] });
    return res.slice(0, n);
  }

  function normalitzar(pts) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }
    const s = Math.max(maxX - minX, maxY - minY) || 1;
    let cx = 0, cy = 0;
    const q = pts.map(p => ({ x: (p.x - minX) / s, y: (p.y - minY) / s, id: p.id }));
    q.forEach(p => { cx += p.x; cy += p.y; });
    cx /= q.length; cy /= q.length;
    return q.map(p => ({ x: p.x - cx, y: p.y - cy, id: p.id }));
  }

  function preparar(tracos) {
    return normalitzar(remostrejar(aplanar(tracos), N));
  }

  function distanciaNuvol(a, b, inici, millor) {
    const n = a.length, usat = new Array(n).fill(false);
    let suma = 0, i = inici;
    do {
      let min = Infinity, idx = -1;
      for (let j = 0; j < n; j++) {
        if (usat[j]) continue;
        const d = Math.hypot(a[i].x - b[j].x, a[i].y - b[j].y);
        if (d < min) { min = d; idx = j; }
      }
      usat[idx] = true;
      const pes = 1 - ((i - inici + n) % n) / n;
      suma += pes * min;
      if (suma >= millor) return suma;
      i = (i + 1) % n;
    } while (i !== inici);
    return suma;
  }

  function comparar(a, b, millor) {
    const pas = Math.floor(Math.pow(N, 0.5));
    let min = millor;
    for (let i = 0; i < N; i += pas) {
      min = Math.min(min, distanciaNuvol(a, b, i, min), distanciaNuvol(b, a, i, min));
    }
    return min;
  }

  const PLANTILLES = [];
  for (const [xifra, variants] of Object.entries(DEFINICIONS))
    for (const tracos of variants) PLANTILLES.push({ xifra, punts: preparar(tracos) });

  // Proporció amplada/alçada del dibuix (un 1 és molt estret; un 4 és ample)
  function proporcio(tracos) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    tracos.forEach(t => t.forEach(p => {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }));
    return (maxX - minX) / Math.max(1, maxY - minY);
  }
  // Hi ha algun tram gairebé horitzontal i prou llarg? (la ratlla del 4)
  function teRatllaHoritzontal(tracos, llarg, pendent) {
    let minY = Infinity, maxY = -Infinity;
    tracos.forEach(t => t.forEach(p => { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }));
    const h = Math.max(1, maxY - minY);
    for (const t of tracos) {
      for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
        const dx = Math.abs(t[j].x - t[i].x), dy = Math.abs(t[j].y - t[i].y);
        if (dx > h * llarg && dy < dx * pendent) return true;
      }
    }
    return false;
  }

  function reconeixer(tracos) {
    const valids = tracos.filter(t => t.length > 0);
    if (!valids.length) return null;
    const punts = preparar(valids);
    // distància mínima per a cada xifra
    const dist = {};
    for (const t of PLANTILLES) {
      const d = comparar(punts, t.punts, dist[t.xifra] ?? Infinity);
      if (d < (dist[t.xifra] ?? Infinity)) dist[t.xifra] = d;
    }
    const ordre = Object.keys(dist).sort((a, b) => dist[a] - dist[b]);
    let xifra = ordre[0];
    // Desempat 1 ↔ 4: el núvol de punts els pot confondre; la forma global no.
    const prop = proporcio(valids);
    if (xifra === '1' && dist['4'] <= LLINDAR && prop > 0.45 && teRatllaHoritzontal(valids, 0.45, 0.25)) xifra = '4';   // clarament té ratlla
    else if (xifra === '4' && dist['1'] <= LLINDAR && (prop < 0.25 || !teRatllaHoritzontal(valids, 0.3, 0.45))) xifra = '1';   // no en té gens
    return dist[xifra] <= LLINDAR ? { xifra, distancia: dist[xifra] } : null;
  }


  // ---------- Número sencer (diverses xifres d'un cop) ----------
  // Agrupa els traços per posició horitzontal: els que es solapen en X formen una mateixa xifra
  // (així el 4, el 5 o el 7 amb ratlla, fets amb dos traços, compten com una sola xifra).
  function agruparXifres(tracos) {
    const valids = tracos.filter(t => t.length > 0);
    if (!valids.length) return [];
    let minY = Infinity, maxY = -Infinity;
    valids.forEach(t => t.forEach(p => { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }));
    const alcada = Math.max(1, maxY - minY);
    const caixes = valids.map(t => {
      const xs = t.map(p => p.x);
      return { t, min: Math.min(...xs), max: Math.max(...xs) };
    }).sort((a, b) => (a.min + a.max) - (b.min + b.max));
    const grups = [];
    for (const c of caixes) {
      const g = grups[grups.length - 1];
      if (g) {
        // Un traç quasi vertical (el pal d'un 4, un 1) té amplada ~0: li donem una amplada mínima
        const minW = alcada * 0.15;
        const ampliar = (a, b) => b - a >= minW ? [a, b] : [(a + b - minW) / 2, (a + b + minW) / 2];
        const [c0, c1] = ampliar(c.min, c.max), [g0, g1] = ampliar(g.min, g.max);
        const solap = Math.min(c1, g1) - Math.max(c0, g0);
        const centreDins = (c0 + c1) / 2 >= g0 && (c0 + c1) / 2 <= g1;
        if (centreDins || solap > 0.3 * Math.min(c1 - c0, g1 - g0)) {
          g.tracos.push(c.t); g.min = Math.min(g.min, c.min); g.max = Math.max(g.max, c.max); continue;
        }
      }
      grups.push({ tracos: [c.t], min: c.min, max: c.max });
    }
    return grups.map(g => g.tracos);
  }

  // Retorna el número com a text ("47") o null si alguna xifra no s'entén.
  function reconeixerNumero(tracos) {
    const grups = agruparXifres(tracos);
    if (!grups.length) return null;
    let text = '';
    for (const g of grups) {
      const r = reconeixer(g);
      if (!r) return null;
      text += r.xifra;
    }
    return text;
  }

  global.ReconeixedorXifres = { reconeixer, reconeixerNumero, agruparXifres, DEFINICIONS };
})(typeof window !== 'undefined' ? window : globalThis);
