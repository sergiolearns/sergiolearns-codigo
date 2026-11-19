# Simuladores de MD (Matemática discreta)

## Tabla de verdad y equivalencias (v96, 19 nov 2026)

Página: https://sergiolearns.com/laboratorio/simuladores/tabla-de-verdad/ · https://sergiolearns.com/en/lab/simulators/truth-table/

Escribes una fórmula (con símbolos o con el teclado: `->`, `<->`, `&`, `|`, `!`, `xor`) y sale su tabla de verdad columna a columna, de dentro afuera. La clasifica (tautología, contradicción o contingencia), compara dos fórmulas lado a lado y da sus formas normales disyuntiva y conjuntiva. Kit v2 en diseño D: lecciones con «¿Qué crees que pasa?», tu fórmula en modo libre y «Ponte a prueba» (temas 1 y 2).

| Archivo | Qué es |
|---|---|
| `engine-tv.js` | Motor: normaliza lo que escribes, lo analiza (precedencia ¬ > ∧ > ∨/⊕ > → > ↔; → y ↔ asocian por la derecha), saca filas, columnas intermedias, clasificación, equivalencia, FND/FNC y el código Python equivalente |
| `comun-md.js` | Piezas comunes de los simuladores de MD (copia de `comun-ag.js` con Python en lugar de MATLAB) |
| `ui-tv.js` | Lecciones, modo libre y niveles de «Ponte a prueba» |
| `tv.css` | Estilos propios (la base es `../ag/ag.css` y el kit `../comun/kit2.css`) |
| `test-tv.js` | Pruebas del motor: `node test-tv.js` (4024 comprobaciones, 2000 al azar de FND/FNC) |
| `test-page.py` | Página local con Playwright para ver el simulador sin WordPress |
| `build-96.py` | Monta el fragmento PHP (esbuild minifica el JS y el CSS): `python3 build-96.py salida.php [--publico]` |

## Caminos mínimos y árbol generador (v97, 19 nov 2026)

Página: https://sergiolearns.com/laboratorio/simuladores/caminos-minimos/ · https://sergiolearns.com/en/lab/simulators/shortest-paths/

Dijkstra paso a paso con la tabla del examen de problemas de aula (`coste,vértice`, `-` para infinito, `*` para los cerrados), «Rellenar mi tabla» para comparar la tuya casilla a casilla, y Kruskal y Prim paso a paso para el árbol generador mínimo. Kit v2 en diseño D: lecciones (las guaguas de Gran Canaria del tema 4 y un grafo tipo examen), tu grafo en modo libre (aristas por texto, vértices que se arrastran) y «Ponte a prueba» (temas 4 y 5).

| Archivo | Qué es |
|---|---|
| `engine-cm.js` | Motor (`window.SLCM`): lee las aristas, Dijkstra con sus columnas (empates por orden alfabético; una casilla solo cambia si el coste es estrictamente menor), el camino, la comparación con tu tabla, Kruskal, Prim y grafos al azar |
| `ui-cm.js` | Lecciones, modo libre, «Rellenar mi tabla» y niveles de «Ponte a prueba» (usa `comun-md.js`, `window.SLMD`) |
| `cm.css` | Estilos propios (la base es `../ag/ag.css` y el kit `../comun/kit2.css`) |
| `test-cm.js` | Pruebas del motor: `node test-cm.js` (220 comprobaciones) |
| `build-97.py` | Monta el fragmento PHP: `python3 build-97.py salida.php [--publico]`. Los enlaces a los artículos del tema 4 se buscan por su slug |

## Autómatas (v98, 19 nov 2026)

Página: https://sergiolearns.com/laboratorio/simuladores/automatas/ · https://sergiolearns.com/en/lab/simulators/automata/

Un autómata finito lee una cadena símbolo a símbolo: el estado activo de un AFD (y la trampa que no se dibuja), el conjunto de activos de un AFND con su λ-cierre, los estados de absorción e inaccesibles, la construcción por subconjuntos fila a fila y de una expresión regular sencilla a su AFND. Kit v2 en diseño D: lecciones (la cerradura de la taquilla del tema 6a, la trampa, la llave maestra con λ, la penúltima es 1…), tu autómata en modo libre (tabla por texto, cadena o expresión regular) y «Ponte a prueba» (tema 6a).

| Archivo | Qué es |
|---|---|
| `engine-af.js` | Motor (`window.SLAF`): lee la tabla (`inicio q0`, `finales q3`, `q0 1 q1`, varios destinos con comas, `λ` o `eps`), λ-cierre, `mueve`, ejecución paso a paso, accesibles y de absorción, construcción por subconjuntos, expresión regular a AFND (Thompson) y la colocación de los estados |
| `ui-af.js` | Lecciones, modo libre y niveles de «Ponte a prueba» (usa `comun-md.js`, `window.SLMD`) |
| `af.css` | Estilos propios (la base es `../ag/ag.css` y el kit `../comun/kit2.css`) |
| `test-af.js` | Pruebas del motor: `node test-af.js` (25 comprobaciones) |
| `build-98.py` | Monta el fragmento PHP: `python3 build-98.py salida.php [--publico] [--ids t6t,t6p,t6e]` (shortcode `[sl_sim_af]`) |
