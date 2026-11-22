# 14. 🤔 Pensa i resol

[← Índex](../README.md) · Carpeta `jocs/pensa-resol/` · Xifres

Problemes petits de la vida de cada dia: calcular, triar cartes, pagar amb monedes, trobar el que no encaixa i descobrir quina pregunta no es pot respondre.

## Pantalla d'inici

- **Nivell:** Fàcil (fins a 10, es tria entre 3), Mitjà (fins a 20, entre 4) o Difícil (fins a 100, s'escriu la resposta).
- **Tria l'operació:** No / Sí. Amb Sí, abans del número cal dir quina operació toca (+ − ×, i ÷ al Difícil).
- **Lletra:** MAJÚSCULA o minúscula. **Veu:** llegeix l'enunciat (només amb veu catalana).

## Com es juga

Ronda de 10: 5 de càlcul (al Difícil, 4 i una història encadenada de 3 preguntes), 1 de cartes, 1 de monedes, 2 de «Quin no hi encaixa?» i 1 de «Quina pregunta NO es pot respondre?». Després de cada problema hi ha el botó «Següent ▶».

En horitzontal (tauleta i portàtil, v0.44.0) l'enunciat va a l'esquerra; a la dreta, el dibuix o les dades i les respostes, junts i centrats; la franja (missatge + botons) ocupa tota l'amplada a baix.

Pistes: «💡 Vull una pista»; després del primer error la pista surt sola, al segon és més clara i al tercer es mostra la resposta. Les pistes poden portar dibuixos (grups, files) quan hi ha 20 objectes o menys.

## Contingut

Un sol fitxer, `problemes.json`, amb aquests apartats:

| Apartat     | Què hi ha                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| `noms`      | Noms per als problemes, amb l'article: `["Júlia", "la"]`, `["Pau", "en"]` |
| `calcul`    | 34 plantilles de problemes de càlcul                                      |
| `cartes`    | Enunciats del joc de cartes                                               |
| `monedes`   | Textos i objectes per als problemes de pagar                              |
| `preguntes` | Situacions per a «Quina pregunta NO es pot respondre?»                    |
| `histories` | Històries encadenades del Difícil                                         |

### Plantilles de càlcul (`calcul`)

```json
{
  "id": "cromos-regal",
  "f": "suma",
  "nivells": ["facil", "mitja", "dificil"],
  "e1": "🃏",
  "unitat": "cromos",
  "text": "{Nom} té {a} cromos i el seu germà li'n regala {b}. Quants cromos té ara?"
}
```

| Camp        | Per a què serveix                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `f`         | Fórmula que tria els números i calcula la resposta (taula de sota)                                                                          |
| `nivells`   | En quins nivells surt: `facil`, `mitja`, `dificil`                                                                                          |
| `text`      | L'enunciat. `{a}`, `{b}`, `{c}`, `{t}` són els números; `{nom}` = «la Júlia», `{Nom}` = «La Júlia», `{de_nom}` = «de la Júlia» / «d'en Pau» |
| `unitat`    | Què es compta (surt a la resposta)                                                                                                          |
| `e1`, `e2`  | Emojis per als dibuixos de la pista                                                                                                         |
| `files`     | (opcional) Noms de les dues files del dibuix de la pista                                                                                    |
| `b`, `maxB` | (opcional, multiplicacions) `b` fix o el màxim de `b`                                                                                       |
| `op`        | (opcional) L'operació que s'ha de triar, si no és l'habitual de la fórmula                                                                  |

| Fórmula     | Què calcula                         |
| ----------- | ----------------------------------- |
| `suma`      | a + b                               |
| `resta`     | a − b                               |
| `compara`   | quant més té un que l'altre (a − b) |
| `mesResta`  | a − b dit com «quantes en falten»   |
| `menysSuma` | a + b (només Difícil)               |
| `mult`      | a grups de b                        |
| `reparteix` | t entre a (només Difícil)           |
| `agrupa`    | t en grups de b (només Difícil)     |
| `dosPassos` | a + b − c                           |
| `multResta` | a × b − c (Difícil)                 |
| `canvi`     | bitllet − preu (Mitjà i Difícil)    |
| `piramide`  | la base de 3 o 4 maons i el de dalt |

### Altres apartats

```json
// cartes
{ "id": "robot", "quantes": 2, "nivells": ["facil", "mitja", "dificil"],
  "text": "El robot de la ciutat necessita dues targetes que sumin {t}. Quines tries?" }

// preguntes
{ "id": "biblioteca",
  "dades": "La biblioteca té {a} contes i {b} còmics. Aquesta setmana n'han deixat {c} en préstec.",
  "si": [["Quants llibres té la biblioteca en total?", "{a} + {b}"]],
  "no": "Quantes pàgines té cada conte?",
  "falta": "Les dades no diuen res de les pàgines." }
```

- `monedes.textos` usa `{preu}` i `{objecte}`; `monedes.objectes` és la llista d'objectes.
- `preguntes.si`: preguntes que sí es poden respondre, amb el càlcul; `no`: la que no es pot respondre; `falta`: per què.

### Com fer-lo créixer

- **Un problema de càlcul nou:** afegeix una plantilla a `calcul` amb una fórmula de la taula. No cal tocar el codi.
- **Més noms, objectes, cartes o preguntes:** afegeix-los al seu apartat amb el mateix format.
- **Una història nova:** a més del JSON, cal afegir els seus números a `VARS_HISTORIA` dins `index.html` (cada història té els seus).
