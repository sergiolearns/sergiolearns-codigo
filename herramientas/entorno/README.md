# Entorno sl-ide · editor

El entorno de programación de [SergioLearns](https://sergiolearns.com/) (los simulacros prácticos de FP2, FP1 e IC2 y la sección Entornos) carga desde aquí, por jsDelivr y fijado a un commit, el editor **CodeMirror 6** empaquetado en un solo archivo:

- `sl-cm-6.0.2-v1.2.min.js` (entorno v1.2, 28 oct 2026): lo mismo que la v1.1 y además **C** (`@codemirror/lang-cpp` 6.0.3 con `@lezer/cpp` 1.1.6). Expone `window.SLCM` y es compatible con los entornos v1.0 y v1.1.
- `sl-cm-6.0.2-v1.1.min.js` (entorno v1.1, 28 oct 2026): CodeMirror 6.0.2 con Python y Java, autocompletado, buscar, resaltado de las otras apariciones y lo que necesita el entorno para colorear por nombre y marcar la línea del error. Se queda para los commits antiguos.
- `sl-cm-6.0.2.min.js` (entorno v1.0, 27 oct 2026): la primera versión. Se queda para que los commits antiguos sigan funcionando.
- `cm-entry.js`: lo que se empaqueta. Para regenerarlo: `npm install codemirror@6.0.2 @codemirror/state@6.7.6 @codemirror/view@6.43.14 @codemirror/language@6.13.1 @codemirror/commands@6.11.1 @codemirror/autocomplete@6.20.3 @codemirror/search@6.7.2 @codemirror/lang-python@6.2.1 @codemirror/lang-java@6.0.2 @codemirror/lang-cpp@6.0.3 @lezer/highlight@1.2.5 esbuild` y `npx esbuild cm-entry.js --bundle --minify --format=iife --global-name=SLCM --outfile=sl-cm.js` (versiones exactas en la cabecera del `.min.js`).

Licencia de CodeMirror: MIT, de Marijn Haverbeke y colaboradores. Python (Pyodide 314.0.7), Java (`@live-codes/java-wasm` 0.1.0) y C (`@basthon/xcc-wasm` 0.1.0, el compilador xcc de tyfkda, licencia MIT) se cargan directamente de npm por jsDelivr.
