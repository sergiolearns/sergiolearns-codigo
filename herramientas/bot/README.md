# Sergio Bot v2 (SergioLearns)

Asistente de [sergiolearns.com](https://sergiolearns.com) que **lee lo que el lector tiene en pantalla**: la sección que está leyendo, lo que selecciona, el código y la consola de los entornos de programación, la pregunta del cuestionario o el estado del simulador. Es un fragmento de WordPress (Code Snippets), sin plugins ni servicios intermedios. Publicado el 3 de noviembre de 2026.

- `bot.tpl.php`: el servidor. API `GET /wp-json/sl/v1/bot/ficha` y `POST /wp-json/sl/v1/bot` (respuesta en streaming SSE), contexto sacado de la entrada (texto limpio por secciones, pregunta del cuestionario, artículos publicados relacionados), filtro de enlaces (solo las URL que da el servidor), límites diarios por IP con hash y globales, y un proveedor por función con la misma entrada y salida (`slb_mistral()`, `slb_gemini()`).
- `bot.js` y `bot.css`: el panel lateral de terminal, el botón «Pregúntale» de la cápsula del menú, la pestaña «Preguntar a Sergio Bot» dentro de Ctrl K, el botón `s_` del móvil y los botones en contexto («Explícame este código», pistas de los cuestionarios). Aspecto tinta y claro (`localStorage('sl_entorno_tema')`), historial solo en `sessionStorage`.
- `instrucciones.md`: las instrucciones fijas (tono de los artículos, reglas y tres ejemplos). Van dentro del fragmento.
- `build.py`: genera `sergiolearns-bot.php` con el JS y el CSS minificados (esbuild; el JS sin renombrar variables).
- `patch.py`: pares «viejo → nuevo» para actualizar el fragmento publicado sin volver a subirlo entero.
- `pruebas/`: `t_ctx.php` prueba sin WordPress (con `stubs.php`) el texto que se saca de una entrada, la pregunta del cuestionario y el filtro de enlaces.

La clave del proveedor **no está aquí**: va en `wp-config.php` (`SL_BOT_MISTRAL_KEY`, `SL_BOT_GEMINI_KEY`).

```
python3 build.py            # genera sergiolearns-bot.php
cd pruebas && php t_ctx.php # contexto, cuestionario y enlaces
```
