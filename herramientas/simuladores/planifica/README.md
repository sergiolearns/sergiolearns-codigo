# Simulador de planificación de CPU (SergioLearns)

Simulador de planificación de CPU de [sergiolearns.com/laboratorio/simuladores/planificacion-cpu/](https://sergiolearns.com/laboratorio/simuladores/planificacion-cpu/) (en inglés, `/en/lab/simulators/cpu-scheduling/`): FCFS, SJF, SRTF y Round Robin con cuanto, diagrama de Gantt en SVG, paso a paso con la cola de listos y la explicación de cada decisión, resultados (fin, retorno, espera y respuesta con sus medias), comparativa de los cuatro algoritmos y un reto para practicar. Sin dependencias, todo en el navegador.

| Archivo | Qué es |
|---|---|
| `engine.js` | Motor: `SLPlanifica(procesos, algoritmo, cuanto)` (también como módulo de Node) |
| `ui.js` | Interfaz (monta cada `.sl-sim[data-sim="planifica"]`; `data-lang="es"`/`"en"`, `data-links` con las tarjetas de «Ponte a prueba») |
| `sim.css`, `page.css` | Estilos: aspecto tinta y claro (`localStorage('sl_entorno_tema')`, el mismo que los entornos) |
| `ref.py`, `test.py` | Referencia en Python y pruebas: ejemplos de los apuntes de IC2 y del artículo, y 4000 casos aleatorios contra el motor |
| `simuladores.tpl.php`, `build.py` | Plantilla del fragmento de WordPress «SergioLearns — simuladores» y el script que mete el JS y el CSS minificados (esbuild) |

## Criterios
- Empates: primero el que llegó antes; si llegan a la vez, el que va antes en la tabla.
- SJF no expulsa. SRTF solo expulsa si el que llega es estrictamente más corto que lo que le queda al de la CPU.
- Round Robin: si un proceso llega en el mismo instante en que otro agota su cuanto, el recién llegado va antes en la cola. Si el cuanto se agota y la cola está vacía, el mismo proceso sigue con un cuanto nuevo (otro bloque en el Gantt).
- Un núcleo, tiempo entero, cambio de contexto despreciable.

## Probarlo
```
python3 test.py      # necesita node
```

Licencia: la del repositorio.
