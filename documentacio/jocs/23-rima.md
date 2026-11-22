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

### Difícil: escriptura lliure

La targeta «✏️ N'escric una» s'obre en una caixa de text. Com es decideix:

1. Si és la mateixa paraula de dalt: «Aquesta ja és la de dalt» (sense error).
2. Si és a la llista del grup (paraules amb dibuix o `escrites`), sense mirar accents: encert, «⭐ Paraula teva!». Les paraules teves surten a la celebració i sumen una estrella.
3. Si rima però no és a la llista, o si l'app no la coneix: sense error, «Aquesta no la tinc a la meva llista».
4. Si l'app la coneix (`conegudes`) i no rima: error, com una targeta equivocada.

Quan rima: la paraula ha d'acabar amb la terminació del grup (sense mirar accents ni dièresi). Si abans de la terminació hi ha una vocal amb accent, la força és allà i no rima («pèsol» no rima amb «sol»). Als grups acabats en vocal forta (-ó, -à) cal l'accent, tret dels monosíl·labs («pa», «ja»).

## Contingut: `rimes.json`

```json
{
  "grups": [
    { "rima": "at", "dibuix": [{ "p": "gat", "e": "🐱" }, …], "escrites": ["prat", "forat", …] }, …
  ],
  "conegudes": ["abella", "avió", …]
}
```

- `rima`: la terminació des de la vocal forta, sense accent (`o` per a -ó, `a` per a -à).
- `dibuix`: paraules amb emoji; són les que surten al Fàcil i al Mitjà.
- `escrites`: paraules que surten al Difícil i que s'accepten a l'escriptura lliure.
- `conegudes`: totes les paraules dels grups i les de `jocs/intrus/paraules.json`. Serveix per saber si una paraula escrita que no rima és una paraula coneguda (error) o desconeguda (sense error). Es genera de nou quan es canvien els grups.
- Normes del contingut: sense pilota, futbol ni ordinador.

### Com fer-lo créixer

Afegir paraules a `dibuix` (amb emoji) o a `escrites`, o un grup nou. Cada grup necessita almenys 2 paraules amb dibuix per sortir al Fàcil i al Mitjà.
