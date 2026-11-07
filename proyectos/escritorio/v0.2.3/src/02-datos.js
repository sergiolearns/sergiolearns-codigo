/* ===================== 02 · datos =====================
   Lo que hay en la habitación, con datos reales de la web (4 nov 2026).
   v0.2.2: iconos propios por asignatura (E41), la guía docente de los libros de 2º, la agenda
   de la mochila y las novedades del móvil (E49).
   Regla de Sergio (4 nov): fuera del PC todo es físico, sin órdenes de terminal. */
const LIBROS = [
  { id: 'fp1', icono: 'codigo', code: 'FP1', curso: 1, name: 'Fundamentos de Programación I', sub: 'Python desde cero', color: '#5B4BDB', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp1/',
    temas: ['Variables y tipos', 'Operadores', 'Condicionales', 'Bucles', 'Funciones', 'Listas y tuplas', 'Strings', 'Diccionarios', 'Ficheros', 'Módulos'],
    datos: ['43 artículos en cada idioma', 'Teoría, práctica y ejercicios', 'Cuestionario y chuletario por tema'],
    curiosidad: 'La web nació en marzo de 2026 con este libro: variables, operadores, condicionales, bucles y funciones, más cómo instalar VS Code y Fedora en VirtualBox. «Condicionales en Python · ejercicios» sigue entre las páginas con más clics del último mes.' },
  { id: 'fp2', icono: 'cubo', code: 'FP2', curso: 1, name: 'Fundamentos de Programación II', sub: 'Python y Java con objetos', color: '#4638B8', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp2/',
    temas: ['Clases y objetos', 'Herencia', 'Excepciones', 'Sintaxis de Java', 'Colecciones', 'Iteradores'],
    datos: ['70 artículos en cada idioma', 'De Python a Java', 'Programas probados con Java 21'],
    curiosidad: 'En Java, \'A\' + \'B\' no da «AB»: da 131 (65 + 66), porque los char se suman como números. «Instalar Java en Windows» tuvo 1.999 impresiones en un mes: «jdk21» es lo que más se busca para llegar a la web.' },
  { id: 'ic1', icono: 'chip', code: 'IC1', curso: 1, name: 'IC1', sub: 'Computadores y MIPS', color: '#FF6B4A', estado: 'En curso', url: '',
    temas: ['MIPS (6 temas, del 20 al 25 nov)', 'Temas de papel (del 27 al 30 nov)', 'Simulacro práctico (26 nov)'],
    datos: ['Se escribe ahora mismo', 'Guía de la asignatura: 19 nov'],
    curiosidad: 'MIPS se aprende con una historia: Kira, 19 años, del gremio Halcones del Norte, crea su personaje con llamadas al sistema y pelea contra un slime usando la pila. Y los temas de papel empiezan con un «hola mundo» que baja siete pisos, del código a los transistores.' },
  { id: 'ic2', icono: 'terminal', code: 'IC2', curso: 1, name: 'IC2', sub: 'C, Linux, redes y procesos', color: '#16794B', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/ic2/',
    temas: ['C', 'Linux', 'Redes', 'Qué es un sistema operativo', 'Concurrencia', 'Gestión de memoria', 'Memoria virtual', 'Sistemas de archivos'],
    datos: ['58 artículos en cada idioma', 'Simuladores en el Laboratorio'],
    curiosidad: 'La página más visitada de toda la web es «Comandos básicos de Linux · ejercicios»: 24 clics en 28 días. Y en memoria virtual, con la misma cadena, FIFO da 11 fallos, LRU 9 y el óptimo 7; con FIFO, más marcos pueden dar más fallos (Belady: 9 con 3 marcos, 10 con 4).' },
  { id: 'aedv', icono: 'barras', acento: '#9CC3FF', code: 'AEDV', curso: 2, name: 'Análisis Exploratorio de Datos y Visualización', sub: '2º curso', color: '#2E2A42', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Primer semestre de 2º. Llegará a la web cuando termine 1º: el plan es completar primero todo el primer curso, después las herramientas interactivas y luego 2º.' },
  { id: 'fsi', icono: 'red', acento: '#F5C06B', code: 'FSI', curso: 2, name: 'Fundamentos de los Sistemas Inteligentes', sub: '2º curso', color: '#2E2A42', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Sistemas inteligentes: la razón por la que elegí Ciencia e Ingeniería de Datos en vez de Telecomunicaciones fue el impacto de la IA.' },
  { id: 'is', icono: 'uml', acento: '#5BD39A', code: 'IS', curso: 2, name: 'Ingeniería del Software', sub: '2º curso', color: '#2E2A42', estado: 'Pendiente', url: '', temas: [], datos: ['Idea: un editor UML'], curiosidad: 'Para esta asignatura quiero hacer mi propio editor de diagramas de clases, más sencillo y gratis, con los colores de la web.' },
  { id: 'fmcc', icono: 'altavoz', acento: '#FF9B80', code: 'FMCC', curso: 2, name: 'Fundamentos de Marketing y Comportamiento del Consumidor', sub: '2º curso', color: '#2E2A42', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Marketing en una carrera de datos: el 83 % de los clics que llegan a la web desde Google vienen de un ordenador. Por eso este escritorio se piensa primero para ordenador y el móvil llega en la v0.5.' },
  { id: 'hpi', icono: 'bocadillos', acento: '#A99EF5', code: 'HPI', curso: 2, name: 'Habilidades Profesionales para Ingenieros', sub: '2º curso', color: '#2E2A42', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Las páginas en inglés de la web pasaron de 15 a 50 clics al mes. En tres meses llegaron visitas de España (178 clics), México (71), Colombia (24) y Perú (21).' }
];
const CARPETAS = [
  { id: 'python', icono: 'codigo', nombre: 'Python', n: 61, color: '#5B4BDB', url: 'https://sergiolearns.com/category/programacion/python/', dir: 'sergiolearns.com/category/programacion/python' },
  { id: 'java', icono: 'cubo', nombre: 'Java', n: 48, color: '#4638B8', url: 'https://sergiolearns.com/category/programacion/java/', dir: 'sergiolearns.com/category/programacion/java' },
  { id: 'c', icono: 'llaves', nombre: 'C', n: 30, color: '#16794B', url: 'https://sergiolearns.com/category/programacion/c-cat/', dir: 'sergiolearns.com/category/programacion/c-cat' },
  { id: 'linux', icono: 'terminal', nombre: 'Linux', n: 18, color: '#2F5FD0', url: 'https://sergiolearns.com/category/sistemas/linux/', dir: 'sergiolearns.com/category/sistemas/linux' },
  { id: 'redes', icono: 'red', nombre: 'Redes', n: 6, color: '#D9651C', url: 'https://sergiolearns.com/category/sistemas/redes/', dir: 'sergiolearns.com/category/sistemas/redes' },
  { id: 'mips', icono: 'chip', nombre: 'MIPS', n: 0, sale: '20 nov', color: '#FF6B4A', url: '', dir: '' },
  { id: 'computadores', icono: 'pisos', nombre: 'Computadores', n: 0, sale: '27 nov', color: '#F5A524', url: '', dir: '' }
];
// Discos = simulacros de examen (E24). Fechas de publicación reales del calendario de la web.
const SIMULACROS = [
  { id: 'fp1', icono: 'codigo', code: 'FP1', color: '#5B4BDB', partes: [['Teoría', '2026-11-17', 'https://sergiolearns.com/simulacro-examen-fp1-teoria/'], ['Práctica', '2026-11-18', 'https://sergiolearns.com/simulacro-examen-fp1-practica/']],
    reverso: 'Examen real: 8 de enero de 2027. Teoría y práctica por separado, como en IC2.' },
  { id: 'fp2', icono: 'cubo', code: 'FP2', color: '#4638B8', partes: [['Teoría', '2026-11-14', 'https://sergiolearns.com/simulacro-examen-fp2-teoria/'], ['Práctica', '2026-11-15', 'https://sergiolearns.com/simulacro-examen-fp2-practica/']],
    reverso: 'Pista: en el ordenador hay un archivo que no se ve a simple vista.' },
  { id: 'ic2', icono: 'terminal', code: 'IC2', color: '#16794B', partes: [['Teoría', '2026-11-12', 'https://sergiolearns.com/simulacro-examen-ic2-teoria/'], ['Práctica', '2026-11-13', 'https://sergiolearns.com/simulacro-examen-ic2-practica/']],
    reverso: '30 preguntas al azar del banco, la explicación de cada fallo y el resultado en PDF.' },
  { id: 'ic1', icono: 'chip', code: 'IC1', color: '#FF6B4A', partes: [['Práctica', '2026-11-26', 'https://sergiolearns.com/simulacro-examen-ic1-practica/']],
    reverso: 'Se corrige solo al entregar: sin botón «Evaluar». Versiones A, B y C, como el examen real.' }
];
// USB = simuladores (E24)
const SIMULADORES = [
  { id: 'cpu', icono: 'gantt', nombre: 'Planificación de la CPU', corto: 'CPU', cmd: '$ planifica --algoritmo rr --quantum 2', color: '#5B4BDB', url: 'https://sergiolearns.com/laboratorio/simuladores/planificacion-cpu/' },
  { id: 'pag', icono: 'marcos', nombre: 'Reemplazo de páginas', corto: 'PÁGINAS', cmd: '$ reemplaza --algoritmo lru --marcos 3', color: '#FF6B4A', url: 'https://sergiolearns.com/laboratorio/simuladores/reemplazo-paginas/' },
  { id: 'sub', icono: 'red', nombre: 'Subredes IPv4', corto: 'SUBREDES', cmd: '$ subredes 192.168.10.0/26', color: '#16794B', url: 'https://sergiolearns.com/laboratorio/simuladores/subredes-ipv4/' },
  { id: 'paq', icono: 'paquete', nombre: 'El viaje de un paquete', corto: 'PAQUETE', cmd: '$ viaja --de portatil --a servidor', color: '#F5A524', url: 'https://sergiolearns.com/laboratorio/simuladores/viaje-paquete/' }
];
// El manual (E02, E23): un librito impreso de verdad, sin terminal
const MANUAL = [
  { t: 'El cuarto de Sergio', l: ['Bienvenido a mi cuarto.', 'Aquí está todo lo de la carrera,', 'como objetos de verdad.', '', 'No hay botones: se coge, se gira,', 'se arrastra y se suelta.', '', 'Sergio'] },
  { t: 'Mirar', l: ['Mueve el ratón para mirar.', 'Lleva el ratón al borde de la pantalla', 'para girar del todo (o usa las', 'flechas; sentado, también A y D).', '', 'La puerta está al fondo del pasillo:', 'por ahí se vuelve a la web.', '', 'Esc sale de lo que estés haciendo.'] },
  { t: 'Caminar', l: ['Es mi cuarto: recórrelo.', 'Clic en un mueble (la cama, el armario,', 'la tele, la ventana…) y vas hasta él.', 'O camina con W, A, S y D;', 'las flechas giran la vista.', '', 'Para volver a la mesa: clic en la silla.', 'Esc te levanta de la silla, la cama', 'o el sillón; nunca te lleva a ningún sitio.'] },
  { t: 'Coger y usar', l: ['Clic en un objeto: lo coges y lo', 'miras de cerca.', 'Arrastra para girarlo; la rueda acerca.', 'Busca detalles: hay curiosidades', 'y alguna pista escondida.', '', 'E: lo usas (abrir, meter, leer).', 'Esc: lo dejas en su sitio.', 'Lo de la mesa también se coge de pie.'] },
  { t: 'Llevar', l: ['Mantén pulsado y arrastra un disco,', 'un USB o una carpeta.', 'Donde encaja, brilla.', 'Suelta y entra solo.', '', 'Discos: simulacros de examen.', 'USB: simuladores.', 'Los dos van a la torre.'] },
  { t: 'Cada cosa', l: ['Libros: pasa la página arrastrándola.', 'Cajonera: tira de los tiradores.', 'Taza: acércala y habla con el vapor.', 'Flexo: su interruptor está en la base.', 'Monitor: está apagado; clic y entras.', 'Ventana: la hora de Canarias; el estor', 'baja y sube. Reloj: arrastra las agujas;', 'doble clic vuelve a la hora real.'] },
  { t: 'El cuarto', l: ['Cama: túmbate y coge el móvil', '(lo nuevo de la web y una pausa).', 'Sillón: siéntate y lee los libros de 2º.', 'Mochila: la agenda, semana a semana.', 'Mesita: sus cajones y su lamparita.', 'Armario: una puerta cada vez; el espejo.', 'Tele y PS5 Pro: el rincón de juegos.', 'Luz: junto al pasillo o junto a la cama.'] },
  { t: 'La pizarra', l: ['Coge un rotulador de la bandeja', '(azul, rojo o verde) y escribe.', 'Rueda: más fino o más grueso.', 'Doble clic: una nota con el teclado.', 'Ctrl+Z deshace. Supr borra lo tuyo;', 'Mayús+Supr (o doble clic con el', 'borrador) la deja en blanco.', 'Se queda guardada en tu navegador.', 'V o F responde la pregunta del día.'] },
  { t: 'El ratón de la mesa', l: ['¿La vista va lenta o rápida?', 'Pon el punto sobre el ratón', 'de la mesa y gira la rueda.', 'Sus luces dicen el nivel (1 a 5).', 'Se queda guardado.'] },
  { t: 'Sin ratón', l: ['Tab: recorre los objetos y los sitios.', 'Intro: lo coges o vas. E: lo usas.', 'Flechas: giras el objeto o pasas', 'las páginas. V o F: responde', 'en la pizarra. Esc: vuelves.', '', 'La web normal, sin 3D:', 'sergiolearns.com'], enlace: 'https://sergiolearns.com/' }
];
const PREGUNTA = { texto: ['En Python,', '3 // 2 vale 1.5'], correcta: 'F', explica: ['// es la división entera:', '3 // 2 da 1. Con / sí da 1.5.'] };
const EXAMEN = new Date(2027, 0, 8);
function diasHasta(f) { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((f - t) / 86400000); }
function fechaCorta(iso) { const [y, m, d] = iso.split('-').map(Number); return d + ' ' + ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][m - 1]; }
function publicado(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date() >= new Date(y, m - 1, d, 9, 0); }
// Respuestas de ejemplo de la taza (el Sergio Bot de verdad vive en la web)
const BOT = [
  [/simulacro|examen/i, 'Los simulacros son los discos del estuche. Mete uno en la torre y el monitor te dice cuándo sale.'],
  [/fp1|python/i, 'FP1 está completa: 43 artículos con teoría, práctica y ejercicios. Coge el libro violeta de la estantería.'],
  [/fp2|java/i, 'FP2 también está entera: de Python a Java, con colecciones e iteradores.'],
  [/ic1|mips/i, 'IC1 se está escribiendo: MIPS sale del 20 al 25 de noviembre.'],
  [/ic2|linux|redes|memoria/i, 'IC2 está completa. Los simuladores son los USB del portalápices.'],
  [/hola|buenas|hey/i, 'Hola. Pregúntame por una asignatura o por los simulacros.'],
  [/gracias/i, 'A ti. Ánimo con el estudio.'],
  [/ventana|hora|lluvia|paloma/i, 'Fuera es la hora real de Canarias. Si llueve o pasa una paloma, es de verdad (bueno, casi).'],
  [/coste|cuesta|precio/i, 'Cada pregunta al Sergio Bot de la web cuesta unos 0,2 céntimos. La web entera, hasta unos 113 € al año.']
];
// El corcho (E34): la historia de la web en fotos y entradas. En la v0.3 aquí aparecerán los logros.
const CORCHO = [
  { tipo: 'foto', t: 'Marzo 2026', s: 'Nace la web: Python desde cero', color: '#5B4BDB' },
  { tipo: 'entrada', t: 'Agosto 2026', s: 'AdSense: rechazada otra vez («poco valor»)', color: '#C2362B' },
  { tipo: 'foto', t: 'Septiembre 2026', s: 'Rediseño: la terminal cálida', color: '#FF6B4A' },
  { tipo: 'nota', t: '28 oct', s: '1.900 negritas rotas arregladas en 201 artículos', color: '#F5C06B' },
  { tipo: 'foto', t: '2 nov 2026', s: '332 entradas, todas renovadas', color: '#16794B' },
  { tipo: 'entrada', t: '3 nov 2026', s: 'Sergio Bot v2: unos 0,2 céntimos por pregunta', color: '#4638B8' },
  { tipo: 'nota', t: 'Lo más leído', s: 'Comandos básicos de Linux · ejercicios', color: '#F5C06B' },
  { tipo: 'nota', t: '3 meses', s: '457 clics y 30.600 impresiones en Google', color: '#A99EF5' },
  { tipo: 'entrada', t: '1 dic 2026', s: 'El cuarto de Sergio: capítulos 1, 2 y 3', color: '#2E2A42' }
];
const BOT_OTRA = 'Eso lo responde mejor el Sergio Bot de la web, que lee los artículos. Está en sergiolearns.com, abajo a la derecha.';

/* ---------- v0.2.2 ---------- */
// Iconos propios (E41): trazos en una rejilla de 24, los mismos que dibuja material/v0.2.2/scripts/bocetos.py
const ICONOS_ASIG = {
  codigo: 'M8 6l-5 6 5 6M16 6l5 6-5 6M13.5 4.5l-3 15',
  cubo: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4',
  terminal: 'M3 5h18v14H3zM7 10l3 2.5L7 15M12.5 15H17',
  barras: 'M3 20.5h18M6 20.5v-6M10.5 20.5V8M15 20.5v-9M19.5 20.5V4.5',
  red: 'M6 4.5a2 2 0 1 0 0.01 0zM6 17.5a2 2 0 1 0 0.01 0zM18 11a2 2 0 1 0 0.01 0zM7.7 7.3l8.6 4.2M7.7 18.7l8.6-4.6M6 8.5v9',
  uml: 'M3 3.5h8v6.5H3zM13 14h8v6.5h-8zM3 6.8h8M13 17.3h8M7 10v7h6',
  altavoz: 'M3.5 9.5v5h3.5l7 4.5v-14l-7 4.5zM17.5 8.5a5 5 0 0 1 0 7M20 6a8.5 8.5 0 0 1 0 12',
  bocadillos: 'M3 4h12v9H9l-3.5 3.5V13H3zM16.5 8.5H21v9h-2v3l-3-3h-5v-2.5',
  libro: 'M3 5h6.5a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H3zM21 5h-6.5A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h7z',
  llaves: 'M9 4C6.5 4 6.5 6 6.5 8S5 11.5 4 12c1 .5 2.5 1.5 2.5 4s0 4 2.5 4M15 4c2.5 0 2.5 2 2.5 4s1.5 3.5 2.5 4c-1 .5-2.5 1.5-2.5 4s0 4-2.5 4',
  pisos: 'M3.5 7.5L12 3.5l8.5 4L12 11.5zM3.5 12L12 16l8.5-4M3.5 16.5L12 20.5l8.5-4',
  gantt: 'M3 5.5h7M8 10h6M5 14.5h8M12 19h8M3 3v18',
  marcos: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7zM15.5 16.5h2',
  paquete: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M7.5 5l9 4',
  mando: 'M7 8h10a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 1.8A3 3 0 0 1 3 14v-2a4 4 0 0 1 4-4zM7 10.5v3M5.5 12h3M16 11v.01M18 13v.01'
};
// dibuja un icono en un lienzo: (x, y) arriba a la izquierda, tam en píxeles
function dibujaIcono(c, nombre, x, y, tam, color, grosor = 2) {
  if (!ICONOS_ASIG[nombre]) return;
  c.save(); c.translate(x, y); c.scale(tam / 24, tam / 24);
  c.strokeStyle = color; c.lineWidth = grosor; c.lineCap = 'round'; c.lineJoin = 'round';
  c.stroke(new Path2D(ICONOS_ASIG[nombre])); c.restore();
}
// Libros de 2º: su guía docente (decisión de Sergio, 4 nov), de sus notas de cada asignatura, sin nombres de profesores
const GUIAS = {
  aedv: { ects: '6 ECTS · R, RStudio y RMarkdown', eval: ['Participación (PA)', 'Exámenes: la mayor entre EP1+EP2 y EC', 'Proyecto personal (PP) sobre los ODS,', 'con entregas y defensa oral', 'Sin PP con nota, la final se queda en 4'], temas: ['Exploración de datos', 'Visualización', 'Proyecto personal con entregas'] },
  fsi: { ects: '6 ECTS · 1er semestre', eval: ['0,5 · examen (EV1)', '0,1 · asistencia (EV2)', '0,1 · ejercicios (EV3)', '0,3 · prácticas (EV4)', 'Mínimo un 5 en examen y en prácticas'], temas: ['UD1 Introducción a la IA', 'UD2 Resolución de problemas', 'UD3 Agentes inteligentes', 'UD4 Aprendizaje', 'UD5 Percepción artificial', 'UD6 Representación del conocimiento', 'UD7-UD10 Prácticas'] },
  is: { ects: '6 ECTS · UML y Java (IntelliJ)', eval: ['Examen (EXA): 7 puntos', 'Trabajos en grupo (TRA): 3 puntos', 'Aprobar: global ≥ 5, EXA ≥ 3,5', 'y TRA ≥ 1,5'], temas: ['Diagramas de clases', 'Casos de uso', 'Trabajos prácticos en grupo'] },
  fmcc: { ects: '6 ECTS · 1er semestre', eval: ['Actividades prácticas AP1-AP8: 45', 'Participación: 5', 'EC1-EC7: 35 · examen EC8: 15', 'Aprobar: 50 de 100'], temas: ['AP1: la web de un hotel (HTML y CSS)', 'Comportamiento del consumidor', 'Actividades prácticas'] },
  hpi: { ects: '6 ECTS · todo en inglés', eval: ['Componente lingüístico: 30 %', 'Componente informático: 70 %', 'Hay que aprobar los dos por separado', 'Asistencia mínima: 75 % en cada uno'], temas: ['Semanas 1-5: inglés', 'Semanas 6-15: informática', 'Mini research article (IMRaD)', 'Presentación oral en grupo'] }
};
// La agenda de la mochila (E49): lo próximo de la web y los exámenes, con sus fechas reales
const AGENDA = [   // [fecha, qué, enlace]: el enlace solo se usa cuando ya ha salido (publicado(), regla A3 de la web)
  ['2026-11-12', 'Simulacro IC2 · teoría', 'https://sergiolearns.com/simulacro-examen-ic2-teoria/'], ['2026-11-13', 'Simulacro IC2 · práctica', 'https://sergiolearns.com/simulacro-examen-ic2-practica/'],
  ['2026-11-14', 'Simulacro FP2 · teoría', 'https://sergiolearns.com/simulacro-examen-fp2-teoria/'], ['2026-11-15', 'Simulacro FP2 · práctica', 'https://sergiolearns.com/simulacro-examen-fp2-practica/'],
  ['2026-11-17', 'Simulacro FP1 · teoría', 'https://sergiolearns.com/simulacro-examen-fp1-teoria/'], ['2026-11-18', 'Simulacro FP1 · práctica', 'https://sergiolearns.com/simulacro-examen-fp1-practica/'],
  ['2026-11-20', 'MIPS en la web (hasta el 25)', ''], ['2026-11-26', 'Simulacro IC1 · práctica', 'https://sergiolearns.com/simulacro-examen-ic1-practica/'],
  ['2026-11-27', 'Temas de papel de IC1 (hasta el 30)', ''], ['2026-12-01', 'El cuarto de Sergio: capítulos 1, 2 y 3', ''], ['2027-01-08', 'Examen de FP1', '']
];
// Lo nuevo de la web, en el móvil de la mesita (E49, y la puerta de la versión móvil, E53)
const NOVEDADES = [['5 nov', 'v0.2.3: El cuarto de Sergio'], ['4 nov', 'v0.2.2: se recorre el cuarto'], ['3 nov', 'Sergio Bot v2'], ['2 nov', '332 entradas renovadas'], ['31 oct', 'Calculadora «¿Cuánto necesito?»']];
