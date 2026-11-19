// Pruebas del motor del simulador «Autómatas» (node test-af.js). Los resultados esperados salen de los artículos del tema 6a.
const E = require('./engine-af.js');
let ok = 0, bad = 0;
const t = (name, got, exp) => { const g = JSON.stringify(got), e = JSON.stringify(exp); if (g === e) ok++; else { bad++; console.log('MAL', name, g, '≠', e); } };
const P = s => { const r = E.parse(s); if (r.err) throw new Error(r.err + ' ' + r.line); return r.M; };
const D101 = P('inicio q0\nfinales q3\nq0 0 q0\nq0 1 q1\nq1 0 q2\nq1 1 q1\nq2 0 q0\nq2 1 q3\nq3 0 q2\nq3 1 q1');
t('afd', E.isDFA(D101), true);
t('1101', E.accepts(D101, '1101'), true); t('1010', E.accepts(D101, '1010'), false); t('vacía', E.accepts(D101, ''), false);
t('traza', E.run(D101, '1101').map(x => x.S[0]), ['q0', 'q1', 'q1', 'q2', 'q3']);
const N101 = P('start p0\nfinals p3\np0 0 p0\np0 1 p0,p1\np1 0 p2\np2 1 p3');
t('afnd', E.isDFA(N101), false); t('porque', E.whyNot(N101), { q: 'p0', a: '1', n: 2 });
t('activos', E.run(N101, '1101').map(x => x.S.join(' ')), ['p0', 'p0 p1', 'p0 p1', 'p0 p2', 'p0 p1 p3']);
const R = E.subsets(N101); t('subconj', R.sets.map(s => s.join(' ')), ['p0', 'p0 p1', 'p0 p2', 'p0 p1 p3']); t('fin', R.fin, [false, false, false, true]);
const NL = P('inicio r0\nfinales a3 b2\nr0 λ a1,b1\na1 1 a2\na2 0 a3\na3 1 a3\nb1 1 b2\nb2 1 b2');
t('cierre', E.closure(NL, ['r0']), ['r0', 'a1', 'b1']);
t('λ', ['10', '1011', '111', '0', '100'].map(w => E.accepts(NL, w)), [true, true, true, false, false]);
const N4 = P('inicio t0\nfinales t3\nt0 0 t0\nt0 L t1\nt1 1 t2\nt2 0 t1\nt2 e t3\nt3 1 t3');
const R4 = E.subsets(N4); t('subconj λ', R4.sets.map(s => E.setName(s)), ['{t0, t1}', '{t2, t3}', '{t1}', '{t3}', '∅']);
t('afd λ', ['001', '1011', '10'].map(w => E.accepts(E.subsetDFA(N4).M, w)), [true, true, false]);
const T = P('inicio s0\nfinales s2\ns0 1 s1\ns0 0 B\ns1 0 s2\ns1 1 B\ns2 0 B\ns2 1 B\nB 0 B\nB 1 B\nX 0 s2\nX 1 s2');
t('accesibles', E.reach(T).sort(), ['B', 's0', 's1', 's2']); t('absorción', E.absorbing(T), ['B']);
t('parse mal', E.parse('inicio q0\nq0 01 q1').err, 'sym');
// expresiones regulares contra la lista de cadenas de longitud ≤ 6
const all = []; for (let n = 0; n <= 6; n++) for (let i = 0; i < (1 << n); i++) all.push(n ? i.toString(2).padStart(n, '0') : '');
const RX = { '(1+01)(01)*': /^(1|01)(01)*$/, '10*1*': /^10*1*$/, '(0+1)*101': /^[01]*101$/, '0*(10*10*10*)*': /^0*(10*10*10*)*$/, '(01)*1': /^(01)*1$/, '1(01)*+(01)*': /^(1(01)*|(01)*)$/ };
for (const k in RX) t('re ' + k, all.filter(w => E.reTest(k, w) !== RX[k].test(w)).length, 0);
t('re→afd', E.subsetDFA(E.reNFA('(0+1)*101')).R.sets.length >= 4, true);
// colocación: todos dentro del lienzo
const L = E.layout(D101, 600, 300); t('layout', Object.values(L).every(p => p.x > 0 && p.x < 600 && p.y > 0 && p.y < 300), true);
console.log(ok + ' bien, ' + bad + ' mal'); if (bad) process.exit(1);
