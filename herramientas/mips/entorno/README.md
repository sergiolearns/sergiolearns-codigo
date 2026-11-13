# Entorno MIPS de SergioLearns (`sl-mips`)

Editor al estilo de Notepad++ (colores y autocompletado) y simulador al estilo de QtSpim (registros, segmentos de texto y datos, consola, Ejecutar, Paso a paso, Pausa, Parar y puntos de ruptura) en el navegador. Lo usan la sección Entornos de [sergiolearns.com](https://sergiolearns.com), los artículos de MIPS de IC1 y los simulacros de examen.

## Versión 2.0 (13 nov 2026): la carcasa D

- Tarjeta con la sombra de su color, un solo botón principal (**Ejecutar**) y **Ajustar** para lo secundario: tema, Hex/Dec, segmento del núcleo, ayudas y ficheros (descargar, subir, copiar enlace, volver al ejemplo).
- Claro por defecto; oscuro si el visitante lo elige (se guarda en `localStorage.sl_entorno_tema`).
- **Paso a paso explicado**: una tira con la instrucción que se acaba de ejecutar, una frase con lo que ha cambiado y «Explícamelo con calma» (tipo, campos del código máquina y cambios). Los textos salen de `fuentes/sl-mips-explica.js`.
- **Tarjeta de error** en español o inglés (`fuentes/sl-mips-errores.js`): qué ha pasado con los valores del programa, en qué línea, «Ir a la línea», «Pregúntale a Leo» (si Leo está en la página) y el mensaje original de SPIM plegado. Cubre la sintaxis (operandos que faltan o sobran, registros que no existen, instrucciones mal escritas, directivas), las etiquetas repetidas o que no existen, los avisos de inmediatos y desplazamientos, y las excepciones (direcciones desalineadas o fuera de la memoria, desbordamiento, división entre cero, salirse del código, syscall desconocida, pila llena). No sale en el modo examen.
- Las excepciones que SPIM ignora ya no acaban en «Programa terminado» a secas, y los bucles de excepciones (un `jr` a 0, una recursión sin fin) se paran.
- Consola con la entrada dentro, pantalla completa (con 1200 px o más, editor y simulador a la vez), barra pegada abajo en el móvil y pastillas de ejemplos cuando el entorno va dentro de `.sl-envp` (la página de Entornos).
- La API para otros scripts no cambia (`root.slmips`: `assemble`, `run`, `step`, `stop`, `code`, `setCode`, `state`, `output`, `messages`, `regs`, `setHelp`, `ready`), así que los simulacros de `sl-quiz` siguen funcionando.

| Archivo | Qué es |
|---|---|
| `sl-mips.min.js` / `sl-mips.js` | El entorno v2 (minificado y legible) |
| `sl-mips.min.css` / `sl-mips.css` | Sus estilos |
| `sl-spim.wasm` | El simulador: el núcleo de SPIM compilado a WebAssembly (172 KB; no cambia en la v2) |
| `fuentes/` | `sl-spim.cpp`, `sl-mips-core.js`, `sl-mips-data.js` (núcleo y datos), `sl-mips-ej.js` (ejemplos originales), `sl-mips-explica.js` (frases de cada instrucción), `sl-mips-errores.js` (tarjeta de error), `sl-mips-ui.js` (interfaz), `patch.py` y `build.sh` (reproducen `sl-spim.wasm`), `build-js.sh` (junta y minifica el entorno) y `build-fragmento19.py` (escribe el fragmento de WordPress) |

En la web, la v2 va en línea dentro del fragmento 19 (el fragmento de rendimiento la saca a `sl-assets`); el wasm y el editor siguen saliendo de jsDelivr fijados a un commit.

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

Los cambios para el navegador (sin temporizadores, entrada sin bloquear, contador de instrucciones) están en `fuentes/patch.py`. El envoltorio, la interfaz, los ejemplos y los textos de las explicaciones y los errores son de SergioLearns (2026).
