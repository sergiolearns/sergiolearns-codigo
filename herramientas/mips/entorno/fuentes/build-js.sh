#!/bin/bash
# Junta el entorno MIPS v2 (núcleo, datos, ejemplos, explicaciones, errores e interfaz) en ../sl-mips.js y lo minifica.
# Necesita node y esbuild (npx esbuild). El CSS se escribe a mano en ../sl-mips.css.
set -e
D=$(cd "$(dirname "$0")" && pwd)
{ echo "/* sl-mips.js v2.0 — SergioLearns (13 nov 2026). Incluye el envoltorio de SPIM; el simulador SPIM S20 es de James R. Larus (licencia BSD). */"
  cat "$D/sl-mips-core.js" "$D/sl-mips-data.js" "$D/sl-mips-ej.js" "$D/sl-mips-explica.js" "$D/sl-mips-errores.js" "$D/sl-mips-ui.js"; } > "$D/../sl-mips.js"
node --check "$D/../sl-mips.js"
npx --yes esbuild --minify --loader=js --target=es2017 --legal-comments=none < "$D/../sl-mips.js" > "$D/../sl-mips.min.js"
npx --yes esbuild --minify --loader=css < "$D/../sl-mips.css" > "$D/../sl-mips.min.css"
echo OK $(wc -c < "$D/../sl-mips.js") $(wc -c < "$D/../sl-mips.min.js") $(wc -c < "$D/../sl-mips.min.css")
