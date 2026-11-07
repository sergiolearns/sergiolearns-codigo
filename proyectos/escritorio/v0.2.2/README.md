# El cuarto de Sergio · v0.2.2 (4 nov 2026)

El cuarto de Sergio: se camina y todo sirve para algo. La cámara deja de estar fija en la silla: te levantas, vas a cada mueble y cada uno tiene su animación y su uso.

## Qué trae

- **Un cuarto de verdad** de 3,75 × 4,30 m con la distribución de la foto: armario de tres puertas con espejo, cama con la mochila, mesita con el móvil, corcho, póster, estantería, pizarra, rincón de juegos, sillón, trofeos e interruptor.
- **Caminar**: un clic en un mueble y vas hasta él por el camino más corto (A* en una rejilla de 5 cm); o con **WASD**, chocando y deslizándote por los muebles. Esc o la silla te devuelven a la mesa.
- **Que todo sirva**: la cama te tumba y te da el móvil, el sillón tiene los libros de 2º con su guía docente, la mochila saca la agenda, el armario se abre, la tele se enciende, el estor baja, el interruptor apaga la luz y el **reloj cambia la hora** (y el paisaje con ella).
- **La mesa nueva**: mesa elevable con cajonera y cajón de archivo, archivador de metacrilato para los discos, peana de los USB, torre con ventiladores, monitor de marco fino, flexo y teclado español.
- **Portadas propias**: un icono SVG por asignatura en libros, lomos, discos, USB y carpetas.
- **El paisaje en 3D**: edificios con volumen, palomas con cuerpo, ropa tendida, humo, gente en las ventanas, la montaña con coches, nubes, un avión y lluvia; sin paralaje falso.
- **Entrar en el PC**: el monitor empieza apagado; al encenderlo, la cámara se mete en la pantalla con una señal (barrido, separación de colores y ruido).

## Cómo abrirlo

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `14-bucle.js`). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` · `02-datos.js` | Motor, curvas, muelles y bus de eventos; los datos, con los iconos por asignatura, la guía docente y la agenda |
| `03-habitacion.js` | Lo fijo: el cuarto de 3,75 × 4,30 m y la mesa elevable con su cajonera |
| `04-objetos.js` · `05-camara.js` · `06-gestos.js` | Objetos que se cogen, cámara y máquina de estados |
| `07-acciones.js` · `08-libro.js` · `09-pizarra.js` | Acciones de cada objeto, libro abierto y pizarra |
| `10-pantalla.js` | El monitor apagado y la entrada en el PC |
| `11-ventana.js` | El paisaje en 3D a su distancia real |
| `12-cuarto.js` | **Nuevo**: caminar (A* y WASD con colisiones) y la animación y el uso de cada mueble |
| `13-accesibilidad.js` · `14-bucle.js` | Tab, teclas y anuncios; el fotograma |

**Capítulo que lo explica:** [Capítulo 4 · El cuarto de Sergio v0.2.x — recorrer y jugar](https://sergiolearns.com/el-cuarto-de-sergio-v0-2-x-recorrer-y-jugar/) · [English](https://sergiolearns.com/en/sergios-room-v0-2-x-walk-and-play/) (programado para diciembre de 2026; cuenta de la v0.2.1 a la v0.2.5)
