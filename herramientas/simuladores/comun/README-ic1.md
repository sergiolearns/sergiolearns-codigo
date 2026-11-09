# Simuladores de IC1 (SergioLearns, 9 nov 2026)

Tres simuladores de la teoría de IC1 en [sergiolearns.com/laboratorio/simuladores/](https://sergiolearns.com/laboratorio/simuladores/), con la estructura de los de IC2 (`kit.js`, ventana de terminal, Paso/Ejecutar, Compartir y «Ponte a prueba»):

| Carpeta | Simulador | Página |
|---|---|---|
| `../pipeline/` | Pipeline del MIPS: tu código, ejecutado con SPIM, en el pipeline de 5 etapas (burbujas, anticipación, saltos) | `/laboratorio/simuladores/pipeline-mips/` · `/en/lab/simulators/mips-pipeline/` |
| `../cache/` | Caché paso a paso: dirección partida, directa o n vías con LRU/FIFO, las 3 C, escrituras, tamaño y TMAM | `/laboratorio/simuladores/cache-paso-a-paso/` · `/en/lab/simulators/cache-step-by-step/` |
| `../codifica/` | Codificador de instrucciones: ensamblador ↔ campos ↔ hexadecimal, con la convención de los apuntes o la de QtSpim | `/laboratorio/simuladores/codificador-mips/` · `/en/lab/simulators/mips-encoder/` |

- El pipeline usa el núcleo de SPIM del entorno MIPS (`../../mips/entorno/sl-spim.wasm`; envoltorio `fuentes/sl-mips-core.js`): `trace.js` ejecuta el programa desde `main` instrucción a instrucción y `engine.js` lo planifica con el mismo modelo que `pipe.py` (el de los apuntes).
- `comun/ic1.css`: estilos de los tres (usan las variables de `../planifica/sim.css`). `comun/build-ic1.py` mete el JS y el CSS minificados (esbuild) en el fragmento «SergioLearns — simuladores» (v1.2) y `comun/mini-ic1.php` son sus animaciones de las tarjetas.

## Pruebas
```
cd ../pipeline && python3 ref_test.py && node spim_test.js ../../mips/entorno   # 6000 trazas contra pipe.py; la caja (16/11/10) y bucles con SPIM
cd ../cache && python3 test.py                                                # 4000 secuencias contra sim()/simv() de los temas 13 y 14; 70 %/728 bits y 60 %/736 bits
cd ../codifica && python3 test.py && node spim_test.js ../../mips/entorno      # contra isa.py (apuntes) y contra el ensamblador de SPIM (QtSpim), ida y vuelta
```

Licencia: la del repositorio. SPIM es de James R. Larus (licencia BSD; ver `../../mips/entorno/README.md`).
