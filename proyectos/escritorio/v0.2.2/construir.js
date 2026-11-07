#!/usr/bin/env node
/* Junta los módulos de src/ en un solo HTML (escritorio-3d.html).
   Por qué un solo archivo: los módulos ES no se cargan desde file:// (Chromium
   lo bloquea) y el prototipo se abre así, y el artefacto de claude.ai es una página.
   Uso: node construir.js */
'use strict';
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, 'src');
const partes = fs.readdirSync(src).filter(f => /^\d\d-.+\.js$/.test(f)).sort();
let html = fs.readFileSync(path.join(src, '00-cabecera.html'), 'utf8');
html += partes.map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
html += '\n</script>\n</body>\n</html>\n';
fs.writeFileSync(path.join(__dirname, 'escritorio-3d.html'), html);
console.log('escritorio-3d.html:', partes.length, 'módulos,', html.split('\n').length, 'líneas,', (Buffer.byteLength(html) / 1024).toFixed(1), 'kB');
