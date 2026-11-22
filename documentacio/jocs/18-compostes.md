# 18. 🧩 Paraules compostes

[← Índex](../README.md) · Carpeta `jocs/compostes/` · Lletres

Paraules fetes de dues paraules (renta + plats = rentaplats), amb peces de trencaclosques i, en el mode Visual, amb dibuixos.

## Pantalla d'inici

- **Dificultat:**
  - 🌱 **Fàcil:** una definició i 3 peces (2 de bones i una trampa) per posar als dos forats. 10 paraules.
  - **Mitjà:** 2, 3 o 4 paraules alhora amb totes les seves peces. 5 taulers.
  - **Difícil:** la definició, una part posada i cal escriure l'altra. 10 paraules.
  - 🖼️ **Visual:** un dibuix «cosa + cosa = paraula» i 3 paraules; es clica la bona. 10 dibuixos.
- **Quantes paraules alhora** (només Mitjà). **Temps:** sense temps, Normal o Ràpid. **Lletra:** MAJÚSCULA o minúscula.

## Com es juga

Les peces s'arrosseguen als forats o es fa clic a la peça i després al forat. Quan la paraula és bona, les dues peces s'ajunten en una de sola, verda. Primer error en rosa; segon, pista en groc; tercer, es mostra la paraula. Al Visual, les paraules falses comparteixen una part amb la bona sempre que es pot, perquè calgui mirar els dos dibuixos.

## Contingut

Un fitxer, `paraules.json`, i la carpeta `imatges/` amb els dibuixos del mode Visual.

```json
{
  "paraules": [
    {
      "paraula": "rentaplats",
      "parts": ["renta", "plats"],
      "definicio": "Màquina que renta els plats."
    },
    {
      "paraula": "paraigua",
      "parts": ["para", "aigua"],
      "definicio": "Ens tapa quan plou.",
      "nota": "Es perd una a: para + aigua = paraigua."
    }
  ],
  "evitar": ["passaport", "portaveu", "capicua"],
  "visual": [
    { "paraula": "rentaplats", "imatge": "imatges/rentaplats.webp?v=3" }
  ]
}
```

| Camp       | Per a què serveix                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| `paraules` | Ara n'hi ha 67: la paraula ben escrita, les dues parts i una definició curta                             |
| `nota`     | (opcional) Explicació quan, en ajuntar les parts, canvia alguna lletra o porta guionet                   |
| `evitar`   | Paraules reals que es podrien formar sense voler amb peces d'altres paraules; el joc no les deixa formar |
| `visual`   | Les paraules que tenen dibuix (ara 53) i la ruta de la imatge                                            |

Les parts sempre s'escriuen sense guionet: «gira-sol» té les parts `gira` i `sol`.

### Com fer-lo créixer

- **Una paraula nova:** afegeix-la a `paraules`. Ha de ser composta, normativa, coneguda a primària i sense res bèl·lic, sexista ni despectiu. Si alguna peça seva, unida a una altra peça, forma una paraula real, afegeix aquesta paraula a `evitar`.
- **Un dibuix nou:** la paraula ha de ser també a `paraules`. Les imatges es generen amb el prompt de `imatges/PROMPT-IMATGES.md` (900 × 300, ceres, sense text). Claude les retalla, les passa a WebP i treu els accents del nom del fitxer (`capgròs.png` → `capgros.webp`), i després s'afegeixen a `visual`.
- **Substituir dibuixos:** l'app guarda les imatges al dispositiu. Si se substitueixen, cal canviar `?v=3` per `?v=4` a totes les rutes de `visual`.
- Les paraules compostes també les fa servir **Busca l'intrús**.
