# 9. 🔀 Anagrames

[← Índex](../README.md) · Carpeta `jocs/anagrames/` · Lletres

Les lletres d'una paraula surten desordenades i cal posar-les en ordre a les caselles.

## Pantalla d'inici

- **Tema:** 12 temes (Animals, Fruites i verdures, Menjars, Transports, Natura i temps, Emocions, Casa, Cos humà, Escola, Contes i llibres, Festes i cultura, Personatges) o 🎲 Barreja.
- **Dificultat** (surt sola de la llargada): Fàcil 3–4 lletres (amb dibuix), Mitjà 5–6, Difícil 7–10 (dibuix només amb la pista).

## Com es juga

10 paraules, sense temps. Es toca una fitxa i va a la primera casella lliure, o s'arrossega a qualsevol casella. També es pot escriure amb el teclat (A val per À, C per Ç), i ⌫ treu l'última lletra.

- **Pistes (groc):** «💡 Vull una pista» (una frase, i el dibuix al Mitjà i al Difícil) i «🔤 Destapa una lletra». Des de la v0.44.0 són a la franja de sota, al costat del missatge, amb «↺ Treu-les» (rosa) i «🙈 Mostra-la»; al mòbil vertical, en una fila sota el missatge amb text curt («💡 Pista», «🔤 Lletra»).
- **Errors:** el primer, «Hi ha lletres canviades de lloc» en rosa; després, en groc, quantes lletres ja són al seu lloc. A partir del tercer error surt 🙈 Mostra-la.

## Contingut

- `temes.json`: la llista de temes.
- `temes/<id>.json`: les paraules de cada tema.

```json
// temes/animals.json
{
  "id": "animals",
  "nom": "Animals",
  "icona": "🐾",
  "paraules": [
    {
      "id": "gos",
      "paraula": "gos",
      "emoji": "🐶",
      "imatge": "recursos/animals/gos.webp",
      "pista": "Borda i mou la cua quan està content."
    }
  ]
}
```

| Camp               | Per a què serveix                                             |
| ------------------ | ------------------------------------------------------------- |
| `paraula`          | La paraula que s'ha de formar (els noms propis amb majúscula) |
| `emoji` / `imatge` | Dibuix; la imatge substitueix l'emoji si el fitxer existeix   |
| `pista`            | Frase que surt amb el botó 📝 Pista                           |
| `font`             | (opcional) D'on surt un personatge (llibre, sèrie…)           |

### Com fer-lo créixer

- **Una paraula nova:** afegeix-la a `paraules` del tema. El nivell surt sol de la llargada.
- **Un tema nou:** crea `temes/<id>.json` i afegeix-lo a `temes.json`. Si un tema no té 10 paraules d'un nivell, el joc completa amb les de llargada més propera.
- **Imatges:** `recursos/<tema>/<id>.webp`, tal com explica `recursos/LLEGEIX-ME.md`.
