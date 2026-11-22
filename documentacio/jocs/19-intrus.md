# 19. 🕵️ Busca l'intrús

[← Índex](../README.md) · Carpeta `jocs/intrus/` · Lletres

Surten 4 dibuixos o paraules: tres comparteixen alguna cosa i un no. Cal trobar l'intrús i, al nivell Difícil, dir per què.

## Pantalla d'inici

- **Dificultat:** 🌱 Fàcil (dibuixos), Mitjà (paraules) o Difícil (paraules i motiu).
- **Temps per fitxa:** sense temps, 10, 15 (per defecte) o 20 s. Comença a comptar quan surt la fitxa.
- **Lletra:** MAJÚSCULA o minúscula.

## Criteris

Els criteris se sumen d'un nivell al següent:

| Criteri              | Nivell          | Exemple (l'intrús és l'últim)           |
| -------------------- | --------------- | --------------------------------------- |
| Lletra inicial       | Tots            | pilota, poma, porta · llibre            |
| Grup (camp semàntic) | Tots            | gos, gat, cavall · cotxe                |
| Síl·laba inicial     | Tots            | ca-vall, ca-di-ra, ca-mi-ó · pi-lo-ta   |
| Rima                 | Mitjà i Difícil | sabata, patata, corbata · taula         |
| Singular o plural    | Mitjà i Difícil | gats, cases, flors · poma               |
| Sinònims i antònims  | Mitjà i Difícil | gran, gegant, enorme · petit            |
| Part i tot           | Mitjà i Difícil | roda, volant, motor · semàfor           |
| Paraules compostes   | Mitjà i Difícil | paraigua, gira-sol, rentaplats · cadira |
| Nombre de síl·labes  | Difícil         | sol, pa, tren · poma                    |
| Nom, verb o adjectiu | Difícil         | córrer, saltar, nedar · taula           |
| Intensitat o grau    | Difícil         | gelat, fred, fresc · bullent            |
| Diminutius           | Difícil         | gatet, cotxet, llibret · taula          |

Al Fàcil, per a la lletra i la síl·laba inicial surt una targeta amb la lletra o la síl·laba («Quin NO comença per P?»). Al Mitjà i al Difícil no es diu quin criteri és.

## Com es juga

Es clica la targeta de l'intrús. Primer error en rosa; segon, pista en groc sobre què cal mirar; tercer, es mostra l'intrús. Amb temps hi ha un sol intent. Al Difícil, després de trobar l'intrús surten 3 motius i només un és cert. Sempre surt l'explicació («"Cotxe" és un transport; gos, gat i cavall són animals») i el botó «Següent ▶».

Premi: 3 estrelles amb 9 o més a la primera, 2 amb 2 o menys malament.

## Com es fan les rondes

Les rondes no estan escrites una a una: el joc les munta a partir de la fitxa de cada paraula (grup, síl·labes, si és plural…). A cada ronda comprova que:

- només hi hagi una resposta bona: si una altra paraula també podria ser l'intrús per un altre criteri del nivell, la ronda es descarta;
- les paraules amb dos sentits (taronja, rosa, estrella) no surtin amb paraules de l'altre grup;
- al Fàcil, l'intrús no comenci per un so que es confon amb el de les altres (B i V, A i E, O i U, S i Z);
- al Difícil, els motius falsos siguin falsos tal com es llegeixen.

## Contingut

`paraules.json` té la major part del contingut. A més, el joc llegeix les paraules compostes de `../compostes/paraules.json` i els diminutius de `../petit-gros/paraules.json`.

