# 13. 🎨 Dibuix secret

[← Índex](../README.md) · Carpeta `jocs/dibuix-secret/` · Xifres

Una quadrícula de números. Surt una ordre cada vegada («Pinta de 🔴 vermell el trenta-dos» o «… el resultat de 4 × 8») i, en tocar la casella, es pinta. Al final desapareixen els números i queda el dibuix.

## Pantalla d'inici

- **Dificultat** (mida de la quadrícula): 🌱 6×6 de l'1 al 36, Mitjà 10×10 de l'1 al 100, Difícil 13×13 del 0 al 168.
- **Com surt el número:** ✍️ escrit en lletres («vint-i-u», «cent trenta-dos») o 🧮 amb una operació.
- **Lletra:** MAJÚSCULA o minúscula (només amb lletres).

## Com es juga

Primer error en rosa («Aquesta és la casella del N»); segon, pista en groc (a quina fila és); tercer, la casella s'il·lumina. Al mòbil, si les caselles són molt petites, surt una lupa en tocar.

## Contingut

Un sol fitxer, `dibuixos.json`:

```json
{
  "colors": { "K": ["negre", "#3B3355"], "R": ["vermell", "…"], … },
  "dibuixos": {
    "6":  [ { "id": "cor", "nom": "un cor",
              "files": [".R..R.", "RRRRRR", "RRRRRR", ".RRRR.", "..RR..", "......"] } ],
    "10": [ … ],
    "13": [ … ]
  }
}
```

| Camp       | Per a què serveix                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `colors`   | Cada lletra és un color: `[nom en català, color]`. Hi ha K negre, R vermell, O taronja, Y groc, G verd, B blau, M marró, N rosa i P lila |
| `dibuixos` | Els dibuixos per mida de quadrícula (6, 10 o 13)                                                                                         |
| `files`    | Una línia de text per fila: `.` = casella buida, una lletra = el color d'aquella casella                                                 |

### Com fer-lo créixer

- **Un dibuix nou:** afegeix un objecte a la mida que toca, amb tantes files com la mida i cada fila amb tants caràcters com la mida (6, 10 o 13).
- Fes servir només les lletres de `colors`. Per a un color nou, afegeix-lo a `colors` amb el seu nom.
- El joc no repeteix l'últim dibuix de cada mida.
