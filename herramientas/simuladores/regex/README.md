# Probador de expresiones regulares (SergioLearns, 9 nov 2026)

Python y Java con **sus motores de verdad**, en el navegador: Python con Pyodide (CPython 3.14, `re`) y Java con javac + TeaVM (`@live-codes/java-wasm` 0.1.0, las versiones del entorno) y el `java.util.regex` de OpenJDK 21 (`motor-java/`: el de TeaVM da resultados falsos).

| Archivo | Qué es |
|---|---|
| `arnes.py` | Arnés de Python: compila la expresión y devuelve match, search, fullmatch, finditer, findall, sub, split y el reto (fullmatch) en JSON |
| `Arnes.java` | El mismo arnés en Java: matches(), lookingAt(), find(), replaceAll, split y el reto (matches()); entrada en Base64 por System.in |
| `engine.js` | `window.SLRx`: worker de Pyodide, runtime de Java (una ejecución por prueba: compilar cuesta ~2,5 s), código equivalente (r"…" en Python, barras dobles en Java) |
| `ui.js`, `regex.css` | La interfaz (`.sl-sim[data-sim="regex"]`, con `comun/kit.js`): texto marcado, qué devuelve cada función, grupos, tu código, paso a paso por coincidencias y reto |
| `build.py` | Mete los arneses y `motor-java/SlRegex.java` (gzip + base64, 37 KB) en `dist/regex.js` |
| `motor-java/` | El regex de OpenJDK aplanado para TeaVM, con su LEEME, licencia (GPLv2 + Classpath Exception) y pruebas |

## Pruebas (Chromium con Playwright; Pyodide y java-wasm servidos en local)
```
python3 t/java_ref.py > ref.txt                               # Arnes.java con el JDK (referencia)
python3 t/java_teavm.py motor-java/SlRegex.java ref.txt www   # 20/20 iguales al JDK en TeaVM
python3 t/motor_test.py www                                   # SLRx: Python 20/20 = CPython, Java 8/8 = JDK, backtracking cortado a los 3 s
python3 t/ui_test.py www capturas/                            # interfaz: 13/13 (reto en los dos, IP en Java, móvil, claro, inglés, recargar)
```
`www/` necesita `jw/` (dist de java-wasm), `py/` (npm pyodide@314.0.7), `kit.js`, los CSS de `../planifica/` y `../comun/`, `regex.css`, `regex.js` (con la base en `location.origin`) y `t/` → ver `t/ui_test.py`.
