# Imatges del joc «Veritat o mentida?»

Cada element dels temes (`../temes/<tema>.json`) té un camp `imatge` amb una ruta fixa, per exemple:

    "imatge": "recursos/animals/gat.webp"

- Si el fitxer existeix, el joc mostra la imatge; si no, mostra l'emoji de l'element.
- La imatge es veu sempre a la mateixa mida (un quadrat), ajustada sense retallar.
- Recomanat: imatges quadrades, 512×512 px, format `.webp` (o `.png`), fons transparent o clar.
- Carpetes: una per tema (`animals/`, `fruites/`, `menjars/`, `transports/`, `natura/`, `banderes/`, `emocions/`).
- Si fas servir un altre nom o format, canvia la ruta del camp `imatge` al JSON.
