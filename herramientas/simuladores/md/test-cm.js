// Pruebas del motor (node test-cm.js): las tablas de los artículos del tema 4 de MD.
require('./engine-cm.js'); var C = global.SLCM, n = 0, bad = 0;
function eq(a, b, m) { n++; var A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) { bad++; console.log('MAL', m, A, '≠', B); } }
var gua = [['a','b',7],['a','d',12],['a','e',6],['b','c',5],['b','d',8],['b','e',10],['c','d',9],['d','g',18],['e','f',5],['e','g',22],['f','g',14]];
var D = C.dijkstra(gua, 'a');
eq(D.order, ['a','e','b','f','c','d','g'], 'orden guaguas');
eq(D.V.map(function (v) { return D.cols.map(function (c) { return c.cells[v]; }).join(' '); }), [
 '0,a * * * * * *', '7,a 7,a 7,a * * * *', '- - 12,b 12,b 12,b * *', '12,a 12,a 12,a 12,a 12,a 12,a *', '6,a 6,a * * * * *', '- 11,e 11,e 11,e * * *', '- 28,e 28,e 25,f 25,f 25,f 25,f'], 'tabla guaguas');
eq(C.path(D, 'a', 'g'), ['a','e','f','g'], 'camino guaguas'); eq(D.cost.g, 25, 'coste');
eq(D.cols[4].tie, ['d'], 'empate c/d');
var ex = [['a','b',2],['b','c',6],['c','d',2],['e','f',4],['f','g',2],['g','h',2],['a','e',4],['b','f',3],['c','g',1],['d','h',7],['a','f',9],['f','c',4]];
var X = C.dijkstra(ex, 'a');
eq(X.V.map(function (v) { return X.cols.map(function (c) { return c.cells[v]; }).join(' '); }), [
 '0,a * * * * * * *','2,a 2,a * * * * * *','- 8,b 8,b 8,b 8,b 8,b * *','- - - - - 10,c 10,c 10,c','4,a 4,a 4,a * * * * *','9,a 5,b 5,b 5,b * * * *','- - - 7,f 7,f * * *','- - - - 9,g 9,g 9,g *'], 'tabla examen');
eq(C.path(X, 'a', 'h'), ['a','b','f','g','h'], 'camino examen');
var Y = C.dijkstra(ex, 'd');
eq(Y.V.map(function (v) { return Y.cols.map(function (c) { return c.cells[v]; }).join(' '); }), [
 '- - - 14,f 14,f 10,b 10,b 10,b','- 8,c 8,c 8,c 8,c 8,c * *','2,d 2,d * * * * * *','0,d * * * * * * *','- - - 9,f 9,f 9,f 9,f *','- 6,c 5,g 5,g * * * *','- 3,c 3,c * * * * *','7,d 7,d 5,g 5,g 5,g * * *'], 'tabla d→e (Pruébalo tú)');
var e4 = [['a','b',3],['a','c',7],['b','c',2],['b','d',6],['c','d',3],['c','e',8],['d','e',2],['d','f',5],['e','f',1],['e','g',6],['f','g',4]];
eq(C.dijkstra(e4, 'a').cost.g, 15, 'ejercicio 4');
// comparación de tablas: espacios y mayúsculas no cuentan; los pasos de más, en blanco
var U = {}; X.V.forEach(function (v) { U[v] = X.cols.map(function (c) { return c.cells[v].replace(',', ', '); }).concat(['', '']); });
var cmp = C.compare(X, U, 2); eq([cmp.ok, cmp.n], [80, 80], 'comparar bien');
U.a[1] = '-'; U.c[0] = '*'; U.h[9] = '*'; cmp = C.compare(X, U, 2); eq([cmp.ok, cmp.res.a[1], cmp.res.c[0], cmp.res.h[9]], [77, false, false, false], 'comparar con fallos');
// Kruskal y Prim (guaguas): el mismo peso total
var K = C.kruskal(gua), P = C.prim(gua, 'a');
eq(K.total, 45, 'Kruskal total'); eq(P.total, 45, 'Prim total'); eq(K.tree.length, 6, 'n-1 aristas');
eq(K.steps.filter(function (s) { return s.why === 'cycle'; }).map(function (s) { return s.e.slice(0, 2).join(''); }), ['cd', 'be', 'ad'], 'Kruskal rechaza');
eq(P.steps.map(function (s) { return s.e[1]; }), ['e','f','b','c','d','g'], 'Prim orden');
// parse
eq(C.parse('a-b 3\nb – c: 4; a c 2').E, [['a','b',3],['b','c',4],['a','c',2]], 'parse');
eq(C.parse('a-a 3').err, 'loop', 'bucle'); eq(C.parse('a-b 3, b-a 4').err, 'dup', 'repetida'); eq(C.parse('hola').err, 'syntax', 'sintaxis');
for (var i = 0; i < 200; i++) { var R = C.random(6); n++; if (!C.connected(R) || C.verts(R).length !== 6) { bad++; console.log('MAL random', JSON.stringify(R)); } }
console.log(n - bad + '/' + n);
