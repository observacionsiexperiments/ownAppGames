# 16. 🔁 Sinònims i antònims

[← Índex](../README.md) · Carpeta `jocs/sinonims/` · Lletres

Cal trobar paraules que volen dir el mateix (sinònims) o el contrari (antònims).

## Pantalla d'inici

- **Nivell:**
  - **Fàcil:** una paraula i 4 opcions; es clica la bona. 10 paraules.
  - **Mitjà:** 2 + 2 paraules que s'uneixen amb línies; es comprova cada línia. 5 taulers.
  - **Difícil:** 6 paraules a l'esquerra (fins a 8 a la dreta); es comprova amb «Comprova ✓» quan es vulgui, també amb les línies a mitges. 3 taulers.
- **Què es busca:** Sinònims ＝, Antònims ≠ o Barrejat (al Fàcil, un rètol gran diu si és «EL MATEIX» o «EL CONTRARI»; als taulers, cada tauler és d'un sol tipus i s'alternen).
- **Més d'una parella:** Sí / No (una paraula pot tenir dues respostes bones).
- **Temps:** sense temps, Normal o Ràpid. **Lletra** i **veu**.

## Com es juga

Les línies es fan arrossegant amb el ratolí o el dit, o amb clic a una paraula i clic a l'altra. Una línia bona queda verda; una de dolenta, rosa, i s'esborra. Al segon error amb la mateixa paraula surt una pista; al tercer, es mostren les respostes en groc.

## Contingut

Un sol fitxer, `paraules.json`, amb grups de sinònims:

```json
{
  "grups": [
    {
      "id": "petit",
      "paraules": ["petit", "menut", "xic"],
      "contraris": ["gran"]
    },
    {
      "id": "gran",
      "paraules": ["gran", "enorme", "gegant"],
      "contraris": ["petit"]
    }
  ]
}
```

| Camp        | Per a què serveix                           |
| ----------- | ------------------------------------------- |
| `id`        | Identificador del grup (la primera paraula) |
| `paraules`  | Paraules que volen dir el mateix            |
| `contraris` | `id` dels grups que en són el contrari      |

Ara hi ha 95 grups i 143 paraules. Els grups units per contraris formen «famílies»: el joc mai posa en un mateix tauler ni com a opció falsa dues paraules de la mateixa família, perquè no hi hagi dues respostes possibles.

### Com fer-lo créixer

- **Un sinònim nou:** afegeix la paraula al grup que toca.
- **Un grup nou:** dona-li un `id` i, si té contrari, posa'l als dos grups (cada grup ha de tenir l'altre a `contraris`).
- També el fa servir **Busca l'intrús** per als criteris de vocabulari, però aquell joc té la seva pròpia llista de sinònims.
