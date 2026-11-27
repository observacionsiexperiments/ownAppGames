# 21. 📏 La recta numèrica

[← Índex](../README.md) · Carpeta `jocs/recta-numerica/` · Xifres

Surt un tros de recta amb 11 marques. Alguns números ja hi són escrits i una fletxa assenyala una marca sense número: cal dir quin número hi va.

## Pantalla d'inici

La pregunta «Fins a quin número?» (es recorda a `appjocs.recta-numerica.nivell`):

| Nivell | Números | Salts entre marques | Com es respon |
| --- | --- | --- | --- |
| 🌱 Fàcil | 0 – 20 | d'1 en 1 | 3 targetes |
| Mitjà | 0 – 100 | de 2, de 5 o de 10 en 10 | 3 targetes |
| Difícil | 0 – 1000 | de 10 o de 100 en 100 | S'escriu amb `EntradaNumero` (teclat o dibuix); al mòbil, amb `FinestraEntrada` |

### ⚙️ A mida (v0.51.0)

El quart botó obre tres grups més (es recorden a `appjocs.recta-numerica.mida`):

- **Del 0 fins al…** 20 · 50 · 100 · 1000.
- **De quant en quant?** d'1, 2, 5, 10 o 100 (se'n poden triar uns quants; cada recta en fa servir un a l'atzar). Cal que hi càpiguen 10 salts (salt × 10 ≤ fins a on): els que no hi caben surten apagats, i si en canviar el «fins al» no en queda cap de triat, es tria el més gran que hi càpiga. Sempre en queda almenys un.
- **Com respons?** 👆 Triant (3 targetes; la fletxa, com al Mitjà, com a molt a 2 marques d'un número escrit) · ✏️ Escrivint (com al Difícil, a qualsevol marca).

Rècord a `appjocs.recta-numerica.record.mida.<fins>.<salts>.<triar|escriure>`.

## Com es fa cada recta

- La recta comença en un múltiple del salt, de manera que les 11 marques no passen del màxim del nivell.
- Es veuen escrits el primer número, l'últim i un del mig (de la 3a a la 9a marca).
- La fletxa assenyala una marca sense número: al Fàcil, sempre al costat d'un número escrit; al Mitjà, com a molt a 2 marques; al Difícil, a qualsevol lloc (millor lluny).
- Trampes (Fàcil i Mitjà): un salt més, un salt menys i, si els salts no són d'1, el número comptant d'1 en 1 des del número escrit de l'esquerra (l'error típic). Mai un número que ja es veu escrit a la recta.
- El dibuix és un SVG. Si la zona fa menys de 560 px d'ample, el llenç és més curt (540 en lloc de 1000) perquè tot surti més gran. La caixa del «?» va a sobre de la línia i els números a sota, perquè no es tapin mai.

## Com es juga

- Primer error: rosa. Segon: pista en groc, «Compta de 5 en 5 des del 35», i les marques entre el número escrit i la fletxa s'il·luminen una a una. El botó «💡 Vull una pista» fa el mateix.
- Tercer error: es mostra la resposta i el compte fet («35, 40, 45, 50»), amb «Següent ▶» (`Pantalla.despres(…, true)`).
- En encertar, el número surt a la recta en verd i passa sol a la següent.
- 10 rectes per partida. Estrelles: 3 amb 9 o més a la primera, 2 amb 2 o menys malament. Rècord per nivell: `appjocs.recta-numerica.record.<nivell>`.

## Contingut

No té fitxer de contingut: les rectes es fan a l'atzar.
