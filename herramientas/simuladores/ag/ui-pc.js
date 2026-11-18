/* SergioLearns — simulador de AG: Plano complejo (18 nov 2026).
 * Un complejo en binómica y en polar a la vez (módulo, argumento por cuadrantes, trigonométrica y exponencial), la suma como
 * paralelogramo, el producto como giro y escala, el cociente como giro al revés, las potencias de De Moivre en espiral y las
 * raíces n-ésimas como polígono. Lecciones del tema 7 de AG (la noria de la feria), modo libre arrastrando los puntos y
 * «Ponte a prueba» por niveles. Necesita SLK (kit v2), SLAG (comun-ag.js) y SLPC (engine-pc.js). */
(function () {
  'use strict';
  var K = window.SLK, M = window.SLAG, P = window.SLPC;
  if (!K || !M || !P) return;
  var esc = K.esc, fill = K.fill, ico = K.ico;
  var R3 = Math.sqrt(3);
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/plano-complejo', what: 'Qué quieres ver', modes: { forma: 'Formas', suma: 'Suma', prod: 'Producto', coc: 'Cociente', pot: 'Potencias', raiz: 'Raíces' },
      zl: 'z', wl: 'w', nl: 'n', showC: 'Tus números', hideC: 'Ocultar', go: 'Dibujar', rnd: 'Otro al azar', badZ: 'No entiendo ese número: prueba con 3 - 2i, √3 + i o 2_30 (polar, en grados).',
      hint: 'Escribe en binómica (3 - 2i, √3 + i, -i) o en polar con módulo_ángulo (2_30). También puedes arrastrar los puntos del dibujo.', yoursN: 'Tus números', yoursD: 'Los que has escrito o arrastrado.',
      bin: 'Binómica', mod: 'Módulo', arg: 'Argumento', polar: 'Polar', trig: 'Trigonométrica', exp: 'Exponencial', q: 'cuadrante', qs: { 1: '1.er cuadrante', 2: '2.º cuadrante', 3: '3.er cuadrante', 4: '4.º cuadrante', 'x+': 'eje real positivo', 'x-': 'eje real negativo', 'y+': 'eje imaginario positivo', 'y-': 'eje imaginario negativo', 0: 'el origen' },
      sum: 'Suma', dif: 'Resta', cj: 'Conjugado', op: 'Opuesto', prodK: 'Producto', cocK: 'Cociente', powK: 'Potencia', rootK: 'Raíces', k: 'k', out: 'w queda fuera del dibujo', sen: 'sen', apart: 'separadas {a}', ang: 'ángulos',
      lv: [['El argumento', 'Un complejo de los de clase: dibújalo y da su argumento entre 0° y 360°.'], ['Producto en polar', 'Dos complejos en polar: módulo y argumento del producto.'], ['Una raíz n-ésima', 'El argumento de una de las raíces de un complejo.']],
      lq1: '¿Cuál es el argumento de z = {z}, entre 0° y 360°? Escribe solo el número de grados.', lq2: 'Si z = {a} y w = {b}, ¿cuánto valen el módulo y el argumento de z·w? Escribe los dos separados por una coma (por ejemplo, 6, 150), con el argumento entre 0 y 360.', lq3: 'Las raíces {n}-ésimas de w = {w}: ¿cuál es el argumento de la raíz con k = {k}? Escribe solo los grados.',
      h1: 'Referencia: arctan|b/a|. 2.º cuadrante: 180° − ref; 3.º: 180° + ref; 4.º: 360° − ref.', h2: 'Los módulos se multiplican y los argumentos se suman (y se resta 360° si te pasas).', h3: '(α + 360°·k)/n, con α el argumento de w.' },
    en: { title: 'sergio@learns: ~/lab/simulators/complex-plane', what: 'What do you want to see', modes: { forma: 'Forms', suma: 'Sum', prod: 'Product', coc: 'Quotient', pot: 'Powers', raiz: 'Roots' },
      zl: 'z', wl: 'w', nl: 'n', showC: 'Your numbers', hideC: 'Hide', go: 'Draw', rnd: 'Random one', badZ: 'I cannot read that number: try 3 - 2i, √3 + i or 2_30 (polar, in degrees).',
      hint: 'Type in binomial form (3 - 2i, √3 + i, -i) or in polar form as modulus_angle (2_30). You can also drag the points in the drawing.', yoursN: 'Your numbers', yoursD: 'The ones you typed or dragged.',
      bin: 'Binomial', mod: 'Modulus', arg: 'Argument', polar: 'Polar', trig: 'Trigonometric', exp: 'Exponential', q: 'quadrant', qs: { 1: '1st quadrant', 2: '2nd quadrant', 3: '3rd quadrant', 4: '4th quadrant', 'x+': 'positive real axis', 'x-': 'negative real axis', 'y+': 'positive imaginary axis', 'y-': 'negative imaginary axis', 0: 'the origin' },
      sum: 'Sum', dif: 'Difference', cj: 'Conjugate', op: 'Opposite', prodK: 'Product', cocK: 'Quotient', powK: 'Power', rootK: 'Roots', k: 'k', out: 'w lies outside the drawing', sen: 'sin', apart: '{a} apart', ang: 'angles',
      lv: [['The argument', 'A class-style complex number: draw it and give its argument between 0° and 360°.'], ['Product in polar form', 'Two complex numbers in polar form: modulus and argument of the product.'], ['One nth root', 'The argument of one of the roots of a complex number.']],
      lq1: 'What is the argument of z = {z}, between 0° and 360°? Write just the number of degrees.', lq2: 'If z = {a} and w = {b}, what are the modulus and argument of z·w? Write both separated by a comma (for example, 6, 150), with the argument between 0 and 360.', lq3: 'The {n}th roots of w = {w}: what is the argument of the root with k = {k}? Write just the degrees.',
      h1: 'Reference: arctan|b/a|. 2nd quadrant: 180° − ref; 3rd: 180° + ref; 4th: 360° − ref.', h2: 'Moduli multiply and arguments add (subtract 360° if you go past it).', h3: '(α + 360°·k)/n, with α the argument of w.' }
  };
  var CAB = [R3, 1];
  function S(m, o) { o.m = m; return o; }
  /* ------------------------------------------------ lecciones (el tema 7 de AG: la noria de la feria) */
  var LES = [
    { k: 'noria', g: 'target', n: ['La cabina de la noria', 'The Ferris wheel cabin'], d: ['Nuestra cabina, √3 + i: binómica, módulo, argumento y las cuatro formas.', 'Our cabin, √3 + i: binomial form, modulus, argument and the four forms.'],
      steps: [
        S('forma', { z: CAB, show: 'bin', s: ['El eje de la noria está en el origen y cada unidad son 10 metros. Nuestra cabina está √3 ≈ 1,73 a la derecha y 1 arriba: en binómica, z = √3 + i.', 'The wheel axle is at the origin and each unit is 10 metres. Our cabin is √3 ≈ 1.73 to the right and 1 up: in binomial form, z = √3 + i.'], code: 'z = sqrt(3) + 1i' }),
        S('forma', { z: CAB, show: 'mod', s: ['Su distancia al eje es el módulo: |z| = √(3 + 1) = 2, el radio de la noria. Todas las cabinas están en esa circunferencia.', 'Its distance to the axle is the modulus: |z| = √(3 + 1) = 2, the radius of the wheel. All the cabins are on that circle.'], code: 'abs(z)', res: '2' }),
        S('forma', { z: CAB, show: 'arg', s: ['El ángulo con el eje real positivo es el argumento: arctan(1/√3) = 30°, y como el punto está en el 1.er cuadrante, no hay que corregirlo.', 'The angle with the positive real axis is the argument: arctan(1/√3) = 30°, and since the point is in the 1st quadrant, no fix is needed.'], code: 'angle(z)*180/pi', res: '30.0000',
          ask: { q: ['¿Qué argumento tiene la cabina opuesta, −√3 − i?', 'What argument does the opposite cabin, −√3 − i, have?'], o: [['30°, el mismo que da arctan', '30°, the same one arctan gives'], ['210°', '210°', 1], ['−30°', '−30°']] } }),
        S('forma', { z: CAB, show: 'all', s: ['Con módulo y argumento tienes la forma polar, 2₃₀°, la trigonométrica, 2(cos 30° + i sen 30°), y la exponencial, 2e^(iπ/6). Es el mismo punto: cambia solo la forma de describirlo.', 'With modulus and argument you have the polar form, 2₃₀°, the trigonometric form, 2(cos 30° + i sin 30°), and the exponential form, 2e^(iπ/6). It is the same point: only the way of describing it changes.'], code: 'w = 2*exp(1i*pi/6)', res: '1.7321 + 1.0000i' }),
        S('forma', { z: [-1, -1], show: 'all', s: ['La trampa del arcotangente: para −1 − i, arctan(−1/−1) = arctan(1) = 45°, pero el punto está en el 3.er cuadrante. El argumento es 45° + 180° = 225°. MATLAB lo da entre −180° y 180°: −135° + 360° = 225°, el mismo.', 'The arctangent trap: for −1 − i, arctan(−1/−1) = arctan(1) = 45°, but the point is in the 3rd quadrant. The argument is 45° + 180° = 225°. MATLAB gives it between −180° and 180°: −135° + 360° = 225°, the same one.'], code: 'angle(-1 - 1i)*180/pi', res: '-135' })
      ] },
    { k: 'giro', g: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>', n: ['Multiplicar es girar', 'Multiplying is turning'], d: ['z·i gira 90°, z·(1+i) gira 45° y estira √2: los módulos se multiplican y los ángulos se suman.', 'z·i turns 90°, z·(1+i) turns 45° and stretches by √2: moduli multiply and angles add.'],
      steps: [
        S('prod', { z: CAB, w: [0, 1], show: 'zw', s: ['Nuestra cabina, z = 2₃₀°, y el número i, que en polar es 1₉₀°: módulo 1 y ángulo 90°.', 'Our cabin, z = 2₃₀°, and the number i, which in polar form is 1₉₀°: modulus 1 and angle 90°.'], code: 'z = sqrt(3) + 1i;  w = 1i' }),
        S('prod', { z: CAB, w: [0, 1], show: 'all', s: ['z·i = 2₁₂₀°: el módulo se multiplica por 1 (no cambia) y al ángulo se le suman 90°. Un cuarto de vuelta, sin senos ni cosenos. En binómica: (√3 + i)·i = −1 + √3 i.', 'z·i = 2₁₂₀°: the modulus is multiplied by 1 (unchanged) and 90° is added to the angle. A quarter turn, with no sines or cosines. In binomial form: (√3 + i)·i = −1 + √3 i.'], code: 'z*1i', res: '-1.0000 + 1.7321i' }),
        S('prod', { z: CAB, w: [1, 1], show: 'zw', s: ['Ahora w = 1 + i = √2₄₅°. Antes de mirar el resultado, piensa qué le hará a la cabina.', 'Now w = 1 + i = √2₄₅°. Before looking at the result, think about what it will do to the cabin.'], code: 'w = 1 + 1i',
          ask: { q: ['¿Qué argumento tendrá z·w?', 'What argument will z·w have?'], o: [['75°', '75°', 1], ['30°', '30°'], ['1350°', '1350°']] } }),
        S('prod', { z: CAB, w: [1, 1], show: 'all', s: ['z·w = (2·√2)₃₀°₊₄₅° = (2√2)₇₅°: gira 45° y se estira √2 veces. Los módulos se multiplican y los argumentos se suman.', 'z·w = (2·√2)₃₀°₊₄₅° = (2√2)₇₅°: it turns 45° and stretches √2 times. Moduli multiply and arguments add.'], code: 'abs(z*w), angle(z*w)*180/pi', res: '2.8284  75.0000' })
      ] },
    { k: 'cociente', g: 'back', n: ['Dividir es girar al revés', 'Dividing is turning back'], d: ['La cabina de arriba entre la nuestra: se dividen los módulos y se restan los ángulos.', 'The top cabin divided by ours: moduli divide and angles subtract.'],
      steps: [
        S('coc', { z: [0, 2], w: CAB, show: 'zw', s: ['La cabina de arriba, z = 2i = 2₉₀°, y la nuestra, w = √3 + i = 2₃₀°.', 'The top cabin, z = 2i = 2₉₀°, and ours, w = √3 + i = 2₃₀°.'], code: 'z = 2i;  w = sqrt(3) + 1i' }),
        S('coc', { z: [0, 2], w: CAB, show: 'all', s: ['z/w = (2/2)₉₀°₋₃₀° = 1₆₀°: el giro que lleva de nuestra cabina a la de arriba. En binómica sería multiplicar arriba y abajo por el conjugado de w; en polar, una resta.', 'z/w = (2/2)₉₀°₋₃₀° = 1₆₀°: the turn that takes our cabin to the top one. In binomial form you would multiply top and bottom by the conjugate of w; in polar form, it is a subtraction.'], code: 'z/w', res: '0.5000 + 0.8660i' }),
        S('coc', { z: [3, 2], w: [1, -2], show: 'all', s: ['Con números que no son de los de siempre, la polar no ayuda: (3 + 2i)/(1 − 2i) = −1/5 + (8/5)i, multiplicando por el conjugado (1 + 2i) arriba y abajo.', 'With numbers that are not the usual ones, polar form does not help: (3 + 2i)/(1 − 2i) = −1/5 + (8/5)i, multiplying top and bottom by the conjugate (1 + 2i).'], code: '(3 + 2i)/(1 - 2i)', res: '-0.2000 + 1.6000i' })
      ] },
    { k: 'suma', g: 'grid', n: ['La suma es un paralelogramo', 'Addition is a parallelogram'], d: ['El algodón y la taquilla: sumar es poner una flecha tras otra; el conjugado es un espejo.', 'The candyfloss and the ticket booth: adding is putting one arrow after another; the conjugate is a mirror.'],
      steps: [
        S('suma', { z: [3, 2], w: [1, -2], show: 'zw', s: ['En el plano de la feria, el puesto de algodón está en z = 3 + 2i y la taquilla en w = 1 − 2i.', 'On the fairground map, the candyfloss stall is at z = 3 + 2i and the ticket booth at w = 1 − 2i.'], code: 'z = 3 + 2i;  w = 1 - 2i' }),
        S('suma', { z: [3, 2], w: [1, -2], show: 'all', s: ['z + w = (3 + 1) + (2 − 2)i = 4: la diagonal del paralelogramo. Parte real con parte real e imaginaria con imaginaria.', 'z + w = (3 + 1) + (2 − 2)i = 4: the diagonal of the parallelogram. Real part with real part, imaginary with imaginary.'], code: 'z + w', res: '4' }),
        S('suma', { z: [3, 2], w: [1, -2], show: 'cj', s: ['El conjugado, z̄ = 3 − 2i, es el reflejo en el eje real; el opuesto, −z = −3 − 2i, es media vuelta. No los confundas: el conjugado cambia un signo y el opuesto, los dos.', 'The conjugate, z̄ = 3 − 2i, is the reflection in the real axis; the opposite, −z = −3 − 2i, is a half turn. Do not mix them up: the conjugate flips one sign and the opposite, both.'], code: 'conj(z), -z', res: '3.0000 - 2.0000i   -3.0000 - 2.0000i',
          ask: { q: ['¿Cuál es el opuesto de 4 − 3i?', 'What is the opposite of 4 − 3i?'], o: [['4 + 3i', '4 + 3i'], ['−4 + 3i', '−4 + 3i', 1], ['−4 − 3i', '−4 − 3i']] } })
      ] },
    { k: 'potencias', g: '<path d="M12 12m-1 0a1 1 0 1 0 2 0a3 3 0 1 0-6 0a5 5 0 1 0 10 0a7 7 0 1 0-14 0"/>', n: ['Potencias en espiral', 'Powers in a spiral'], d: ['(1 + i)ⁿ gira 45° y se estira √2 en cada potencia: la fórmula de De Moivre.', '(1 + i)ⁿ turns 45° and stretches by √2 at each power: De Moivre’s formula.'],
      steps: [
        S('pot', { z: [1, 1], n: 1, s: ['z = 1 + i = √2₄₅°. Elevar es multiplicar por z una y otra vez: el mismo giro y la misma escala, repetidos.', 'z = 1 + i = √2₄₅°. Raising to a power is multiplying by z again and again: the same turn and the same scale, repeated.'], code: 'z = 1 + 1i' }),
        S('pot', { z: [1, 1], n: 2, s: ['z² = 2₉₀° = 2i: el módulo al cuadrado (√2² = 2) y el ángulo por 2.', 'z² = 2₉₀° = 2i: the modulus squared (√2² = 2) and the angle times 2.'], code: 'z^2', res: '0.0000 + 2.0000i' }),
        S('pot', { z: [1, 1], n: 3, s: ['z³ = (2√2)₁₃₅°: otros 45° y otra vez √2 veces más lejos.', 'z³ = (2√2)₁₃₅°: another 45° and √2 times further out again.'], code: 'abs(z)^3, angle(z)*3*180/pi', res: '2.8284  135',
          ask: { q: ['¿Dónde caerá z⁴?', 'Where will z⁴ land?'], o: [['En −4, sobre el eje real', 'At −4, on the real axis', 1], ['En 4i', 'At 4i'], ['En 4', 'At 4']] } }),
        S('pot', { z: [1, 1], n: 4, s: ['z⁴ = 4₁₈₀° = −4. De Moivre: (R_α)ⁿ = (Rⁿ)ₙ·α. Y z⁸ = 16₃₆₀° = 16 sin multiplicar ocho veces.', 'z⁴ = 4₁₈₀° = −4. De Moivre: (R_α)ⁿ = (Rⁿ)ₙ·α. And z⁸ = 16₃₆₀° = 16 without multiplying eight times.'], code: 'abs(z)^4, angle(z)*4*180/pi', res: '4.0000  180' })
      ] },
    { k: 'raices', g: 'target', n: ['Las seis cabinas', 'The six cabins'], d: ['Las raíces sextas de −64 son las cabinas de la noria: n raíces, mismo módulo, separadas 360°/n.', 'The sixth roots of −64 are the Ferris wheel cabins: n roots, the same modulus, 360°/n apart.'],
      steps: [
        S('raiz', { w: [-64, 0], n: 6, k: 1, s: ['w = −64 = 64₁₈₀° (queda fuera del dibujo). Sus raíces sextas tienen módulo ⁶√64 = 2; la primera tiene ángulo 180°/6 = 30°: nuestra cabina.', 'w = −64 = 64₁₈₀° (it is outside the drawing). Its sixth roots have modulus ⁶√64 = 2; the first one has angle 180°/6 = 30°: our cabin.'], code: 'R = abs(-64)^(1/6)', res: '2' }),
        S('raiz', { w: [-64, 0], n: 6, k: 2, s: ['La siguiente suma 360°/6 = 60°: 2₉₀°, la cabina de arriba. Sumar 360° daría otra vez la primera.', 'The next one adds 360°/6 = 60°: 2₉₀°, the top cabin. Adding 360° would give the first one again.'], code: '(pi + 2*pi*1)/6*180/pi', res: '90',
          ask: { q: ['¿Cuántas raíces sextas tiene −64?', 'How many sixth roots does −64 have?'], o: [['Una', 'One'], ['Dos', 'Two'], ['Seis', 'Six', 1]] } }),
        S('raiz', { w: [-64, 0], n: 6, k: 6, s: ['Las seis: 2₃₀°₊₆₀°ₖ, un hexágono regular. Son las seis cabinas de la noria: z⁶ = −64.', 'All six: 2₃₀°₊₆₀°ₖ, a regular hexagon. They are the six cabins of the wheel: z⁶ = −64.'], code: '2*exp(1i*(pi + 2*pi*(0:5))/6)', res: '6 raíces' }),
        S('raiz', { w: [0, -8], n: 3, k: 3, s: ['Con las raíces cúbicas de −8i = 8₂₇₀°: módulo 2, ángulos 90° + 120°k. Un triángulo equilátero: 2i, −√3 − i y √3 − i.', 'With the cube roots of −8i = 8₂₇₀°: modulus 2, angles 90° + 120°k. An equilateral triangle: 2i, −√3 − i and √3 − i.'], code: '2*exp(1i*(3*pi/2 + 2*pi*(0:2))/3)', res: '3 raíces' })
      ] }
  ];
  LES.forEach(function (l) { l.steps.forEach(function (s) { if (s.ask) s.ask = { q: s.ask.q, o: s.ask.o }; }); });
  /* ------------------------------------------------ geometría del dibujo */
  var W = 440, CX = 220, CY = 220, HALF = 196;
  function ext(st) {   // radio que hay que ver
    var pts = pointsOf(st), m = 0;
    pts.forEach(function (p) { var a = Math.max(Math.abs(p[0]), Math.abs(p[1])); if (a < 30) m = Math.max(m, a); });
    var r = Math.max(2.5, m * 1.18), steps = [2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 30];
    for (var i = 0; i < steps.length; i++) if (steps[i] >= r) return steps[i];
    return 30;
  }
  function pointsOf(st) {
    var z = st.z, w = st.w, a = [];
    if (st.m === 'forma') a.push(z, P.conj(z));
    if (st.m === 'suma') a.push(z, w, P.add(z, w), P.neg(z), P.conj(z));
    if (st.m === 'prod') a.push(z, w, P.mul(z, w));
    if (st.m === 'coc') a.push(z, w, P.div(z, w));
    if (st.m === 'pot') for (var k = 1; k <= Math.max(st.n, 1); k++) a.push(P.pow(z, k));
    if (st.m === 'raiz') { P.roots(st.w, st.n).forEach(function (r) { a.push(r.z); }); if (P.abs(st.w) < 6) a.push(st.w); }
    return a;
  }
  /* ------------------------------------------------ montaje */
  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var UI = K.mount(el, { sim: 'pc', title: t.title, d: true }), q = UI.q;
    var ED = { m: 'forma', z: CAB.slice(), w: [1, 1], n: 6, zs: '√3 + i', ws: '1 + i' };
    var main = '<div class="gj-edw pc-edw" hidden><div class="gj-edl">'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.what) + '</p><div class="m1-seg pc-mode" role="group">' + ['forma', 'suma', 'prod', 'coc', 'pot', 'raiz'].map(function (m) { return '<button type="button" data-pm="' + m + '">' + esc(t.modes[m]) + '</button>'; }).join('') + '</div></div>'
      + '<p class="gj-edh">' + esc(t.hint) + '</p></div><div class="gj-edr"><div class="m1-grp pc-ins">'
      + '<label class="pc-in"><span>z</span><input type="text" data-pi="z" spellcheck="false" autocomplete="off"></label>'
      + '<label class="pc-in pc-inw"><span>w</span><input type="text" data-pi="w" spellcheck="false" autocomplete="off"></label>'
      + '<div class="pc-in pc-inn"><span>n</span><div class="m1-seg pc-n" role="group"></div></div></div>'
      + '<div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-pa="go">' + ico('play', 14) + '<span>' + esc(t.go) + '</span></button><button type="button" class="slk-btn" data-pa="rnd">' + ico('dice', 14) + '<span>' + esc(t.rnd) + '</span></button></div></div></div>'
      + '<div class="pc-board"><div class="gj-op pc-op" aria-live="polite"></div><div class="pc-grid"><div class="m1-plotw pc-plotw"><svg class="m1-plot pc-plot" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="' + esc(en ? 'Complex plane' : 'Plano complejo') + '"></svg></div><div class="pc-side"></div></div></div>';
    var CUR = null, CURST = null, LOCK = null;
    var C = M.card(UI, { lessons: LES, main: main,
      onLoad: function (les) { CUR = les; if (les.k !== 'tuya') edFrom(les.steps[0]); },
      onStep: function (les, k, ox) { render(les.steps[k], ox.anim); },
      xp: function () { return xp(CUR.steps[C.D.pos()]); },
      state: function () { return CUR && CUR.k === 'tuya' ? { ED: { m: ED.m, z: ED.z, w: ED.w, n: ED.n } } : null; },
      restore: function (x) { if (x && x.ED) { ED.m = x.ED.m; ED.z = x.ED.z; ED.w = x.ED.w; ED.n = x.ED.n; edDraw(); free(); } }
    });
    var TOG = document.createElement('button'); TOG.type = 'button'; TOG.className = 'slk-btn pm3-codeb gj-tog'; TOG.setAttribute('data-pa', 'tog'); TOG.setAttribute('aria-expanded', 'false');
    q('.m1-head__r').insertBefore(TOG, q('.m1-head__r').firstChild);
    function tog(open) { var w = q('.pc-edw'); w.hidden = !open; TOG.setAttribute('aria-expanded', open ? 'true' : 'false'); TOG.innerHTML = ico('grid', 16) + '<span>' + esc(open ? t.hideC : t.showC) + '</span>'; if (open) K.anim(w, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    tog(false);
    /* ---------- formato */
    function zh(z) { return esc(P.zs(z, lang)); }
    function ph(z) { return esc(P.nice(P.abs(z), lang)) + '<sub>' + esc(P.deg(P.arg(z), lang)) + '</sub>'; }
    function phRA(r, a) { return esc(P.nice(r, lang)) + '<sub>' + esc(P.deg(((a % 360) + 360) % 360, lang)) + '</sub>'; }
    function trig(z) { var r = P.nice(P.abs(z), lang), a = P.deg(P.arg(z), lang); return esc((r === '1' ? '' : r) + '(cos ' + a + ' + i ' + t.sen + ' ' + a + ')'); }
    function expo(z) { var r = P.nice(P.abs(z), lang), a = P.arg(z), f = radTxt(a); return esc((r === '1' ? '' : r) + 'e') + '<sup>' + esc('i' + f) + '</sup>'; }
    function radTxt(a) {   // 30 → π/6
      if (Math.abs(a) < 1e-9) return '0';
      for (var d = 1; d <= 12; d++) { var n = a * d / 180; if (Math.abs(n - Math.round(n)) < 1e-6) { n = Math.round(n); return (n === 1 ? '' : n) + 'π' + (d === 1 ? '' : '/' + d); } }
      return (Math.round(a * Math.PI / 180 * 1000) / 1000 + '').replace('.', en ? '.' : ',');
    }
    function row(k, v, cls) { return '<div class="pc-row' + (cls ? ' ' + cls : '') + '"><span class="pc-k">' + esc(k) + '</span><span class="pc-v">' + v + '</span></div>'; }
    /* ---------- el dibujo */
    function svgPlane(st, R) {
      var s = HALF / R, X = function (x) { return CX + x * s; }, Y = function (y) { return CY - y * s; };
      var step = R <= 3 ? 0.5 : R <= 6 ? 1 : R <= 12 ? 2 : R <= 20 ? 4 : 5, lab = R <= 3 ? 1 : step, h = '';
      for (var v = -Math.floor(R / step) * step; v <= R + 1e-9; v += step) {
        if (Math.abs(v) < 1e-9) continue;
        h += '<line class="m1-gl" x1="' + X(v) + '" y1="' + (CY - HALF) + '" x2="' + X(v) + '" y2="' + (CY + HALF) + '"/><line class="m1-gl" x1="' + (CX - HALF) + '" y1="' + Y(v) + '" x2="' + (CX + HALF) + '" y2="' + Y(v) + '"/>';
        if (Math.abs(v / lab - Math.round(v / lab)) < 1e-9) { OB.push([X(v) - 10, CY + 3, X(v) + 10, CY + 18], [CX - 30, Y(v) - 8, CX - 4, Y(v) + 6]); } if (Math.abs(v / lab - Math.round(v / lab)) < 1e-9) h += '<text class="m1-tl" x="' + X(v) + '" y="' + (CY + 15) + '" text-anchor="middle">' + fmtT(v) + '</text><text class="m1-tl" x="' + (CX - 7) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + fmtI(v) + '</text>';
      }
      h += '<line class="m1-ax" x1="' + (CX - HALF) + '" y1="' + CY + '" x2="' + (CX + HALF) + '" y2="' + CY + '"/><line class="m1-ax" x1="' + CX + '" y1="' + (CY - HALF) + '" x2="' + CX + '" y2="' + (CY + HALF) + '"/>';
      h += '<text class="pc-axl" x="' + (CX + HALF - 2) + '" y="' + (CY - 8) + '" text-anchor="end">Re</text><text class="pc-axl" x="' + (CX + 8) + '" y="' + (CY - HALF + 14) + '">Im</text>';
      return { h: h, X: X, Y: Y, s: s };
    }
    function fmtT(v) { return String(v).replace('-', '−').replace('.', en ? '.' : ','); }
    function fmtI(v) { return v === 1 ? 'i' : v === -1 ? '−i' : fmtT(v) + 'i'; }
    function vec(G, z, cls, from, dash) { var f = from || [0, 0]; var x1 = G.X(f[0]), y1 = G.Y(f[1]), x2 = G.X(z[0]), y2 = G.Y(z[1]); var d = Math.hypot(x2 - x1, y2 - y1); if (d < 2) return ''; for (var u = 0; u <= d; u += 10) { var px = x1 + (x2 - x1) * u / d, py = y1 + (y2 - y1) * u / d; OB.push([px - 3, py - 3, px + 3, py + 3]); } return '<line class="pc-v ' + cls + (dash ? ' is-dash' : '') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" marker-end="url(#' + UI.id + '-ar-' + cls + ')"/>'; }
    var LB = [], OB = [];   // etiquetas de los puntos: se colocan al final, donde no se pisen
    function dot(G, z, cls, label, handle) {
      var x = G.X(z[0]), y = G.Y(z[1]), out = '<g class="pc-pt ' + cls + (handle ? ' is-h' : '') + '"' + (handle ? ' data-h="' + handle + '" tabindex="0" role="slider" aria-label="' + esc(label || handle) + '"' : '') + '>' + (handle ? '<circle class="pc-halo" cx="' + x + '" cy="' + y + '" r="16"/>' : '') + '<circle cx="' + x + '" cy="' + y + '" r="' + (handle ? 7 : 5.5) + '"/></g>';
      LB.push({ x: x, y: y, t: label, c: cls });
      return out;
    }
    function labels() {
      var big = window.matchMedia && window.matchMedia('(max-width:560px)').matches, fs = big ? 20 : 13, cw = fs * 0.6, boxes = [], out = '';
      LB.forEach(function (p) { boxes.push([p.x - 9, p.y - 9, p.x + 9, p.y + 9]); }); boxes = boxes.concat(OB);
      function hit(b) { for (var i = 0; i < boxes.length; i++) { var o = boxes[i]; if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true; } return b[0] < 2 || b[2] > W - 2 || b[1] < 2 || b[3] > W - 2; }
      LB.forEach(function (p) {
        if (!p.t) return;
        if (big && p.t.indexOf(' = ') > 0) p.t = p.t.split(' = ')[0];
        var w = p.t.length * cw, h = fs, right = p.x >= CX - 1 ? p.x < W - w - 20 : p.x - w - 20 < 0, up = p.y > 40, best = null;
        var C = [];
        [8, 22, 38, 56].forEach(function (d) { [[right, up], [right, !up], [!right, up], [!right, !up], [right, null], [!right, null]].forEach(function (c) { C.push([c[0], c[1], d]); }); });
        for (var i = 0; i < C.length && !best; i++) {
          var r = C[i][0], u = C[i][1], d = C[i][2], x0 = r ? p.x + 10 : p.x - 10 - w, y0 = u === null ? p.y - h / 2 : (u ? p.y - d - h : p.y + d), b = [x0, y0, x0 + w, y0 + h];
          if (u === null) { b[0] = r ? p.x + 6 + d : p.x - 6 - d - w; b[2] = b[0] + w; }
          if (!hit(b)) best = b;
        }
        if (!best) { var x1 = p.x + 10; best = [x1, p.y - 8 - h, x1 + w, p.y - 8]; }
        boxes.push(best);
        out += '<text class="pc-lb ' + p.c + '" x="' + best[0].toFixed(1) + '" y="' + (best[3] - fs * 0.22).toFixed(1) + '">' + esc(p.t) + '</text>';
      });
      return out;
    }
    function arc(G, r, a0, a1, cls, label) {
      if (Math.abs(a1 - a0) < 0.5) return '';
      var n = Math.max(8, Math.round(Math.abs(a1 - a0) / 4)), pts = [];
      for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push((CX + r * Math.cos(a)).toFixed(1) + ',' + (CY - r * Math.sin(a)).toFixed(1)); }
      var am = (a0 + a1) / 2 * Math.PI / 180, lx = CX + (r + 16) * Math.cos(am), ly = CY - (r + 16) * Math.sin(am); if (label) OB.push([lx - label.length * 4.5, ly - 8, lx + label.length * 4.5, ly + 8]);
      return '<polyline class="pc-arc ' + cls + '" points="' + pts.join(' ') + '"/>' + (label ? '<text class="pc-al ' + cls + '" x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) + '" text-anchor="middle">' + esc(label) + '</text>' : '');
    }
    function circle(G, r, cls) { return '<circle class="pc-circ ' + (cls || '') + '" cx="' + CX + '" cy="' + CY + '" r="' + (r * G.s).toFixed(1) + '"/>'; }
    function defs() { return '<defs>' + ['co', 'vi', 'gr', 'mu', 'in'].map(function (c) { return '<marker id="' + UI.id + '-ar-' + c + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="pc-mk ' + c + '" d="M0 0L10 5L0 10z"/></marker>'; }).join('') + '</defs>'; }
    function draw(st) {
      LB = []; OB = []; var R = LOCK || ext(st), G = svgPlane(st, R), h = defs() + G.h, z = st.z, w = st.w, sh = st.show || 'all', side = '', op = '';
      if (st.m === 'forma') {
        var za = P.arg(z), r = P.abs(z);
        if (sh !== 'bin') h += circle(G, r, 'is-faint');
        h += '<line class="pc-proj" x1="' + G.X(z[0]) + '" y1="' + G.Y(z[1]) + '" x2="' + G.X(z[0]) + '" y2="' + CY + '"/><line class="pc-proj" x1="' + G.X(z[0]) + '" y1="' + G.Y(z[1]) + '" x2="' + CX + '" y2="' + G.Y(z[1]) + '"/>';
        h += '<text class="pc-al co" x="' + G.X(z[0]) + '" y="' + (CY + (z[1] >= 0 ? 30 : -22)) + '" text-anchor="middle">a = ' + esc(P.nice(z[0], lang)) + '</text><text class="pc-al co" x="' + (CX + (z[0] >= 0 ? -10 : 10)) + '" y="' + (G.Y(z[1]) + 4) + '" text-anchor="' + (z[0] >= 0 ? 'end' : 'start') + '">b = ' + esc(P.nice(z[1], lang)) + '</text>';
        if (sh === 'arg' || sh === 'all') h += arc(G, 30, 0, za, 'vi', P.deg(za, lang));
        if (sh !== 'bin') { var mx = G.X(z[0] / 2), my = G.Y(z[1] / 2); h += '<text class="pc-al mu" x="' + (mx - 8) + '" y="' + (my - 8) + '" text-anchor="end">' + esc(P.nice(r, lang)) + '</text>'; }
        h += vec(G, z, 'co') + dot(G, z, 'co', 'z = ' + P.zs(z, lang), 'z');
        var qd = P.quad(z);
        side += row(t.bin, zh(z), 'is-main') + (sh !== 'bin' ? row(t.mod, '√(' + esc(sq(z[0]) + ' + ' + sq(z[1])) + ') = ' + esc(P.nice(r, lang))) : '')
          + (sh === 'arg' || sh === 'all' ? row(t.arg, esc(P.deg(za, lang)) + ' <small>' + esc(t.qs[qd]) + '</small>') : '')
          + (sh === 'all' ? row(t.polar, ph(z), 'is-hi') + row(t.trig, trig(z)) + row(t.exp, expo(z)) : '');
        op = 'z = ' + P.zs(z, lang);
      } else if (st.m === 'suma') {
        var s2 = P.add(z, w);
        h += vec(G, z, 'vi') + vec(G, w, 'gr');
        if (sh !== 'zw' && sh !== 'cj') { h += vec(G, s2, 'mu', z, true).replace('class="pc-v mu', 'class="pc-v gr') + vec(G, s2, 'mu', w, true).replace('class="pc-v mu', 'class="pc-v vi') + vec(G, s2, 'co') + dot(G, s2, 'co', 'z + w = ' + P.zs(s2, lang)); }
        if (sh === 'cj') { var cj = P.conj(z), ng = P.neg(z); h += '<line class="pc-proj" x1="' + G.X(z[0]) + '" y1="' + G.Y(z[1]) + '" x2="' + G.X(cj[0]) + '" y2="' + G.Y(cj[1]) + '"/>' + vec(G, cj, 'gr', null, true) + dot(G, cj, 'gr', 'z̄ = ' + P.zs(cj, lang)) + vec(G, ng, 'co', null, true) + dot(G, ng, 'co', '−z = ' + P.zs(ng, lang)); }
        h += dot(G, z, 'vi', 'z = ' + P.zs(z, lang), 'z') + (sh === 'cj' ? '' : dot(G, w, 'gr', 'w = ' + P.zs(w, lang), 'w'));
        side += row('z', zh(z)) + row('w', zh(w)) + (sh === 'all' || sh === 'zw' ? row(t.sum, sh === 'zw' ? '?' : zh(s2), 'is-hi') + (sh === 'all' ? row(t.dif, zh(P.sub(z, w))) : '') : '')
          + (sh === 'cj' ? row(t.cj + ' z̄', zh(P.conj(z)), 'is-hi') + row(t.op + ' −z', zh(P.neg(z))) : '');
        op = sh === 'cj' ? 'z̄ · −z' : 'z + w';
      } else if (st.m === 'prod' || st.m === 'coc') {
        var pr = st.m === 'prod', res = pr ? P.mul(z, w) : P.div(z, w), az = P.arg(z), aw = P.arg(w), ar = P.arg(res);
        h += vec(G, z, 'vi') + vec(G, w, 'gr');
        h += arc(G, 26, 0, aw, 'gr', '') + arc(G, 40, 0, az, 'vi', '');
        if (sh === 'all') { h += arc(G, 56, 0, ar, 'co', P.deg(ar, lang)); h += vec(G, res, 'co') + dot(G, res, 'co', (pr ? 'z·w = ' : 'z/w = ') + P.zs(res, lang)); }
        h += dot(G, z, 'vi', 'z = ' + P.zs(z, lang), 'z') + dot(G, w, 'gr', 'w = ' + P.zs(w, lang), 'w');
        var Rz = P.abs(z), Rw = P.abs(w);
        side += row('z', ph(z) + ' <small>= ' + zh(z) + '</small>') + row('w', ph(w) + ' <small>= ' + zh(w) + '</small>');
        if (sh === 'all') side += row(pr ? 'z·w' : 'z/w', '(' + esc(P.nice(Rz, lang)) + (pr ? '·' : '/') + esc(P.nice(Rw, lang)) + ')<sub>' + esc(P.deg(az, lang).replace('°', '') + (pr ? '° + ' : '° − ') + P.deg(aw, lang)) + '</sub>', 'is-hi')
          + row('=', ph(res) + ' <small>= ' + zh(res) + '</small>');
        else side += row(pr ? 'z·w' : 'z/w', '?', 'is-hi');
        op = pr ? 'z · w' : 'z / w';
      } else if (st.m === 'pot') {
        var n = st.n, pts = [];
        for (var k = 1; k <= n; k++) pts.push(P.pow(z, k));
        var sp = [[0, 0]].concat(pts);
        for (var k2 = 1; k2 < pts.length; k2++) h += spiral(G, pts[k2 - 1], pts[k2]);
        pts.forEach(function (p, i) { var last = i === pts.length - 1; h += vec(G, p, last ? 'co' : 'mu') + dot(G, p, last ? 'co' : 'in', i === 0 ? 'z' : (last ? 'z' + supN(i + 1) + ' = ' + P.zs(p, lang) : 'z' + supN(i + 1)), i === 0 ? 'z' : null); });
        var Rz2 = P.abs(z), az2 = P.arg(z), rn = Math.pow(Rz2, n), an = az2 * n;
        side += row('z', ph(z) + ' <small>= ' + zh(z) + '</small>') + row('z' + supN(n), '(' + esc(P.nice(Rz2, lang)) + '<sup>' + n + '</sup>)<sub>' + n + '·' + esc(P.deg(az2, lang)) + '</sub>', 'is-hi')
          + row('=', phRA(rn, an) + ' <small>= ' + zh(pts[pts.length - 1]) + '</small>') + (an >= 360 ? row(t.ang, esc(P.deg(an, lang) + ' − ' + Math.floor(an / 360) * 360 + '° = ' + P.deg(an % 360, lang))) : '');
        op = 'z' + supN(n) + ' · De Moivre';
      } else {
        var rs = P.roots(w, st.n), shown = rs.slice(0, Math.max(1, st.k || st.n)), Rr = rs[0].r;
        h += circle(G, Rr, 'is-faint');
        if (shown.length === rs.length && rs.length > 2) h += '<polygon class="pc-poly" points="' + rs.map(function (x) { return G.X(x.z[0]).toFixed(1) + ',' + G.Y(x.z[1]).toFixed(1); }).join(' ') + '"/>';
        if (shown.length >= 2) h += arc(G, 34, rs[0].a, rs[1].a, 'vi', P.deg(360 / st.n, lang));
        shown.forEach(function (x, i) { h += vec(G, x.z, i === 0 ? 'co' : 'mu') + dot(G, x.z, i === 0 ? 'co' : 'in', 'z' + subN(x.k)); });
        var inside = P.abs(w) <= (LOCK || ext(st));
        if (inside) h += dot(G, w, 'gr', 'w', 'w');
        side += row('w', ph(w) + ' <small>= ' + zh(w) + '</small>') + (inside ? '' : '<p class="pc-note">' + esc(t.out) + '</p>')
          + row('n', String(st.n)) + row(t.mod, esc(supN(st.n) + '√' + P.nice(P.abs(w), lang) + ' = ' + P.nice(Rr, lang)))
          + row(t.ang, esc('(' + P.deg(P.arg(w), lang) + ' + 360°·k)/' + st.n + ' · ' + fill(t.apart, { a: P.deg(360 / st.n, lang) })), 'is-hi')
          + '<div class="pc-roots">' + shown.map(function (x) { return '<span><b>z' + subN(x.k) + '</b> ' + phRA(x.r, x.a) + ' = ' + zh(x.z) + '</span>'; }).join('') + '</div>';
        op = supN(st.n) + '√w · n = ' + st.n;
      }
      return { svg: h + labels(), side: side, op: op };
    }
    function sq(x) { var n = P.nice(x, lang); return (x < 0 ? '(' + n + ')' : n) + '²'; }
    function supN(n) { return String(n).split('').map(function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }).join(''); }
    function subN(n) { return String(n).split('').map(function (d) { return '₀₁₂₃₄₅₆₇₈₉'.charAt(+d); }).join(''); }
    function spiral(G, a, b) {
      var r0 = P.abs(a), r1 = P.abs(b), a0 = P.arg(a), a1 = P.arg(b); if (a1 < a0) a1 += 360;
      var pts = []; for (var i = 0; i <= 14; i++) { var r = r0 + (r1 - r0) * i / 14, an = (a0 + (a1 - a0) * i / 14) * Math.PI / 180; pts.push(G.X(r * Math.cos(an)).toFixed(1) + ',' + G.Y(r * Math.sin(an)).toFixed(1)); }
      return '<polyline class="pc-spi" points="' + pts.join(' ') + '"/>';
    }
    function render(st, anim) {
      CURST = st;
      var D = draw(st);
      q('.pc-plot').innerHTML = D.svg;
      q('.pc-side').innerHTML = D.side;
      q('.pc-op').innerHTML = '<span class="gj-op__k">' + esc(t.modes[st.m] ? t.modes[st.m] : st.m) + '</span><b>' + esc(D.op) + '</b>';
      if (anim && !K.reduced()) { q('.pc-plot').classList.remove('is-anim'); void q('.pc-plot').offsetWidth; q('.pc-plot').classList.add('is-anim'); }
      C.setStrip(st.code || code(st), st.res != null ? st.res : (st.code ? null : res(st)));
    }
    function code(st) {
      var z = P.mlin(st.z || [0, 0]), w = P.mlin(st.w || [0, 0]);
      if (st.m === 'forma') return 'z = ' + z + ';  [abs(z) angle(z)*180/pi]';
      if (st.m === 'suma') return '(' + z + ') + (' + w + ')';
      if (st.m === 'prod') return '(' + z + ')*(' + w + ')';
      if (st.m === 'coc') return '(' + z + ')/(' + w + ')';
      if (st.m === 'pot') return '(' + z + ')^' + st.n;
      return 'abs(w)^(1/' + st.n + ')*exp(1i*(angle(w) + 2*pi*(0:' + (st.n - 1) + '))/' + st.n + ')';
    }
    function res(st) {
      if (st.m === 'forma') return P.ml(P.abs(st.z)) + '  ' + P.ml(((P.arg(st.z) + 180) % 360) - 180);
      if (st.m === 'suma') return P.mlz(P.add(st.z, st.w));
      if (st.m === 'prod') return P.mlz(P.mul(st.z, st.w));
      if (st.m === 'coc') return P.mlz(P.div(st.z, st.w));
      if (st.m === 'pot') return P.mlz(P.pow(st.z, st.n));
      return st.n + (en ? ' roots' : ' raíces');
    }
    function xp(st) {
      if (!st) return null;
      var s = st.s ? st.s[li] : '', parts = [], tip;
      var z = st.z, w = st.w;
      if (st.m === 'forma') {
        parts.push({ c: '|z| = √(a² + b²)', d: esc(en ? 'The modulus is the distance to the origin: Pythagoras with the two parts.' : 'El módulo es la distancia al origen: Pitágoras con las dos partes.') });
        parts.push({ c: 'α = arctan|b/a| + ' + (en ? 'quadrant' : 'cuadrante'), d: esc(en ? 'The reference angle is placed in the quadrant: 180° − ref in the 2nd, 180° + ref in the 3rd, 360° − ref in the 4th.' : 'El ángulo de referencia se coloca en su cuadrante: 180° − ref en el 2.º, 180° + ref en el 3.º, 360° − ref en el 4.º.') });
        parts.push({ c: 'angle(z)', d: esc(en ? 'MATLAB already takes the quadrant into account, but it answers in radians between −π and π.' : 'MATLAB ya tiene en cuenta el cuadrante, pero responde en radianes entre −π y π.') });
        tip = esc(en ? 'Draw the point before working out the argument: the arctangent cannot tell z from −z.' : 'Dibuja el punto antes de calcular el argumento: el arcotangente no distingue z de −z.');
      } else if (st.m === 'suma') {
        parts.push({ c: '(a + bi) + (c + di)', d: esc(en ? '= (a + c) + (b + d)i: part by part.' : '= (a + c) + (b + d)i: parte a parte.') });
        parts.push({ c: 'conj(z), -z', d: esc(en ? 'The conjugate flips the imaginary sign (mirror); the opposite flips both (half turn).' : 'El conjugado cambia el signo de la imaginaria (espejo); el opuesto, los dos (media vuelta).') });
        tip = esc(en ? 'Sums are always done in binomial form.' : 'Las sumas siempre en binómica.');
      } else if (st.m === 'prod' || st.m === 'coc') {
        var pr = st.m === 'prod';
        parts.push({ c: pr ? 'R_α · S_β = (R·S)_(α+β)' : 'R_α / S_β = (R/S)_(α−β)', d: esc(pr ? (en ? 'Multiplying: moduli multiply and arguments add.' : 'Al multiplicar, los módulos se multiplican y los argumentos se suman.') : (en ? 'Dividing: moduli divide and arguments subtract.' : 'Al dividir, los módulos se dividen y los argumentos se restan.')) });
        parts.push({ c: (pr ? 'z*w' : 'z/w'), d: esc(en ? 'In binomial form you would expand (with i² = −1) or multiply by the conjugate of the denominator.' : 'En binómica habría que desarrollar (con i² = −1) o multiplicar por el conjugado del denominador.') });
        tip = esc(en ? 'If the numbers have usual angles, go polar; if not, binomial is exact.' : 'Si los números tienen ángulos de los de siempre, en polar; si no, la binómica es exacta.');
      } else if (st.m === 'pot') {
        parts.push({ c: '(R_α)ⁿ = (Rⁿ)_(n·α)', d: esc(en ? 'De Moivre: the same turn and scale n times.' : 'De Moivre: el mismo giro y la misma escala n veces.') });
        parts.push({ c: 'mod(n*alfa, 360)', d: esc(en ? 'Bring the angle back within one turn before switching to binomial form.' : 'Reduce el ángulo a una vuelta antes de pasar a binómica.') });
        tip = esc(en ? 'Multiply the angle by n; do not add n.' : 'El ángulo se multiplica por n; no se le suma n.');
      } else {
        parts.push({ c: 'ⁿ√(R_α) = (ⁿ√R)_((α + 360°k)/n)', d: esc(en ? 'k = 0, 1, …, n − 1: n roots with the same modulus.' : 'k = 0, 1, …, n − 1: n raíces con el mismo módulo.') });
        parts.push({ c: '360°/n', d: esc(en ? 'The gap between consecutive roots: they form a regular polygon.' : 'La separación entre raíces seguidas: forman un polígono regular.') });
        tip = esc(en ? 'Check that you get exactly n roots and that each one raised to n gives w.' : 'Comprueba que te salen exactamente n raíces y que cada una elevada a n da w.');
      }
      return { code: st.code || code(st), lead: esc(s), parts: parts, tip: tip };
    }
    /* ---------- tus números (modo libre) */
    function edFrom(st) { if (!st) return; ED.m = st.m; if (st.z) ED.z = st.z.slice(); if (st.w) ED.w = st.w.slice(); if (st.n) ED.n = st.n; edDraw(); }
    function inp(z) {   // lo que se escribe en la caja: legible y que se vuelva a leer igual
      var s = P.zs(z, 'en').replace(/−/g, '-'), b = P.parse(s);
      if (b && Math.abs(b[0] - z[0]) < 1e-9 && Math.abs(b[1] - z[1]) < 1e-9) return s;
      var f = function (x) { return String(Math.round(x * 1e4) / 1e4); };
      return f(z[0]) + (z[1] < 0 ? ' - ' : ' + ') + f(Math.abs(z[1])) + 'i';
    }
    function edDraw() {
      [].forEach.call(q('.pc-mode').children, function (b) { var on = b.getAttribute('data-pm') === ED.m; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      q('[data-pi="z"]').value = ED.m === 'raiz' ? '' : inp(ED.z);
      q('[data-pi="w"]').value = inp(ED.w);
      q('.pc-ins').classList.toggle('no-z', ED.m === 'raiz');
      q('.pc-ins').classList.toggle('no-w', ED.m === 'forma' || ED.m === 'pot');
      q('.pc-ins').classList.toggle('no-n', !(ED.m === 'pot' || ED.m === 'raiz'));
      q('.pc-n').innerHTML = [2, 3, 4, 5, 6, 7, 8].map(function (v) { var on = v === ED.n; return '<button type="button" data-pn="' + v + '" class="' + (on ? 'is-on' : '') + '" aria-pressed="' + on + '">' + v + '</button>'; }).join('');
    }
    function freeStep() {
      var st = { m: ED.m, z: ED.z.slice(), w: ED.w.slice(), n: ED.n, k: ED.n, show: ED.m === 'suma' ? 'all' : 'all' };
      st.s = [txtFree(st, 'es'), txtFree(st, 'en')];
      return st;
    }
    function txtFree(st, lg) {
      var e = lg === 'en', T = TX[lg], z = st.z, w = st.w;
      if (st.m === 'forma') return (e ? 'z = ' + P.zs(z, lg) + ' has modulus ' + P.nice(P.abs(z), lg) + ' and argument ' + P.deg(P.arg(z), lg) + ' (' + T.qs[P.quad(z)] + ').' : 'z = ' + P.zs(z, lg) + ' tiene módulo ' + P.nice(P.abs(z), lg) + ' y argumento ' + P.deg(P.arg(z), lg) + ' (' + T.qs[P.quad(z)] + ').');
      if (st.m === 'suma') return 'z + w = ' + P.zs(P.add(z, w), lg) + (e ? ': the diagonal of the parallelogram.' : ': la diagonal del paralelogramo.');
      if (st.m === 'prod') return 'z·w = ' + P.zs(P.mul(z, w), lg) + (e ? ': moduli ' : ': módulos ') + P.nice(P.abs(z), lg) + ' · ' + P.nice(P.abs(w), lg) + (e ? ', angles ' : ', ángulos ') + P.deg(P.arg(z), lg) + ' + ' + P.deg(P.arg(w), lg) + '.';
      if (st.m === 'coc') return 'z/w = ' + P.zs(P.div(z, w), lg) + (e ? ': moduli ' : ': módulos ') + P.nice(P.abs(z), lg) + ' / ' + P.nice(P.abs(w), lg) + (e ? ', angles ' : ', ángulos ') + P.deg(P.arg(z), lg) + ' − ' + P.deg(P.arg(w), lg) + '.';
      if (st.m === 'pot') return 'z' + supN(st.n) + ' = ' + P.zs(P.pow(z, st.n), lg) + (e ? ' (De Moivre).' : ' (De Moivre).');
      return (e ? 'The ' + st.n + ' roots of w = ' + P.zs(w, lg) + ' have modulus ' : 'Las ' + st.n + ' raíces de w = ' + P.zs(w, lg) + ' tienen módulo ') + P.nice(P.roots(w, st.n)[0].r, lg) + (e ? ' and are ' : ' y están separadas ') + P.deg(360 / st.n, lg) + (e ? ' apart.' : '.');
    }
    function free(noLoad) {
      var les = { k: 'tuya', g: 'pen', n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD], steps: [freeStep()] };
      var i = LES.findIndex(function (l) { return l.k === 'tuya'; }); if (i >= 0) LES[i] = les; else LES.push(les);
      if (noLoad && CUR && CUR.k === 'tuya') { CUR = les; render(les.steps[0]); return; }
      C.load('tuya');
    }
    function go() {
      var zv = q('[data-pi="z"]').value, wv = q('[data-pi="w"]').value, z = ED.m === 'raiz' ? ED.z : P.parse(zv), w = (ED.m === 'forma' || ED.m === 'pot') ? ED.w : P.parse(wv);
      if (!z) { UI.toast(t.badZ); q('[data-pi="z"]').focus(); return; }
      if (!w || ((ED.m === 'coc' || ED.m === 'raiz') && P.abs(w) < 1e-9)) { UI.toast(t.badZ); q('[data-pi="w"]').focus(); return; }
      ED.z = [P.clean(z[0]), P.clean(z[1])]; ED.w = [P.clean(w[0]), P.clean(w[1])];
      free();
    }
    function rnd() {
      var rr = [1, 2, 3], aa = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330], pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
      var mk = function () { var r = pick(rr), a = pick(aa); return a % 45 === 0 && a % 90 !== 0 && r === 3 ? P.pol(Math.SQRT2, a) : P.pol(r, a); };
      ED.z = mk(); ED.w = ED.m === 'raiz' ? P.pol(pick([8, 16, 27, 64].slice(0, 2)), pick(aa)) : mk(); if (ED.m === 'pot') ED.n = 2 + Math.floor(Math.random() * 4); if (ED.m === 'raiz') ED.n = 3 + Math.floor(Math.random() * 4);
      edDraw(); free();
    }
    /* ---------- arrastrar los puntos */
    var DRAG = null;
    function toPlane(e) {
      var sv = q('.pc-plot'), pt = sv.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(sv.getScreenCTM().inverse()), R = LOCK || ext(CURST), s = HALF / R, st = R <= 3 ? 0.25 : R <= 8 ? 0.5 : 1;
      var x = (p.x - CX) / s, y = (CY - p.y) / s;
      x = Math.max(-R, Math.min(R, Math.round(x / st) * st)); y = Math.max(-R, Math.min(R, Math.round(y / st) * st));
      return [x, y];
    }
    el.addEventListener('pointerdown', function (e) {
      var hnd = e.target.closest && e.target.closest('[data-h]'); if (!hnd || !el.contains(hnd)) return;
      e.preventDefault(); C.D.stop();
      var which = hnd.getAttribute('data-h');
      if (!CUR || CUR.k !== 'tuya') { edFrom(CURST); LOCK = ext(CURST); free(); } else LOCK = LOCK || ext(CURST);
      DRAG = { h: which, id: e.pointerId };
      try { q('.pc-plot').setPointerCapture(e.pointerId); } catch (x) {}
    });
    el.addEventListener('pointermove', function (e) {
      if (!DRAG || e.pointerId !== DRAG.id) return;
      var v = toPlane(e); if (DRAG.h === 'w' && (ED.m === 'coc' || ED.m === 'raiz') && Math.abs(v[0]) < 1e-9 && Math.abs(v[1]) < 1e-9) return;
      ED[DRAG.h] = v; free(true); C.setSub('<span>' + esc(CUR.steps[0].s[li]) + '</span>');
    });
    function endDrag() { if (!DRAG) return; DRAG = null; LOCK = null; edDraw(); free(true); C.setSub(esc(CUR.steps[0].s[li])); }
    el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag);
    el.addEventListener('keydown', function (e) {
      var hnd = e.target.closest && e.target.closest('[data-h]');
      if (hnd && el.contains(hnd) && /^Arrow/.test(e.key)) {
        e.preventDefault(); var which = hnd.getAttribute('data-h');
        if (!CUR || CUR.k !== 'tuya') { edFrom(CURST); free(); }
        var d = ext(CURST) <= 3 ? 0.25 : 0.5, v = ED[which].slice();
        if (e.key === 'ArrowRight') v[0] += d; if (e.key === 'ArrowLeft') v[0] -= d; if (e.key === 'ArrowUp') v[1] += d; if (e.key === 'ArrowDown') v[1] -= d;
        ED[which] = v; edDraw(); free(true); C.setSub(esc(CUR.steps[0].s[li]));
        var nh = q('[data-h="' + which + '"]'); if (nh) nh.focus({ preventScroll: true });
        return;
      }
      var x = e.target; if (e.key === 'Enter' && x.hasAttribute && x.hasAttribute('data-pi') && el.contains(x)) { e.preventDefault(); go(); }
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pm],[data-pn],[data-pa]'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-pm')) { ED.m = b.getAttribute('data-pm'); if (ED.m === 'raiz' && P.abs(ED.w) < 1e-9) ED.w = [-64, 0]; edDraw(); go(); return; }
      if (b.hasAttribute('data-pn')) { ED.n = +b.getAttribute('data-pn'); edDraw(); go(); return; }
      var a = b.getAttribute('data-pa');
      if (a === 'tog') { tog(q('.pc-edw').hidden); return; }
      if (a === 'go') { go(); tog(false); } else if (a === 'rnd') { rnd(); tog(false); }
    });
    /* ---------- «Ponte a prueba» */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pick(a) { return a[ri(0, a.length - 1)]; }
    var NICE = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1], [R3, 1], [-R3, 1], [-R3, -1], [R3, -1], [1, R3], [-1, R3], [-1, -R3], [1, -R3]];
    function numDeg(x) { var v = parseFloat(String(x).replace(',', '.').replace('°', '').replace('−', '-')); return isFinite(v) ? String(Math.round((((v % 360) + 360) % 360) * 10) / 10) : '?'; }
    var LV = [
      { gen: function () { var k = pick([1, 2, 3, 4]), b = pick(NICE.slice(4)), z = [b[0] * k, b[1] * k]; return { q: fill(t.lq1, { z: P.zs(z, lang) }), code: 'z = ' + P.mlin(z) + '\nmod(angle(z)*180/pi, 360)', ans: String(P.arg(z)), norm: numDeg, hint: t.h1, mode: 'text' }; } },
      { gen: function () {
        var r1 = ri(1, 4), r2 = ri(1, 3), a1 = pick([30, 45, 60, 90, 120, 135, 150, 210, 240, 300, 315]), a2 = pick([30, 45, 60, 90, 120, 150, 180, 270, 300]);
        var rr = r1 * r2, aa = (a1 + a2) % 360;
        return { q: fill(t.lq2, { a: r1 + '_' + a1 + '°', b: r2 + '_' + a2 + '°' }).replace(/_(\d+)°/g, function (m, d) { return '₍' + d + '°₎'; }), code: 'z = ' + r1 + '*exp(1i*' + a1 + '*pi/180);  w = ' + r2 + '*exp(1i*' + a2 + '*pi/180);\n[abs(z*w) mod(angle(z*w)*180/pi, 360)]', ans: rr + ', ' + aa,
          norm: function (x) { var m = String(x).replace(/−/g, '-').match(/-?\d+(?:[.,]\d+)?/g); if (!m || m.length < 2) return '?'; return Math.round(parseFloat(m[0].replace(',', '.')) * 100) / 100 + ', ' + numDeg(m[1]); }, hint: t.h2, mode: 'text' };
      } },
      { gen: function () {
        var n = ri(3, 6), r = Math.pow(ri(1, 2), n), a = pick([0, 90, 180, 270, 60, 120]), w = P.pol(r, a), k = ri(1, n - 1), ak = (a + 360 * k) / n;
        return { q: fill(t.lq3, { n: n, w: P.nice(r, lang) + '₍' + a + '°₎', k: k }), code: 'w = ' + P.mlin(w) + ';  n = ' + n + ';  k = ' + k + ';\nmod((angle(w) + 2*pi*k)/n*180/pi, 360)', ans: numDeg(ak), norm: numDeg, hint: t.h3, mode: 'text' };
      } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_pc_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    edDraw();
    C.start();
  }
  window.SLPCUI = { mount: mount, LES: LES };
  K.boot('.sl-sim[data-sim="pc"]', mount);
})();
