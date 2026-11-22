# Com funciona l'app

[← Índex](README.md)

«Juguem?» (abans AppJocs) és una PWA (una web que es pot instal·lar com una app) feta només amb HTML, CSS i JavaScript. No hi ha cap pas de compilació: el que hi ha a la carpeta és el que es publica.

## Estructura de carpetes

| Ruta                                             | Què és                                                          |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `index.html` + `js/app.js`                       | Pantalla d'inici (llançadora) amb les targetes dels jocs        |
| `manual.html`                                    | Manual d'ús per a famílies i mestres (botó a ⚙️ Opcions)        |
| `css/styles.css`                                 | Estils comuns i colors                                          |
| `sw.js`                                          | Service worker: fa que l'app funcioni sense connexió            |
| `manifest.webmanifest`, `icons/`                 | Dades i icones per instal·lar l'app                             |
| `js/preferencies.js`                             | Opcions generals (nom, temporitzador, comptar errors)           |
| `js/celebracio.js`                               | Celebracions (petita en encertar i gran en acabar la partida)   |
| `js/pantalla.js`                                 | Avís d'orientació i càlculs de mida de pantalla                 |
| `js/entrada-numero.js`, `js/finestra-entrada.js` | Teclat per escriure números (i la finestra gran al mòbil)       |
| `jocs/jocs.json`                                 | Llista de jocs que surten a la pantalla d'inici                 |
| `jocs/<id>/`                                     | Cada joc a la seva carpeta (`index.html` i, si en té, els JSON) |
| `documentacio/`                                  | Aquesta documentació (no es publica)                            |

## La pantalla d'inici i `jocs/jocs.json`

La pantalla d'inici llegeix `jocs/jocs.json` i pinta una targeta per joc, ordenades pel número. Cada entrada té:

| Camp         | Exemple              | Per a què serveix                                           |
| ------------ | -------------------- | ----------------------------------------------------------- |
| `id`         | `"intrus"`           | Nom de la carpeta del joc (`jocs/intrus/`)                  |
| `num`        | `19`                 | Número gran de la targeta; també es pot buscar escrivint-lo |
| `nom`        | `"Busca l'intrús"`   | Títol de la targeta (surt en majúscules)                    |
| `icona`      | `"🕵️"`               | Emoji de la targeta                                         |
| `descripcio` | `"Quatre dibuixos…"` | Text curt de la targeta                                     |
| `objectiu`   | `"Trobar l'intrús…"` | Es fa servir per al buscador                                |
| `categories` | `["lletres"]`        | Filtre de la pantalla d'inici: `xifres` o `lletres`         |
| `estat`      | `"actiu"`            | `actiu`, `properament` (targeta grisa) o `ocult` (no surt)  |

La pantalla d'inici és pensada per a tauleta: 3 targetes per fila en horitzontal i 2 en vertical. Si no hi caben totes, llisca cap avall. El buscador troba per nom, per descripció o pel número del joc.

## Opcions generals (⚙️)

Les guarda `js/preferencies.js` al dispositiu (`localStorage`, clau `appjocs.preferencies`) i les fan servir tots els jocs:

- **Nom:** surt en algunes felicitacions («Molt bé, Anna!») i a la celebració final.
- **Temporitzador Sí/No:** amb «No», els jocs amaguen l'opció de temps i es juga sense temps.
- **Comptar errors i intents Sí/No:** amb «No», no hi ha comptadors, rècords ni estrelles; els errors continuen sortint en rosa.

## Coses comunes a tots els jocs

- **Colors amb funció:** verd = encert; rosa = error o esborrar; groc = pista o temps que s'acaba; blau = seleccionat o informació; préssec = acció (botons generals).
- **Pistes progressives:** primer error en rosa; segon error, pista en groc que orienta sense donar la resposta; tercer error, es mostra la resposta. Amb temps, normalment hi ha un sol intent.
- **Tot ha de cabre a la pantalla sense lliscar** (menys la pantalla d'inici). Es prova a 11 mides: 1024×690, 1180×740, 1280×720, 1366×950, 768×1024, 820×1180, 390×844, 360×740, 375×667, 844×390 i 740×360.
- **Ratolí i teclat:** es juga molt amb Chromebook sense pantalla tàctil. Tot es pot fer amb el ratolí (arrossegar o clic-clic) i, on s'escriu, amb el teclat. No hi ha dreceres numèriques per triar targetes: la resposta es dona clicant la targeta.
- **Rècords:** cada joc els guarda a `localStorage` amb claus `appjocs.<joc>.record.…`.
- **Final de partida:** celebració amb estrelles i els botons «🔁 Tornar a jugar» i «🏠 Menú principal».

## Afegir un joc nou

1. Crea `jocs/<id>/index.html` (es pot partir de `jocs/_plantilla/` o d'un joc semblant). Ha de carregar `../../js/pantalla.js`, `../../js/preferencies.js` i `../../js/celebracio.js`.
2. Afegeix-lo a `jocs/jocs.json` amb el número següent (`num`) i la categoria.
3. Afegeix una fila a la taula de jocs de `manual.html` i actualitza el nombre de jocs del text.
4. Prova les 11 mides de pantalla, i la pantalla d'inici amb el joc nou.
5. Puja la versió a `sw.js` i a `js/app.js`.
6. Escriu el seu document en aquesta carpeta i enllaça'l a l'índex.

Un fitxer nou a l'arrel del projecte (fora de `jocs/`) també s'ha d'afegir a la línia `cp -r …` de `.github/workflows/deploy.yml`, o no es publicarà.

## Publicar

Cada `push` a la branca `main` publica l'app a https://observacionsiexperiments.github.io/ownAppGames/ (GitHub Actions). Els commits es fan amb el correu noreply de GitHub.
