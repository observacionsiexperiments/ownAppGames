# 12. 🔍 Paraula amagada

[← Índex](../README.md) · Carpeta `jocs/paraula-amagada/` · Lletres

La paraula surt com una fila de dibuixos, un per lletra. Cada dibuix amaga la lletra per la qual comença el seu nom. Cal buscar aquella lletra a la taula de l'abecedari i posar-la al seu lloc.

## Pantalla d'inici

- **Dificultat:** 🌱 Fàcil (3–4 lletres), Mitjà (5–6, la taula mostra les lletres), Difícil (7 o més, la taula només té dibuixos: cal pensar el so inicial).
- **Lletra:** MAJÚSCULA o minúscula.

## Com es juga

10 paraules. Es toca la lletra a la taula (o s'escriu amb el teclat: A val per À, C per Ç) i va al buit blau. Quan la paraula és plena es comprova: verda, o les lletres errònies en rosa. Pistes en groc: 💡 Quina lletra? i 🖼️ Què és? (mostra el dibuix de la paraula). Des de la v0.44.0 són a la franja de sota, al costat del missatge, amb ⌫ (rosa). Al tercer error surt 🙈 Mostra-la.

## Contingut

Un sol fitxer, `dades.json`:

```json
{
  "abecedari": {
    "A": [["✈️", "avió"], ["🐝", "abella"], ["🕷️", "aranya"], ["🦆", "ànec"]],
    "B": [["🐋", "balena"], …]
  },
  "paraules": [ { "paraula": "gat", "emoji": "🐱" } ]
}
```

| Camp        | Per a què serveix                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `abecedari` | Per a cada lletra, de 2 a 5 dibuixos `[emoji, nom]` (v0.55.3: N i D en tenen 5 per la paritat: nen 👦 / nena 👧, home 👨 / dona 👩). El nom ha de començar per aquella lletra. A cada paraula se'n sorteja un |
| `paraules`  | Les paraules amagades i l'emoji que surt amb la pista 🖼️                                                                      |

### Com fer-lo créixer

- **Una paraula nova:** afegeix-la a `paraules`. El nivell surt sol de la llargada. Totes les seves lletres han de tenir dibuix a l'abecedari (À compta com A, Ç com C). No hi ha W ni Y.
- **Un dibuix nou per a una lletra:** afegeix `[emoji, nom]` a la lletra, fins a 4. Ha de ser un dibuix clar i el nom ha de començar per aquella lletra (també de so).
