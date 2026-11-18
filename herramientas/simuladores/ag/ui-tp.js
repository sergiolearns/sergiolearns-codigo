/* SergioLearns — simulador de AG: Transformaciones en el plano (18 nov 2026).
 * Una matriz 2 × 2 deforma la cuadrícula: las columnas son las imágenes de e₁ y e₂, el cuadrado unidad cambia de área
 * según det(A) (y se da la vuelta si es negativo), los autovectores no giran, con det = 0 aparecen el núcleo y la imagen,
 * la diagonalización hace A en tres pasos (P⁻¹, D, P) y las potencias salen solas; si A es simétrica, la forma cuadrática
 * xᵗAx con su curva y su clasificación. Lecciones de los temas 5 y 6 de AG, «Tu matriz» y «Ponte a prueba».
 * Necesita SLK (kit v2), SLAG (comun-ag.js) y SLTP (engine-tp.js). */
(function () {
  'use strict';
  var K = window.SLK, CA = window.SLAG, E = window.SLTP;
  if (!K || !CA || !E) return;
  var esc = K.esc, fill = K.fill, ico = K.ico, num = E.num, Mx = E.M;
  var SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
  var GL = {
    rot: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>',
    flip: '<path d="M12 3v18"/><path d="M9 7l-6 5 6 5z"/><path d="M15 7l6 5-6 5z"/>',
    shear: '<path d="M8 5h12l-4 14H4z"/>',
    squash: '<path d="M4 12h16"/><path d="M12 3v5M12 16v5"/><path d="M9 6l3 2 3-2M9 18l3-2 3 2"/>',
    pow: '<path d="M4 19l5-5 4 3 7-10"/><path d="M15 7h5v5"/>',
    bowl: '<path d="M3 7c2 11 16 11 18 0"/><path d="M8 7h8"/>',
    saddle: '<path d="M3 15c3-8 6-8 9-3s6 5 9-3"/>'
  };
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/transformaciones-en-el-plano', showM: 'Tu matriz', hideM: 'Ocultar', yours: 'Tu matriz', presets: 'Para probar',
      go: 'Ver la transformación', rnd: 'Otra al azar', editHint: 'Escribe enteros, decimales o fracciones (3, -1/2, 1,5). La primera columna es la imagen de e₁ y la segunda, la de e₂.',
      badCell: 'Hay una casilla que no es un número: revisa la marcada.', yoursN: 'Tu matriz', yoursD: 'La que has escrito: cuadrícula, determinante, autovectores y lo que toque.',
      pre: [['Giro 90°', [0, -1, 1, 0]], ['Escala', [2, 0, 0, 2]], ['Espejo', [-1, 0, 0, 1]], ['Cizalla', [1, 1, 0, 1]], ['Proyección', [1, 0, 0, 0]], ['Simétrica', [3, 1, 1, 3]]],
      area: 'área ×{a}', flipT: 'da la vuelta', lam: 'Autovalores', none: 'complejos: {re} ± {im}i', ker: 'Núcleo', im: 'Imagen', cls: 'La forma', w: 'xᵗAx',
      probe: 'Arrastra la flecha de prueba', probeOk: 'No gira: f(x) = {l}·x', probeNo: 'Gira',
      kind: { start: 'Inicio', apply: 'Aplico A', det: 'Determinante', eig: 'Autovectores', ker: 'Núcleo e imagen', d1: 'P⁻¹', d2: 'D', d3: 'P', pow: 'Potencias', qmap: 'Forma cuadrática', qcurve: 'Su curva', qcls: 'Clasificación' },
      C: { dp: 'definida positiva', dn: 'definida negativa', sp: 'semidefinida positiva', sn: 'semidefinida negativa', in: 'indefinida', '0': 'nula' },
      plane: 'Plano con la cuadrícula transformada por la matriz',
      lv: [['El área con signo', 'El determinante dice por cuánto se multiplica el área y si la figura se da la vuelta. Un número entero, con su signo.'], ['Las direcciones que no giran', 'Los dos autovalores, de menor a mayor, separados por un espacio (por ejemplo: -1 3).'], ['Clasifica la forma', 'Escribe DP, DN, SP, SN o I (definida positiva o negativa, semidefinida positiva o negativa, indefinida).']],
      lq1: 'El cuadrado unidad se transforma con esta matriz. ¿Cuánto vale det(A), con su signo?', lq2: '¿Cuáles son los autovalores de A?', lq3: '¿Cómo es la forma cuadrática xᵗAx de esta matriz simétrica?',
      h1: 'det(A) = a·d − b·c con A = [a b; c d].', h2: 'λ² − tr(A)·λ + det(A) = 0, con tr(A) = a + d.', h3: 'Mira los signos de los autovalores o usa Sylvester: a₁₁ y det(A).' },
    en: { title: 'sergio@learns: ~/lab/simulators/plane-transformations', showM: 'Your matrix', hideM: 'Hide', yours: 'Your matrix', presets: 'To try',
      go: 'See the transformation', rnd: 'Random one', editHint: 'Type integers, decimals or fractions (3, -1/2, 1.5). The first column is the image of e₁ and the second, that of e₂.',
      badCell: 'One cell is not a number: check the marked one.', yoursN: 'Your matrix', yoursD: 'The one you typed: grid, determinant, eigenvectors and whatever applies.',
      pre: [['90° rotation', [0, -1, 1, 0]], ['Scaling', [2, 0, 0, 2]], ['Mirror', [-1, 0, 0, 1]], ['Shear', [1, 1, 0, 1]], ['Projection', [1, 0, 0, 0]], ['Symmetric', [3, 1, 1, 3]]],
      area: 'area ×{a}', flipT: 'flips it', lam: 'Eigenvalues', none: 'complex: {re} ± {im}i', ker: 'Kernel', im: 'Image', cls: 'The form', w: 'xᵗAx',
      probe: 'Drag the test arrow', probeOk: 'It does not turn: f(x) = {l}·x', probeNo: 'It turns',
      kind: { start: 'Start', apply: 'Apply A', det: 'Determinant', eig: 'Eigenvectors', ker: 'Kernel and image', d1: 'P⁻¹', d2: 'D', d3: 'P', pow: 'Powers', qmap: 'Quadratic form', qcurve: 'Its curve', qcls: 'Classification' },
      C: { dp: 'positive definite', dn: 'negative definite', sp: 'positive semidefinite', sn: 'negative semidefinite', in: 'indefinite', '0': 'zero' },
      plane: 'Plane with the grid transformed by the matrix',
      lv: [['The signed area', 'The determinant says how much the area is multiplied by and whether the shape flips over. A whole number, with its sign.'], ['The directions that do not turn', 'The two eigenvalues, smallest first, separated by a space (for example: -1 3).'], ['Classify the form', 'Type PD, ND, PSD, NSD or I (positive or negative definite, positive or negative semidefinite, indefinite).']],
      lq1: 'The unit square is transformed by this matrix. What is det(A), with its sign?', lq2: 'What are the eigenvalues of A?', lq3: 'What kind of quadratic form is xᵗAx for this symmetric matrix?',
      h1: 'det(A) = a·d − b·c with A = [a b; c d].', h2: 'λ² − tr(A)·λ + det(A) = 0, with tr(A) = a + d.', h3: 'Look at the signs of the eigenvalues or use Sylvester: a₁₁ and det(A).' }
  };
  /* ------------------------------------------------ lecciones (los ejemplos de los temas 5 y 6 de AG) */
  var LES = [
    { k: 'foto', g: GL.rot, A: [0, -1, 1, 0], kinds: ['start', 'apply', 'det', 'eig'],
      n: ['Girar la foto', 'Rotating the photo'], d: ['El filtro «girar 90°»: las columnas de A, el área que no cambia y ninguna dirección que se libre.', 'The «rotate 90°» filter: the columns of A, an area that does not change and no direction that escapes.'],
      say: { start: ['El filtro «girar 90°» de la app de fotos, en matriz. Antes de aplicarlo: la cuadrícula de siempre y el cuadrado unidad, de área 1, con e₁ en coral y e₂ en violeta.', 'The «rotate 90°» filter of the photo app, as a matrix. Before applying it: the usual grid and the unit square, with area 1, with e₁ in coral and e₂ in violet.'],
        apply: ['Giro de 90° a la izquierda: e₁ = (1, 0) va a (0, 1) y e₂ = (0, 1) va a (−1, 0). Esas dos imágenes, en orden, son las columnas de A.', 'A 90° turn to the left: e₁ = (1, 0) goes to (0, 1) and e₂ = (0, 1) goes to (−1, 0). Those two images, in order, are the columns of A.'],
        det: ['Girar no estira ni aplasta: el cuadrado sigue teniendo área 1 y det(A) = 1. Y es positivo: la foto gira, pero no se da la vuelta.', 'Rotating neither stretches nor squashes: the square still has area 1 and det(A) = 1. And it is positive: the photo turns, but it does not flip over.'] },
      ask: { eig: { q: ['Antes de mirarlo: ¿hay alguna dirección que no gire con este filtro?', 'Before looking: is there any direction that does not turn with this filter?'], o: [['Ninguna', 'None', 1], ['La diagonal (1, 1)', 'The diagonal (1, 1)'], ['Los dos ejes', 'Both axes']] } } },
    { k: 'filtro', g: 'grid', A: [2, 1, 1, 2], kinds: ['start', 'apply', 'det', 'eig'],
      n: ['El filtro que mezcla', 'The mixing filter'], d: ['f(x, y) = (2x + y, x + 2y): el área se triplica y dos rectas no giran.', 'f(x, y) = (2x + y, x + 2y): the area triples and two lines do not turn.'],
      say: { start: ['El filtro de mezcla de canales del tema 5: cada canal nuevo es el doble del suyo más el otro, f(x, y) = (2x + y, x + 2y).', 'The channel-mixing filter from topic 5: each new channel is twice its own plus the other one, f(x, y) = (2x + y, x + 2y).'] },
      ask: { det: { q: ['¿Qué área tendrá el cuadrado unidad después de aplicar A?', 'What area will the unit square have after applying A?'], o: [['3', '3', 1], ['4', '4'], ['1', '1']] },
        eig: { q: ['Sobre la diagonal (1, 1), ¿qué le hace A a los vectores?', 'On the diagonal (1, 1), what does A do to the vectors?'], o: [['Los multiplica por 3', 'Multiplies them by 3', 1], ['Los gira', 'Rotates them'], ['Los deja igual', 'Leaves them as they are']] } } },
    { k: 'espejo', g: GL.flip, A: [-1, 0, 0, 1], kinds: ['start', 'apply', 'det', 'eig'],
      n: ['Darle la vuelta', 'Flipping it over'], d: ['El espejo: |det| = 1, pero con signo negativo.', 'The mirror: |det| = 1, but with a negative sign.'],
      say: { start: ['El espejo de la app de fotos: f(x, y) = (−x, y). Lo de la derecha pasa a la izquierda y la altura no cambia.', 'The mirror of the photo app: f(x, y) = (−x, y). What is on the right goes to the left and the height does not change.'],
        det: ['El área no cambia, |det(A)| = 1, pero det(A) = −1: el signo negativo es la marca de que la foto sale dada la vuelta. Mira el orden de las flechas: antes, girando de la coral a la violeta ibas a la izquierda; ahora, a la derecha.', 'The area does not change, |det(A)| = 1, but det(A) = −1: the negative sign is the mark of a flipped photo. Look at the order of the arrows: before, turning from coral to violet went left; now it goes right.'] },
      ask: { det: { q: ['¿Qué signo tendrá det(A)?', 'What sign will det(A) have?'], o: [['Negativo', 'Negative', 1], ['Positivo', 'Positive'], ['Cero', 'Zero']] } } },
    { k: 'cizalla', g: GL.shear, A: [1, 1, 0, 1], kinds: ['start', 'apply', 'det', 'eig'],
      n: ['La cizalla', 'The shear'], d: ['Inclinar la foto en cursiva: una sola recta que no gira y nada que diagonalizar.', 'Slanting the photo into italics: a single line that does not turn and nothing to diagonalise.'],
      say: { start: ['La cizalla, f(x, y) = (x + y, y): como poner la foto en cursiva. La fila de abajo se queda quieta y las de arriba se desplazan cada vez más.', 'The shear, f(x, y) = (x + y, y): like putting the photo in italics. The bottom row stays still and the rows above slide more and more.'] },
      ask: { eig: { q: ['¿Es diagonalizable la cizalla?', 'Is the shear diagonalisable?'], o: [['No: solo hay una dirección que no gira', 'No: only one direction does not turn', 1], ['Sí, porque det(A) = 1 ≠ 0', 'Yes, because det(A) = 1 ≠ 0'], ['Sí, porque λ = 1 es real', 'Yes, because λ = 1 is real']] } } },
    { k: 'aplasta', g: GL.squash, A: [1, 1, 1, 1], kinds: ['start', 'apply', 'det', 'ker', 'eig'],
      n: ['El filtro que aplasta', 'The squashing filter'], d: ['det = 0: el plano cae en una recta, la imagen, y otra recta va al origen, el núcleo.', 'det = 0: the plane falls onto a line, the image, and another line goes to the origin, the kernel.'],
      say: { start: ['Un filtro que pone la suma de los dos canales en los dos: f(x, y) = (x + y, x + y). Es el «blanco y negro» del tema 5, en el plano.', 'A filter that puts the sum of both channels in both: f(x, y) = (x + y, x + y). It is the «black and white» filter from topic 5, in the plane.'] },
      ask: { ker: { q: ['¿A dónde van los puntos de la recta (1, −1)?', 'Where do the points on the line (1, −1) go?'], o: [['Al origen', 'To the origin', 1], ['A la recta (1, 1)', 'To the line (1, 1)'], ['Se quedan donde están', 'They stay where they are']] } } },
    { k: 'potencias', g: GL.pow, A: [2, 1, 1, 2], kinds: ['apply', 'd1', 'd2', 'd3', 'pow2', 'pow3'],
      n: ['Diagonalizar y elevar', 'Diagonalise and raise'], d: ['A = P·D·P⁻¹ en tres movimientos y Aⁿ sin multiplicar matrices.', 'A = P·D·P⁻¹ in three moves and Aⁿ without multiplying matrices.'],
      say: { apply: ['Otra vez el filtro de mezcla. Aplicarlo varias veces seguidas es calcular A², A³…, y con la diagonalización salen casi sin cuentas. Primero, la deformación entera de golpe.', 'The mixing filter again. Applying it several times in a row means computing A², A³…, and with diagonalisation they come out with almost no arithmetic. First, the whole deformation at once.'] },
      ask: { d2: { q: ['En la base de autovectores, ¿qué hace D?', 'In the eigenvector basis, what does D do?'], o: [['Estira cada eje por su autovalor', 'Stretches each axis by its eigenvalue', 1], ['Gira el plano', 'Rotates the plane'], ['Mezcla los dos ejes', 'Mixes the two axes']] } } },
    { k: 'bowl', g: GL.bowl, A: [2, 1, 1, 2], kinds: ['qmap', 'qcurve', 'qcls'],
      n: ['El bowl del skatepark', 'The skatepark bowl'], d: ['La forma cuadrática 2x² + 2xy + 2y²: todo sube, una elipse y definida positiva.', 'The quadratic form 2x² + 2xy + 2y²: everything goes up, an ellipse and positive definite.'],
      say: { qmap: ['El skatepark del tema 6 visto desde arriba: la altura en cada punto es w = 2x² + 2xy + 2y², la forma cuadrática de la matriz simétrica A. Coral, sube; violeta, baja. Aquí todo es coral: un bowl.', 'The skatepark from topic 6 seen from above: the height at each point is w = 2x² + 2xy + 2y², the quadratic form of the symmetric matrix A. Coral goes up; violet goes down. Here it is all coral: a bowl.'] },
      ask: { qcls: { q: ['¿Cómo es la forma 2x² + 2xy + 2y²?', 'What kind of form is 2x² + 2xy + 2y²?'], o: [['Definida positiva', 'Positive definite', 1], ['Indefinida', 'Indefinite'], ['Semidefinida positiva', 'Positive semidefinite']] } } },
    { k: 'silla', g: GL.saddle, A: [1, 2, 2, 1], kinds: ['qmap', 'qcurve', 'qcls'],
      n: ['La silla de montar', 'The saddle'], d: ['x² + 4xy + y²: sube en una dirección y baja en otra. Indefinida.', 'x² + 4xy + y²: up in one direction, down in another. Indefinite.'],
      say: { qmap: ['Ahora w = x² + 4xy + y². Hay zonas coral, donde sube, y violetas, donde baja: la rampa con forma de silla de montar del skatepark.', 'Now w = x² + 4xy + y². There are coral areas, where it goes up, and violet ones, where it goes down: the saddle-shaped ramp of the skatepark.'] },
      ask: { qcls: { q: ['¿Cómo es la forma x² + 4xy + y²?', 'What kind of form is x² + 4xy + y²?'], o: [['Indefinida', 'Indefinite', 1], ['Definida positiva', 'Positive definite'], ['Definida negativa', 'Negative definite']] } } }
  ];
  /* ------------------------------------------------ análisis y textos de cada paso */
  function mat(a) { return Mx(a[0], a[1], a[2], a[3]); }
  function an(A) {
    var e = E.eig(A), dp = E.diagP(A), q = E.sym(A) ? E.cls(A) : null;
    return { A: A, d: E.det(A), e: e, dp: dp, ki: E.kerIm(A), q: q, sym: E.sym(A), isD: E.z(A[0][1]) && E.z(A[1][0]) };
  }
  function V(v) { return E.vtxt(v); }
  function expr(A, ascii) {   // a x² + 2b xy + c y²
    var t = [[A[0][0], ascii ? 'x^2' : 'x²'], [2 * A[0][1], ascii ? 'x*y' : 'xy'], [A[1][1], ascii ? 'y^2' : 'y²']], s = '';
    t.forEach(function (p) {
      var c = p[0]; if (E.z(c)) return;
      var a = Math.abs(c), cs = E.z(a - 1) ? '' : num(a, 1) + (ascii ? '*' : '');
      s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + cs + p[1];
    });
    s = s || '0';
    return ascii ? s : s.replace(/-/g, '−');
  }
  function kerR(v) { return E.z(v[1]) ? [1, 0] : [v[0] / v[1], 1]; }   // como null(A, 'r'): la variable libre a 1
  function stepsOf(les, lang) {
    var en = lang === 'en', li = en ? 1 : 0, A = mat(les.A), X = an(A), out = [];
    var c1 = V([A[0][0], A[1][0]]), c2 = V([A[0][1], A[1][1]]), d = X.d, ad = num(Math.abs(d)), ml = E.ml(A);
    var lt = E.eigTxt(A) || [], dp = X.dp;
    les.kinds.forEach(function (kind) {
      var st = { kind: kind, A: A, M: A, lay: {}, name: 'A' }, s = '';
      var say = les.say && les.say[kind] ? les.say[kind][li] : null;
      if (kind === 'start') {
        st.M = E.I; st.name = 'I'; st.lay = { sq: 1, ev: 1 };
        s = en ? 'The usual grid and the unit square, with area 1. The coral arrow is e₁ = (1, 0) and the violet one, e₂ = (0, 1). The matrix is A = ' + ml + '.' : 'La cuadrícula de siempre y el cuadrado unidad, de área 1. La flecha coral es e₁ = (1, 0) y la violeta, e₂ = (0, 1). La matriz es A = ' + ml + '.';
        st.code = 'A = ' + ml; st.res = null;
      } else if (kind === 'apply') {
        st.lay = { sq: 1, ev: 1 };
        s = en ? 'I apply A. e₁ goes to ' + c1 + ' and e₂ to ' + c2 + ': they are the two columns of A. Lines stay straight and parallel and the origin does not move; that is why the transformation is linear.' : 'Aplico A. e₁ va a ' + c1 + ' y e₂ a ' + c2 + ': son las dos columnas de A. Las rectas siguen siendo rectas y paralelas y el origen no se mueve; por eso la transformación es lineal.';
        st.code = 'A*[1 0; 0 1]'; st.res = ml;
      } else if (kind === 'det') {
        st.lay = { sq: 1, ev: 1, area: 1 };
        if (E.z(d)) s = en ? 'The square has been squashed into a segment: area 0, so det(A) = 0. Different vectors end up in the same place and the transformation can no longer be undone.' : 'El cuadrado se ha aplastado en un segmento: área 0, así que det(A) = 0. Vectores distintos acaban en el mismo sitio y la transformación ya no se puede deshacer.';
        else s = (en ? 'The unit square is now a parallelogram with area ' + ad + ': the area of any shape is multiplied by |det(A)| = ' + ad + '. ' : 'El cuadrado unidad es ahora un paralelogramo de área ' + ad + ': el área de cualquier figura se multiplica por |det(A)| = ' + ad + '. ')
          + (d > 0 ? (en ? 'As det(A) = ' + num(d) + ' is positive, the photo does not flip over.' : 'Como det(A) = ' + num(d) + ' es positivo, la foto no se da la vuelta.') : (en ? 'As det(A) = ' + num(d) + ' is negative, the photo comes out flipped, as in a mirror.' : 'Como det(A) = ' + num(d) + ' es negativo, la foto sale dada la vuelta, como en un espejo.'));
        st.code = 'det(A)'; st.res = num(d, 1);
      } else if (kind === 'eig') {
        st.lay = { eig: 1, probe: 1, ev: 0 };
        var e = X.e;
        if (e.kind === 'c') s = en ? 'No line escapes: the eigenvalues are complex, ' + num(e.re) + ' ± ' + num(e.im) + 'i, and every direction turns. Without real eigenvalues it is not diagonalisable over ℝ. Drag the test arrow and check it.' : 'No se libra ninguna recta: los autovalores son complejos, ' + num(e.re) + ' ± ' + num(e.im) + 'i, y todas las direcciones giran. Sin autovalores reales no es diagonalizable en ℝ. Arrastra la flecha de prueba y compruébalo.';
        else if (e.kind === 'd' && e.diag) s = en ? 'No direction turns: A = ' + lt[0] + '·I and every vector is an eigenvector, with λ = ' + lt[0] + '. It is already diagonal.' : 'Ninguna dirección gira: A = ' + lt[0] + '·I y todo vector es autovector, con λ = ' + lt[0] + '. Ya es diagonal.';
        else if (e.kind === 'd') s = en ? 'Only one direction does not turn, ' + V(e.v[0]) + ', with λ = ' + lt[0] + ' twice. Diagonalising needs two independent eigenvectors and there is only one: it is not diagonalisable.' : 'Solo una dirección no gira, ' + V(e.v[0]) + ', con λ = ' + lt[0] + ' doble. Para diagonalizar harían falta dos autovectores independientes y solo hay uno: no es diagonalizable.';
        else s = en ? 'The dashed lines are the directions that do not turn, the eigenvectors: along ' + V(e.v[0]) + ' everything is multiplied by ' + lt[0] + ', and along ' + V(e.v[1]) + ', by ' + lt[1] + '. Drag the test arrow: it only stops turning on top of them.' : 'Las rectas discontinuas son las direcciones que no giran, los autovectores: sobre ' + V(e.v[0]) + ' todo se multiplica por ' + lt[0] + ', y sobre ' + V(e.v[1]) + ', por ' + lt[1] + '. Arrastra la flecha de prueba: solo deja de girar encima de ellas.';
        st.code = 'eig(A)'; st.res = e.kind === 'c' ? num(e.re, 1) + ' ± ' + num(e.im, 1) + 'i' : (E.eigTxt(A, 1) || []).join('  ');
      } else if (kind === 'ker') {
        st.lay = { ker: 1, sq: 1 };
        var ki = X.ki;
        if (ki.r === 1) s = en ? 'The whole plane falls onto the line Im(f) = ⟨' + V(ki.im) + '⟩, and the whole line Ker(f) = ⟨' + V(ki.ker) + '⟩ ends up at the origin. dim Ker + dim Im = 1 + 1 = 2, the dimension of the plane.' : 'El plano entero cae sobre la recta Im(f) = ⟨' + V(ki.im) + '⟩, y toda la recta Nuc(f) = ⟨' + V(ki.ker) + '⟩ va a parar al origen. dim Nuc + dim Im = 1 + 1 = 2, la dimensión del plano.';
        else if (ki.r === 0) s = en ? 'A = 0 sends the whole plane to the origin: the kernel is all of ℝ² and the image, just the zero vector.' : 'A = 0 manda el plano entero al origen: el núcleo es todo ℝ² y la imagen, solo el vector cero.';
        else s = en ? 'det(A) ≠ 0: only the zero vector goes to the origin. The kernel is {0} and the image is the whole plane.' : 'det(A) ≠ 0: solo el vector cero va al origen. El núcleo es {0} y la imagen, todo el plano.';
        var kr = ki.ker ? kerR(ki.ker) : null;
        st.code = "null(A, 'r')"; st.res = kr ? '[' + num(kr[0], 1) + '; ' + num(kr[1], 1) + ']' : null;
      } else if (/^d[123]$/.test(kind) && dp) {
        var Pm = E.ml(dp.P), Dm = 'diag([' + num(dp.l[0], 1) + ' ' + num(dp.l[1], 1) + '])';
        st.lay = { eig: 1 };
        if (kind === 'd1') { st.M = dp.Pi; st.name = 'P⁻¹'; s = en ? 'Diagonalising is doing A in three moves. First P⁻¹, with P = ' + Pm + ' (the eigenvectors in columns): it changes to the eigenvector basis, and the dashed lines fall onto the axes.' : 'Diagonalizar es hacer A en tres movimientos. Primero P⁻¹, con P = ' + Pm + ' (los autovectores en columnas): pasa a la base de autovectores, y las rectas discontinuas se tumban sobre los ejes.'; st.code = 'P = ' + Pm + '; inv(P)'; st.res = E.ml(dp.Pi); }
        if (kind === 'd2') { st.M = E.mul(dp.D, dp.Pi); st.name = 'D·P⁻¹'; s = en ? 'Then D: in that basis each axis just has to be stretched by its eigenvalue, ' + lt[0] + ' and ' + lt[1] + '. Nothing gets mixed.' : 'Luego D: en esa base solo hay que estirar cada eje por su autovalor, ' + lt[0] + ' y ' + lt[1] + '. Sin mezclar nada.'; st.code = 'D = ' + Dm; st.res = E.ml(dp.D); }
        if (kind === 'd3') { st.M = A; st.name = 'P·D·P⁻¹'; s = en ? 'Finally P goes back to the usual basis. P·D·P⁻¹ = A: the same deformation as before, made of three simple ones.' : 'Por último, P devuelve a la base de siempre. P·D·P⁻¹ = A: la misma deformación de antes, hecha con tres sencillas.'; st.code = 'P*D*inv(P)'; st.res = ml; }
      } else if (/^pow\d$/.test(kind)) {
        var n = +kind.slice(3), An = E.pow(A, n), sp = SUP[n];
        st.M = An; st.name = 'A' + sp; st.lay = { sq: 1, eig: dp ? 1 : 0 };
        if (dp) s = en ? 'A' + sp + ' is applying A ' + n + ' times. With diagonalisation, A' + sp + ' = P·D' + sp + '·P⁻¹ and only the eigenvalues are raised: ' + lt[0] + sp + ' = ' + num(Math.pow(dp.l[0], n)) + ' and ' + lt[1] + sp + ' = ' + num(Math.pow(dp.l[1], n)) + '. The dashed lines are still the same.' : 'A' + sp + ' es aplicar A ' + n + ' veces. Con la diagonalización, A' + sp + ' = P·D' + sp + '·P⁻¹ y solo se elevan los autovalores: ' + lt[0] + sp + ' = ' + num(Math.pow(dp.l[0], n)) + ' y ' + lt[1] + sp + ' = ' + num(Math.pow(dp.l[1], n)) + '. Las rectas discontinuas siguen siendo las mismas.';
        else s = en ? 'A' + sp + ' is applying A ' + n + ' times: ' + E.ml(An) + '.' : 'A' + sp + ' es aplicar A ' + n + ' veces: ' + E.ml(An) + '.';
        st.code = 'A^' + n; st.res = E.ml(An);
      } else if (kind === 'qmap' || kind === 'qcurve' || kind === 'qcls') {
        st.M = E.I; st.name = 'A'; st.show = A;
        var q = X.q, ex = expr(A);
        if (kind === 'qmap') { st.lay = { heat: 1 }; s = en ? 'As A is symmetric, xᵗAx = ' + ex + ' is a quadratic form. Each point is coloured by its value: coral where it is positive, violet where it is negative.' : 'Como A es simétrica, xᵗAx = ' + ex + ' es una forma cuadrática. Cada punto se colorea con su valor: coral si es positivo, violeta si es negativo.'; st.code = 'syms x y; expand([x y]*A*[x; y])'; st.res = expr(A, 1); }
        if (kind === 'qcurve') {
          st.lay = { heat: 1, quad: 1, eig: 1 };
          var neg = q && q.n > 0, pos = q && q.p > 0;
          s = (en ? (pos ? 'The solid curve is xᵗAx = 1' : 'xᵗAx = 1 has no points') + (neg ? (pos ? ' and the dashed one, xᵗAx = −1' : '; the dashed curve is xᵗAx = −1') : '') + '. Its axes of symmetry are the eigenvectors of A' : (pos ? 'La curva continua es xᵗAx = 1' : 'xᵗAx = 1 no tiene puntos') + (neg ? (pos ? ' y la discontinua, xᵗAx = −1' : '; la curva discontinua es xᵗAx = −1') : '') + '. Sus ejes de simetría son los autovectores de A')
            + (q && q.v.length === 2 ? ': ' + V(q.v[0]) + (en ? ' and ' : ' y ') + V(q.v[1]) + '.' : '.');
          st.code = 'eig(A)'; st.res = (E.eigTxt(A, 1) || []).join('  ');
        }
        if (kind === 'qcls') {
          st.lay = { heat: 1, quad: 1, eig: 1, cls: 1 };
          var sg = !q ? '' : q.k === 'dp' ? (en ? 'are both positive' : 'son los dos positivos') : q.k === 'dn' ? (en ? 'are both negative' : 'son los dos negativos') : q.k === 'in' ? (en ? 'have different signs' : 'tienen signos distintos') : q.k === 'sp' ? (en ? 'are 0 and a positive one' : 'son 0 y uno positivo') : q.k === 'sn' ? (en ? 'are 0 and a negative one' : 'son 0 y uno negativo') : (en ? 'are both 0' : 'son los dos 0');
          var a11 = num(A[0][0]), syl = '';
          if (q && q.k === 'dp') syl = en ? ' Sylvester confirms it without computing them: a₁₁ = ' + a11 + ' > 0 and det(A) = ' + num(d) + ' > 0.' : ' Sylvester lo confirma sin calcularlos: a₁₁ = ' + a11 + ' > 0 y det(A) = ' + num(d) + ' > 0.';
          else if (q && q.k === 'dn') syl = en ? ' Sylvester: a₁₁ = ' + a11 + ' < 0 and det(A) = ' + num(d) + ' > 0, alternating signs.' : ' Sylvester: a₁₁ = ' + a11 + ' < 0 y det(A) = ' + num(d) + ' > 0, signos alternos.';
          else if (q && q.k === 'in') syl = en ? ' With Sylvester it is immediate: det(A) = ' + num(d) + ' < 0.' : ' Con Sylvester es inmediato: det(A) = ' + num(d) + ' < 0.';
          else if (q) syl = en ? ' With det(A) = 0, Sylvester cannot decide: you need the eigenvalues.' : ' Con det(A) = 0, Sylvester no decide: hacen falta los autovalores.';
          s = q ? (en ? 'The eigenvalues, ' + lt[0] + ' and ' + lt[1] + ', ' + sg + ': the form is ' + TX.en.C[q.k] + '.' : 'Los autovalores, ' + lt[0] + ' y ' + lt[1] + ', ' + sg + ': la forma es ' + TX.es.C[q.k] + '.') + syl : '';
          st.code = '[A(1,1), det(A)]'; st.res = num(A[0][0], 1) + '  ' + num(d, 1);
        }
      } else return;
      st.s = [say || s, say || s];
      if (les.ask && les.ask[kind]) st.ask = les.ask[kind];
      out.push(st);
    });
    return out;
  }
  function autoKinds(A) {   // lo que toca enseñar de una matriz cualquiera
    var X = an(A), k = ['start', 'apply', 'det'];
    if (X.ki.r < 2) k.push('ker');
    k.push('eig');
    if (X.dp && !X.isD && X.e.kind === 'r') k.push('d1', 'd2', 'd3');
    if (Math.abs(X.d) <= 6 && X.ki.r === 2) k.push('pow2');
    if (X.sym && !(E.z(A[0][0]) && E.z(A[0][1]) && E.z(A[1][1]))) k.push('qmap', 'qcurve', 'qcls');
    return k;
  }
  /* ------------------------------------------------ el simulador */
  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = li === 1;
    var UI = K.mount(el, { sim: 'tp', title: t.title, d: true }), q = UI.q, uid = UI.id;
    LES.forEach(function (l) { l.steps = stepsOf(l, lang); });
    var ED = { A: ['2', '1', '1', '2'] };
    var main = '<div class="tp-edw" hidden><div class="m1-grp"><p class="m1-h">' + esc(t.yours) + '</p><div class="tp-edrow"><span class="tp-edA">A =</span><div class="tp-ed"></div></div><p class="tp-edh">' + esc(t.editHint) + '</p></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.presets) + '</p><div class="m1-pills tp-pre">' + t.pre.map(function (p, i) { return '<button type="button" class="m1-pill" data-tpp="' + i + '">' + esc(p[0]) + '</button>'; }).join('') + '</div>'
      + '<div class="m1-btns"><button type="button" class="slk-btn slk-btn--p" data-ta="go">' + ico('play', 14) + '<span>' + esc(t.go) + '</span></button><button type="button" class="slk-btn" data-ta="rnd">' + ico('dice', 14) + '<span>' + esc(t.rnd) + '</span></button></div></div></div>'
      + '<div class="tp-board"><div class="tp-plw"><svg class="tp-pl" viewBox="-200 -200 400 400" role="img" aria-label="' + esc(t.plane) + '"><defs><clipPath id="' + uid + '-c"><rect x="-200" y="-200" width="400" height="400" rx="12"/></clipPath></defs>'
      + '<g clip-path="url(#' + uid + '-c)"><g class="tp-heat"></g><g class="tp-g0"></g><g class="tp-g1"></g><g class="tp-lay"></g></g><g class="tp-hd"></g></svg></div>'
      + '<div class="tp-side"><div class="tp-op" aria-live="polite"></div><div class="tp-mat"></div><dl class="tp-facts"></dl><p class="tp-pmsg" aria-live="polite"></p></div></div>';
    var CUR = null, SHOW = { M: E.I, R: 4.5 }, ST = null, RAF = 0, PROBE = [1.5, -0.5];
    var C = CA.card(UI, { lessons: LES, main: main,
      onLoad: function (les) { CUR = les; if (les.k !== 'tuya') edFrom(les); },
      onStep: function (les, k, ox) { render(les.steps[k], ox.anim); },
      xp: function () { return xp(CUR.steps[C.D.pos()]); },
      state: function () { return CUR && CUR.k === 'tuya' ? { ED: ED } : null; },
      restore: function (x) { if (x && x.ED && x.ED.A) { ED = x.ED; edDraw(); } }
    });
    var TOG = document.createElement('button'); TOG.type = 'button'; TOG.className = 'slk-btn pm3-codeb tp-tog'; TOG.setAttribute('data-ta', 'tog'); TOG.setAttribute('aria-expanded', 'false');
    q('.m1-head__r').insertBefore(TOG, q('.m1-head__r').firstChild);
    function tog(open) { var w = q('.tp-edw'); w.hidden = !open; TOG.setAttribute('aria-expanded', open ? 'true' : 'false'); TOG.innerHTML = ico('grid', 16) + '<span>' + esc(open ? t.hideM : t.showM) + '</span>'; if (open) K.anim(w, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    tog(false);
    /* ---------- el plano */
    function reach(Mt, st) {   // hasta dónde hay que ver: el cuadrado transformado y los autovectores
      var m = 4.5, pts = [[1, 0], [0, 1], [1, 1], [1, -1]];
      pts.forEach(function (p) { var w = E.app(Mt, p); m = Math.max(m, Math.abs(w[0]) * 1.2 + 0.6, Math.abs(w[1]) * 1.2 + 0.6); });
      return Math.min(m, 40);
    }
    function P(v, R) { var k = 200 / R; return [v[0] * k, -v[1] * k]; }
    function f2(x) { return Math.round(x * 10) / 10; }
    function line(a, b, cls, extra) { return '<line class="' + cls + '" x1="' + f2(a[0]) + '" y1="' + f2(a[1]) + '" x2="' + f2(b[0]) + '" y2="' + f2(b[1]) + '"' + (extra || '') + '/>'; }
    function arrow(v, R, cls, lab, lp) {
      var p = P(v, R), L = Math.hypot(p[0], p[1]);
      if (L < 2) return '<circle class="' + cls + ' tp-dot0" r="4.5"/>';
      var ux = p[0] / L, uy = p[1] / L, h = Math.min(12, L * 0.45), w = h * 0.55, bx = p[0] - ux * h, by = p[1] - uy * h;
      var s = line([0, 0], [bx, by], cls) + '<path class="' + cls + ' tp-hdp" d="M' + f2(p[0]) + ' ' + f2(p[1]) + 'L' + f2(bx - uy * w) + ' ' + f2(by + ux * w) + 'L' + f2(bx + uy * w) + ' ' + f2(by - ux * w) + 'Z"/>';
      if (lab) {   // la etiqueta, junto a la punta y un poco apartada de la recta para que no la tache
        var o = lp || 14, side = lp > 18 ? 1 : 0, tx = p[0] + ux * (side ? 6 : o) - uy * (side ? 18 : 0), ty = p[1] + uy * (side ? 6 : o) + ux * (side ? 18 : 0) + 4;
        tx = Math.max(-182 + lab.length * 4, Math.min(182 - lab.length * 4, tx)); ty = Math.max(-182, Math.min(190, ty));
        s += '<text class="tp-lab ' + cls + '-t" x="' + f2(tx) + '" y="' + f2(ty) + '" text-anchor="middle">' + esc(lab) + '</text>';
      }
      return s;
    }
    function grid0(R) {
      var s = '', st = R <= 9 ? 1 : R <= 20 ? 2 : 5, n = Math.ceil(R / st) * st;
      for (var i = -n; i <= n; i += st) { if (!i) continue; var a = P([i, -R], R), b = P([i, R], R), c = P([-R, i], R), dd = P([R, i], R); s += line(a, b, 'tp-l0') + line(c, dd, 'tp-l0'); }
      s += line(P([-R, 0], R), P([R, 0], R), 'tp-a0') + line(P([0, -R], R), P([0, R], R), 'tp-a0');
      return s;
    }
    function grid1(Mt, R) {
      var s = '', st = R <= 9 ? 1 : R <= 20 ? 2 : 5, N = 14 * st, L = 60 * st;
      for (var i = -N; i <= N; i += st) {
        var cls = i ? 'tp-l1' : 'tp-a1';
        s += line(P(E.app(Mt, [i, -L]), R), P(E.app(Mt, [i, L]), R), cls) + line(P(E.app(Mt, [-L, i]), R), P(E.app(Mt, [L, i]), R), cls);
      }
      return s;
    }
    function heat(A, R) {
      var n = 20, h = 400 / n, s = '', mx = 0, vals = [];
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var x = -R + (j + 0.5) * 2 * R / n, y = R - (i + 0.5) * 2 * R / n, w = A[0][0] * x * x + 2 * A[0][1] * x * y + A[1][1] * y * y;
        vals.push(w); mx = Math.max(mx, Math.abs(w));
      }
      vals.forEach(function (w, k) {
        if (Math.abs(w) < 1e-9 || !mx) return;
        var i = Math.floor(k / n), j = k % n, o = Math.pow(Math.abs(w) / mx, 0.6) * 0.42 + 0.06;
        s += '<rect class="' + (w > 0 ? 'tp-hp' : 'tp-hn') + '" x="' + f2(-200 + j * h) + '" y="' + f2(-200 + i * h) + '" width="' + f2(h + 0.4) + '" height="' + f2(h + 0.4) + '" fill-opacity="' + f2(o * 100) / 100 + '"/>';
      });
      return s;
    }
    function curve(A, R, c) {   // xᵗAx = c en polares: r(θ) = √(c / q(θ))
      var d = '', on = false;
      for (var i = 0; i <= 720; i++) {
        var th = i * Math.PI / 360, u = [Math.cos(th), Math.sin(th)], qv = A[0][0] * u[0] * u[0] + 2 * A[0][1] * u[0] * u[1] + A[1][1] * u[1] * u[1];
        var r = qv * c > 1e-9 ? Math.sqrt(c / qv) : Infinity;
        if (r > R * 1.6) { on = false; continue; }
        var p = P([r * u[0], r * u[1]], R);
        d += (on ? 'L' : 'M') + f2(p[0]) + ' ' + f2(p[1]); on = true;
      }
      return d ? '<path class="tp-q' + (c < 0 ? ' is-neg' : '') + '" d="' + d + '"/>' : '';
    }
    function layers(st, Mt, R) {
      var A = st.show || st.A, X = an(A), s = '', lay = st.lay, hd = '';
      if (lay.quad) { s += curve(A, R, 1) + curve(A, R, -1); }
      if (lay.sq) {
        var o = P([0, 0], R), a = P(E.app(Mt, [1, 0]), R), b = P(E.app(Mt, [1, 1]), R), c = P(E.app(Mt, [0, 1]), R), dd = E.det(Mt);
        s += '<path class="tp-sq' + (dd < -1e-9 ? ' is-neg' : '') + '" d="M' + o.map(f2).join(' ') + 'L' + a.map(f2).join(' ') + 'L' + b.map(f2).join(' ') + 'L' + c.map(f2).join(' ') + 'Z"/>';
        if (lay.area && Math.abs(dd) > 0.05) { var g = P(E.app(Mt, [0.5, 0.5]), R); s += '<text class="tp-lab tp-areat" x="' + f2(g[0]) + '" y="' + f2(g[1] + 5) + '" text-anchor="middle">' + esc((dd < 0 ? '−' : '') + num(Math.abs(dd))) + '</text>'; }
      }
      if (lay.ker && X.ki.r === 1) {
        var kv = X.ki.ker, iv = X.ki.im;
        s += line(P([-kv[0] * 60, -kv[1] * 60], R), P([kv[0] * 60, kv[1] * 60], R), 'tp-ker') + line(P([-iv[0] * 60, -iv[1] * 60], R), P([iv[0] * 60, iv[1] * 60], R), 'tp-im');
        for (var j = -3; j <= 3; j++) { if (!j) continue; var pk = P(E.app(Mt, [kv[0] * j, kv[1] * j]), R); s += '<circle class="tp-kdot" cx="' + f2(pk[0]) + '" cy="' + f2(pk[1]) + '" r="4.5"/>'; }
        var kl = P([kv[0] * R * 0.62 / Math.hypot(kv[0], kv[1]), kv[1] * R * 0.62 / Math.hypot(kv[0], kv[1])], R), il = P([iv[0] * R * 0.62 / Math.hypot(iv[0], iv[1]), iv[1] * R * 0.62 / Math.hypot(iv[0], iv[1])], R);
        s += '<text class="tp-lab tp-ker-t" x="' + f2(kl[0] + 8) + '" y="' + f2(kl[1] - 8) + '">' + esc(en ? 'Ker' : 'Nuc') + '</text><text class="tp-lab tp-im-t" x="' + f2(il[0] + 8) + '" y="' + f2(il[1] - 8) + '">Im</text>';
      }
      if (lay.eig && X.e.kind !== 'c') {
        var vs = X.e.kind === 'd' && X.e.diag ? [] : X.e.v;
        vs.forEach(function (v, i) {
          var w = E.app(Mt, v), wn = Math.hypot(w[0], w[1]), dir = wn > 1e-6 ? [w[0] / wn, w[1] / wn] : [v[0] / Math.hypot(v[0], v[1]), v[1] / Math.hypot(v[0], v[1])];
          s += line(P([-dir[0] * 80, -dir[1] * 80], R), P([dir[0] * 80, dir[1] * 80], R), 'tp-el');
          if (!st.show) s += arrow(w, R, 'tp-ev', 'λ = ' + num(X.e.l[i]), 22);
        });
      }
      if (lay.ev) { s += arrow(E.app(Mt, [1, 0]), R, 'tp-e1', 'e₁', 14) + arrow(E.app(Mt, [0, 1]), R, 'tp-e2', 'e₂', 14); }
      if (lay.probe) {
        var x = PROBE, fx = E.app(Mt, x);
        s += arrow(x, R, 'tp-px') + arrow(fx, R, 'tp-pf', 'f(x)', 16);
        var px = P(x, R);
        hd = '<g class="tp-hnd" tabindex="0" role="slider" aria-label="' + esc(t.probe) + '" aria-valuetext="x = ' + esc(V([f2(x[0]), f2(x[1])])) + '"><circle class="tp-hnd__h" cx="' + f2(px[0]) + '" cy="' + f2(px[1]) + '" r="16"/><circle class="tp-hnd__c" cx="' + f2(px[0]) + '" cy="' + f2(px[1]) + '" r="7"/></g>';
      }
      if (lay.cls && X.q) {
        var lab = (en ? TX.en.C : TX.es.C)[X.q.k];
        s += '<g class="tp-clsb"><rect x="-188" y="-188" width="' + (lab.length * 7.6 + 24) + '" height="28" rx="14"/><text class="tp-clst" x="-176" y="-169">' + esc(lab) + '</text></g>';
      }
      return { s: s, hd: hd };
    }
    function probeMsg(Mt) {
      var x = PROBE, fx = E.app(Mt, x), cr = x[0] * fx[1] - x[1] * fx[0], nx = Math.hypot(x[0], x[1]), nf = Math.hypot(fx[0], fx[1]);
      if (nx < 1e-6) return '';
      if (Math.abs(cr) <= 0.02 * nx * Math.max(nf, 0.2)) { var l = nf < 1e-6 ? 0 : (fx[0] * x[0] + fx[1] * x[1]) / (nx * nx); return '<b class="is-ok">' + esc(fill(t.probeOk, { l: num(l) })) + '</b>'; }
      return '<span>' + esc(t.probeNo) + '</span> · x = ' + esc(V([f2(x[0]), f2(x[1])])) + ' → f(x) = ' + esc(V([f2(fx[0]), f2(fx[1])]));
    }
    function draw(Mt, R) {
      var st = ST;
      q('.tp-g0').innerHTML = grid0(R);
      q('.tp-g1').innerHTML = st.show ? '' : grid1(Mt, R);
      q('.tp-heat').innerHTML = st.lay.heat ? heat(st.show || st.A, R) : '';
      var L = layers(st, Mt, R);
      q('.tp-lay').innerHTML = L.s; q('.tp-hd').innerHTML = L.hd;
      q('.tp-pmsg').innerHTML = st.lay.probe ? probeMsg(Mt) : '';
    }
    function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function render(st, anim) {
      ST = st;
      var to = st.M, R1 = Math.max(reach(to, st), st.lay.quad || st.lay.heat ? 3.2 : 0);
      if (st.lay.heat) R1 = 3.2;
      var from = SHOW.M, R0 = SHOW.R;
      cancelAnimationFrame(RAF);
      side(st);
      C.setStrip(st.code, st.res);
      if (!anim || K.reduced() || (E.eq(from, to) && Math.abs(R0 - R1) < 1e-6)) { SHOW = { M: to, R: R1 }; draw(to, R1); return; }
      var t0 = performance.now(), dur = 950;
      (function fr(now) {
        var x = Math.min(1, (now - t0) / dur), e = ease(x), Mt = E.between(from, to, e), R = R0 + (R1 - R0) * e;
        SHOW = { M: Mt, R: R }; draw(Mt, R);
        if (x < 1) RAF = requestAnimationFrame(fr); else SHOW = { M: to, R: R1 };
      })(t0);
    }
    function cell(v) { return '<span class="tp-c">' + esc(num(v)) + '</span>'; }
    function side(st) {
      var A = st.show || st.A, X = an(A), M = st.show || st.kind === 'start' ? A : st.M, d = E.det(M), lt = E.eigTxt(A), fx = [];
      q('.tp-op').innerHTML = '<span class="tp-op__k">' + esc(t.kind[st.kind.replace(/\d$/, '')] || t.kind[st.kind]) + '</span>';
      q('.tp-mat').innerHTML = '<span class="tp-mn">' + esc(st.show || st.kind === 'start' ? 'A' : st.name) + ' =</span><span class="tp-m">' + cell(M[0][0]) + cell(M[0][1]) + cell(M[1][0]) + cell(M[1][1]) + '</span>';
      var hot = function (k) { return st.kind === k || (k === 'eig' && /^d\d|pow|qcurve/.test(st.kind)) ? ' class="is-hot"' : ''; };
      fx.push('<div' + hot('det') + '><dt>det</dt><dd>' + esc(num(d)) + (st.show ? '' : ' <small>' + esc(fill(t.area, { a: num(Math.abs(d)) })) + (d < -1e-9 ? ' · ' + esc(t.flipT) : '') + '</small>') + '</dd></div>');
      fx.push('<div' + hot('eig') + '><dt>λ</dt><dd>' + (X.e.kind === 'c' ? esc(fill(t.none, { re: num(X.e.re), im: num(X.e.im) })) : esc(lt.join(en ? ' and ' : ' y '))) + '</dd></div>');
      if (st.lay.ker && X.ki.r === 1) fx.push('<div class="is-hot"><dt>' + esc(t.ker) + '</dt><dd>' + esc(V(X.ki.ker)) + '</dd></div><div class="is-hot"><dt>' + esc(t.im) + '</dt><dd>' + esc(V(X.ki.im)) + '</dd></div>');
      if (st.show) fx.push('<div' + hot('qmap') + '><dt>' + esc(t.w) + '</dt><dd>' + esc(expr(A)) + '</dd></div>');
      if (st.lay.cls && X.q) fx.push('<div class="is-hot"><dt>' + esc(t.cls) + '</dt><dd>' + esc((en ? TX.en.C : TX.es.C)[X.q.k]) + '</dd></div>');
      q('.tp-facts').innerHTML = fx.join('');
    }
    /* ---------- la flecha de prueba (ratón, dedo o teclado) */
    var drag = false;
    function toXY(e) {
      var svg = q('.tp-pl'), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse()), k = 200 / SHOW.R;
      return [p.x / k, -p.y / k];
    }
    function setProbe(v) {
      var X = an(ST.show || ST.A), n = Math.hypot(v[0], v[1]), lim = SHOW.R * 0.92;
      if (n > lim) { v = [v[0] * lim / n, v[1] * lim / n]; n = lim; }
      if (X.e.kind !== 'c' && n > 0.3) X.e.v.forEach(function (w) {   // si pasa muy cerca de un autovector, se pega a él
        var wn = Math.hypot(w[0], w[1]), c = (v[0] * w[0] + v[1] * w[1]) / (n * wn);
        if (Math.abs(c) > 0.9985) { var s = (v[0] * w[0] + v[1] * w[1]) / (wn * wn); v = [w[0] * s, w[1] * s]; }
      });
      PROBE = [Math.round(v[0] * 100) / 100, Math.round(v[1] * 100) / 100]; draw(SHOW.M, SHOW.R);
      var h = q('.tp-hnd'); if (h && drag !== 'key') h.classList.add('is-drag');
    }
    var PL = q('.tp-pl');
    PL.addEventListener('pointerdown', function (e) { if (!e.target.closest('.tp-hnd')) return; drag = true; e.preventDefault(); try { PL.setPointerCapture(e.pointerId); } catch (x) {} C.D.stop(); });
    PL.addEventListener('pointermove', function (e) { if (drag === true) setProbe(toXY(e)); });
    function up() { if (drag) { drag = false; var h = q('.tp-hnd'); if (h) h.classList.remove('is-drag'); } }
    PL.addEventListener('pointerup', up); PL.addEventListener('pointercancel', up);
    PL.addEventListener('keydown', function (e) {
      if (!e.target.closest || !e.target.closest('.tp-hnd')) return;
      var d = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, 0.25], ArrowDown: [0, -0.25] }[e.key];
      if (!d) return; e.preventDefault(); e.stopPropagation();
      drag = 'key'; setProbe([PROBE[0] + d[0], PROBE[1] + d[1]]); drag = false;
      var h = q('.tp-hnd'); if (h) h.focus({ preventScroll: true });
    }, true);
    /* ---------- «Explícamelo con calma» */
    function xp(st) {
      if (!st) return null;
      var A = st.show || st.A, X = an(A), parts = [], tip = '', T = E.tr(A), d = X.d, w = function (es, enx) { return esc(en ? enx : es); };
      var a = num(A[0][0]), b = num(A[0][1]), c = num(A[1][0]), dd = num(A[1][1]);
      if (st.kind === 'start') { parts.push({ c: 'A = ' + E.ml(A), d: w('La matriz se escribe por filas: el espacio separa columnas y el punto y coma, filas.', 'The matrix is written by rows: a space separates columns and a semicolon, rows.') }); tip = w('La matriz de una aplicación lineal se monta por columnas: en cada columna, la imagen de un vector de la base.', 'The matrix of a linear map is built by columns: each column holds the image of one basis vector.'); }
      else if (st.kind === 'apply') { parts.push({ c: 'A*[1; 0]', d: w('Da la primera columna, ' + V([A[0][0], A[1][0]]) + ': a dónde va e₁.', 'Gives the first column, ' + V([A[0][0], A[1][0]]) + ': where e₁ goes.') }); parts.push({ c: 'A*[0; 1]', d: w('Da la segunda, ' + V([A[0][1], A[1][1]]) + ': a dónde va e₂.', 'Gives the second one, ' + V([A[0][1], A[1][1]]) + ': where e₂ goes.') }); tip = w('f(x, y) = (' + a + 'x + ' + b + 'y, ' + c + 'x + ' + dd + 'y): cada fila de A es una coordenada de la imagen.', 'f(x, y) = (' + a + 'x + ' + b + 'y, ' + c + 'x + ' + dd + 'y): each row of A is one coordinate of the image.').replace(/\+ −/g, '− '); }
      else if (st.kind === 'det') { parts.push({ c: 'det(A)', d: w('a·d − b·c = ' + a + '·' + dd + ' − ' + b + '·' + c + ' = ' + num(d) + '.', 'a·d − b·c = ' + a + '·' + dd + ' − ' + b + '·' + c + ' = ' + num(d) + '.') }); parts.push({ c: 'abs(det(A))', d: w('El factor por el que se multiplica cualquier área.', 'The factor every area gets multiplied by.') }); tip = w('det(A) ≠ 0 si y solo si la aplicación es biyectiva y tiene inversa, de matriz A⁻¹.', 'det(A) ≠ 0 if and only if the map is bijective and has an inverse, with matrix A⁻¹.'); }
      else if (st.kind === 'eig') { parts.push({ c: 'eig(A)', d: w('Las raíces de λ² − ' + num(T) + 'λ + ' + num(d) + ' = 0 (traza y determinante).', 'The roots of λ² − ' + num(T) + 'λ + ' + num(d) + ' = 0 (trace and determinant).').replace(/\+ −/g, '− ').replace(/− −/g, '+ ') }); parts.push({ c: '[P, D] = eig(A)', d: w('P trae los autovectores en columnas, normalizados a longitud 1; D, los autovalores en la diagonal.', 'P has the eigenvectors as columns, normalised to length 1; D, the eigenvalues on the diagonal.') }); tip = w('Autovector: A·v = λ·v con v ≠ 0. Se saca resolviendo (A − λI)·v = 0 con cada λ.', 'Eigenvector: A·v = λ·v with v ≠ 0. You get it by solving (A − λI)·v = 0 for each λ.'); }
      else if (st.kind === 'ker') { parts.push({ c: "null(A, 'r')", d: w('Una base del núcleo con números sencillos (la «r» es de racional).', 'A basis of the kernel with simple numbers (the «r» stands for rational).') }); parts.push({ c: 'rank(A)', d: w('dim Im(f) = rango de A = ' + X.ki.r + '.', 'dim Im(f) = rank of A = ' + X.ki.r + '.') }); tip = w('dim Nuc(f) + dim Im(f) = dimensión del espacio de salida, aquí 2.', 'dim Ker(f) + dim Im(f) = dimension of the domain, here 2.'); }
      else if (/^d\d/.test(st.kind)) { parts.push({ c: 'P = ' + E.ml(X.dp.P), d: w('Los autovectores en columnas, en el mismo orden que sus autovalores en D.', 'The eigenvectors as columns, in the same order as their eigenvalues in D.') }); parts.push({ c: 'A*P - P*D', d: w('Tiene que dar la matriz nula: es la comprobación rápida.', 'It must give the zero matrix: it is the quick check.') }); tip = w('D = P⁻¹·A·P. Si cambias el orden de las columnas de P, cambia el orden de la diagonal de D.', 'D = P⁻¹·A·P. If you change the order of the columns of P, the order on the diagonal of D changes too.'); }
      else if (/^pow/.test(st.kind)) { parts.push({ c: st.code, d: w('La potencia de matriz: multiplicar A por sí misma.', 'The matrix power: multiplying A by itself.') }); if (X.dp) parts.push({ c: 'P*D^' + st.kind.slice(3) + '*inv(P)', d: w('Lo mismo por la diagonalización: D elevada es elevar su diagonal.', 'The same through diagonalisation: raising D means raising its diagonal.') }); tip = w('Ojo: A.^n eleva cada número y no es Aⁿ. Con D da igual; con A, no.', 'Careful: A.^n raises each entry and is not Aⁿ. With D it makes no difference; with A it does.'); }
      else if (st.kind === 'qmap') { parts.push({ c: 'expand([x y]*A*[x; y])', d: w('La fórmula de la forma: los de la diagonal van con x² e y², y los de fuera se suman para el término cruzado xy.', 'The formula of the form: the diagonal entries go with x² and y², and the off-diagonal ones add up for the cross term xy.') }); tip = w('Al revés, para montar A desde la fórmula, el coeficiente de xy se parte por la mitad.', 'The other way round, to build A from the formula, the xy coefficient is split in half.'); }
      else if (st.kind === 'qcurve') { parts.push({ c: 'eig(A)', d: w('Los autovalores; sus autovectores son los ejes de la curva.', 'The eigenvalues; their eigenvectors are the axes of the curve.') }); tip = w('En la base de autovectores la forma queda λ₁u² + λ₂v²: sin término cruzado.', 'In the eigenvector basis the form becomes λ₁u² + λ₂v²: no cross term.'); }
      else if (st.kind === 'qcls') { parts.push({ c: 'A(1,1)', d: w('El primer menor principal: a₁₁ = ' + a + '.', 'The first leading minor: a₁₁ = ' + a + '.') }); parts.push({ c: 'det(A)', d: w('El segundo: ' + num(d) + '.', 'The second one: ' + num(d) + '.') }); tip = w('Sylvester: todos los menores positivos, definida positiva; signos alternos empezando por negativo, definida negativa.', 'Sylvester: all leading minors positive, positive definite; alternating signs starting with negative, negative definite.'); }
      return { code: st.code + (st.res ? '   % → ' + st.res : ''), lead: esc(st.s[li]), parts: parts, tip: tip };
    }
    /* ---------- «Tu matriz» */
    function edFrom(les) { ED.A = les.A.map(function (v) { return num(v, 1); }); edDraw(); }
    function edDraw() {
      q('.tp-ed').innerHTML = ED.A.map(function (v, i) { return '<input type="text" inputmode="decimal" class="tp-in" data-i="' + i + '" value="' + esc(v) + '" aria-label="' + esc((en ? 'Entry ' : 'Casilla ') + ['1,1', '1,2', '2,1', '2,2'][i]) + '" spellcheck="false" autocomplete="off">'; }).join('');
    }
    function go() {
      var bad = null, v = [];
      [].forEach.call(q('.tp-ed').querySelectorAll('.tp-in'), function (x) { var p = E.parse(x.value); x.classList.toggle('is-bad', p === null || Math.abs(p) > 50); if ((p === null || Math.abs(p) > 50) && !bad) bad = x; ED.A[+x.getAttribute('data-i')] = x.value.trim() || '0'; v.push(p); });
      if (bad) { UI.toast(t.badCell); bad.focus(); return; }
      var les = { k: 'tuya', g: 'pen', A: v, kinds: autoKinds(mat(v)), n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD] };
      les.steps = stepsOf(les, lang);
      var i = LES.findIndex(function (l) { return l.k === 'tuya'; }); if (i >= 0) LES[i] = les; else LES.push(les);
      C.load('tuya');
    }
    function rnd() {
      var r = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }, v;
      do v = [r(-3, 3), r(-3, 3), r(-3, 3), r(-3, 3)]; while (v.every(function (x) { return !x; }) || Math.abs(v[0] * v[3] - v[1] * v[2]) > 9);
      if (Math.random() < 0.35) v[2] = v[1];   // a veces simétrica, para ver su forma cuadrática
      ED.A = v.map(String); edDraw(); go();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tpp],[data-ta]'); if (!b || !el.contains(b)) return;
      if (b.hasAttribute('data-tpp')) { ED.A = t.pre[+b.getAttribute('data-tpp')][1].map(String); edDraw(); go(); tog(false); return; }
      var a = b.getAttribute('data-ta');
      if (a === 'tog') { tog(q('.tp-edw').hidden); return; }
      if (a === 'go') { go(); tog(false); } else if (a === 'rnd') { rnd(); tog(false); }
    });
    el.addEventListener('input', function (e) { var x = e.target; if (x.classList && x.classList.contains('tp-in') && el.contains(x)) { ED.A[+x.getAttribute('data-i')] = x.value; x.classList.remove('is-bad'); } });
    el.addEventListener('keydown', function (e) { var x = e.target; if (e.key === 'Enter' && x.classList && x.classList.contains('tp-in') && el.contains(x)) { e.preventDefault(); go(); tog(false); } });
    /* ---------- «Ponte a prueba» */
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function nums(s) { return (String(s).replace(/−/g, '-').match(/-?\d+(?:[.,]\d+)?(?:\/\d+)?/g) || []).map(function (x) { return E.parse(x); }); }
    var LV = [
      { gen: function () {
        var v; do v = [ri(-4, 5), ri(-4, 5), ri(-4, 5), ri(-4, 5)]; while (!(v[0] * v[3] - v[1] * v[2]));
        return { q: t.lq1, code: 'A = ' + E.ml(mat(v)) + '\ndet(A)', ans: String(v[0] * v[3] - v[1] * v[2]), norm: function (x) { var n = nums(x); return n.length === 1 ? String(n[0]) : '?'; }, hint: t.h1, mode: 'text' };
      } },
      { gen: function () {
        var Ps = [[1, 1, 0, 1], [1, 1, 1, 2], [2, 1, 1, 1], [1, 0, 1, 1], [1, -1, 1, 0], [1, 2, 0, 1], [1, 1, -1, 0]], l1, l2;
        do { l1 = ri(-3, 4); l2 = ri(-3, 4); } while (l1 === l2);
        var p = Ps[ri(0, Ps.length - 1)], Pm = mat(p), A = E.mul(E.mul(Pm, Mx(l1, 0, 0, l2)), E.inv(Pm));
        A = A.map(function (r) { return r.map(function (x) { return Math.round(x); }); });
        return { q: t.lq2, code: 'A = ' + E.ml(A) + '\neig(A)', ans: Math.min(l1, l2) + ' ' + Math.max(l1, l2), norm: function (x) { var n = nums(x); return n.length === 2 && n.every(function (y) { return y !== null; }) ? n.sort(function (a, b) { return a - b; }).join(' ') : '?'; }, hint: t.h2, mode: 'text' };
      } },
      { gen: function () {
        var want = ['dp', 'dn', 'in', 'sp', 'sn'][ri(0, 4)], A, k, tries = 0;
        do {
          if (want === 'sp' || want === 'sn') { var u = [ri(1, 2), ri(-2, 2)], s = want === 'sp' ? 1 : -1; A = Mx(s * u[0] * u[0], s * u[0] * u[1], s * u[0] * u[1], s * u[1] * u[1]); }
          else { var b = ri(-3, 3); A = Mx(ri(-4, 4), b, b, ri(-4, 4)); }
          k = E.cls(A).k; tries++;
        } while (k !== want && tries < 80);
        var map = en ? { PD: 'dp', ND: 'dn', PSD: 'sp', NSD: 'sn', I: 'in', POSITIVEDEFINITE: 'dp', NEGATIVEDEFINITE: 'dn', POSITIVESEMIDEFINITE: 'sp', NEGATIVESEMIDEFINITE: 'sn', INDEFINITE: 'in', DP: 'dp', DN: 'dn', SP: 'sp', SN: 'sn' }
          : { DP: 'dp', DN: 'dn', SP: 'sp', SN: 'sn', I: 'in', SDP: 'sp', SDN: 'sn', DEFINIDAPOSITIVA: 'dp', DEFINIDANEGATIVA: 'dn', SEMIDEFINIDAPOSITIVA: 'sp', SEMIDEFINIDANEGATIVA: 'sn', INDEFINIDA: 'in' };
        var lab = { dp: en ? 'PD' : 'DP', dn: en ? 'ND' : 'DN', sp: en ? 'PSD' : 'SP', sn: en ? 'NSD' : 'SN', in: 'I' };
        return { q: t.lq3, code: 'A = ' + E.ml(A) + '   % xᵗAx = ' + expr(A), ans: lab[k], norm: function (x) { var u = String(x).toUpperCase().normalize('NFD').replace(/[^A-Z]/g, ''); return map[u] || ({ dp: 1, dn: 1, sp: 1, sn: 1, in: 1 }[String(x).toLowerCase().trim()] ? String(x).toLowerCase().trim() : u); }, hint: t.h3, mode: 'text' };
      } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_tp_niveles', need: 3, levels: LV, hl: function (s) { return esc(s); } });
    // si lo guardado o el enlace compartido es «tu matriz», se rehace antes de arrancar
    var hs = K.hashState(), sv = K.jget('sl_sim_tp_' + lang, null), st0 = hs && hs.k ? hs : sv;
    if (st0 && st0.k === 'tuya' && st0.x && st0.x.ED && st0.x.ED.A) { ED = st0.x.ED; edDraw(); var vv = ED.A.map(E.parse); if (vv.every(function (x) { return x !== null; })) { var les = { k: 'tuya', g: 'pen', A: vv, kinds: autoKinds(mat(vv)), n: [TX.es.yoursN, TX.en.yoursN], d: [TX.es.yoursD, TX.en.yoursD] }; les.steps = stepsOf(les, lang); LES.push(les); } }
    C.start();
  }
  window.SLTPUI = { mount: mount, LES: LES, steps: stepsOf, auto: autoKinds };
  K.boot('.sl-sim[data-sim="tp"]', mount);
})();
