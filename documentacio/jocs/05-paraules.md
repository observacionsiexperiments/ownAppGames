# 5. 📖 Llegeix i tria

[← Índex](../README.md) · Carpeta `jocs/paraules/` · Lletres

Surt una paraula en lletra gran, separada en síl·labes, i quatre dibuixos. Cal llegir-la i tocar el dibuix que hi correspon.

## Pantalla d'inici

- **Paraules:** d'1 síl·laba, de 2, de 3, «4 o més» (de 4 a 6), «Curtes» (1 i 2, per defecte) o «Totes» (d'1 a 6).
- **Lletra:** MAJÚSCULA o minúscula.
- **Dificultat:** Fàcil (dibuixos a l'atzar) o Difícil (dibuixos de paraules que s'hi assemblen: mateixa primera síl·laba, mateixa primera lletra, mateix final…).
- **Veu:** apagada (per defecte) o encesa, només si el dispositiu té veu catalana.

## Com es juga

10 paraules per ronda. Encert en verd; error en rosa amb ✕. Amb veu, el botó groc 🔊 llegeix la paraula síl·laba a síl·laba.

Premi: 3 estrelles sense errors, 2 amb 3 errors o menys, 1 si no.

## Contingut

Les paraules no són en un JSON: són a la llista `PARAULES` del mateix `jocs/paraules/index.html` (148 paraules: 32 d'1 síl·laba, 42 de 2, 42 de 3, 22 de 4, 8 de 5 i 2 de 6).

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
- Posa-la al grup de síl·labes que toca (comentaris `// 1 síl·laba`, `// 2 síl·labes`… fins a `// 6 síl·labes`). Separació normativa de l'IEC.

### Paraules llargues

La paraula ha de cabre en una línia: el joc redueix la lletra (`--escala`) fins que hi cap. Si quedaria massa petita (per sota del 72 %), la parteix en dues línies (`.linia`), la primera amb la meitat de les síl·labes, i torna a ajustar la mida.
