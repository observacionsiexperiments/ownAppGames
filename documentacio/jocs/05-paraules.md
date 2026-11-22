# 5. 📖 Llegeix i tria

[← Índex](../README.md) · Carpeta `jocs/paraules/` · Lletres

Surt una paraula en lletra gran, separada en síl·labes, i quatre dibuixos. Cal llegir-la i tocar el dibuix que hi correspon.

## Pantalla d'inici

- **Síl·labes:** 1, 2 o totes.
- **Lletra:** MAJÚSCULA o minúscula.
- **Dificultat:** Fàcil (dibuixos a l'atzar) o Difícil (dibuixos de paraules que s'hi assemblen: mateixa primera síl·laba, mateixa primera lletra, mateix final…).
- **Veu:** apagada (per defecte) o encesa, només si el dispositiu té veu catalana.

## Com es juga

10 paraules per ronda. Encert en verd; error en rosa amb ✕. Amb veu, el botó groc 🔊 llegeix la paraula síl·laba a síl·laba.

Premi: 3 estrelles sense errors, 2 amb 3 errors o menys, 1 si no.

## Contingut

Les paraules no són en un JSON: són a la llista `PARAULES` del mateix `jocs/paraules/index.html` (74 paraules).

```js
const PARAULES = [
  ["SOL", "☀️"],
  ["PA", "🍞"], // 1 síl·laba
  ["CA·SA", "🏠"],
  ["PO·MA", "🍎"], // 2 síl·labes, separades amb el punt volat ·
];
```

### Com afegir-ne

- Cada paraula és `['PARAULA', 'emoji']`, en majúscules i amb les síl·labes separades per `·` (punt volat).
- Cal un emoji clar i que no es repeteixi.
- Posa-la al grup de síl·labes que toca (comentaris `// 1 síl·laba`, `// 2 síl·labes`).
