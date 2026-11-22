# 17. 🐭 Petit o gros?

[← Índex](../README.md) · Carpeta `jocs/petit-gros/` · Lletres

Diminutius (-et/-eta, -ol/-ola) i augmentatius (-às/-assa), sense pejoratius.

## Pantalla d'inici

- **Nivell:**
  - **Fàcil:** la paraula al mig i la casella al costat; es tria entre 2 opcions. 10 paraules.
  - **Mitjà:** s'uneixen paraules amb la seva forma amb línies. 5 taulers.
  - **Difícil:** s'escriu la forma amb el teclat. 10 paraules.
- **Què es busca:** ← 🐭 Diminutiu, Augmentatiu 🐘 → o ← Els dos →.
- **Temps:** sense temps, Normal o Ràpid. **Lletra:** MAJÚSCULA o minúscula.

## Com es juga

La fila és `← casella · PARAULA · casella →`: a l'esquerra el més petit i a la dreta el més gros. L'etiqueta «← 🐭 més petit» / «més gros 🐘 →» és una píndola gran centrada sobre la casella (v0.44.0). Al Difícil, si només falla l'accent surt «Gairebé! Revisa l'accent». Al segon error, la pista explica la regla d'ortografia («treu la vocal final i afegeix -et»).

## Contingut

Un sol fitxer, `paraules.json`:

```json
{
  "paraules": [
    { "p": "gat", "dim": "gatet", "aug": "gatàs", "regla": "regular" },
    {
      "p": "mà",
      "dim": "maneta",
      "aug": "manassa",
      "regla": "especial",
      "arrel": "man"
    },
    {
      "p": "pa",
      "dim": "panet",
      "aug": null,
      "regla": "especial",
      "arrel": "pan"
    }
  ]
}
```

| Camp    | Per a què serveix                                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p`     | La paraula                                                                                                                                            |
| `dim`   | El diminutiu                                                                                                                                          |
| `aug`   | L'augmentatiu, o `null` si no sona natural o pot ser despectiu                                                                                        |
| `regla` | Regla d'ortografia del diminutiu, per a la pista: `regular`, `vocal` (perd la vocal final), `ss`, `qu`, `gu`, `cgu` (c → gu), `çc`, `jg` o `especial` |
| `arrel` | Només amb `especial`: com queda la paraula abans del sufix (mà → `man`-)                                                                              |

Ara n'hi ha 46 (37 amb augmentatiu). Al Fàcil només surten les regles `regular` i `vocal`.

### Com fer-lo créixer

- Afegeix una entrada amb els quatre camps (i `arrel` si és especial).
- No posis augmentatius de persones que puguin sonar despectius o sexistes: en aquests casos, `aug: null`.
- Els diminutius també els fa servir **Busca l'intrús**.
