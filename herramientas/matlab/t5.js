// Pruebas de las funciones propias (18 nov 2026, intensivo de MATLAB): function en archivo y local, varias salidas,
// nargin/nargout, errores con el mensaje de MATLAB, assert, isrow…, true/false con tamaño. node t5.js
const S = require('./slmat.js'); let n = 0, f = 0;
function R(src, ctx) { const c = ctx || new S.Ctx(); c.outBuf = ''; try { S.run(src, c); } catch (e) { c.outBuf += 'ERR: ' + (e.en || e.message) + '\n'; } return c.outBuf; }
function ok(src, want, ctx) { n++; const o = R(src, ctx); if (!o.includes(want)) { f++; console.log('FALLO', JSON.stringify(src), '\n  esperaba', JSON.stringify(want), '\n  salió', JSON.stringify(o)); } }
ok("A=magic(3);\n[R,p]=g(A)\nfunction [R,p]=g(A)\n R=rref(A); p=rank(A);\nend", "p =\n\n     3");
ok("y=f(3)\nfunction y=f(x)\n y=x^2;\nend", "y =\n\n     9");
ok("f()\nfunction y=f(x)\n y=x^2;\nend", "ERR: Not enough input arguments.");
ok("z=g(1)\nfunction g(x)\n disp(x)\nend", "ERR: Too many output arguments.");
ok("[a,b]=h(1)\nfunction a=h(x)\n a=x;\nend", "ERR: Too many output arguments.");
ok("h(1,2)\nfunction a=h(x)\n a=x;\nend", "ERR: Too many input arguments.");
ok("[a,b]=h(1)\nfunction [a,b]=h(x)\n a=x;\nend", 'ERR: Output argument "b" (and possibly others) not assigned a value in the execution with "h" function.');
ok("x=1\nfunction a=h(x)\n a=x;\nend\ny=2", 'ERR: Function definitions in a script must appear at the end of the file. Move all statements after the "h" function definition to before the first local function definition.');
ok("d=dc([2 1;1 3])\nfunction d=dc(A)\n n=size(A,1);\n if n==1, d=A; return; end\n d=0;\n for j=1:n\n  d=d+(-1)^(1+j)*A(1,j)*dc(A(2:end,[1:j-1 j+1:n]));\n end\nend", "d =\n\n     5");
ok("t(2)\nfunction t(n)\n fprintf('%d %d\\n', nargin, nargout);\nend", "1 0");
ok("r=t(2)\nfunction r=t(n)\n r=nargout;\nend", "r =\n\n     1");
ok("loop(1)\nfunction loop(n)\n loop(n+1)\nend", "ERR: Maximum recursion limit of 500 reached.");
ok("f=@doble; f(3)\nfunction y=doble(x)\n y=2*x;\nend", "ans =\n\n     6");
const c = new S.Ctx(); R("function y=doble(x)\n y=2*x;\nend", c); ok("doble(4)", "ans =\n\n     8", c);   // archivo de funciones
ok("assert(1==2,'no cuadra: %d',3)", "ERR: no cuadra: 3");
ok("assert(false)", "ERR: Assertion failed.");
ok("error('a:b','La matriz es %dx%d',2,3)", "ERR: La matriz es 2x3");
ok("isrow([1 2 3]), iscolumn([1 2])", "logical\n\n   0");
ok("issymmetric([1 2;2 1]), isdiag([1 0;0 2]), istriu([1 2;0 3]), istril([1 2;0 3])", "logical\n\n   0");
ok("e=false(1,3); e(2)=true", "1×3 logical array\n\n   0   1   0");
ok("t=true(2,2)", "2×2 logical array");
console.log('pruebas', n, 'fallos', f);
