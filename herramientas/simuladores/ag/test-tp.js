/* Pruebas del motor de «Transformaciones en el plano» (node test-tp.js) */
require('./engine-tp.js'); var E = globalThis.SLTP, ok = 0, bad = 0;
function t(name, got, exp) { var g = JSON.stringify(got), e = JSON.stringify(exp); if (g === e) ok++; else { bad++; console.log('MAL', name, g, '≠', e); } }
var A = E.M(2, 1, 1, 2);
t('det', E.det(A), 3); t('eig', E.eigTxt(A), ['1', '3']); t('vec', E.eig(A).v, [[1, -1], [1, 1]]);
var d = E.diagP(A); t('PDPi', E.ml(E.mul(E.mul(d.P, d.D), d.Pi)), '[2 1; 1 2]');
t('A5', E.ml(E.pow(A, 5)), '[122 121; 121 122]');
t('giro', E.eig(E.M(0, -1, 1, 0)).kind, 'c');
t('cizalla', [E.eig(E.M(1, 1, 0, 1)).kind, E.eig(E.M(1, 1, 0, 1)).diag, E.eig(E.M(1, 1, 0, 1)).v], ['d', false, [[1, 0]]]);
t('escalar', E.eig(E.M(2, 0, 0, 2)).diag, true);
t('nucleo', E.kerIm(E.M(1, 1, 1, 1)), { r: 1, ker: [1, -1], im: [1, 1] });
t('nucleo2', E.kerIm(E.M(1, 2, 2, 4)), { r: 1, ker: [2, -1], im: [1, 2] });
t('cls dp', E.cls(A).k, 'dp'); t('cls in', E.cls(E.M(1, 2, 2, 1)).k, 'in'); t('cls sp', E.cls(E.M(1, 0, 0, 0)).k, 'sp'); t('cls t6', E.cls(E.M(3, -2, -2, 1)).k, 'in');
t('irr', E.eigTxt(E.M(1, 2, 3, 4)), ['(5 − √33)/2', '(5 + √33)/2']);
t('parse', [E.parse('-3/2'), E.parse('1,5'), E.parse('x')], [-1.5, 1.5, null]);
t('num', [E.num(-1.5), E.num(1 / 3), E.num(Math.SQRT2)], ['−3/2', '1/3', '1.41']);
t('espejo', [E.det(E.M(1, 0, 0, -1)), E.eigTxt(E.M(1, 0, 0, -1)), E.eig(E.M(1, 0, 0, -1)).v], [-1, ['−1', '1'], [[0, 1], [1, 0]]]);
t('between giro', E.ml(E.between(E.I, E.M(0, -1, 1, 0), 1)), '[0 -1; 1 0]');
console.log(ok + ' bien, ' + bad + ' mal'); process.exit(bad ? 1 : 0);
