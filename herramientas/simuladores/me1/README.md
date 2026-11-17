# Simuladores de ME1 (SergioLearns, 16 nov 2026)

Tres simuladores de Métodos Estadísticos I en [sergiolearns.com/laboratorio/simuladores/](https://sergiolearns.com/laboratorio/simuladores/), con el kit v2 en diseño D (como `../punteros/`): lecciones paso a paso con «¿Qué crees que pasa?», controles libres y «Ponte a prueba» por niveles.

| Archivo | Simulador | Página |
|---|---|---|
| `ui-dist.js` | Distribuciones de probabilidad: once distribuciones con d, p y q de R, el área de cada orden, el truco del ≥ | `/laboratorio/simuladores/distribuciones-de-probabilidad/` · `/en/lab/simulators/probability-distributions/` |
| `ui-tcl.js` | Teorema central del límite: muestras de un dado, una exponencial, una moneda trucada…; medias o sumas | `/laboratorio/simuladores/teorema-central-del-limite/` · `/en/lab/simulators/central-limit-theorem/` |
| `ui-ic.js` | Intervalos de confianza: cien intervalos con z, t o para p; nivel, n y el error de usar z con s | `/laboratorio/simuladores/intervalos-de-confianza/` · `/en/lab/simulators/confidence-intervals/` |

- `engine.js`: funciones especiales (lgamma, gamma y beta incompletas regularizadas), Φ⁻¹ con AS241, las once distribuciones con la convención de R, muestreo con semilla e intervalos. `python3 test.py`: 35 205 casos contra SciPy (d, p, cola superior y q).
- `comun.js`: la tarjeta D (pastillas de lecciones, franja con la orden de R, subtítulo, barra de pasos, menú Ajustar, escena de lecciones) y los ejes en SVG.
- `me1.css`: el aspecto (claro y oscuro, escritorio y móvil). Va después de `sl6_css` y `sl6_css7` del fragmento 22.
- `build-81.py salida.php [--publico]`: el fragmento de WordPress «SergioLearns — simuladores de ME1» (v81) con kit2 + los tres minificados (esbuild), el shortcode `[sl_sim_me1 id="distrib|tcl|ic"]`, su registro (`sl81_info`, que el fragmento 22 suma a `sl6_info`), los enlaces de «Ponte a prueba» y las animaciones de las tarjetas (`sl81_mini`). Interruptor `SL_V81_PUBLICO` (`?sl_v81=1`).
- `t/shot.py`: capturas en Chromium con la CSS de la web (`python3 t/shot.py distrib es claro 1280 salida.png`).
