# 8. ✅ Veritat o mentida?

[← Índex](../README.md) · Carpeta `jocs/veritat-mentida/` · Lletres

Surt un dibuix i una frase. Cal llegir-la i dir si és veritat o mentida.

## Pantalla d'inici

- **Tema:** 🐾 Animals, 🍎 Fruites i verdures, 🍕 Menjars, 🚗 Transports, 🌦️ Natura i temps, 🚩 Banderes, 😀 Emocions o 🎲 Barreja.
- **Dificultat:**
  - **Fàcil (Sí / No):** «Això és un gat.»
  - **Mitjà (Veritat / Mentida):** frases sobre l'element («El gat té quatre potes»).
  - **Difícil:** com el Mitjà, però si la frase és mentida cal corregir-la triant la paraula que falta entre 3.
- **Lletra:** MAJÚSCULA o minúscula. **Temps:** 10, 15 o 20 s, o sense temps.

## Com es juga

10 frases, la meitat veritat i la meitat mentida, i un sol intent. Encert en verd amb explicació; error en rosa amb la frase certa; temps esgotat en groc.

Premi: 3 estrelles amb 10 encerts, 2 amb 8 o 9. Rècord per tema i nivell.

## Contingut

Dos nivells de fitxers:

- `temes.json`: la llista de temes.
- `temes/<id>.json`: un fitxer per tema, amb els seus elements.

```json
// temes.json
{
  "temes": [
    {
      "id": "animals",
      "nom": "Animals",
      "icona": "🐾",
      "fitxer": "temes/animals.json"
    }
  ]
}
```

```json
// temes/animals.json
{
  "id": "animals",
  "nom": "Animals",
  "icona": "🐾",
  "facil": "Això és {article} {nom}.",
  "elements": [
    {
      "id": "gat",
      "nom": "gat",
      "article": "un",
      "emoji": "🐱",
      "imatge": "recursos/animals/gat.webp",
      "mitja": {
        "veritat": "El gat té quatre potes.",
        "mentida": "El gat té plomes."
      },
      "dificil": {
        "veritat": "El gat caça ratolins.",
        "mentida": "Els gats ponen ous.",
        "correccio": "Els gats tenen ___.",
        "opcions": ["cries", "ous", "escates"]
      },
      "noConfondre": ["gos"]
    }
  ]
}
```

| Camp                   | Per a què serveix                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `facil`                | Plantilla de la frase del Fàcil (`{article}` i `{nom}` es substitueixen)                    |
| `id`, `nom`, `article` | Identificador, nom i article («un», «una», «l'»)                                            |
| `emoji`                | Dibuix que surt si no hi ha imatge                                                          |
| `imatge`               | Ruta fixa d'una imatge; si el fitxer existeix, substitueix l'emoji                          |
| `mitja`                | Una frase certa i una de falsa                                                              |
| `dificil.correccio`    | La frase certa amb un buit `___`                                                            |
| `dificil.opcions`      | 3 paraules: **la primera és la bona**; el joc les barreja                                   |
| `noConfondre`          | Elements que no han de sortir com a «mentida» del Fàcil perquè s'assemblen massa (opcional) |

### Com fer-lo créixer

- **Un element nou:** afegeix-lo a `elements` del tema, amb tots els camps.
- **Un tema nou:** crea `temes/<id>.json` amb el mateix format i afegeix-lo a `temes.json`. Cada tema necessita prou elements per fer 10 frases (12 o més).
- **Imatges:** posa-les a `recursos/<tema>/<id>.webp` (512 × 512). Ho explica `recursos/LLEGEIX-ME.md`.
- Les banderes són emojis i a Windows no es veuen.
