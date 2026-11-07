# El cuarto de Sergio · v0.2.4 (5 nov 2026)

Controles de juego y un uso para cada cosa: ratón capturado con mira, siete fallos arreglados, un juego en la tele, un secreto detrás de un cuadro y la muestra de cómo se vería el cuarto con calidad final.

## Qué trae

- **Siete fallos**: el disco expulsado viene a la mano, vuelve el humo de la taza, la agenda sale de dentro de la mochila, la camiseta se coge y ya no tapa el cuadro, y las puertas del armario abren bien (tope de 77°).
- **Controles de juego** (Pointer Lock): un clic captura el ratón y aparece una mira; WASD camina, Mayús corre, E interactúa, Esc suelta el ratón y el clic derecho sale sin soltarlo. Lo que necesita cursor usa uno propio. El modo de antes sigue en Ajustes → Controles.
- **La mesa** reequilibrada: torre compacta, discos y USB a la izquierda y la taza a la derecha.
- **Un uso para cada cosa**: el zapatero con **«Caza de bugs»** en la tele (también con un DualSense de verdad, por la Gamepad API), el altillo con la caja de las versiones y la cápsula del tiempo, la libreta que se escribe, la calculadora que funciona y pósits que se pegan donde mires.
- **El secreto**: el cuadro torcido esconde una caja fuerte de 4 cifras con el primer trofeo, «Detective del cuarto».
- **El móvil** con M desde cualquier sitio: Linterna, Cámara (foto en PNG), Estudio (25 + 5 minutos), Web, Mapa y Ajustes.
- **La muestra de calidad final** (`calidad-final/`): el rincón del escritorio con texturas PBR hechas con código, `RoomEnvironment`, sombras suaves congeladas, oclusión ambiental (GTAO) y AgX, todo con three.js 0.186.1.

## Cómo abrirlo

- `escritorio-3d.html`: el prototipo listo para abrir (doble clic, con internet: three.js 0.186.1 sale de jsDelivr y las fuentes de Google Fonts).
- `src/`: el código por módulos (`00-cabecera.html` y `01-nucleo.js` … `14-bucle.js`, con el nuevo `12-usos.js`). **Se edita aquí**, no en el HTML.
- `construir.js`: junta `src/` en `escritorio-3d.html` (`node construir.js`). Los módulos se juntan porque los módulos ES no cargan desde `file://`.
- `calidad-final/calidad-final.html`: la muestra de calidad final, una escena aparte (26 kB) que se abre igual, con doble clic y con internet.

| Módulo | Qué hace |
|---|---|
| `01-nucleo.js` · `02-datos.js` | Motor, curvas, muelles y bus de eventos; los datos |
| `03-habitacion.js` | Lo fijo: el cuarto, la mesa reequilibrada y la caja fuerte |
| `04-objetos.js` · `05-camara.js` | Objetos que se cogen y cámara |
| `06-gestos.js` | La máquina de estados con Pointer Lock, la mira y el cursor propio |
| `07-acciones.js` · `08-libro.js` · `09-pizarra.js` · `10-pantalla.js` | Acciones, libro abierto, pizarra y PC |
| `11-ventana.js` · `12-cuarto.js` | El paisaje en 3D; caminar y los muebles |
| `12-usos.js` | **Nuevo**: el móvil y sus apps, el zapatero y «Caza de bugs», el altillo, la calculadora, los pósits y la caja fuerte |
| `13-accesibilidad.js` · `14-bucle.js` | Tab, teclas y anuncios; el fotograma |

**Capítulo que lo explica:** [Capítulo 4 · El cuarto de Sergio v0.2.x — recorrer y jugar](https://sergiolearns.com/el-cuarto-de-sergio-v0-2-x-recorrer-y-jugar/) · [English](https://sergiolearns.com/en/sergios-room-v0-2-x-walk-and-play/) (programado para diciembre de 2026; cuenta de la v0.2.1 a la v0.2.5)
