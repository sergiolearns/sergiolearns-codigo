# El cuarto de Sergio · v0.2.3 (5 nov 2026)

El cuarto limpio: primero el rendimiento, luego los fallos, las funciones que faltaban y una limpieza del cuarto. Aquí el proyecto pasa a llamarse «El cuarto de Sergio».

## Qué trae

- **Rendimiento primero**: tope y presupuesto de píxeles con **escala adaptativa** (`?fps` enseña el panel), lo quieto se junta por material (182 piezas → 37 mallas), Lambert en lo mate y los sombreadores precompilados al cargar.
- **Ocho fallos arreglados**: el libro se cierra desde su página, el teclado 3D solo se hunde escribiendo, Esc solo sale, mirar de cerca desde donde estés, animaciones de un solo movimiento, textos que caben, clics que no se saltan la inspección y libros que salen de debajo de la pila.
- **El espejo** refleja de verdad (`Reflector`), el armario abre la puerta que tocas y la **mesita** abre sus dos cajones (recuerdos de 1º y la libreta de ideas) y enciende su lamparita.
- La **agenda** va semana a semana; el cajón de arriba tiene calculadora, pósits y la pista; lo de la mesa se coge y se conecta también de pie.
- **La limpieza**: el cuarto pasa a 3,90 × 4,70 m con el pasillo de la entrada, el zapatero con la PS5 Pro y dos DualSense, la cama y el sillón con los colores de la paleta, la camiseta del Mundial 2018 y el edificio de enfrente con volumen.
- **El nombre**: «El cuarto de Sergio» en el título, la carga, el manual, el PC, el corcho, la agenda y el móvil.

## Cómo abrirlo

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `14-bucle.js`). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` · `02-datos.js` | Motor, curvas, muelles y bus de eventos (con la resolución adaptativa); los datos |
| `03-habitacion.js` | Lo fijo: el cuarto de 3,90 × 4,70 m con el pasillo, lo quieto juntado por material |
| `04-objetos.js` · `05-camara.js` · `06-gestos.js` | Objetos que se cogen, cámara y máquina de estados |
| `07-acciones.js` · `08-libro.js` · `09-pizarra.js` · `10-pantalla.js` | Acciones, libro abierto, pizarra y PC |
| `11-ventana.js` | El paisaje en 3D |
| `12-cuarto.js` | Caminar, mirar de cerca, el espejo y el uso de cada mueble |
| `13-accesibilidad.js` · `14-bucle.js` | Tab, teclas y anuncios; el fotograma con el presupuesto de píxeles y `?fps` |

**Capítulo que lo explica:** [Capítulo 4 · El cuarto de Sergio v0.2.x — recorrer y jugar](https://sergiolearns.com/el-cuarto-de-sergio-v0-2-x-recorrer-y-jugar/) · [English](https://sergiolearns.com/en/sergios-room-v0-2-x-walk-and-play/) (programado para diciembre de 2026; cuenta de la v0.2.1 a la v0.2.5)
