# 10. 🧮 Quin número falta?

[← Índex](../README.md) · Carpeta `jocs/quin-numero/` · Xifres

En prémer «✨ Gira» apareix una operació (suma, resta, multiplicació o divisió) amb un número amagat. Cal trobar-lo.

## Pantalla d'inici

1. **Mode:** 🔁 Ronda (10 operacions), ⏱️ Contrarellotge (1 minut) o ♾️ Lliure (fins que es prem 🏁 Acabar).
2. **Dificultat:**
   - 🌱 **Fàcil:** sumes i restes fins a 10, taules del 2 al 5; es tria entre 3 opcions.
   - **Mitjà:** fins a 20, taules del 2 al 10; es tria entre 4.
   - **Difícil:** fins a 100; s'escriu la resposta amb el teclat de l'app.
3. **Operacions:** + − × ÷ (una o més).
4. **Què s'amaga:** 🎯 el resultat, o 🔀 qualsevol número de l'operació.

## Com es juga

En prémer «Comença!» surt de seguida la primera operació (v0.44.0). Només al Contrarellotge hi ha el pas «▶ Comencem?», perquè és quan comença el temps.

Les opcions trampa són properes a la bona (±1, ±2, ±10, o el resultat d'una altra operació). Primer error en rosa; segon, pista en groc segons l'operació («7 × 3 és 7 + 7 + 7»); tercer, es mostra la resposta. Al Contrarellotge només hi ha rosa i es passa sol a la següent.

## Premi i rècord

Ronda: 3 estrelles amb 9 o més a la primera. Contrarellotge: 3 estrelles amb 15 encerts o més. Rècord per a cada combinació d'opcions.

## Contingut

No té fitxer de contingut: les operacions es generen sense negatius, amb divisions exactes i sense repetir l'anterior.
