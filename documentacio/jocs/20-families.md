# 20. 🗂️ Paraules en família

[← Índex](../README.md) · Carpeta `jocs/families/` · Lletres

Treballa els camps semàntics (paraules d'un mateix tema), els camps lèxics (dins d'un tema, paraules del mateix tipus: objectes, persones, accions…) i les famílies de paraules (paraules amb la mateixa arrel).

## Pantalla d'inici

- **Què vols fer:** 🗂️ Camps, 🌳 Famílies o 🔀 Barrejat (s'alternen).
- **Dificultat:** 🌱 Fàcil (reconèixer, 1r), Mitjà (classificar, 2n) o Difícil (raonar, 3r).
- **Temps per tauler:** sense temps (per defecte), 1, 2 o 3 minuts.
- **Lletra:** MAJÚSCULA o minúscula.

Es juguen 5 taulers.

## Mode Camps

1. **Endevina el tema:** surten 4 o 5 paraules (al Fàcil, amb dibuix) i cal triar el tema entre 3. Les 3 opcions són sempre de blocs diferents (vida quotidiana, natura, persones, tradicions), perquè no s'assemblin. Al primer error, rosa; al segon, es mostra el tema.
2. **Classifica:** les paraules del tema surten a la safata i s'arrosseguen a la capsa del seu camp lèxic (o clic a la paraula i clic a la capsa). Bona: es queda a la capsa en verd. Dolenta: rosa i torna a la safata. Al segon error amb la mateixa paraula s'il·lumina la capsa bona; al tercer, la paraula hi va sola en groc.

| Nivell | Capses | Paraules |
| --- | --- | --- |
| Fàcil | 2, amb dibuixos | 3 per capsa |
| Mitjà | 3 | 3 per capsa |
| Difícil | 4 + «No hi pertany» | 2 per capsa + 2 paraules d'altres temes |

Al Fàcil només surten els temes que tenen 2 camps amb prou paraules amb emoji. Les tradicions surten poc: com a molt un tauler per partida, i no a totes les partides. Una paraula que surt en dos temes (pilota a Joguines i a Esports) mai fa de paraula trampa en cap dels dos.

## Mode Famílies

Surt la paraula base («Família de FLOR») i un núvol de paraules. Es cliquen les de la família i es prem **Comprova**. Les bones queden verdes; les que no són de la família, en rosa, amb l'explicació. Al segon error, una paraula bona es marca amb la vora groga; al tercer, es mostren totes.

| Nivell | Paraules al núvol | Intruses |
| --- | --- | --- |
| Fàcil | 8 | Paraules d'altres famílies que comencen ben diferent. No hi surten les famílies on l'arrel canvia (neu → nevar) |
| Mitjà | 10 | D'altres famílies, i 1 trampa |
| Difícil | 12 | 3 trampes: paraules que comencen igual però no són de la família (marró, març per a *mar*) |

Premi: 3 estrelles amb els 5 taulers a la primera, 2 amb 1 tauler o cap malament. Rècord per mode, nivell i temps.

## Contingut

Un sol fitxer, `paraules.json`, amb dos apartats: `temes` i `families`.

### Temes

```json
{
  "id": "casa", "nom": "Casa", "de": "de la casa", "bloc": "quotidiana",
  "camps": [
    { "nom": "Mobles", "paraules": [ { "p": "llit", "e": "🛏️" }, { "p": "armari" } ] },
    { "nom": "Tasques de casa", "paraules": [ { "p": "escombrar" }, { "p": "parar taula" } ] }
  ]
}
```

| Camp | Per a què serveix |
| --- | --- |
| `id` | Identificador del tema |
| `nom` | Nom sense article («Casa», «Animals»): surt a les opcions d'«Endevina el tema» i a dalt del tauler |
| `de` | Com es diu darrere de «de», per a les explicacions: «"Pilota" no és de la casa» |
| `bloc` | `quotidiana`, `natura`, `persones` o `tradicions`. Les opcions d'«Endevina el tema» són sempre de blocs diferents; les tradicions surten poc |
| `camps` | Els camps lèxics: cada un té `nom` (el títol de la capsa) i les seves `paraules` |
| `p`, `e` | La paraula i, si en té, l'emoji (només les paraules amb emoji surten al Fàcil) |

Ara hi ha 20 temes: Escola, Casa, Aliments, Roba, Joguines, Botigues i mercat, Animals, Bosc, Plantes i flors, Temps atmosfèric, Professions, Emocions, Esports, Transports, Sant Jordi, Castanyada, Tió de Nadal, Castellers, Sardana i Aplec del Caragol.

### Famílies

```json
{
  "arrel": "mar",
  "paraules": ["mar", "mariner", "marinera", "marina", "marítim", "maror", "marejar"],
  "trampes": [ { "p": "marró", "per": "és un color" } ],
  "canvia": true
}
```

| Camp | Per a què serveix |
| --- | --- |
| `paraules` | La família: **la primera és la base**, la que surt a dalt («Família de MAR»); les altres van al núvol |
| `trampes` | Paraules que s'assemblen però no són de la família, amb una explicació curta (`per`). El joc diu: «"Marró" comença com "mar", però és un color: no és de la família» |
| `canvia` | (opcional) L'arrel canvia una mica (neu → nevar, pluja → ploure, feliç → felicitat): no surt al Fàcil |

Ara hi ha 22 famílies.

### Com fer-lo créixer

- **Una paraula nova en un tema:** afegeix-la al camp que toca. Amb emoji, si en té un de clar.
- **Un camp nou en un tema:** afegeix-lo a `camps` amb almenys 3 paraules.
- **Un tema nou:** afegeix-lo a `temes` amb almenys 4 camps (per al Difícil). Perquè surti al Fàcil, almenys 2 camps han de tenir 3 paraules amb emoji.
- **Una família nova:** afegeix-la a `families`, amb la base primer i almenys 3 paraules més. Per al Difícil calen 3 trampes, cada una amb la seva explicació. Només relacions lingüísticament correctes: si un dubte no es pot resoldre, millor no posar-la.
- **Normes de contingut:** res bèl·lic ni violent, sexista, despectiu ni d'alcohol. Els oficis i les persones, en masculí i en femení barrejats.
