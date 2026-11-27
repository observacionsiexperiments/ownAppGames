# 25. 🧱 Block Numbers

[← Índex](../README.md) · Carpeta `jocs/block-numbers/` · Xifres

Entendre què val cada xifra d'un número (valor posicional). Quan es resol, el número es dibuixa amb blocs: plaques de 100, barres de 10 i quadrets d'1. Així es veu que el 3 de 347 val 300.

## Pantalla d'inici

Dues preguntes (es recorden a `appjocs.block-numbers.opcions`):

| Nivell | Números | Què hi ha de nou |
| --- | --- | --- |
| 🌱 Fàcil | Del 10 al 99 | Només desenes i unitats (caixes D · U) |
| Mitjà | Del 100 al 999 | Centenes, desenes i unitats (C · D · U) |
| Difícil | Del 100 al 999 | La meitat dels números amb zeros (305, 470, 800) |

**Què vols practicar?** (un o més; sempre en queda un; per defecte, tots quatre): ✂️ Separar · 🧱 Comptar blocs · 🔤 Llegir · 🏗️ Construir. Les 10 rondes es reparteixen a parts iguals entre els tipus triats, sense tres seguides del mateix.

## Tipus de ronda

- **Separar:** surt el número i s'escriu una xifra a cada caixa (Centenes · Desenes · Unitats). En escriure una xifra, passa sola a la caixa següent; es pot tocar una caixa per canviar-la. Si n'hi ha alguna de buida, avisa: «Si no n'hi ha cap, escriu un 0».
- **Comptar blocs:** surten els blocs i s'escriu el número en una sola caixa (fins a 3 xifres). Els blocs sempre surten com el número: mai més de 9 plaques, 9 barres ni 9 quadrets (v0.52.3: es van treure els «blocs per agrupar» del Difícil, perquè el número ha de llegir-se directament dels blocs).
- **Llegir:** surt el número en lletres i s'escriu amb xifres; en encertar-ho passa directament al resultat (des de v0.52.2 ja no es demana separar-lo després).

Números en lletres (`parts()` / `enLletres()`), escriptura normativa: «u» per a l'1 (vint-i-u, trenta-u, cent u), deu–dinou, guionet entre desenes i unitats (quaranta-set), «-i-» només amb el vint (vint-i-dos), centenes amb guionet (dos-cents) i espai entre la centena i la resta (tres-cents cinc).

- **Separar (v0.53.1):** al Fàcil, les caixes D · U (escalfament) alternades amb «Quantes … té?»; al Mitjà i al Difícil, «Quantes … té?» alternat amb la **suma**.
  - **Quantes desenes té?** Surt el número i la pregunta «Quantes desenes té?» (o centenes, o unitats; també columnes amb 0: «Quantes desenes té el 305?» → 0). Es toca la xifra entre tres targetes (les xifres del número, sense repetir; si en falten, una altra xifra a l'atzar). El nom de les columnes sota les xifres només surt amb la pista. Errors: «El 3 són les centenes · Busca la xifra de les desenes» o «El 8 no és al número». Al 2n error es mostra la resposta. En encertar: «✓ 315 té 1 desena · 1 desena = 10». Al resultat, la columna preguntada queda ressaltada (v0.53.5): el seu grup de blocs amb el títol subratllat i els altres apagats, i el seu valor encerclat a la descomposició (139 = 100 + (30) + 9; si és un 0, també surt: 305 = 300 + (0) + 5). (Abans, a v0.53.0, era «Quant val el 4?», que no s'entenia.)
  - **Suma:** 347 = ☐ + ☐ + ☐. Les caixes porten l'etiqueta «Valor de les centenes» · «Valor de les desenes» · «Valor de les unitats», en dues línies i del color de cada columna (v0.53.4; amb «Centenes» semblava que s'havia d'escriure «300 centenes», i «el 3 val» tampoc no era la nomenclatura de la descomposició). Cada caixa té un guió per xifra (centenes _ _ _, desenes _ _, unitats _; v0.53.2) que s'omple d'esquerra a dreta, perquè es vegi que s'hi escriu 700 i no 7. En omplir-ne una o escriure un 0, passa a la següent. Errors: «Has escrit les xifres soles», «El 4 de les desenes no val 4», «La suma fa el número, però…».
