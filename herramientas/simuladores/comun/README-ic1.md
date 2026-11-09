# Simuladores de IC1 (SergioLearns, 9 nov 2026)

Nueve simuladores de la teoría de IC1 en [sergiolearns.com/laboratorio/simuladores/](https://sergiolearns.com/laboratorio/simuladores/), con la estructura de los de IC2 (`kit.js`, ventana de terminal, Paso/Ejecutar, Compartir y «Ponte a prueba»):

| Carpeta | Simulador | Página |
|---|---|---|
| `../pipeline/` | Pipeline del MIPS: tu código, ejecutado con SPIM, en el pipeline de 5 etapas (burbujas, anticipación, saltos) | `/laboratorio/simuladores/pipeline-mips/` · `/en/lab/simulators/mips-pipeline/` |
| `../cache/` | Caché paso a paso: dirección partida, directa o n vías con LRU/FIFO, las 3 C, escrituras, tamaño y TMAM | `/laboratorio/simuladores/cache-paso-a-paso/` · `/en/lab/simulators/cache-step-by-step/` |
| `../codifica/` | Codificador de instrucciones: ensamblador ↔ campos ↔ hexadecimal, con la convención de los apuntes o la de QtSpim | `/laboratorio/simuladores/codificador-mips/` · `/en/lab/simulators/mips-encoder/` |
| `../ruta/` | Ruta de datos monociclo: el programa ciclo a ciclo, el valor de cada cable, las señales de control y las ampliaciones addi, slti, bne y jal (port de `monociclo.py` y `rdsvg.py`) | `/laboratorio/simuladores/ruta-de-datos/` · `/en/lab/simulators/datapath/` |
| `../numero/` | Un número, todas sus formas: bases, SM, C1, C2 y exceso, y sumas y restas en columna con el desbordamiento | `/laboratorio/simuladores/un-numero-todas-sus-formas/` · `/en/lab/simulators/one-number-every-form/` |
| `../ieee/` | Explorador IEEE 754: simple, doble, media y el formato antiguo de 16 bits, paso a paso y bit a bit, con aritmética exacta | `/laboratorio/simuladores/explorador-ieee-754/` · `/en/lab/simulators/ieee-754-explorer/` |
| `../hamming/` | Hamming en vivo: codificar, estropear bits y corregir, de cualquier tamaño, con paridad par o impar | `/laboratorio/simuladores/hamming-en-vivo/` · `/en/lab/simulators/hamming-live/` |
| `../codigos/` | Códigos: BCD con +6 y resta con C10, Gray con XOR y texto en ASCII y UTF-8 | `/laboratorio/simuladores/codigos-bcd-gray-utf8/` · `/en/lab/simulators/bcd-gray-utf8-codes/` |
| `../rendimiento/` | Rendimiento y E/S: tiempo de CPU y CPI medio, Amdahl y el % de CPU de consulta, interrupciones y DMA | `/laboratorio/simuladores/rendimiento-y-entrada-salida/` · `/en/lab/simulators/performance-and-io/` |

- El pipeline usa el núcleo de SPIM del entorno MIPS (`../../mips/entorno/sl-spim.wasm`; envoltorio `fuentes/sl-mips-core.js`): `trace.js` ejecuta el programa desde `main` instrucción a instrucción y `engine.js` lo planifica con el mismo modelo que `pipe.py` (el de los apuntes).
- `comun/ic1.css`: estilos de todos (usan las variables de `../planifica/sim.css`). `comun/build-ic1.py` mete el JS y el CSS minificados (esbuild) en el fragmento «SergioLearns — simuladores» (v1.2) y `comun/mini-ic1.php` son sus animaciones de las tarjetas; `comun/build-ic1b.py` hace la v1.3 con los seis siguientes (animaciones en `comun/mini-ic1b.php`), `comun/build-ic1b-lab.py` sus filas del laboratorio por asignatura y sus iconos, y `comun/paginas-ic1b.py` sus páginas.

## Pruebas
```
cd ../pipeline && python3 ref_test.py && node spim_test.js ../../mips/entorno   # 6000 trazas contra pipe.py; la caja (16/11/10) y bucles con SPIM
cd ../cache && python3 test.py                                                # 4000 secuencias contra sim()/simv() de los temas 13 y 14; 70 %/728 bits y 60 %/736 bits
cd ../codifica && python3 test.py && node spim_test.js ../../mips/entorno      # contra isa.py (apuntes) y contra el ensamblador de SPIM (QtSpim), ida y vuelta
cd ../ruta && python3 test.py          # 401 programas (110 800 ciclos) contra monociclo.py: cables, señales, registros y memoria; la taquilla en 150 ciclos
cd ../numero && python3 test.py        # 20 000 operaciones (sin signo, SM, C1, C2) y 3006 cambios de base contra los scripts de los temas 2-4
cd ../ieee && python3 test.py          # 30 078 números contra struct (simple, doble, media) y 4004 del cronómetro antiguo contra viejo()
cd ../hamming && python3 test.py       # 20 000 palabras con 0, 1 y 2 errores contra enc/chk/flip/datos del tema 7
cd ../codigos && python3 test.py       # sumas y restas BCD, Gray y 3023 caracteres en UTF-8 contra el tema 6 y Python
cd ../rendimiento && python3 test.py   # los casos de los temas 12 y 15 y 5000 al azar
```

Licencia: la del repositorio. SPIM es de James R. Larus (licencia BSD; ver `../../mips/entorno/README.md`).
