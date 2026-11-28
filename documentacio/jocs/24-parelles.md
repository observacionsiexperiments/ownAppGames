# 24. 🧠 Parelles de càlcul

[← Índex](../README.md) · Carpeta `jocs/parelles/` · Xifres

Un memory de càlcul. Totes les fitxes surten tapades; se'n giren dues: si una és una operació (2 + 5) i l'altra el seu resultat (7), fan parella i es queden destapades en verd. Si no, es tornen a tapar.

## Pantalla d'inici

Quatre grups (es recorden a `appjocs.parelles.opcions`):

| Grup | Opcions |
| --- | --- |
| 1. Nivell | Fàcil (sumes fins a 10) · Mitjà (sumes i restes fins a 20) · Difícil (fins a 100, portant-ne, i taules del 2, 5 i 10) |
| 2. Quantes parelles? | 6 (12 fitxes) · 8 (16) · 10 (20) |
| 3. Quants jugadors o jugadores? | 🧒 1 (infant, ni nen ni nena; v0.55.4: abans 👤, que es veu com un home) · 🔵 🟠 2 per torns (blau i taronja); `aria-label` amb «jugador o jugadora» (v0.55.3) |
| 4. Mirar-les abans? | No · Sí (totes destapades 3 segons en començar) |

El cronòmetre només surt jugant sol i amb el temporitzador de ⚙️ Opcions encès.

## Operacions

No hi ha JSON: es fan a l'atzar a cada partida (`crearOperacions`).

- **Cada resultat surt un sol cop a la partida**: cap parella no és dubtosa.
- Res de +0, −0, ×0 ni ×1; les restes no donen mai 0 ni negatius.
- Fàcil: sumes amb resultat de 2 a 10. Amb 10 parelles no hi ha prou resultats diferents fins a 10, i s'arriba fins a 12.
- Mitjà: sumes i restes alternades, fins a 20.
- Difícil: una de cada tres és una taula (del 2, 5 o 10, per 2 a 10); la resta, sumes i restes fins a 100: desenes senceres (30 + 40, 70 − 20) o amb unitats, portant-ne (38 + 25, 52 − 17).

## Com es juga

- Es toca una fitxa per girar-la i després una altra (també amb Tab + Enter; sense dreceres de números).
- **Parella:** verd, «✓ 2 + 5 = 7», confeti petit. Amb dos jugadors o jugadores, qui encerta torna a tirar i la parella queda amb la vora del seu color.
- **No fan parella:** les dues en rosa, «No fan parella» o «Gairebé!» amb una frase que anima a continuar (no diu el resultat). Si són de la mateixa mena: «Són dues operacions (o dos números): busca una operació i un número». Es tapen soles al cap d'1,5 s, o abans si es toca una altra fitxa. Amb dos jugadors o jugadores, passa el torn.
- **Fàcil:** el dors diu de quina mena és la fitxa: blau amb «+ −» les operacions i préssec amb «=» els resultats. Mitjà i Difícil: totes iguals («?»).
- **💡 Ensenya-les un moment:** destapa totes les fitxes 2 s. Una per partida, només jugant sol; amb pista, com a molt 2 estrelles.

## Final

- **Sol:** «Has fet les N parelles en X intents» (un intent = dues fitxes girades). Estrelles: fins a N + 2 intents ⭐⭐⭐, fins a 2N ⭐⭐, més ⭐. Rècord de menys intents a `appjocs.parelles.record.<nivell>.<parelles>`. Sense «Comptar errors»: ni intents ni estrelles ni rècord.
- **Dos jugadors o jugadores:** «Guanya 🔵 Blau!» (o 🟠 Taronja; v0.55.3, abans «Guanya el blau»), «Torn: 🔵 Blau» o «Empat!» amb les parelles de cadascú. Sense rècord ni estrelles.

## Pantalla

Criteri «ple»: a dalt els comptadors i «Nova partida», al mig la graella i a baix la franja (missatge i pista); al mòbil apaïsat, la franja a la dreta. La funció `ajustar()` tria la forma de la graella (12 fitxes: 4×3, 3×4 o 6×2; 16: 4×4 o 8×2; 20: 5×4, 4×5 o 10×2) on la lletra pot ser més grossa segons l'operació més llarga de la partida, amb fitxes entre 1,6 i 0,7 d'amplada per alçada. Si encara caldria desplaçar la pàgina, encongeix les fitxes el que sobra. El missatge sempre té dues línies d'alçada perquè la graella no canviï de mida. Animació de girar (sense, si el dispositiu demana menys moviment).