- **Construir (v0.53.0):** surt un número i es fa amb blocs amb els botons +100 · +10 · +1 (i −100 · −10 · −1 per treure'n), del color de cada columna; al Fàcil, sense centenes. Mai més de 9 de cada (el + es desactiva). Els blocs es dibuixen mentre es construeix, sense títols. ✓ (o Intro) comprova; si no s'ha posat cap bloc, avisa sense comptar-ho com a error. Errors: «Falten barres de 10», «Sobren quadrets»… (la primera columna que no quadra) amb «Mira la xifra de les desenes».

## Blocs

- SVG que omple la zona de la dreta (o del mig). Placa = 10 × 10 quadrets, barra = 10 quadrets en vertical, unitats en columnes de 10. Sobre cada grup, «3 × 100», «4 × 10», «7 × 1».
- **Colors (excepció a «un color = una funció», com les monedes de Pensa i resol):** centenes préssec (`--c-accio`), desenes blau (`--c-info`), unitats groc (`--c-pista`), també a les caixes i a les xifres del número un cop resolt.
- Les plaques es posen en 1, 2 o 3 files segons el que faci els blocs més grans a l'espai que hi ha. Animació d'aparició (columna per columna), sense si el dispositiu demana menys moviment.

## Errors i pistes

- **1r error:** les caixes equivocades en rosa (les bones en verd), «Mira-ho bé».
- **2n error o 💡 Vull una pista:** separar → les xifres del número es pinten del color de la seva caixa; comptar → «Compta primer les plaques…»; llegir → cada part del nom en groc amb el que val a sota (tres-cents 300 · quaranta 40 · set 7).
- **3r error:** surt la resposta, es dibuixen els blocs i «Següent ▶».
- Punts de progrés (verd a la primera, groc amb ajuda, rosa si s'ha mostrat). Estrelles: 9 o 10 a la primera ⭐⭐⭐, com a molt 2 rondes mostrades ⭐⭐, si no ⭐. Rècord (més rondes a la primera) a `appjocs.block-numbers.record.<nivell>`.

## Pantalla

**Dues fases (v0.52.1):**

- **Pregunta:** només el número (o, a «Comptar blocs», els blocs), les caixes i el teclat, centrats. Creixen fins a omplir l'espai (`--esc`, fins a 1,7×, calculat a `ajustar()`).
- **Resultat** (en encertar o després del 3r error): s'amaguen les caixes i el teclat; surten els blocs grans, la descomposició amb els colors de cada columna (347 = 300 + 40 + 7; a «Llegir», també el nom en lletres) i «Següent ▶» (no passa sol).

- Teclat de pantalla propi (1–5 ⌫ / 6–0 ✓; el botó de comprovar només porta ✓, amb `aria-label` «Comprova») i teclat de l'ordinador: les xifres escriuen a la caixa activa, Retrocés esborra, Intro comprova, fletxes per canviar de caixa.
- «Comptar blocs» en horitzontal: els blocs a l'esquerra i la caixa i el teclat a la dreta. Mòbil apaïsat: número i caixes a l'esquerra, teclat i missatge a la dreta; al resultat, els blocs a l'esquerra i la descomposició i el missatge a la dreta.
- `ajustar()` posa al tauler l'alçada que queda fins a baix de la pantalla (i l'encongeix si encara caldria desplaçar); l'SVG va en posició absoluta perquè no faci créixer la graella.
- **Marges (v0.52.4):** el dibuix dels blocs té marge a sota (el traç i l'animació no es tallen); a la descomposició, el nom en lletres i els números de colors tenen línies separades (els fons de color són `inline-block`); en mòbil vertical, les caixes i les tecles no s'estiren més del compte (límits en `vw`); en tornar a calcular la mida després de la pista de «Llegir» (valors sota el nom), el número no fa desbordar.
- **Revisió pedagògica (v0.52.5):**
  - A la pregunta de «Comptar blocs» els blocs surten **sense títols** («3 × 100»): l'infant ha de comptar. Els títols només surten al resultat.
  - **El zero es veu:** al resultat, una columna amb 0 surt com un requadre ratllat amb un 0 i el títol «0 × 10» (al Fàcil, només D i U). Al Difícil la descomposició també escriu el zero: 305 = 300 + 0 + 5.
  - **Errors típics** (`diagnosi()`): oblidar el zero (35 per 305 → «Compte amb el zero! No hi ha cap desena: cal escriure un 0 al seu lloc»; a les caixes, 3 · 5 · 0 per 305 → «305 no té desenes: a la caixa de les desenes hi va un 0») i canviar l'ordre (374 per 347 → «Has canviat les desenes i les unitats»; 503 per 305 → «Tens les xifres bones, però en un altre ordre»). Al 1r error surt en rosa; al 2n, en groc amb la pista.
- **Columnes amb aire (v0.53.6):** al resultat, cada columna és almenys tan ampla com el seu títol («9 × 1», «0 × 10»), amb els blocs centrats a sota, i l'espai entre columnes és més gran (34 en lloc de 22): els títols ja no s'enganxen.
