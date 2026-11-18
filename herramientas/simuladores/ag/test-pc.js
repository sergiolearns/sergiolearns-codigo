// Pruebas del motor del Plano complejo: node test-pc.js
global.window = global; require('./engine-pc.js'); const P = global.SLPC; let ok = 0, bad = 0;
function eq(a, b, m) { if (JSON.stringify(a) === JSON.stringify(b)) ok++; else { bad++; console.log('MAL', m, JSON.stringify(a), '≠', JSON.stringify(b)); } }
const r3 = Math.sqrt(3);
eq(P.zs([r3, 1]), '√3 + i', 'zs1'); eq(P.zs([0, -2]), '−2i', 'zs2'); eq(P.zs([4, 0]), '4', 'zs3'); eq(P.zs([3, -2]), '3 − 2i', 'zs4');
eq(P.zs([-r3, -1]), '−√3 − i', 'zs5'); eq(P.zs([Math.SQRT2, Math.SQRT2]), '√2 + √2 i', 'zs6'); eq(P.zs([0.5, r3 / 2]), '1/2 + (√3/2)i', 'zs7');
eq(P.zs([-0.2, 1.6]), '−1/5 + (8/5)i', 'zs8');
eq(P.arg([-1, -1]), 225, 'arg1'); eq(P.arg([r3, -1]), 330, 'arg2'); eq(P.arg([0, -5]), 270, 'arg3'); eq(P.arg([-4, 0]), 180, 'arg4');
eq(P.nice(2 * Math.SQRT2), '2√2', 'n1'); eq(P.nice(Math.sqrt(6)), '√6', 'n2'); eq(P.nice(1.2019, 'es'), '1,2', 'n3');
eq(P.zs(P.mul([3, 2], [1, -2])), '7 − 4i', 'mul'); eq(P.zs(P.div([3, 2], [1, -2])), '−1/5 + (8/5)i', 'div'); eq(P.zs(P.pow([1, 1], 8)), '16', 'pow');
eq(P.roots([-64, 0], 6).map(x => P.zs(x.z)), ['√3 + i', '2i', '−√3 + i', '−√3 − i', '−2i', '√3 − i'], 'roots');
eq(P.roots([0, -8], 3).map(x => P.zs(x.z)), ['2i', '−√3 − i', '√3 − i'], 'roots3');
eq(P.parse('√3 + i'), [r3, 1], 'p1'); eq(P.parse('3-2i'), [3, -2], 'p2'); eq(P.parse('-2i'), [0, -2], 'p3'); eq(P.parse('2_30').map(x => +x.toFixed(6)), [+r3.toFixed(6), 1], 'p4');
eq(P.parse('1,5+0,5i'), [1.5, 0.5], 'p5'); eq(P.parse('i'), [0, 1], 'p6'); eq(P.parse('abc'), null, 'p7'); eq(P.parse('sqrt(3)+1i'), [r3, 1], 'p8');
eq(P.mlz([r3, 1]), '1.7321 + 1.0000i', 'ml1'); eq(P.mlz([13, 0]), '13', 'ml2'); eq(P.mlin([r3, 1]), 'sqrt(3) + 1i', 'mi1'); eq(P.mlin([3, -2]), '3 - 2i', 'mi2'); eq(P.mlin([0, -2]), '-2i', 'mi3');
eq(P.ps([r3, 1], 'es'), '2_30', 'ps');
eq(String(P.parse('2 + (1/2)i')), '2,0.5', 'parse paréntesis');
console.log(ok, 'bien,', bad, 'mal'); process.exit(bad ? 1 : 0);
