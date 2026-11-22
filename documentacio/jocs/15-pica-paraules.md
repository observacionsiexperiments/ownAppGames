# 15. 👏 Pica paraules

[← Índex](../README.md) · Carpeta `jocs/pica-paraules/` · Lletres

Surt una paraula en lletra gran i cal dir quantes síl·labes té, picant de mans i tocant el número.

## Pantalla d'inici

- **Nivell:** Fàcil (1 o 2 síl·labes), Mitjà (de 1 a 4) o Difícil (de 1 a 6).
- **Temps:** sense temps, 15 s o 10 s.
- **Lletra:** MAJÚSCULA o minúscula. **Veu:** llegeix la paraula (només amb veu catalana).

## Com es juga

10 paraules, repartides entre tots els tamanys del nivell. Sense temps hi ha 3 intents: el primer error diu «Pica de mans a cada tros…»; el segon separa la primera síl·laba; el tercer mostra la paraula separada i el número en groc. Amb temps hi ha un sol intent. En encertar, la paraula surt separada en verd.

Premi: 3 estrelles amb 10 a la primera, 2 amb 8 o 9.

## Contingut

Un sol fitxer, `paraules.json`, amb les paraules agrupades pel nombre de síl·labes:

```json
{
  "paraules": {
    "1": ["sol", "pa", …],
    "2": ["ca-sa", …],
    "3": ["pi-lo-ta", …],
    "4": ["pa-pa-llo-na", …],
    "5": ["ma-te-mà-ti-ques", …],
    "6": ["res-pon-sa-bi-li-tat", …]
  }
}
```

Ara n'hi ha 201. Les síl·labes se separen amb un guionet: el joc fa servir el guionet per comptar-les i per mostrar la paraula separada.

### Com fer-lo créixer

- Afegeix la paraula a la llista del seu nombre de síl·labes, amb les síl·labes separades per guionets.
- Separació normativa de l'IEC. Evita paraules amb hiatus dubtosos o amb ela geminada (l·l), que confonen en comptar.
