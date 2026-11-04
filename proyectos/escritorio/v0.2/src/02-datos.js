/* ===================== 02 · datos =====================
   Lo que hay en la habitación, con datos reales de la web (4 nov 2026).
   Regla de Sergio (4 nov): fuera del PC todo es físico, sin órdenes de terminal. */
const LIBROS = [
  { id: 'fp1', code: 'FP1', curso: 1, name: 'Fundamentos de Programación I', sub: 'Python desde cero', color: '#5B4BDB', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp1/',
    temas: ['Variables y tipos', 'Operadores', 'Condicionales', 'Bucles', 'Funciones', 'Listas y tuplas', 'Strings', 'Diccionarios', 'Ficheros', 'Módulos'],
    datos: ['43 artículos en cada idioma', 'Teoría, práctica y ejercicios', 'Cuestionario y chuletario por tema'],
    curiosidad: 'El 2 de noviembre de 2026 terminé de renovar todos los artículos antiguos de la web. Este libro fue el primero en estar completo.' },
  { id: 'fp2', code: 'FP2', curso: 1, name: 'Fundamentos de Programación II', sub: 'Python y Java con objetos', color: '#4638B8', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/fp2/',
    temas: ['Clases y objetos', 'Herencia', 'Excepciones', 'Sintaxis de Java', 'Colecciones', 'Iteradores'],
    datos: ['70 artículos en cada idioma', 'De Python a Java', 'Programas probados con Java 21'],
    curiosidad: 'Los programas de Java de la web se ejecutan de verdad antes de publicarse: las salidas en español llevan coma decimal y las inglesas, punto.' },
  { id: 'ic1', code: 'IC1', curso: 1, name: 'IC1', sub: 'Computadores y MIPS', color: '#FF6B4A', estado: 'En curso', url: '',
    temas: ['MIPS (6 temas, del 20 al 25 nov)', 'Temas de papel (del 27 al 30 nov)', 'Simulacro práctico (26 nov)'],
    datos: ['Se escribe ahora mismo', 'Guía de la asignatura: 19 nov'],
    curiosidad: 'Este libro todavía tiene páginas en blanco: se va escribiendo a la vez que el curso.' },
  { id: 'ic2', code: 'IC2', curso: 1, name: 'IC2', sub: 'C, Linux, redes y procesos', color: '#16794B', estado: 'Completa', url: 'https://sergiolearns.com/asignatura/ic2/',
    temas: ['C', 'Linux', 'Redes', 'Qué es un sistema operativo', 'Concurrencia', 'Gestión de memoria', 'Memoria virtual', 'Sistemas de archivos'],
    datos: ['58 artículos en cada idioma', 'Simuladores en el Laboratorio'],
    curiosidad: 'Con la misma cadena de páginas, FIFO da 11 fallos, LRU 9 y el algoritmo óptimo 7. Está en el tema de memoria virtual.' },
  { id: 'aedv', code: 'AEDV', curso: 2, name: 'Análisis Exploratorio de Datos y Visualización', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Llegará a la web cuando la estudie.' },
  { id: 'fsi', code: 'FSI', curso: 2, name: 'Fundamentos de los Sistemas Inteligentes', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Llegará a la web cuando la estudie.' },
  { id: 'is', code: 'IS', curso: 2, name: 'Ingeniería del Software', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['Idea: un editor UML'], curiosidad: 'Llegará a la web cuando la estudie.' },
  { id: 'fmcc', code: 'FMCC', curso: 2, name: 'Fundamentos de Marketing y Comportamiento del Consumidor', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Llegará a la web cuando la estudie.' },
  { id: 'hpi', code: 'HPI', curso: 2, name: 'Habilidades Profesionales para Ingenieros', sub: '2º curso', color: '#5A566E', estado: 'Pendiente', url: '', temas: [], datos: ['La estoy cursando ahora'], curiosidad: 'Llegará a la web cuando la estudie.' }
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
    reverso: 'Examen real: 8 de enero de 2027.' },
  { id: 'fp2', code: 'FP2', color: '#4638B8', partes: [['Teoría', '2026-11-14', 'https://sergiolearns.com/simulacro-examen-fp2-teoria/'], ['Práctica', '2026-11-15', 'https://sergiolearns.com/simulacro-examen-fp2-practica/']],
    reverso: 'Pista: en el ordenador hay un archivo que no se ve a simple vista.' },
  { id: 'ic2', code: 'IC2', color: '#16794B', partes: [['Teoría', '2026-11-12', 'https://sergiolearns.com/simulacro-examen-ic2-teoria/'], ['Práctica', '2026-11-13', 'https://sergiolearns.com/simulacro-examen-ic2-practica/']],
    reverso: 'Grabado con los simuladores del Laboratorio.' },
  { id: 'ic1', code: 'IC1', color: '#FF6B4A', partes: [['Práctica', '2026-11-26', 'https://sergiolearns.com/simulacro-examen-ic1-practica/']],
    reverso: 'Todavía caliente: el de teoría llegará con los temas de papel.' }
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
  { t: 'Cada cosa', l: ['Libros: pasa la página arrastrándola.', 'Cajón: tira del tirador.', 'Pizarra: escribe con el rotulador;', 'para responder, toca V o F.', 'Taza: acércala y habla con el vapor.', 'Lámpara: su interruptor está en la base.', 'Monitor: el ordenador, con su LEEME.txt.'] },
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
  [/gracias/i, 'A ti. Ánimo con el estudio.']
];
const BOT_OTRA = 'Eso lo responde mejor el Sergio Bot de la web, que lee los artículos. Está en sergiolearns.com, abajo a la derecha.';
