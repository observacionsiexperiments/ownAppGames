# 22. 🧱 Frases desordenades

[← Índex](../README.md) · Carpeta `jocs/frases/` · Lletres

Les paraules d'una frase surten barrejades en fitxes i cal posar-les en ordre a les caselles. Funciona com Anagrames, però amb paraules.

## Pantalla d'inici

- **Tema:** 🐾 Animals, 🏫 Escola, 🏠 Casa i família, 🍎 Menjar, 🌳 Natura i temps o 🎲 Barreja.
- **Dificultat:** 🌱 Fàcil (3–4 paraules), Mitjà (5–6) o Difícil (7–10).
- Les opcions es recorden a `appjocs.frases.opcions`.

## Com es juga

- Es toca una fitxa i va a la primera casella buida, o s'arrossega a la casella que es vulgui (com a Anagrames: pointer events, sense que el soltar faci també clic). Tocar una paraula posada la torna a baix; «↺ Treu-les» les torna totes. Teclat: Tab + Enter per posar, ⌫ per treure l'última.
- El punt final ja hi és. **Majúscula:** al Fàcil i al Mitjà la primera paraula ja porta la majúscula a la fitxa (és una pista); al Difícil totes surten en minúscula. Sempre, la paraula que queda a la primera casella es mostra amb majúscula i la resta en minúscula. Els **noms propis** (les paraules que van en majúscula enmig d'alguna versió de la frase: Sant Feliu de Llobregat, Nadal, Carme, Cisne…) sempre conserven la majúscula.
- Quan totes les caselles són plenes, es comprova sola. Compta com a bona la frase principal i qualsevol dels ordres de `alt`.
- Errors: el primer, rosa («Hi ha paraules canviades de lloc»); després, groc, quantes paraules ja són al seu lloc (respecte de la versió que més s'hi assembla). Al tercer surt «🙈 Mostra-la».
- «💡 Vull una pista»: la primera vegada posa fixa (groga) la primera paraula; la segona, l'última.
- En encertar passa sola a la següent; si s'ha mostrat la frase, surt «Següent ▶».
- 10 frases per partida (a l'atzar del tema i el nivell). Rècord per nivell: `appjocs.frases.record.<nivell>`.

## Contingut: `frases.json`

```json
{
  "temes": [{ "id": "animals", "nom": "Animals", "e": "🐾" }, …],
  "frases": {
    "animals": {
      "facil":   [{ "f": "El gos borda." }, …],
      "mitja":   [{ "f": "Al pati saltem a corda.", "alt": ["Saltem a corda al pati."] }, …],
      "dificil": […]
    }, …
  }
}
```

- `f`: la frase, amb majúscula inicial i punt final. Les paraules se separen per espais; les formes amb apòstrof (l'arbre, m'agrada) o guionet (menjar-la) són una sola fitxa.
- `alt` (opcional): altres ordres bons, amb les mateixes paraules.
- Cal que cada tema i nivell tingui almenys 10 frases. Llargades: Fàcil 3–4 paraules, Mitjà 5–6, Difícil 7–9 (la de les festes de tardor de Sant Feliu de Llobregat en té 10).
- Normes del contingut: sense pilota, televisió, videojocs ni ordinador; sense rols de gènere (les feines de casa es reparteixen; hi ha un mestre i una mestra); padrí i padrina (no avi i iaia); referències de Sant Feliu de Llobregat i de la ludoteca; i, en revisar el contingut, s'hi afegeixen frases, no se'n treuen.

### Com fer-lo créixer

Afegir frases a la llista del tema i el nivell. Un tema nou: afegir-lo a `temes` i crear `frases.<id>` amb els tres nivells (10 frases o més cadascun); la pantalla d'inici el mostra sola.
