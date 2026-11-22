# Juguem? (AppJocs)

PWA amb una pàgina principal que fa de llançadora de minijocs. Es publica a GitHub Pages amb GitHub Actions.

📚 **Documentació de cada joc:** [documentacio/README.md](documentacio/README.md)

## Estructura

```
index.html              Llançadora (pàgina principal)
manifest.webmanifest    Manifest de la PWA
sw.js                   Service worker (ús sense connexió)
css/styles.css          Estils comuns
js/app.js               Lògica de la llançadora
icons/                  Icones de l'app
jocs/jocs.json          Registre de minijocs
jocs/<id>/index.html    Cada minijoc a la seva carpeta
documentacio/           Com funciona cada joc i els seus JSON (no es publica)
.github/workflows/      Desplegament automàtic
```

## Afegir un minijoc

1. Copia `jocs/_plantilla/` a `jocs/<id-nou>/`.
2. Afegeix una entrada a `jocs/jocs.json`:
   ```json
   { "id": "id-nou", "num": 20, "nom": "Nom", "icona": "🎯",
     "descripcio": "Què és", "objectiu": "Què s'ha d'aconseguir",
     "categories": ["lletres"], "estat": "actiu" }
   ```
   `num` és el número següent (surt gran a la targeta) i `categories` pot ser `xifres` o `lletres`.
   `estat` pot ser `actiu`, `properament` (targeta visible però desactivada) o `ocult`.
3. Puja `VERSIO` a `sw.js` perquè els clients rebin l'actualització.

## Desplegament

1. Al repositori: **Settings → Pages → Source: GitHub Actions**.
2. Cada `push` a `main` publica l'app a `https://<usuari>.github.io/<repo>/`.

Totes les rutes són relatives, per això funciona dins la subcarpeta del repositori.

## Provar en local

```
python -m http.server 8000
```
Obre `http://localhost:8000`.
