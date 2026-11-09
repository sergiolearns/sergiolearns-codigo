# Visualizador de algoritmos (SergioLearns, 9 nov 2026)

Búsquedas, recursión y ordenación **con Python de verdad**: el programa del lector lo ejecuta CPython en el navegador (Pyodide 314.0.7, la versión del entorno de Python) dentro de un worker, trazado con `sys.settrace`. Todo lo que se ve sale de esa ejecución: la línea, la pila de llamadas, las listas como barras (estilo `htop`), cada comparación entre elementos, cada escritura, el árbol de llamadas y la salida de `print`.

| Archivo | Qué es |
|---|---|
| `arnes.py` | `sl_traza(json)`: ejecuta y traza. Los números de las listas literales se envuelven con `ast` en `SLInt`/`SLFloat`/`SLStr` (subclases de verdad: `isinstance`, `sort`, aritmética y `print` siguen igual), que apuntan cada comparación y saben quiénes son; límite de 4000 pasos y de 150 llamadas anidadas; `input()` da un error explicado |
| `engine.js` | `window.SLAlg`: worker de Pyodide, cola de ejecuciones y los ejemplos |
| `ui.js`, `algoritmos.css` | La interfaz (`.sl-sim[data-sim="algoritmos"]`, con `comun/kit.js`): ejemplo y datos, código con la línea siguiente y la anterior, editar y ejecutar, pestaña Java, memoria con punteros (`i`, `j`, `medio`, `inf`/`sup` con el tramo atenuado), contadores, pila, salida, error explicado, árbol de llamadas, compartir y reto |
| `ej/es/*.py`, `ej/java-es/*.java` | Los 13 ejemplos (búsqueda lineal y binaria —iterativa y recursiva con inmersión—, factorial, potencia doble y rápida, Fibonacci, Hanói, burbuja, selección, inserción, mezcla y quicksort). El inglés (`ej/en`, `ej/java-en`) lo genera `ejemplos.py` cambiando nombres y textos |
| `build.py` | `dist/algoritmos.js` (arnés y ejemplos dentro) |
| `build-fragmento.py`, `build-fragmento35.py`, `build-fragmento18.py` | Fragmento 22 v1.5 (`SL_V24_PUBLICO`), fragmento 35 (hubs de FP1 y FP2) y fragmento 18 (icono `barras`) |
| `parche.py` | Parche por líneas (gzip + base64) para aplicar un fragmento en el navegador y comprobar su sha |

## Pruebas
```
python3 ejemplos.py && bash t/java.sh ej/es ej/java-es && bash t/java.sh ej/en ej/java-en   # Java = Python, 13/13 en cada idioma
python3 t/casos.py && node t/motor_test.mjs        # 788/788: comparaciones y llamadas = contadores de t/ref.py, salida = CPython sin trazar, errores y límites
python3 t/ui_test.py www capturas/                 # interfaz 25/25 (www/: py/ → npm pyodide@314.0.7, kit.js y los CSS de planifica/, comun/ y regex/)
```
Licencia: la del repositorio.
