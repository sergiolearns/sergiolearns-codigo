# Simulador «Gauss-Jordan paso a paso» (AG)

Fuentes del simulador de Álgebra y Geometría de [sergiolearns.com/laboratorio/simuladores/gauss-jordan/](https://sergiolearns.com/laboratorio/simuladores/gauss-jordan/) (17 nov 2026).

- `engine-gj.js`: fracciones exactas con BigInt, Gauss y Gauss-Jordan con cada operación elemental, rango, Rouché-Frobenius, solución paramétrica, inversa por (A | I) y determinante.
- `comun-ag.js`: la tarjeta del kit v2 en diseño D (copia de la de ME1, con la franja de MATLAB).
- `ui-gj.js`: lecciones (el batido, el requesón, la tarde imposible, la inversa de la clave y un determinante 4 × 4), «Tu matriz» y «Ponte a prueba».
- `ag.css`: estilos (base de ME1 y lo propio de Gauss-Jordan).
- `build-87.py`: arma el fragmento PHP (v87) con el JS y el CSS minificados; en la web va como parte 97 del módulo «Simuladores».
- `test-gj.js`: pruebas del motor con Node (`node test-gj.js`).
