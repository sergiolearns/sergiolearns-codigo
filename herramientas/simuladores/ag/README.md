# Simuladores de AG: Gauss-Jordan, Transformaciones en el plano y Plano complejo

Fuentes del simulador de Álgebra y Geometría de [sergiolearns.com/laboratorio/simuladores/gauss-jordan/](https://sergiolearns.com/laboratorio/simuladores/gauss-jordan/) (17 nov 2026).

- `engine-gj.js`: fracciones exactas con BigInt, Gauss y Gauss-Jordan con cada operación elemental, rango, Rouché-Frobenius, solución paramétrica, inversa por (A | I) y determinante.
- `comun-ag.js`: la tarjeta del kit v2 en diseño D (copia de la de ME1, con la franja de MATLAB).
- `ui-gj.js`: lecciones (el batido, el requesón, la tarde imposible, la inversa de la clave y un determinante 4 × 4), «Tu matriz» y «Ponte a prueba».
- `ag.css`: estilos (base de ME1 y lo propio de Gauss-Jordan).
- `build-87.py`: arma el fragmento PHP (v87) con el JS y el CSS minificados; en la web va como parte 97 del módulo «Simuladores».
- `test-gj.js`: pruebas del motor con Node (`node test-gj.js`).

## Transformaciones en el plano (18 nov 2026)

Página: [sergiolearns.com/laboratorio/simuladores/transformaciones-en-el-plano/](https://sergiolearns.com/laboratorio/simuladores/transformaciones-en-el-plano/). Una matriz 2 × 2 deforma la cuadrícula: el determinante como área, los autovectores que no giran, el núcleo y la imagen, la diagonalización en tres pasos, las potencias y las formas cuadráticas.

- `engine-tp.js` (motor), `ui-tp.js` (lecciones, «Tu matriz» y «Ponte a prueba»), `tp.css`.
- `build-88.py`: arma el fragmento v88; en la web va como parte 98 del módulo «Simuladores» (shortcode `[sl_sim_tp id="tp"]`).
- `test-tp.js`: 19 pruebas (`node test-tp.js`).

## Plano complejo (18 nov 2026)

Página: [sergiolearns.com/laboratorio/simuladores/plano-complejo/](https://sergiolearns.com/laboratorio/simuladores/plano-complejo/). Binómica y polar a la vez, el producto como giro y escala, las potencias de De Moivre y las raíces n-ésimas como polígono.

- `engine-pc.js`, `ui-pc.js`, `pc.css`.
- `build-89.py`: arma el fragmento v89; en la web va como parte 99 del módulo «Simuladores» (shortcode `[sl_sim_pc]`).
- `test-pc.js`: 35 pruebas (`node test-pc.js`).

Los tres llevan dentro el kit v2 y `comun-ag.js`, porque la página de cada uno solo carga su parte.
