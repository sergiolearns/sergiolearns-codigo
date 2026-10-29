set -e
cd /home/claude/mips/web
{ echo "/* sl-mips.js v1.0.2 — SergioLearns (29 oct 2026). Incluye el envoltorio de SPIM; el simulador SPIM S20 es de James R. Larus (licencia BSD). */"; cat sl-mips-core.js sl-mips-data.js sl-mips-ui.js; } > sl-mips.js
node --check sl-mips.js && echo OK $(wc -c < sl-mips.js)
