# Calculadora de notas «¿Cuánto necesito?» (SergioLearns)

Calculadora no oficial de las guías de asignatura de [sergiolearns.com/universidad/](https://sergiolearns.com/universidad/) (FP1, FP2, IC1 e IC2 del Grado en Ciencia e Ingeniería de Datos de la ULPGC), con los criterios de las guías docentes 2026/27.

- `engine.js`: fórmulas, mínimos y reglas de cada asignatura (`evalua` y `necesita`); también como módulo de Node.
- `ui.js` y `calc.css`: la interfaz (ventana de terminal, aspecto tinta/claro con `localStorage('sl_entorno_tema')`).
- `calculadora.tpl.php` y `build.py`: el fragmento de WordPress «SergioLearns — calculadora» (esbuild mete dentro el JS y el CSS minificados).
- `ref.py` y `test.py`: referencia independiente en Python y 40 000 casos al azar (nota final y «lo que necesitas», comprobado nota a nota de 0 a 10 en pasos de 0,01).

Criterios: lo que falta lleva la misma nota en todas las partes pendientes; la nota se enseña truncada a dos decimales (un 4,996 no sale como 5,00). FP2: «si FE01 > 6,5, la nota es como mínimo 5» solo cuando FE01a y FE01b llegan a 5.

```
python3 test.py
```
