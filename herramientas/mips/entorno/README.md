# Entorno MIPS de SergioLearns (`sl-mips`)

Editor al estilo de Notepad++ (colores y autocompletado) y simulador al estilo de QtSpim (registros, segmentos de texto y datos, consola, Ejecutar, Paso, Pausa, Parar y puntos de ruptura) en el navegador, con ayudas que se pueden apagar y aspecto oscuro o claro. Lo usan la sección Entornos de [sergiolearns.com](https://sergiolearns.com) y los artículos de MIPS de IC1.

| Archivo | Qué es |
|---|---|
| `sl-mips.min.js` / `sl-mips.js` | El entorno (minificado y legible) |
| `sl-mips.min.css` / `sl-mips.css` | Sus estilos |
| `sl-spim.wasm` | El simulador: el núcleo de SPIM compilado a WebAssembly (172 KB) |
| `fuentes/` | Fuentes del envoltorio (`sl-spim.cpp`, `sl-mips-core.js`, `sl-mips-data.js`, `sl-mips-ui.js`), los cambios al núcleo (`patch.py`) y el script de compilación (`build.sh`, reproduce este `sl-spim.wasm` byte a byte) |

Uso en una página:

```html
<div class="sl-mips" data-mips='{"libre": true, "files": [{"name": "suma.s", "code": "…"}]}'></div>
<script>window.SL_MIPS_BASE = {wasm: ".../sl-spim.wasm", cm: ".../sl-cm-6.0.2-v1.2.min.js"};</script>
<script src=".../sl-mips.min.js"></script>
```

El editor es el CodeMirror 6 empaquetado de `../../entorno/` (el mismo de los entornos de Python, Java y C).

## Licencias

El simulador es **SPIM S20**, de James R. Larus, versión 9.1.20 (el mismo núcleo que QtSpim), distribuido con licencia BSD:

> Copyright (c) 1990-2017, James R. Larus. All rights reserved.
>
> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. Neither the name of the James R. Larus nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Los cambios para el navegador (sin temporizadores, entrada sin bloquear, contador de instrucciones) están en `fuentes/patch.py`. El envoltorio y la interfaz son de SergioLearns (2026).
