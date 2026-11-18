const fs=require('fs');
const parts=['parse.js','mat.js','la.js','sym.js','fmt.js','interp.js','builtins.js'].map(f=>fs.readFileSync(__dirname+'/'+f,'utf8'));
const out=`/* sl-matlab v1.0 (16 nov 2026) · SergioLearns. Intérprete propio de la parte de MATLAB que se usa en Álgebra y Geometría (GCID, ULPGC):
   matrices reales y complejas, format short/long/rat, rref, rank, det, inv, A\\b, null, eig, lu, qr, norm, dot, cross… y lo simbólico
   justo para syms/solve/subs de sistemas lineales. No es MATLAB ni pretende serlo: es compatible con lo que pide la asignatura. */
(function (root) {
"use strict";
${parts.join('\n')}
var API = { version: '1.0', Ctx: Ctx, run: run, parse: parse, lex: lex, MErr: MErr, display: display, BUILTIN: BUILTIN, HELP: HELP, srcOf: srcOf,
  valueSummary: function (v, F) { return inlineVal(v, F || { mode: 'short' }); }, sizeOf: function (v) { return [v.r, v.c]; } };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.SLMatlab = API;
})(this);
`;
fs.writeFileSync(__dirname+'/slmat.js',out); console.log('ok',out.length);
