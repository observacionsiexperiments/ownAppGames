# Documentació de «Juguem?» (abans AppJocs)

«Juguem?» (abans AppJocs) és un recull de 20 minijocs en català per a primària (HTML, CSS i JavaScript, sense compilar), publicat a GitHub Pages. Aquesta carpeta explica com funciona cada joc i, quan en té, com són els seus fitxers de contingut (JSON) i com fer-los créixer.

Aquesta carpeta no es publica amb l'app: només és al repositori.

## General

- [Com funciona l'app](general.md): pantalla d'inici, `jocs.json`, opcions ⚙️, colors, mides de pantalla i com afegir un joc nou.

## Jocs

| Núm. | Joc                                                 | Tipus   | Contingut en JSON                       |
| ---- | --------------------------------------------------- | ------- | --------------------------------------- |
| 1    | [🔢 Endevina el número](jocs/01-endevina-numero.md) | Xifres  | No                                      |
| 2    | [🌳 L'arbre dels números](jocs/02-arbre-numeros.md) | Xifres  | No                                      |
| 3    | [🔺 La piràmide de números](jocs/03-piramide.md)    | Xifres  | No                                      |
| 4    | [🧩 El quadre numèric](jocs/04-quadre-numeric.md)   | Xifres  | No                                      |
| 5    | [📖 Llegeix i tria](jocs/05-paraules.md)            | Lletres | Llista dins `index.html`                |
| 6    | [⚡ Suma ràpida](jocs/06-suma-rapida.md)            | Xifres  | No                                      |
| 7    | [🔎 Gran o petit?](jocs/07-gran-petit.md)           | Xifres  | No                                      |
| 8    | [✅ Veritat o mentida?](jocs/08-veritat-mentida.md) | Lletres | `temes.json` + `temes/*.json`           |
| 9    | [🔀 Anagrames](jocs/09-anagrames.md)                | Lletres | `temes.json` + `temes/*.json`           |
| 10   | [🧮 Quin número falta?](jocs/10-quin-numero.md)     | Xifres  | No                                      |
| 11   | [#️⃣ Encreuat de números](jocs/11-encreuat.md)       | Xifres  | No                                      |
| 12   | [🔍 Paraula amagada](jocs/12-paraula-amagada.md)    | Lletres | `dades.json`                            |
| 13   | [🎨 Dibuix secret](jocs/13-dibuix-secret.md)        | Xifres  | `dibuixos.json`                         |
| 14   | [🤔 Pensa i resol](jocs/14-pensa-resol.md)          | Xifres  | `problemes.json`                        |
| 15   | [👏 Pica paraules](jocs/15-pica-paraules.md)        | Lletres | `paraules.json`                         |
| 16   | [🔁 Sinònims i antònims](jocs/16-sinonims.md)       | Lletres | `paraules.json`                         |
| 17   | [🐭 Petit o gros?](jocs/17-petit-gros.md)           | Lletres | `paraules.json`                         |
| 18   | [🧩 Paraules compostes](jocs/18-compostes.md)       | Lletres | `paraules.json` + `imatges/`            |
| 19   | [🕵️ Busca l'intrús](jocs/19-intrus.md)              | Lletres | `paraules.json` (+ dades d'altres jocs) |
| 20   | [🗂️ Paraules en família](jocs/20-families.md)       | Lletres | `paraules.json`                         |

## Normes de contingut (per a tots els jocs)

- **Contingut infantil:** res bèl·lic ni violent, sexista o amb estereotips de gènere, insults o despectius, ni alcohol.
- **Llenguatge inclusiu:** «infants», «nens i nenes», «canalla», «amics i amigues», no «nens» com a genèric.
- **Ortografia normativa** (DIEC, Optimot), amb la reforma del 2016.
- **Després de canviar qualsevol fitxer**, cal pujar la versió a `sw.js` (`VERSIO`) i a `js/app.js` (`VERSIO_APP`). Si no, les tauletes i els mòbils amb l'app instal·lada continuaran veient la versió antiga.
