/* ===================== 02 · datos =====================
   Lo que hay en la habitación, con datos reales de la web (4 nov 2026).
   Regla de Sergio (4 nov): fuera del PC todo es físico, sin órdenes de terminal. */
const LIBROS = [
  { id: 'fp1', code: 'FP1', curso: 1, name: 'Fundamentos de Programación I', sub: 'Python desde cero', color: '#5B4BDB', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp1/',
    temas: ['Variables y tipos', 'Operadores', 'Condicionales', 'Bucles', 'Funciones', 'Listas y tuplas', 'Strings', 'Diccionarios', 'Ficheros', 'Módulos'],
    datos: ['43 artículos en cada idioma', 'Teoría, práctica y ejercicios', 'Cuestionario y chuletario por tema'],
    curiosidad: 'La web nació en marzo de 2026 con este libro: variables, operadores, condicionales, bucles y funciones, más cómo instalar VS Code y Fedora en VirtualBox. «Condicionales en Python · ejercicios» sigue entre las páginas con más clics del último mes.' },
  { id: 'fp2', code: 'FP2', curso: 1, name: 'Fundamentos de Programación II', sub: 'Python y Java con objetos', color: '#4638B8', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp2/',
    temas: ['Clases y objetos', 'Herencia', 'Excepciones', 'Sintaxis de Java', 'Colecciones', 'Iteradores'],
    datos: ['70 artículos en cada idioma', 'De Python a Java', 'Programas probados con Java 21'],
    curiosidad: 'En Java, \'A\' + \'B\' no da «AB»: da 131 (65 + 66), porque los char se suman como números. «Instalar Java en Windows» tuvo 1.999 impresiones en un mes: «jdk21» es lo que más se busca para llegar a la web.' },
  { id: 'ic1', code: 'IC1', curso: 1, name: 'IC1', sub: 'Computadores y MIPS', color: '#FF6B4A', estado: 'En curso', url: '',
    temas: ['MIPS (6 temas, del 20 al 25 nov)', 'Temas de papel (del 27 al 30 nov)', 'Simulacro práctico (26 nov)'],
    datos: ['Se escribe ahora mismo', 'Guía de la asignatura: 19 nov'],
    curiosidad: 'MIPS se aprende con una historia: Kira, 19 años, del gremio Halcones del Norte, crea su personaje con llamadas al sistema y pelea contra un slime usando la pila. Y los temas de papel empiezan con un «hola mundo» que baja siete pisos, del código a los transistores.' },
  { id: 'ic2', code: 'IC2', curso: 1, name: 'IC2', sub: 'C, Linux, redes y procesos', color: '#16794B', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/ic2/',
    temas: ['C', 'Linux', 'Redes', 'Qué es un sistema operativo', 'Concurrencia', 'Gestión de memoria', 'Memoria virtual', 'Sistemas de archivos'],
    datos: ['58 artículos en cada idioma', 'Simuladores en el Laboratorio'],
    curiosidad: 'La página más visitada de toda la web es «Comandos básicos de Linux · ejercicios»: 24 clics en 28 días. Y en memoria virtual, con la misma cadena, FIFO da 11 fallos, LRU 9 y el óptimo 7; con FIFO, más marcos pueden dar más fallos (Belady: 9 con 3 marcos, 10 con 4).' },
  { id: 'aedv', code: 'AEDV', curso: 2, name: 'Análisis Exploratorio de Datos y Visualización', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Primer semestre de 2º. Llegará a la web cuando termine 1º: el plan es completar primero todo el primer curso, después las herramientas interactivas y luego 2º.' },
  { id: 'fsi', code: 'FSI', curso: 2, name: 'Fundamentos de los Sistemas Inteligentes', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Sistemas inteligentes: la razón por la que elegí Ciencia e Ingeniería de Datos en vez de Telecomunicaciones fue el impacto de la IA.' },
  { id: 'is', code: 'IS', curso: 2, name: 'Ingeniería del Software', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['Idea: un editor UML'], curiosidad: 'Para esta asignatura quiero hacer mi propio editor de diagramas de clases, más sencillo y gratis, con los colores de la web.' },
  { id: 'fmcc', code: 'FMCC', curso: 2, name: 'Fundamentos de Marketing y Comportamiento del Consumidor', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Marketing en una carrera de datos: el 83 % de los clics que llegan a la web desde Google vienen de un ordenador. Por eso este escritorio se piensa primero para ordenador y el móvil llega en la v0.5.' },
  { id: 'hpi', code: 'HPI', curso: 2, name: 'Habilidades Profesionales para Ingenieros', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Las páginas en inglés de la web pasaron de 15 a 50 clics al mes. En tres meses llegaron visitas de España (178 clics), México (71), Colombia (24) y Perú (21).' }
];
const CARPETAS = [
  { id: 'python', nombre: 'Python', n: 61, color: '#5B4BDB', url: 'https://sergiolearns.com/category/programacion/python/', dir: 'sergiolearns.com/category/programacion/python' },
  { id: 'java', nombre: 'Java', n: 48, color: '#4638B8', url: 'https://sergiolearns.com/category/programacion/java/', dir: 'sergiolearns.com/category/programacion/java' },
  { id: 'c', nombre: 'C', n: 30, color: '#16794B', url: 'https://sergiolearns.com/category/programacion/c-cat/', dir: 'sergiolearns.com/category/programacion/c-cat' },
  { id: 'linux', nombre: 'Linux', n: 18, color: '#2F5FD0', url: 'https://sergiolearns.com/category/sistemas/linux/', dir: 'sergiolearns.com/category/sistemas/linux' },
  { id: 'redes', nombre: 'Redes', n: 6, color: '#D9651C', url: 'https://sergiolearns.com/category/sistemas/redes/', dir: 'sergiolearns.com/category/sistemas/redes' },
  { id: 'mips', nombre: 'MIPS', n: 0, sale: '20 nov', color: '#FF6B4A', url: '', dir: '' },
  { id: 'computadores', nombre: 'Computadores', n: 0, sale: '27 nov', color: '#F5A524', url: '', dir: '' }
];
// Discos = simulacros de examen (E24). Fechas de publicación reales del calendario de la web.
const SIMULACROS = [
  { id: 'fp1', code: 'FP1', color: '#5B4BDB', partes: [['Teoría', '2026-11-17', 'https://sergiolearns.com/simulacro-examen-fp1-teoria/'], ['Práctica', '2026-11-18', 'https://sergiolearns.com/simulacro-examen-fp1-practica/']],
    reverso: 'Examen real: 8 de enero de 2027. Teoría y práctica por separado, como en IC2.' },
  { id: 'fp2', code: 'FP2', color: '#4638B8', partes: [['Teoría', '2026-11-14', 'https://sergiolearns.com/simulacro-examen-fp2-teoria/'], ['Práctica', '2026-11-15', 'https://sergiolearns.com/simulacro-examen-fp2-practica/']],
    reverso: 'Pista: en el ordenador hay un archivo que no se ve a simple vista.' },
  { id: 'ic2', code: 'IC2', color: '#16794B', partes: [['Teoría', '2026-11-12', 'https://sergiolearns.com/simulacro-examen-ic2-teoria/'], ['Práctica', '2026-11-13', 'https://sergiolearns.com/simulacro-examen-ic2-practica/']],
    reverso: '30 preguntas al azar del banco, la explicación de cada fallo y el resultado en PDF.' },
  { id: 'ic1', code: 'IC1', color: '#FF6B4A', partes: [['Práctica', '2026-11-26', 'https://sergiolearns.com/simulacro-examen-ic1-practica/']],
    reverso: 'Se corrige solo al entregar: sin botón «Evaluar». Versiones A, B y C, como el examen real.' }
];
// USB = simuladores (E24)
const SIMULADORES = [
  { id: 'cpu', nombre: 'Planificación de la CPU', corto: 'CPU', cmd: '$ planifica --algoritmo rr --quantum 2', color: '#5B4BDB', url: 'https://sergiolearns.com/laboratorio/simuladores/planificacion-cpu/' },
  { id: 'pag', nombre: 'Reemplazo de páginas', corto: 'PÁGINAS', cmd: '$ reemplaza --algoritmo lru --marcos 3', color: '#FF6B4A', url: 'https://sergiolearns.com/laboratorio/simuladores/reemplazo-paginas/' },
  { id: 'sub', nombre: 'Subredes IPv4', corto: 'SUBREDES', cmd: '$ subredes 192.168.10.0/26', color: '#16794B', url: 'https://sergiolearns.com/laboratorio/simuladores/subredes-ipv4/' },
  { id: 'paq', nombre: 'El viaje de un paquete', corto: 'PAQUETE', cmd: '$ viaja --de portatil --a servidor', color: '#F5A524', url: 'https://sergiolearns.com/laboratorio/simuladores/viaje-paquete/' }
];
// El manual (E02, E23): un librito impreso de verdad, sin terminal
const MANUAL = [
  { t: 'Manual del escritorio', l: ['Bienvenido a mi mesa.', 'Aquí está todo lo de la carrera,', 'como objetos de verdad.', '', 'No hay botones: se coge, se gira,', 'se arrastra y se suelta.', '', 'Sergio'] },
  { t: 'Mirar', l: ['Mueve el ratón para mirar.', 'Lleva el ratón al borde de la pantalla', 'para girar del todo (o usa A y D,', 'o las flechas).', '', 'Detrás de ti está la puerta:', 'por ahí se vuelve a la web.', '', 'Esc te devuelve siempre a tu sitio.'] },
  { t: 'Coger y usar', l: ['Clic en un objeto: lo coges y lo', 'miras de cerca.', 'Arrastra para girarlo; la rueda acerca.', 'Busca detalles: hay curiosidades', 'y alguna pista escondida.', '', 'E: lo usas (abrir, meter, leer).', 'Esc: lo dejas en su sitio.'] },
  { t: 'Llevar', l: ['Mantén pulsado y arrastra un disco,', 'un USB o una carpeta.', 'Donde encaja, brilla.', 'Suelta y entra solo.', '', 'Discos: simulacros de examen.', 'USB: simuladores.', 'Los dos van a la torre.'] },
  { t: 'Cada cosa', l: ['Libros: pasa la página arrastrándola.', 'Cajón: tira del tirador.', 'Taza: acércala y habla con el vapor.', 'Lámpara: su interruptor está en la base.', 'Monitor: el ordenador, con su LEEME.txt.', 'Ventana: fuera es la hora de Canarias.', 'Corcho: la historia de la web.'] },
  { t: 'La pizarra', l: ['Coge un rotulador de la bandeja', '(azul, rojo o verde) y escribe.', 'Rueda: más fino o más grueso.', 'Doble clic: una nota con el teclado.', 'Ctrl+Z deshace. Borrador para borrar;', 'doble clic con él (o Supr): todo.', 'Se queda guardada en tu navegador.', 'V o F responde la pregunta del día.'] },
  { t: 'El ratón de la mesa', l: ['¿La vista va lenta o rápida?', 'Pon el punto sobre el ratón', 'de la mesa y gira la rueda.', 'Sus luces dicen el nivel (1 a 5).', 'Se queda guardado.'] },
  { t: 'Sin ratón', l: ['Tab: recorre los objetos.', 'Intro: lo coges. E: lo usas.', 'Flechas: giras el objeto o pasas', 'las páginas. V o F: responde', 'en la pizarra. Esc: vuelves.', '', 'La web normal, sin 3D:', 'sergiolearns.com'], enlace: 'https://sergiolearns.com/' }
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
  { tipo: 'entrada', t: '1 dic 2026', s: 'Proyecto Escritorio: capítulos 1, 2 y 3', color: '#2E2A42' }
];
const BOT_OTRA = 'Eso lo responde mejor el Sergio Bot de la web, que lee los artículos. Está en sergiolearns.com, abajo a la derecha.';
