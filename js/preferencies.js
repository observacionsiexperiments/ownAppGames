// Preferències comunes de l'app (es trien a ⚙️ Opcions, a la pàgina d'inici) i es guarden al dispositiu.
//
//   Preferencies.nom()        → nom del nen/a ('' si no n'hi ha)
//   Preferencies.temps()      → true: els jocs amb temps el fan servir (compte enrere, cronòmetre, rècords de temps)
//   Preferencies.errors()     → true: es compten errors/intents (comptadors, estrelles, rècords)
//   Preferencies.aparenca()   → 'auto' (segueix el dispositiu) | 'clar' | 'fosc'
//   Preferencies.aplicarAparenca(t) → posa el tema a la pàgina (data-tema a <html>) i el color de la barra
//   Preferencies.desar({nom, temps, errors, aparenca})
//   Preferencies.ambNom('Molt bé!')          → 'Molt bé, Anna!' (si hi ha nom)
//   Preferencies.felicitacio('✓ Molt bé, 12!') → de tant en tant '✓ Molt bé, Anna!'; si no, el text donat

(function (global) {
  const CLAU = 'appjocs.preferencies';
  const PER_DEFECTE = { nom: '', temps: true, errors: true, aparenca: 'auto' };

  function llegir() {
    try { return { ...PER_DEFECTE, ...JSON.parse(localStorage.getItem(CLAU) || '{}') }; }
    catch { return { ...PER_DEFECTE }; }
  }
  function desar(p) {
    const nou = { ...llegir(), ...p };
    nou.nom = String(nou.nom || '').trim().slice(0, 20);
    try { localStorage.setItem(CLAU, JSON.stringify(nou)); } catch {}
    return nou;
  }

  const nom = () => llegir().nom;
  const temps = () => llegir().temps !== false;
  const errors = () => llegir().errors !== false;
  const aparenca = () => (['clar', 'fosc'].includes(llegir().aparenca) ? llegir().aparenca : 'auto');

  // Mode fosc: 'clar' i 'fosc' es posen a <html data-tema>; 'auto' el treu i mana el dispositiu (CSS).
  // També s'actualitza el color de la barra del navegador.
  function aplicarAparenca(t = aparenca()) {
    const h = document.documentElement;
    if (t === 'clar' || t === 'fosc') h.dataset.tema = t; else delete h.dataset.tema;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(h).getPropertyValue('--fons').trim() || '#FFFBF3';
  }
  aplicarAparenca();
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => aplicarAparenca()); } catch {}

  // Afegeix el nom a una frase: "Molt bé!" → "Molt bé, Anna!"
  function ambNom(text) {
    const n = nom();
    if (!n) return text;
    return /!$/.test(text) ? `${text.slice(0, -1)}, ${n}!` : `${text}, ${n}`;
  }

  // Missatge d'encert: una de cada tres vegades (més o menys) diu el nom
  function felicitacio(text) {
    const n = nom();
    return n && Math.random() < 0.35 ? `✓ Molt bé, ${n}!` : text;
  }

  global.Preferencies = { llegir, desar, nom, temps, errors, aparenca, aplicarAparenca, ambNom, felicitacio };
})(window);
