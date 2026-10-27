# Entorno sl-ide · editor

El entorno de programación de los simulacros prácticos de [SergioLearns](https://sergiolearns.com/examenes/) (FP2, y FP1 más adelante) carga desde aquí, por jsDelivr y fijado a un commit, el editor **CodeMirror 6** empaquetado en un solo archivo:

- `sl-cm-6.0.2.min.js`: CodeMirror 6.0.2 con los lenguajes Python y Java (expone `window.SLCM`). Licencia MIT, de Marijn Haverbeke y colaboradores.
- `cm-entry.js`: lo que se empaqueta. Para regenerarlo: `npm install codemirror@6.0.2 @codemirror/lang-python@6.2.1 @codemirror/lang-java@6.0.2 …` (versiones exactas en la cabecera del `.min.js`) y `npx esbuild cm-entry.js --bundle --minify --format=iife --global-name=SLCM --outfile=sl-cm-6.0.2.min.js`.

Python (Pyodide 314.0.7) y Java (`@live-codes/java-wasm` 0.1.0) se cargan directamente de npm por jsDelivr.
