// los casos de t/casos.json con el arnés en Pyodide (el mismo CPython que en la web)
import { loadPyodide } from 'pyodide';
import fs from 'fs';
const py = await loadPyodide(); py.runPython(fs.readFileSync('src/arnes.py', 'utf8'));
const f = py.globals.get('sl_traza'); const C = JSON.parse(fs.readFileSync('t/casos.json', 'utf8'));
let ok = 0, bad = [];
for (const c of C) {
  const r = JSON.parse(f(JSON.stringify({ code: c.code })));
  const cmp = r.steps.reduce((s, x) => s + (x.k || []).length, 0), calls = r.calls.length;
  const e = [];
  if (r.err) e.push('err ' + JSON.stringify(r.err));
  if (r.out !== c.exp.out) e.push('salida');
  if (c.exp.cmp != null && cmp !== c.exp.cmp) e.push(`cmp ${cmp} != ${c.exp.cmp}`);
  if (c.exp.calls != null && calls !== c.exp.calls) e.push(`llamadas ${calls} != ${c.exp.calls}`);
  if (r.steps[r.steps.length - 1].e !== 'end') e.push('sin paso final');
  if (e.length) bad.push(c.k + ' ' + c.li + ': ' + e.join(', ')); else ok++;
}
// errores y límites
const E = (code, max) => JSON.parse(f(JSON.stringify({ code, max })));
const chk = (b, n) => b ? ok++ : bad.push(n);
let r = E('def f(n):\n    return f(n + 1)\nf(0)\n'); chk(r.err.t === 'RecursionError' && r.err.l === 2 && r.steps.at(-1).e === 'err', 'RecursionError en la línea 2');
r = E('l = [1, 2]\nprint(l[2])\n'); chk(r.err.t === 'IndexError' && r.err.l === 2, 'IndexError');
r = E('while True:\n    pass\n', 500); chk(r.cut && r.steps.length === 500, 'corte a los 500 pasos');
r = E('x = input()\n'); chk(r.err.t === 'SinEntrada', 'input()');
r = E('def f(:\n'); chk(r.err.t === 'SyntaxError' && r.err.l === 1, 'SyntaxError');
r = E('l = [3, 1, 2]\nl.sort()\nprint(l, isinstance(l[0], int), l[0] + 1, f"{l[1]:>3}")\n'); chk(r.out === '[1, 2, 3] True 2   2\n' && r.steps.reduce((s, x) => s + (x.k || []).length, 0) >= 2, 'los elementos siguen siendo int (sort, isinstance, f-string)');
r = E('l = [2.5, -1, 3]\nprint(max(l), sorted(l))\n'); chk(r.out === '3 [-1, 2.5, 3]\n', 'float y negativos');
r = E('n = ["Ana", "Luis"]\nprint("Ana" in n)\n'); chk(r.out === 'True\n' && r.steps.some(s => s.k), 'listas de textos');
console.log(`${ok}/${ok + bad.length} bien`); bad.slice(0, 15).forEach(b => console.log(' FALLA', b));
