# El cuarto de Sergio · v0.2.5 (5 nov 2026)

Pulido con peso y la biblia del cuarto: todo lo que viaja lo hace por una sola función con una curva que pesa, «Caza de bugs» pasa a ser un juego dentro del código de 1º y todos los textos se reescriben con la voz de Sergio.

## Qué trae

- **El trayecto**: todo lo que va de un sitio a otro pasa por `trayecto()` (Catmull-Rom centrípeta recorrida con la curva «peso»): sale por su abertura, no gira hasta haber salido y al posarse se asienta.
- **Diez arreglos**: puertas del zapatero hacia fuera, pósits de un taco que baja, objetos que viajan a su tamaño, el trofeo que espera dentro de la caja, el móvil más cerca (82 % del alto) y el primer clic que ya coge lo que hay debajo.
- **La caja fuerte** es un hueco de verdad en la pared, con puerta de acero y teclado; dentro, el trofeo, cuatro figuras y una nota de Sergio.
- **El móvil** es del visitante: sale del bolsillo y vuelve a él; **Sergio Bot** es una app más del móvil.
- **«Caza de bugs»** nueva: la tele enseña archivos del código de 1º (`lista_enlazada.java`, `notas.py`, `hilos.c`…) y los bugs salen de las líneas con error; jefe de fuga de memoria cada cinco archivos, café y patito de goma.
- **Los textos**, todos reescritos desde la biblia del cuarto; las teclas ya no van escritas en los papeles, sino en un aviso las tres primeras veces.
- **Decorado nuevo**: el micrófono de «Siéntate y hablemos», una Biblia en la mesita de la cama y el cargador del móvil.

## Cómo abrirlo

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `14-bucle.js`, los mismos 15 de la v0.2.4). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` | Motor, curvas (con la curva «peso»), `anim()`, muelles y bus de eventos |
| `02-datos.js` | Los datos, con los textos de la biblia del cuarto |
| `03-habitacion.js` | Lo fijo: el cuarto, la caja fuerte con su hueco, el micrófono y la Biblia |
| `04-objetos.js` · `05-camara.js` | Objetos que se cogen y cámara |
| `06-gestos.js` | La máquina de estados, `trayecto()` y el primer clic |
| `07-acciones.js` · `08-libro.js` · `09-pizarra.js` · `10-pantalla.js` | Acciones, libro abierto, pizarra y PC |
| `11-ventana.js` · `12-cuarto.js` | El paisaje en 3D; caminar y los muebles |
| `12-usos.js` | El móvil con Sergio Bot, la caja fuerte y la nueva «Caza de bugs» |
| `13-accesibilidad.js` · `14-bucle.js` | Tab, teclas y anuncios; el fotograma |

**Capítulo que lo explica:** [Capítulo 4 · El cuarto de Sergio v0.2.x — recorrer y jugar](https://sergiolearns.com/el-cuarto-de-sergio-v0-2-x-recorrer-y-jugar/) · [English](https://sergiolearns.com/en/sergios-room-v0-2-x-walk-and-play/) (programado para diciembre de 2026; cuenta de la v0.2.1 a la v0.2.5)
