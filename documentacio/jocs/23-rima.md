# 23. 🎵 Rima que rima

[← Índex](../README.md) · Carpeta `jocs/rima/` · Lletres

A dalt surt una paraula i a sota unes quantes targetes: cal trobar la que rima. Rimar vol dir que sonen igual des de la vocal forta fins al final (gat · plat, lleó · camió, gota · granota).

## Pantalla d'inici

Una sola pregunta, la dificultat (es recorda a `appjocs.rima.nivell`):

| Nivell | Paraula de dalt | Targetes |
| --- | --- | --- |
| 🌱 Fàcil | Dibuix + paraula | 3 targetes amb dibuix; 1 rima |
| Mitjà | Dibuix + paraula | 4 targetes amb dibuix; 1 rima |
| Difícil | Només paraula | 3 targetes sense dibuix (1 rima) + «✏️ N'escric una» |

## Com es juga

- Es toca la targeta que rima. Quan s'encerta, la part que rima es marca a les dues paraules i passa sola a la següent.
- Les targetes que no rimen són d'altres grups, i se'n tria una que comenci igual que la de dalt quan n'hi ha (cal escoltar el final, no el principi). Mai dues del mateix grup.
- Segon error, o «💡 Vull una pista»: la part que rima es marca en groc a la paraula de dalt. Tercer error: es mostra la bona i surt «Següent ▶».
- No es repeteix el grup de rima fins després de 8 rondes. 10 paraules per partida. Rècord per nivell: `appjocs.rima.record.<nivell>`.

### Difícil: escriptura lliure (v0.48.1)

La targeta «✏️ N'escric una» s'obre en una caixa de text. **L'app no corregeix la paraula**: en coneix massa poques i deia «no la tinc» a paraules bones. La paraula s'apunta (📝, sense error ni encert) i la ronda s'acaba: s'ensenya una de les targetes que rimen («Una altra que rima: …») i surt «Següent ▶». Al comptador, la ronda surt amb un punt blau discontinu. Al final, la celebració mostra «📝 Per mirar amb un adult: gat → plat, …». No compta per als punts ni per a les estrelles: el resultat final és «N de M a la primera», on M són les rondes en què s'ha triat targeta. Només s'avisa si s'escriu la mateixa paraula de dalt.

## Contingut: `rimes.json`

```json
{
  "grups": [
    { "rima": "at", "dibuix": [{ "p": "gat", "e": "🐱" }, …], "escrites": ["prat", "forat", …] }, …
  ],
}
```

- `rima`: la terminació des de la vocal forta, sense accent (`o` per a -ó, `a` per a -à).
- `dibuix`: paraules amb emoji; són les que surten al Fàcil i al Mitjà.
- `escrites`: paraules sense dibuix, que només surten al Difícil.
- Normes del contingut: sense pilota, futbol ni ordinador.

### Com fer-lo créixer

Afegir paraules a `dibuix` (amb emoji) o a `escrites`, o un grup nou. Cada grup necessita almenys 2 paraules amb dibuix per sortir al Fàcil i al Mitjà.
