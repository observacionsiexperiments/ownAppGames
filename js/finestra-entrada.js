// Finestra per escriure números quan la pantalla és petita (mòbil vertical o mòbil apaisat).
// En aquestes pantalles l'entrada de números (teclat o dibuix) no es veu a la pàgina: en tocar la
// casella a omplir, s'obre una finestra gran per sobre de la pàgina (en vertical puja des de baix i
// deixa veure la barra del joc; en apaisat ocupa tota la pantalla en dues columnes) amb el missatge
// del joc i l'entrada. La pàgina del darrere no es mou. Si la resposta és incorrecta, la finestra es queda oberta
// amb l'error o la pista; en encertar, el joc la tanca. En pantalles grans no fa res.
//
// Ús:
//   const finestra = FinestraEntrada.crear({
//     entrada: $('entrada-caixa'),          // bloc que conté el component EntradaNumero
//     info: [$('missatge')],                 // elements que es veuen dins la finestra mentre és oberta
//     avis: 'Toca la casella blava per escriure',   // text que ocupa el lloc de l'entrada a la pàgina
//     disparador: false,                     // true: l'avís és un botó que obre la finestra
//     enObrir: () => entrada.ajustar(),      // p. ex. per redimensionar el llenç de dibuix
//   });
//   finestra.obrir();
//   finestra.tancar();
//   finestra.activa();                       // true si la pantalla fa servir la finestra
//   finestra.posarAvis(text);

(function (global) {
  const MQ = matchMedia('(orientation: portrait) and (max-width: 600px), (orientation: landscape) and (max-height: 500px)');
  const instancies = [];
  let dom = null, oberta = null;

  function crearDom() {
    if (dom) return dom;
    const fons = document.createElement('div');
    fons.className = 'fe-fons'; fons.hidden = true;
    document.body.appendChild(fons);
    fons.addEventListener('click', () => oberta && oberta.tancar());
    const f = document.createElement('section');
    f.className = 'fe-finestra';
    f.setAttribute('role', 'dialog');
    f.setAttribute('aria-label', 'Escriu el número');
    f.hidden = true;
    f.innerHTML = `
      <div class="fe-cap"><b>✏️ Escriu el número</b>
        <button type="button" class="fe-tancar" aria-label="Tanca la finestra">✕</button></div>
      <div class="fe-cos">
        <div class="fe-info"></div>
        <div class="fe-entrada"></div>
      </div>`;
    document.body.appendChild(f);
    f.querySelector('.fe-tancar').addEventListener('click', () => oberta && oberta.tancar());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && oberta) oberta.tancar(); });
    dom = { f, fons, info: f.querySelector('.fe-info'), entrada: f.querySelector('.fe-entrada') };
    return dom;
  }

  function actualitzarMode() {
    document.documentElement.classList.toggle('mode-finestra', MQ.matches);
    if (!MQ.matches && oberta) oberta.tancar();
    instancies.forEach(i => i.refrescar());
  }
  MQ.addEventListener ? MQ.addEventListener('change', actualitzarMode) : MQ.addListener(actualitzarMode);

  function crear(op) {
    const d = crearDom();
    const entrada = op.entrada;
    const info = op.info || [];

    // Lloc a la pàgina on hi havia l'entrada: en mode finestra hi mostrem l'avís
    const lloc = document.createElement(op.disparador ? 'button' : 'p');
    lloc.className = 'fe-lloc' + (op.disparador ? ' fe-disparador' : '');
    if (op.disparador) lloc.type = 'button';
    lloc.textContent = op.avis || '';
    entrada.before(lloc);
    if (op.disparador) lloc.addEventListener('click', () => api.obrir());

    // Marques per tornar cada element al seu lloc en tancar
    const marques = new Map();
    const marca = el => { if (!marques.has(el)) { const m = document.createComment('fe'); el.before(m); marques.set(el, m); } };
    const tornar = el => { const m = marques.get(el); if (m) m.replaceWith(el); marques.delete(el); };

    const api = {
      activa: () => MQ.matches,
      obert: () => oberta === api,
      posarAvis(t) { lloc.textContent = t; },

      obrir() {
        if (!MQ.matches) return false;
        if (oberta && oberta !== api) oberta.tancar();
        if (oberta !== api) {
          info.forEach(el => { marca(el); d.info.appendChild(el); });
          marca(entrada); d.entrada.appendChild(entrada);
          entrada.classList.remove('fe-amagat');
          d.f.hidden = false; d.fons.hidden = false;
          oberta = api;
          document.documentElement.classList.add('fe-oberta');
          requestAnimationFrame(() => { d.f.classList.add('obert'); d.fons.classList.add('obert'); });
          op.enObrir && op.enObrir();
        }
        return true;
      },

      tancar() {
        if (oberta !== api) return;
        oberta = null;
        d.f.classList.remove('obert'); d.fons.classList.remove('obert');
        d.f.hidden = true; d.fons.hidden = true;
        document.documentElement.classList.remove('fe-oberta');
        info.forEach(tornar);
        tornar(entrada);
        api.refrescar();
        op.enTancar && op.enTancar();
      },

      refrescar() {
        if (oberta === api) return;
        entrada.classList.toggle('fe-amagat', MQ.matches);
        if (!MQ.matches) op.enObrir && op.enObrir();   // torna a la pàgina: reajusta el llenç
      },
    };

    instancies.push(api);
    api.refrescar();
    return api;
  }

  document.documentElement.classList.toggle('mode-finestra', MQ.matches);
  global.FinestraEntrada = { crear };
})(window);
