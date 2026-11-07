# El cuarto de Sergio · v0.2.1 (4 nov 2026)

La habitación nueva y una ventana con la hora de Canarias: plano nuevo con cama, corcho, sillón, armario y reloj, un paisaje vivo detrás del monitor, la pizarra útil y los arreglos de la v0.2.

## Qué trae

- **Plano nuevo**: ventana de 1,60 × 1,10 m detrás del monitor, estantería a la altura de los ojos, trofeos, sillón, armario, póster, puerta, pizarra, cama, el **corcho** con la historia de la web y un reloj de pared con la hora de Canarias.
- **La ventana y el ático vivo**: fuera es la hora real de Canarias (`Atlantic/Canary`), en nueve capas: cielo con el sol, estrellas y la luna con su fase real, nubes, ciudad, barrio, farolas, cables con palomas, el pretil de enfrente y la lluvia. Para probar: `?hora=21`, `?lluvia=1`, `?palomas=1`.
- **Mirar de cerca** lo que no se coge (ventana, corcho, trofeos, póster, armario, sillón, cama, reloj): un clic acerca la vista y Esc vuelve.
- **Pizarra útil**: tres rotuladores de verdad, la rueda cambia el grosor, doble clic escribe una nota, Ctrl+Z deshace, Supr borra todo y lo escrito se guarda en el navegador.
- **Girar con inercia y un muelle**; el disco ya no atraviesa nada (sale en vertical, entra en la bandeja por delante y vuelve con un arco de Bézier).
- **Sensibilidad** con la rueda sobre el ratón de la mesa (cinco LED) y **once iconos del cursor** dibujados en SVG.
- Arreglos: una sola tapa en el libro abierto, el borrador borra todo, el vapor sale del borde de la taza y el Tab sigue la lógica de la habitación.

## Cómo abrirlo

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `13-bucle.js`). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` | Motor, curvas, `anim()` con promesas, `Muelle` y el bus de eventos |
| `02-datos.js` | Libros, carpetas, simulacros, simuladores, manual, bot y las curiosidades de la web |
| `03-habitacion.js` | Lo fijo: el plano nuevo (2,95 × 3,80 m), con cama, corcho, trofeos, sillón, armario y reloj |
| `04-objetos.js` | El registro de objetos y los que se cogen |
| `05-camara.js` · `06-gestos.js` | Giro = rumbo + mirada; la máquina de estados, ahora con giro con inercia |
| `07-acciones.js` | Disquetera, puerto, monitor, cajón, carpeta, taza, lámpara y puerta |
| `08-libro.js` · `09-pizarra.js` · `10-pantalla.js` | Libro abierto, pizarra útil y monitor con SergioLearns OS |
| `11-ventana.js` | **Nuevo**: el ático vivo con la hora real de Canarias |
| `12-accesibilidad.js` · `13-bucle.js` | Tab, teclas y anuncios; el fotograma |

**Capítulo que lo explica:** [Capítulo 4 · El cuarto de Sergio v0.2.x — recorrer y jugar](https://sergiolearns.com/el-cuarto-de-sergio-v0-2-x-recorrer-y-jugar/) · [English](https://sergiolearns.com/en/sergios-room-v0-2-x-walk-and-play/) (programado para diciembre de 2026; cuenta de la v0.2.1 a la v0.2.5)
