# 1. 🔢 Endevina el número

[← Índex](../README.md) · Carpeta `jocs/endevina-numero/` · Xifres

L'app pensa un número i cal endevinar-lo amb els mínims intents possibles, ajudant-se de les pistes.

## Pantalla d'inici

(v0.44.0) Una sola pregunta, «Fins a quin número?»: **1 – 20** (Fàcil), **1 – 50** (Mitjà) o **1 – 100** (Difícil). Es recorda a `appjocs.endevina-numero.nivell`. «↺ Nova partida» torna a aquesta pantalla, com a la resta de jocs.

## Com es juga

- S'escriu un número amb el teclat de l'app (fins a 3 xifres) i es prem OK.
- A l'esquerra hi ha on s'escriu; a la dreta, la caixa **💡 Pista** i la caixa **🎯 Intents** (comptador, historial i rècord). En vertical i al mòbil van una sota l'altra.

## Pistes

- **Per distància:** «Gairebé!» (a 2 o menys), a 10 o menys, a 25 o menys, o més lluny. Les distàncies són per a l'1–100; als altres nivells es redueixen en proporció (a l'1–20: 1, 2 i 5).
- **Pistes especials** que fan pensar: el doble, la meitat, les xifres girades, ±10…
- **Ajudes fixes:** a l'intent 4 diu si és parell o senar; al 7, la desena; al 10, la suma de les xifres.
- La llista «Ja saps que…» recull tot el que s'ha descobert.

## Premi i rècord

Partint sempre per la meitat es troba en `ceil(log2(MAX))` intents (7 a l'1–100, 6 a l'1–50, 5 a l'1–20). 3 estrelles amb aquest nombre menys 2 o menys; 2 amb aquest nombre més 1 o menys; 1 si no (a l'1–100: 5 i 8, com abans). El rècord (menys intents) es guarda al dispositiu, un per nivell: `appjocs.endevina-numero.record` (1–100, la clau de sempre), `….record.50` i `….record.20`.

## Contingut

No té fitxer de contingut: el número es tria a l'atzar i les pistes es calculen al moment.
