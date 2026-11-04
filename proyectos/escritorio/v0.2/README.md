# Proyecto Escritorio · v0.2 (4 nov 2026)

La habitación sin botones: se coge, se gira, se arrastra y se suelta. Los discos (simulacros) van a la disquetera, los USB (simuladores) al puerto de la torre, las carpetas salen del cajón, los libros se abren y sus páginas se curvan, la pizarra se escribe con rotulador, la taza abre Sergio Bot en el vapor y detrás está la puerta para volver a la web.

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `12-bucle.js`). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` | Motor, curvas, `anim()` con promesas, `Muelle` y el bus de eventos |
| `02-datos.js` | Libros, carpetas, simulacros, simuladores, manual y bot |
| `03-habitacion.js` | Lo fijo: paredes, mesa, torre, lámpara, estantería y puerta |
| `04-objetos.js` | El registro de objetos y los que se cogen |
| `05-camara.js` | Giro = rumbo + mirada, foco y suavizado |
| `06-gestos.js` | La máquina de estados: inspección, llevar y zonas de destino |
| `07-acciones.js` | Disquetera, puerto, monitor, cajón, carpeta, taza, lámpara y puerta |
| `08-libro.js` · `09-pizarra.js` · `10-pantalla.js` | Libro abierto, pizarra y monitor con SergioLearns OS |
| `11-accesibilidad.js` · `12-bucle.js` | Tab, teclas y anuncios; el fotograma |

**Capítulo que lo explica:** [v0.2 del Proyecto Escritorio — coger, girar, arrastrar y soltar](https://sergiolearns.com/proyecto-escritorio-v0-2-interaccion-sin-botones/) · [English](https://sergiolearns.com/en/desk-project-v0-2-no-buttons/)