```json
{
  "elements": [
    { "p": "gos", "s": "gos", "e": "🐶", "g": "animals" },
    { "p": "cavall", "s": "ca-vall", "e": "🐴", "g": "animals" },
    { "p": "girafa", "s": "gi-ra-fa", "e": "🦒", "g": "animals", "x": 1 },
    { "p": "pantalons", "s": "pan-ta-lons", "e": "👖", "g": "roba", "pl": 1 },
    {
      "p": "taronja",
      "s": "ta-ron-ja",
      "e": "🍊",
      "g": "fruites",
      "d": "colors"
    },
    { "p": "dilluns", "s": "di-lluns", "g": "dies" },
    { "p": "corbata", "s": "cor-ba-ta" }
  ],
  "grups": { "animals": { "u": "un animal", "pl": "animals", "f": "animals" } },
  "rimes": ["ata", "eta", "ell", "all", "ó", "or"],
  "plurals": [
    ["gat", "gats"],
    ["casa", "cases"]
  ],
  "gram": { "verb": ["córrer", "saltar"], "adjectiu": ["petit", "alt"] },
  "sinonims": [
    { "iguals": ["gran", "enorme", "gegant"], "contraris": ["petit", "menut"] }
  ],
  "partTot": [
    {
      "tot": "del cotxe",
      "parts": ["roda", "volant", "motor"],
      "fora": ["semàfor", "carretera"]
    }
  ],
  "intensitat": [
    {
      "a": ["gelat", "fred", "fresc"],
      "da": "del costat del fred",
      "b": ["calent", "bullent"],
      "db": "del costat de la calor"
    }
  ]
}
```

### `elements` (203 paraules)

| Camp    | Per a què serveix                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| `p`     | La paraula                                                                                                    |
| `s`     | Les síl·labes separades amb guionet (síl·laba inicial i nombre de síl·labes)                                  |
| `e`     | Emoji. Només les paraules amb emoji surten al Fàcil                                                           |
| `g`     | Grup (ha d'existir a `grups`). Sense grup, la paraula només surt per lletra, síl·laba o rima                  |
| `x: 1`  | No serveix per a la lletra inicial del Fàcil perquè no sona com la lletra (g o c suaus: girafa, ceba; h muda) |
| `pl: 1` | Paraula en plural (pantalons, mitjons, tisores…)                                                              |
| `d`     | Doble sentit: l'altre grup on podria anar (taronja també és un color)                                         |

### Altres apartats

| Apartat      | Per a què serveix                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grups`      | Nom de cada grup en singular (`u`) i plural (`pl`) per a les explicacions, i família (`f`): al Fàcil l'intrús ve d'una altra família; al Mitjà pot ser de la mateixa (fruites amb una verdura) |
| `rimes`      | Finals que compten com a rima                                                                                                                                                                  |
| `plurals`    | Parelles singular–plural                                                                                                                                                                       |
| `gram`       | Verbs i adjectius (els noms són els `elements` amb grup). Evita paraules que puguin ser nom i verb alhora (menjar, riure)                                                                      |
| `sinonims`   | Tres o més paraules iguals i els seus contraris                                                                                                                                                |
| `partTot`    | Parts d'una cosa i coses del mateix ambient que no en formen part. `tot` ja porta l'article («del cotxe»)                                                                                      |
| `intensitat` | Escales amb dos extrems: paraules d'un costat (`a`) i de l'altre (`b`), amb la frase de cada costat                                                                                            |

### Com fer-lo créixer

- **Una paraula nova:** afegeix-la a `elements` amb les síl·labes ben separades. Per al Fàcil, amb un emoji clar i que no es repeteixi. Si té dos sentits, marca'l amb `d`.
- **Un grup nou:** afegeix-lo a `grups` amb `u`, `pl` i `f`, i posa almenys 3 paraules amb aquell grup.
- **Una rima nova:** afegeix el final a `rimes` i assegura't que hi hagi 3 paraules o més que hi acabin.
- **Més vocabulari:** sinònims, parts i escales d'intensitat s'amplien afegint entrades amb el mateix format.
- Després de canviar el fitxer, convé generar moltes rondes per comprovar que no n'hi ha cap d'ambigua (Claude ho fa amb una prova automàtica).
