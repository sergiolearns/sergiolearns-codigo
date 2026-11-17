/* SergioLearns — simulador de ME1: distribuciones de probabilidad con las funciones d/p/q de R (16 nov 2026). */
(function () {
  'use strict';
  var K = window.SLK, S = window.SLST, M = window.SLM1;
  if (!K || !S || !M) return;
  var ico = K.ico, esc = K.esc, fill = K.fill, num = S.num;
  var NAMES = {
    binom: ['Binomial', 'Binomial'], pois: ['Poisson', 'Poisson'], geom: ['Geométrica', 'Geometric'], hyper: ['Hipergeométrica', 'Hypergeometric'],
    unif: ['Uniforme', 'Uniform'], exp: ['Exponencial', 'Exponential'], gamma: ['Gamma', 'Gamma'], norm: ['Normal', 'Normal'],
    chisq: ['χ²', 'χ²'], t: ['t de Student', 'Student’s t'], f: ['F de Snedecor', 'Snedecor’s F']
  };
  var TX = {
    es: { title: 'sergio@learns: ~/laboratorio/simuladores/distribuciones', disc: 'Discretas', cont: 'Continuas', params: 'Parámetros', question: 'La pregunta',
      qs: { le: 'P(X ≤ a)', gt: 'P(X > a)', ge: 'P(X ≥ a)', ab: 'P(a ≤ X ≤ b)', eq: 'P(X = a)', eqc: 'f(a)', q: 'cuantil' }, a: 'a', b: 'b', p: 'probabilidad',
      res: 'Resultado', same: 'Lo mismo con', mean: 'Media', var: 'Varianza', sd: 'Desviación típica', noMean: 'no existe',
      read: { le: 'La probabilidad de que X valga {a} o menos es {v}: pasa en unas {pc} de cada 100 veces.', lec: 'La probabilidad de que X no pase de {a} es {v}: el área de la curva a la izquierda de {a}.',
        gt: 'La probabilidad de que X pase de {a} es {v}: la cola de la derecha.', ge: 'La probabilidad de que X valga {a} o más es {v}. Ojo: es 1 − F({a1}), porque el {a} también cuenta.',
        ab: 'La probabilidad de que X caiga entre {a} y {b} es {v}.', eq: 'La probabilidad de que X valga exactamente {a} es {v}: la altura de esa barra.',
        eqc: 'f({a}) = {v} es la altura de la curva en {a}, no una probabilidad: en una continua P(X = {a}) = 0.', q: 'El cuantil {p} es {v}: deja a su izquierda el {pc} % de la probabilidad.',
        qd: 'El cuantil {p} es {v}: el menor valor con F(x) ≥ {p} (en una discreta F va a saltos).' },
      lv: [['Una barra o un trozo', 'P(X = k) y P(X ≤ k) en binomiales y Poisson. Escribe la probabilidad con 4 decimales.'], ['El ≥ de las discretas', 'P(X ≥ k) y P(a ≤ X ≤ b): dónde va el k − 1. Con 4 decimales.'], ['Normal y cuantiles', 'Probabilidades y cuantiles de la normal. Probabilidad con 4 decimales; cuantil con 2.']],
      qLv: '¿Cuánto vale {e}?', qQ: '¿Qué valor deja el {pc} % de la probabilidad a su izquierda?', dec4: '(con 4 decimales)', dec2: '(con 2 decimales)',
      ns: 'El simulador necesita JavaScript.' },
    en: { title: 'sergio@learns: ~/lab/simulators/distributions', disc: 'Discrete', cont: 'Continuous', params: 'Parameters', question: 'The question',
      qs: { le: 'P(X ≤ a)', gt: 'P(X > a)', ge: 'P(X ≥ a)', ab: 'P(a ≤ X ≤ b)', eq: 'P(X = a)', eqc: 'f(a)', q: 'quantile' }, a: 'a', b: 'b', p: 'probability',
      res: 'Result', same: 'The same with', mean: 'Mean', var: 'Variance', sd: 'Standard deviation', noMean: 'does not exist',
      read: { le: 'The probability that X is {a} or less is {v}: it happens about {pc} times in 100.', lec: 'The probability that X does not exceed {a} is {v}: the area under the curve to the left of {a}.',
        gt: 'The probability that X exceeds {a} is {v}: the right tail.', ge: 'The probability that X is {a} or more is {v}. Careful: it is 1 − F({a1}), because {a} itself counts.',
        ab: 'The probability that X falls between {a} and {b} is {v}.', eq: 'The probability that X is exactly {a} is {v}: the height of that bar.',
        eqc: 'f({a}) = {v} is the height of the curve at {a}, not a probability: for a continuous variable P(X = {a}) = 0.', q: 'The {p} quantile is {v}: it leaves {pc} % of the probability to its left.',
        qd: 'The {p} quantile is {v}: the smallest value with F(x) ≥ {p} (for a discrete variable F jumps).' },
      lv: [['One bar or a chunk', 'P(X = k) and P(X ≤ k) for binomials and Poissons. Write the probability with 4 decimals.'], ['The ≥ of discrete variables', 'P(X ≥ k) and P(a ≤ X ≤ b): where the k − 1 goes. With 4 decimals.'], ['Normal and quantiles', 'Probabilities and quantiles of the normal. Probability with 4 decimals; quantile with 2.']],
      qLv: 'What is {e}?', qQ: 'Which value leaves {pc} % of the probability to its left?', dec4: '(with 4 decimals)', dec2: '(with 2 decimals)',
      ns: 'The simulator needs JavaScript.' }
  };
  // ---- lecciones (ejemplos de clase; cada paso fija la distribución, sus parámetros y la pregunta)
  var LES = [
    { k: 'examen', g: 'exam', n: ['El test al azar', 'Guessing a test'], d: ['Binomial: d, p y el truco del ≥ con 10 preguntas de 4 opciones.', 'Binomial: d, p and the ≥ trick with 10 four-option questions.'], steps: [
      { d: 'binom', P: { size: 10, prob: 0.25 }, Q: { t: 'eq', a: 3 }, s: ['X son los aciertos al contestar al azar un test de 10 preguntas con 4 opciones. Cada pregunta es un ensayo con p = 0,25, así que X ~ B(10; 0,25). Cada barra es P(X = x).', 'X is the number of right answers when guessing a 10-question test with 4 options. Each question is a trial with p = 0.25, so X ~ B(10, 0.25). Each bar is P(X = x).'] },
      { d: 'binom', P: { size: 10, prob: 0.25 }, Q: { t: 'eq', a: 3 }, s: ['P(X = 3) es la altura de una sola barra: dbinom(3, 10, 0.25) = 0,2503. La «d» de dbinom es de densidad, aunque en una discreta es una probabilidad.', 'P(X = 3) is the height of one bar: dbinom(3, 10, 0.25) = 0.2503. The «d» in dbinom stands for density, although for a discrete variable it is a probability.'] },
      { d: 'binom', P: { size: 10, prob: 0.25 }, Q: { t: 'le', a: 3 }, s: ['P(X ≤ 3) suma las barras de 0 a 3: pbinom(3, 10, 0.25) = 0,7759. La «p» es la función de distribución, F(3).', 'P(X ≤ 3) adds the bars from 0 to 3: pbinom(3, 10, 0.25) = 0.7759. The «p» is the distribution function, F(3).'] },
      { d: 'binom', P: { size: 10, prob: 0.25 }, Q: { t: 'ge', a: 5 }, ask: { q: ['¿Qué escribirías en R para P(X ≥ 5)?', 'What would you write in R for P(X ≥ 5)?'], o: [['1 - pbinom(5, 10, 0.25)', '1 - pbinom(5, 10, 0.25)'], ['1 - pbinom(4, 10, 0.25)', '1 - pbinom(4, 10, 0.25)', 1], ['pbinom(5, 10, 0.25)', 'pbinom(5, 10, 0.25)']] },
        s: ['Para «5 o más» se quita lo que queda por debajo: 1 − F(4). Con pbinom(5) te dejarías fuera el 5. Sale 0,0781: aprobar con 5 aciertos al azar pasa menos de 8 veces de cada 100.', 'For «5 or more» you remove what lies below: 1 − F(4). With pbinom(5) you would leave the 5 out. It gives 0.0781: passing with 5 guesses happens fewer than 8 times in 100.'] },
      { d: 'binom', P: { size: 10, prob: 0.25 }, Q: { t: 'q', p: 0.5 }, s: ['El cuantil va al revés: de una probabilidad a un valor. qbinom(0.5, 10, 0.25) = 2 es el menor x con F(x) ≥ 0,5: la mediana de aciertos.', 'The quantile goes the other way: from a probability to a value. qbinom(0.5, 10, 0.25) = 2 is the smallest x with F(x) ≥ 0.5: the median number of hits.'] },
      { d: 'binom', P: { size: 10, prob: 0.5 }, Q: { t: 'le', a: 5 }, s: ['Con preguntas de verdadero o falso, p = 0,5 y la distribución se vuelve simétrica alrededor de n·p = 5. La media es n·p y la varianza n·p·(1 − p): mira cómo cambian abajo al mover p.', 'With true-or-false questions, p = 0.5 and the distribution becomes symmetric around n·p = 5. The mean is n·p and the variance n·p·(1 − p): watch them change below as you move p.'] }
    ] },
    { k: 'mensajes', g: 'dice', n: ['Mensajes por hora', 'Messages per hour'], d: ['Poisson: la cola de la derecha con lower.tail y qué pasa al subir λ.', 'Poisson: the right tail with lower.tail and what happens when λ grows.'], steps: [
      { d: 'pois', P: { lambda: 4 }, Q: { t: 'eq', a: 0 }, s: ['Al grupo de clase llegan de media 4 mensajes por hora: X ~ Po(4). P(X = 0) = dpois(0, 4) = 0,0183 es una hora entera sin mensajes: casi nunca.', 'The class group gets 4 messages an hour on average: X ~ Po(4). P(X = 0) = dpois(0, 4) = 0.0183 is a whole hour without messages: almost never.'] },
      { d: 'pois', P: { lambda: 4 }, Q: { t: 'gt', a: 6 }, s: ['Más de 6 mensajes: ppois(6, 4, lower.tail = FALSE) = 0,1107. lower.tail = FALSE da la cola de la derecha, P(X > 6), sin restar a mano.', 'More than 6 messages: ppois(6, 4, lower.tail = FALSE) = 0.1107. lower.tail = FALSE gives the right tail, P(X > 6), without subtracting by hand.'] },
      { d: 'pois', P: { lambda: 10 }, Q: { t: 'le', a: 10 }, ask: { q: ['La víspera del examen la media sube a λ = 10. ¿Qué le pasa a la montaña?', 'The day before the exam the mean rises to λ = 10. What happens to the hill?'], o: [['Se va a la derecha y se ensancha', 'It moves right and gets wider', 1], ['Se va a la derecha y se estrecha', 'It moves right and gets narrower'], ['Solo se hace más alta', 'It only gets taller']] },
        s: ['En una Poisson la media y la varianza valen λ: con λ = 10 el centro se va a 10 y la dispersión crece (σ = √10 ≈ 3,16). Por eso las barras son más bajas: la probabilidad se reparte entre más valores.', 'In a Poisson the mean and the variance are both λ: with λ = 10 the centre moves to 10 and the spread grows (σ = √10 ≈ 3.16). That is why the bars are lower: the probability is shared among more values.'] },
      { d: 'pois', P: { lambda: 10 }, Q: { t: 'ab', a: 8, b: 12 }, s: ['Entre 8 y 12 mensajes, los dos incluidos: ppois(12, 10) − ppois(7, 10) = 0,5713. Se resta F(7), no F(8), para no perder el 8.', 'Between 8 and 12 messages, both included: ppois(12, 10) − ppois(7, 10) = 0.5713. You subtract F(7), not F(8), so the 8 is kept.'] }
    ] },
    { k: 'nota', g: 'target', n: ['La nota del examen', 'The exam mark'], d: ['Normal: áreas, la altura que no es probabilidad y el cuantil de los mejores.', 'Normal: areas, the height that is not a probability and the quantile of the best.'], steps: [
      { d: 'norm', P: { mean: 6, sd: 1.5 }, Q: { t: 'le', a: 5 }, s: ['Las notas de un examen siguen una N(6; 1,5). P(X < 5) = pnorm(5, 6, 1.5) = 0,2525: un 25 % de la clase saca menos de un 5. En una continua, < y ≤ dan lo mismo.', 'The marks of an exam follow N(6, 1.5). P(X < 5) = pnorm(5, 6, 1.5) = 0.2525: 25 % of the class scores below 5. For a continuous variable, < and ≤ give the same.'] },
      { d: 'norm', P: { mean: 6, sd: 1.5 }, Q: { t: 'ab', a: 5, b: 8 }, s: ['Entre 5 y 8: pnorm(8, 6, 1.5) − pnorm(5, 6, 1.5) = 0,6563. El área de un trozo es F del final menos F del principio.', 'Between 5 and 8: pnorm(8, 6, 1.5) − pnorm(5, 6, 1.5) = 0.6563. The area of a piece is F at the end minus F at the start.'] },
      { d: 'norm', P: { mean: 6, sd: 1.5 }, Q: { t: 'eq', a: 6 }, s: ['dnorm(6, 6, 1.5) = 0,2660 no es la probabilidad de sacar un 6: es la altura de la curva. Un solo punto no tiene área, así que P(X = 6) = 0.', 'dnorm(6, 6, 1.5) = 0.2660 is not the probability of scoring 6: it is the height of the curve. A single point has no area, so P(X = 6) = 0.'] },
      { d: 'norm', P: { mean: 6, sd: 1.5 }, Q: { t: 'q', p: 0.9 }, ask: { q: ['¿Qué nota deja por encima solo al 10 % de la clase?', 'Which mark leaves only 10 % of the class above it?'], o: [['qnorm(0.1, 6, 1.5)', 'qnorm(0.1, 6, 1.5)'], ['qnorm(0.9, 6, 1.5)', 'qnorm(0.9, 6, 1.5)', 1], ['pnorm(0.9, 6, 1.5)', 'pnorm(0.9, 6, 1.5)']] },
        s: ['El 10 % de arriba es el 90 % de abajo: qnorm(0.9, 6, 1.5) = 7,92. qnorm recibe una probabilidad y devuelve una nota; pnorm, al revés.', 'The top 10 % is the bottom 90 %: qnorm(0.9, 6, 1.5) = 7.92. qnorm takes a probability and returns a mark; pnorm does the opposite.'] },
      { d: 'norm', P: { mean: 6, sd: 1.5 }, Q: { t: 'gt', a: 9 }, s: ['Más de un 9: z = (9 − 6)/1,5 = 2, dos desviaciones por encima de la media. pnorm(9, 6, 1.5, lower.tail = FALSE) = 1 − pnorm(2) = 0,0228.', 'Above 9: z = (9 − 6)/1.5 = 2, two standard deviations above the mean. pnorm(9, 6, 1.5, lower.tail = FALSE) = 1 − pnorm(2) = 0.0228.'] }
    ] },
    { k: 'guagua', g: 'flag', n: ['La espera de la guagua', 'Waiting for the bus'], d: ['Exponencial: colas, la mediana menor que la media y la falta de memoria.', 'Exponential: tails, a median below the mean and memorylessness.'], steps: [
      { d: 'exp', P: { rate: 0.2 }, Q: { t: 'gt', a: 10 }, s: ['La guagua del campus pasa, de media, cada 5 minutos: la espera T ~ Exp(λ = 0,2). Esperar más de 10 minutos: pexp(10, 0.2, lower.tail = FALSE) = e^(−2) = 0,1353.', 'The campus bus comes every 5 minutes on average: the wait T ~ Exp(λ = 0.2). Waiting more than 10 minutes: pexp(10, 0.2, lower.tail = FALSE) = e^(−2) = 0.1353.'] },
      { d: 'exp', P: { rate: 0.2 }, Q: { t: 'le', a: 2 }, s: ['Que llegue en 2 minutos o menos: pexp(2, 0.2) = 1 − e^(−0,4) = 0,3297. En R el parámetro es rate = λ = 1/media, no la media.', 'It arrives within 2 minutes: pexp(2, 0.2) = 1 − e^(−0.4) = 0.3297. In R the parameter is rate = λ = 1/mean, not the mean.'] },
      { d: 'exp', P: { rate: 0.2 }, Q: { t: 'q', p: 0.5 }, s: ['La mediana es qexp(0.5, 0.2) = 3,47 minutos, menos que la media de 5: la cola larga de la derecha tira de la media hacia arriba.', 'The median is qexp(0.5, 0.2) = 3.47 minutes, less than the mean of 5: the long right tail pulls the mean up.'] },
      { d: 'exp', P: { rate: 0.2 }, Q: { t: 'gt', a: 10 }, ask: { q: ['Ya llevas 5 minutos esperando. ¿La probabilidad de esperar 10 más es…?', 'You have already waited 5 minutes. The probability of waiting 10 more is…'], o: [['Menor que al llegar', 'Smaller than when you arrived'], ['La misma: 0,1353', 'The same: 0.1353', 1], ['Mayor que al llegar', 'Larger than when you arrived']] },
        s: ['Es la misma: P(T > 15 | T > 5) = P(T > 10) = 0,1353. La exponencial no tiene memoria: lo que ya esperaste no cuenta.', 'It is the same: P(T > 15 | T > 5) = P(T > 10) = 0.1353. The exponential has no memory: the time you already waited does not count.'] }
    ] },
    { k: 'muestreo', g: 'grid', n: ['t, χ² y F', 't, χ² and F'], d: ['Las del muestreo: los cuantiles de los intervalos y contrastes.', 'The sampling ones: the quantiles of intervals and tests.'], steps: [
      { d: 't', P: { df: 5 }, Q: { t: 'q', p: 0.975 }, s: ['La t de Student es la normal de las muestras pequeñas. qt(0.975, 5) = 2,571, mientras que qnorm(0.975) = 1,96: con 5 grados de libertad las colas pesan más.', 'Student’s t is the normal of small samples. qt(0.975, 5) = 2.571, while qnorm(0.975) = 1.96: with 5 degrees of freedom the tails are heavier.'] },
      { d: 't', P: { df: 30 }, Q: { t: 'q', p: 0.975 }, s: ['Con 30 grados de libertad, qt(0.975, 30) = 2,042: ya casi es la normal. Por eso con muestras grandes se usa z.', 'With 30 degrees of freedom, qt(0.975, 30) = 2.042: almost the normal already. That is why large samples use z.'] },
      { d: 'chisq', P: { df: 9 }, Q: { t: 'q', p: 0.95 }, s: ['La χ² aparece con la varianza muestral: con n = 10 se usan 9 grados de libertad. qchisq(0.95, 9) = 16,92. No es simétrica y solo toma valores positivos.', 'The χ² appears with the sample variance: with n = 10 you use 9 degrees of freedom. qchisq(0.95, 9) = 16.92. It is not symmetric and only takes positive values.'] },
      { d: 'f', P: { df1: 5, df2: 10 }, Q: { t: 'gt', a: 3.33 }, s: ['La F compara dos varianzas. P(F > 3,33) con 5 y 10 grados de libertad es 0,0498: 3,33 es casi el cuantil 0,95, qf(0.95, 5, 10) = 3,326.', 'The F compares two variances. P(F > 3.33) with 5 and 10 degrees of freedom is 0.0498: 3.33 is almost the 0.95 quantile, qf(0.95, 5, 10) = 3.326.'] }
    ] }
  ];
  var PM = {
    size: ['el número de ensayos (preguntas, tiradas…).', 'the number of trials (questions, rolls…).'], prob: ['la probabilidad de éxito en cada ensayo.', 'the probability of success in each trial.'],
    lambda: ['λ, la media de sucesos por intervalo; en una Poisson también es la varianza.', 'λ, the mean number of events per interval; in a Poisson it is also the variance.'],
    m: ['cuántos elementos «buenos» hay en la urna.', 'how many «good» items the urn has.'], n: ['cuántos elementos «malos» hay en la urna.', 'how many «bad» items the urn has.'], k: ['cuántos se sacan, sin devolver.', 'how many are drawn, without replacement.'],
    min: ['el extremo izquierdo del intervalo.', 'the left end of the interval.'], max: ['el extremo derecho del intervalo.', 'the right end of the interval.'],
    rate: ['λ = 1/media: en R la exponencial y la gamma se dan con la tasa, no con la media.', 'λ = 1/mean: in R the exponential and gamma take the rate, not the mean.'], shape: ['α, la forma: con α = 1 es una exponencial.', 'α, the shape: with α = 1 it is an exponential.'],
    mean: ['μ, la media: el centro de la campana.', 'μ, the mean: the centre of the bell.'], sd: ['σ, la desviación típica (no la varianza: si te dan σ², haz la raíz).', 'σ, the standard deviation (not the variance: if you are given σ², take the square root).'],
    df: ['los grados de libertad; con una muestra de tamaño n suelen ser n − 1.', 'the degrees of freedom; with a sample of size n they are usually n − 1.'], df1: ['los grados de libertad del numerador.', 'the degrees of freedom of the numerator.'], df2: ['los grados de libertad del denominador.', 'the degrees of freedom of the denominator.']
  };
  var PRE = { d: ['d: la función de probabilidad (en una discreta, P(X = x)) o de densidad (en una continua, la altura de la curva).', 'd: the probability function (for a discrete variable, P(X = x)) or the density (for a continuous one, the height of the curve).'],
    p: ['p: la función de distribución, F(x) = P(X ≤ x): todo lo que queda a la izquierda.', 'p: the distribution function, F(x) = P(X ≤ x): everything to the left.'], q: ['q: el cuantil, el valor x que deja la probabilidad dada a su izquierda (la inversa de p).', 'q: the quantile, the value x that leaves the given probability to its left (the inverse of p).'] };
  var TIP = { le: ['pbinom(a) y compañía incluyen el propio a: P(X ≤ a). Para «menos de a» en una discreta, usa a − 1.', 'pbinom(a) and friends include a itself: P(X ≤ a). For «less than a» with a discrete variable, use a − 1.'],
    gt: ['lower.tail = FALSE da la cola de la derecha, P(X > a), sin restar a mano; es lo mismo que 1 − p…(a).', 'lower.tail = FALSE gives the right tail, P(X > a), without subtracting by hand; it equals 1 − p…(a).'],
    ge: ['«Al menos a» en una discreta es 1 − F(a − 1): si restas F(a), te dejas fuera el propio a. Es el error más repetido.', '«At least a» for a discrete variable is 1 − F(a − 1): if you subtract F(a), you leave a itself out. It is the most repeated mistake.'],
    ab: ['Un trozo es F(final) − F(principio). En las discretas, si el principio entra, resta F(a − 1).', 'A piece is F(end) − F(start). For discrete variables, if the start is included, subtract F(a − 1).'],
    eq: ['En una discreta, d da la probabilidad de un valor; en una continua, d es una altura y P(X = a) = 0.', 'For a discrete variable, d gives the probability of one value; for a continuous one, d is a height and P(X = a) = 0.'],
    q: ['Comprueba un cuantil con p: p…(q…(0.9)) vuelve a dar 0,9 en las continuas. En las discretas da algo ≥ 0,9, porque F va a saltos.', 'Check a quantile with p: p…(q…(0.9)) gives 0.9 back for continuous variables. For discrete ones it gives something ≥ 0.9, because F jumps.'] };
  var ORDER = ['binom', 'pois', 'geom', 'hyper', 'unif', 'exp', 'gamma', 'norm', 'chisq', 't', 'f'];

  function mount(el) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], li = lang === 'en' ? 1 : 0, en = lang === 'en';
    var UI = K.mount(el, { sim: 'distrib', title: t.title, d: true }), q = UI.q;
    var ST = { d: 'binom', P: S.params('binom', {}), Q: { t: 'le', a: 3, b: 5, p: 0.5 } };
    var main = '<div class="m1-grid"><div class="m1-left"><div class="m1-plotw"><svg class="m1-plot" viewBox="0 0 640 330" role="img"></svg><div class="m1-stats"></div></div><div class="m1-out"></div></div>'
      + '<div class="m1-side"><div class="m1-grp"><p class="m1-h">' + esc(t.disc) + '</p><div class="m1-pills" data-g="d"></div><p class="m1-h">' + esc(t.cont) + '</p><div class="m1-pills" data-g="c"></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.params) + '</p><div class="m1-ps"></div></div>'
      + '<div class="m1-grp"><p class="m1-h">' + esc(t.question) + '</p><div class="m1-seg m1-qs" role="group"></div><div class="m1-ins"></div></div>'
      + '</div></div>';
    var C = M.card(UI, { lessons: LES, main: main,
      onLoad: function () {},
      onStep: function (les, k) { var s = les.steps[k]; ST.d = s.d; ST.P = S.params(s.d, s.P); ST.Q = Object.assign({ a: 3, b: 5, p: 0.5 }, s.Q); render(true); },
      xp: function () {
        var D = S.DIST[ST.d], P = S.params(ST.d, ST.P), R = S.ask(ST.d, P, ST.Q), dis = D.kind === 'd', call = R.calls[0];
        var fn = (call.match(/([dpq])(binom|pois|geom|hyper|unif|exp|gamma|norm|chisq|t|f)\(/) || [])[0] || '', pre = fn.charAt(0), parts = [];
        if (/^1 - /.test(call)) parts.push({ c: '1 - …', d: en ? 'The complement: everything that is not to the left.' : 'El complementario: todo lo que no queda a la izquierda.' });
        parts.push({ c: fn.replace('(', ''), d: esc(PRE[pre][li]) + ' ' + esc(en ? 'The rest of the name is the distribution: ' : 'El resto del nombre es la distribución: ') + '<b>' + esc(NAMES[ST.d][li]) + '</b>.' });
        var first = (call.match(/\(([^,]+),/) || [])[1];
        if (first) parts.push({ c: first.trim(), d: esc(R.kind === 'q' ? (en ? 'The probability you want to leave on the left.' : 'La probabilidad que quieres dejar a la izquierda.') : R.kind === 'ge' ? (en ? 'a − 1 = ' + (R.a - 1) + ': the last value you do NOT want.' : 'a − 1 = ' + (R.a - 1) + ': el último valor que NO quieres.') : (en ? 'The value of X where you look.' : 'El valor de X en el que miras.')) });
        D.ps.forEach(function (p) { parts.push({ c: p[0] + ' = ' + S.rnum(P[p[0]]), d: esc(PM[p[0]][li]) }); });
        if (/lower\.tail/.test(call)) parts.push({ c: 'lower.tail = FALSE', d: esc(en ? 'Take the right tail, P(X > x), instead of F(x).' : 'Toma la cola de la derecha, P(X > x), en lugar de F(x).') });
        var mu = D.mean(P), va = D.var(P);
        var rk = R.kind === 'q' ? (dis ? 'qd' : 'q') : R.kind === 'eq' ? (dis ? 'eq' : 'eqc') : R.kind === 'le' && !dis ? 'lec' : R.kind, v = R.kind === 'q' ? num(R.v, dis ? 0 : 4, en) : num(R.v, 4, en);
        var lead = fill(t.read[rk], { a: num(R.a, 4, en), a1: num(R.a - 1, 4, en), b: num(R.b, 4, en), v: '<b>' + esc(v) + '</b>', pc: num(R.kind === 'q' ? R.p * 100 : Math.round(R.v * 100), 1, en), p: num(R.p, 4, en) })
          + (isFinite(mu) ? ' ' + esc((en ? 'Mean ' : 'Media ') + num(mu, 4, en) + (isFinite(va) ? (en ? ', standard deviation ' : ', desviación típica ') + num(Math.sqrt(va), 4, en) : '') + '.') : '');
        return { code: call, lead: lead, parts: parts, tip: esc(TIP[R.kind === 'eq' ? 'eq' : R.kind][li]) };
      },
      state: function () { return { d: ST.d, P: ST.P, Q: ST.Q }; },
      restore: function (x) { if (x && S.DIST[x.d]) { ST.d = x.d; ST.P = S.params(x.d, x.P); ST.Q = Object.assign({}, ST.Q, x.Q); render(true); } }
    });
    var svg = q('.m1-plot');
    // ---- controles
    function pills() {
      ['d', 'c'].forEach(function (g) {
        q('.m1-pills[data-g="' + g + '"]').innerHTML = ORDER.filter(function (k) { return S.DIST[k].kind === g; }).map(function (k) {
          return '<button type="button" class="m1-pill' + (k === ST.d ? ' is-on' : '') + '" data-d="' + k + '" aria-pressed="' + (k === ST.d) + '">' + esc(NAMES[k][li]) + '</button>';
        }).join('');
      });
    }
    function params() {
      var D = S.DIST[ST.d];
      q('.m1-ps').innerHTML = D.ps.map(function (s) {
        var v = ST.P[s[0]];
        return '<label class="m1-p"><span class="m1-p__l"><code>' + esc(s[0]) + '</code><i>' + esc(s[1]) + '</i></span><input type="range" min="' + s[2] + '" max="' + s[3] + '" step="' + s[4] + '" value="' + v + '" data-p="' + s[0] + '" aria-label="' + esc(s[0]) + '">'
          + '<input type="number" class="m1-num" min="' + s[2] + '" max="' + s[3] + '" step="' + s[4] + '" value="' + v + '" data-pn="' + s[0] + '" aria-label="' + esc(s[0]) + '"></label>';
      }).join('');
    }
    function qseg() {
      var dis = S.DIST[ST.d].kind === 'd', L = dis ? ['le', 'gt', 'ge', 'ab', 'eq', 'q'] : ['le', 'gt', 'ab', 'eq', 'q'];
      if (!dis && ST.Q.t === 'ge') ST.Q.t = 'gt';
      q('.m1-qs').innerHTML = L.map(function (k) { var lab = k === 'eq' && !dis ? t.qs.eqc : t.qs[k]; return '<button type="button" class="' + (ST.Q.t === k ? 'is-on' : '') + '" data-q="' + k + '" aria-pressed="' + (ST.Q.t === k) + '">' + esc(lab) + '</button>'; }).join('');
      var dstep = dis ? 1 : 'any', f = function (k, lab, v, st) { return '<label class="m1-in"><span>' + esc(lab) + '</span><input type="number" class="m1-num" step="' + st + '" value="' + v + '" data-qi="' + k + '"></label>'; };
      q('.m1-ins').innerHTML = ST.Q.t === 'q' ? f('p', t.p, ST.Q.p, 0.01) : f('a', t.a, ST.Q.a, dstep) + (ST.Q.t === 'ab' ? f('b', t.b, ST.Q.b, dstep) : '');
    }
    // ---- el gráfico
    function plot(R, anim) {
      var D = S.DIST[ST.d], P = ST.P, dis = D.kind === 'd', sp = D.sup(P), lo = sp[0], hi = sp[1];
      var x0 = 54, x1 = 624, y0 = 282, y1 = 22, out = '';
      if (dis) {
        var xs = []; for (var x = lo; x <= hi; x++) xs.push(x);
        if (xs.length > 80) { xs = xs.slice(0, 80); hi = xs[xs.length - 1]; }
        var ym = 0; xs.forEach(function (x) { ym = Math.max(ym, D.pmf(x, P)); }); ym = ym * 1.12 || 1;
        var X = M.scale(lo - 0.6, hi + 0.6, x0, x1), Y = M.scale(0, ym, y0, y1), bw = Math.max(2, (X(1) - X(0)) * 0.72);
        out += M.gridY(Y, x0, x1, 0, ym, 4, en);
        var inR = function (x) { return x >= R.lo - 1e-9 && x <= R.hi + 1e-9; };
        out += xs.map(function (x, i) { var h = y0 - Y(D.pmf(x, P)), on = R.kind === 'q' ? x <= R.v : inR(x); return '<rect class="m1-bar' + (on ? ' is-on' : '') + (R.kind === 'q' && x === R.v ? ' is-q' : '') + '" x="' + (X(x) - bw / 2) + '" y="' + (y0 - h) + '" width="' + bw + '" height="' + Math.max(0, h) + '" rx="' + Math.min(4, bw / 3) + '" style="--i:' + i + '"/>'; }).join('');
        var step = Math.max(1, Math.ceil(xs.length / 14));
        out += xs.filter(function (x, i) { return i % step === 0; }).map(function (x) { return '<text class="m1-tl" x="' + X(x) + '" y="' + (y0 + 19) + '" text-anchor="middle">' + x + '</text>'; }).join('');
        var mu = D.mean(P); if (isFinite(mu)) out += '<path class="m1-mu" d="M' + X(mu) + ' ' + (y0 + 26) + 'l-6 9h12z"/><text class="m1-tl m1-mut" x="' + X(mu) + '" y="' + (y0 + 46) + '" text-anchor="middle">μ</text>';
      } else {
        var N = 220, pts = [], ymax = 0, X2 = M.scale(lo, hi, x0, x1);
        for (var i = 0; i <= N; i++) { var xv = lo + (hi - lo) * i / N, yv = D.pdf(xv, P); if (!isFinite(yv)) yv = NaN; pts.push([xv, yv]); if (isFinite(yv)) ymax = Math.max(ymax, yv); }
        var top = ymax * 1.12 || 1; if (ST.d === 'gamma' && P.shape < 1) top = Math.min(top, D.pdf(D.q(0.2, P), P) * 3);
        var Y2 = M.scale(0, top, y0, y1), cl = function (y) { return Math.max(y1 - 8, Y2(isFinite(y) ? Math.min(y, top * 1.05) : top)); };
        out += M.gridY(Y2, x0, x1, 0, top, 4, en);
        var a = Math.max(lo, R.lo), b = Math.min(hi, R.hi);
        if (R.kind !== 'eq' && b > a) {
          var ar = 'M' + X2(a) + ' ' + y0;
          for (var j = 0; j <= 120; j++) { var xx = a + (b - a) * j / 120; ar += 'L' + X2(xx) + ' ' + cl(D.pdf(xx, P)); }
          out += '<path class="m1-area" d="' + ar + 'L' + X2(b) + ' ' + y0 + 'Z"/>';
        }
        out += '<path class="m1-curve" d="' + pts.filter(function (p) { return isFinite(p[1]); }).map(function (p, i) { return (i ? 'L' : 'M') + X2(p[0]).toFixed(1) + ' ' + cl(p[1]).toFixed(1); }).join('') + '"/>';
        var mark = function (v, c) { if (!isFinite(v) || v < lo || v > hi) return ''; return '<line class="m1-mk ' + (c || '') + '" x1="' + X2(v) + '" x2="' + X2(v) + '" y1="' + y0 + '" y2="' + cl(D.pdf(v, P)) + '"/><circle class="m1-dot ' + (c || '') + '" cx="' + X2(v) + '" cy="' + cl(D.pdf(v, P)) + '" r="4.5"/>'; };
        if (R.kind === 'eq') out += mark(R.a, 'is-h'); else { if (isFinite(R.lo)) out += mark(R.lo); if (isFinite(R.hi)) out += mark(R.hi); }
        out += M.axisX(X2, y0, lo, hi, 8, null, en);
        var mu2 = D.mean(P); if (isFinite(mu2) && mu2 >= lo && mu2 <= hi) out += '<path class="m1-mu" d="M' + X2(mu2) + ' ' + (y0 + 26) + 'l-6 9h12z"/><text class="m1-tl m1-mut" x="' + X2(mu2) + '" y="' + (y0 + 46) + '" text-anchor="middle">μ</text>';
      }
      out = '<line class="m1-ax" x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '"/>' + out;
      svg.setAttribute('viewBox', '0 0 640 336');
      svg.setAttribute('aria-label', NAMES[ST.d][li] + ': ' + (R.calls ? R.calls[0] : ''));
      svg.innerHTML = out;
      svg.classList.toggle('is-in', !!anim && !K.reduced());
      if (anim && !K.reduced()) { svg.classList.remove('is-anim'); void svg.getBoundingClientRect(); svg.classList.add('is-anim'); }
    }
    function render(anim) {
      var D = S.DIST[ST.d]; ST.P = S.params(ST.d, ST.P);
      pills(); params(); qseg();
      var R = S.ask(ST.d, ST.P, ST.Q), dis = D.kind === 'd';
      var v = R.kind === 'q' ? num(R.v, dis ? 0 : 4, en) : num(R.v, 4, en);
      C.setStrip(R.calls[0], v);
      plot(R, anim);
      var key = R.kind === 'q' ? (dis ? 'qd' : 'q') : R.kind === 'eq' ? (dis ? 'eq' : 'eqc') : R.kind === 'le' && !dis ? 'lec' : R.kind;
      var rd = fill(t.read[key], { a: num(R.a, 4, en), a1: num(R.a - 1, 4, en), b: num(R.b, 4, en), v: '<b>' + esc(v) + '</b>', pc: num(R.kind === 'q' ? R.p * 100 : Math.round(R.v * 100), 1, en), p: num(R.p, 4, en) });
      var mu = D.mean(ST.P), va = D.var(ST.P);
      q('.m1-out').innerHTML = '<div class="m1-res-c"><p class="m1-h">' + esc(t.res) + '</p><p class="m1-big">' + esc(v) + '</p><p class="m1-rd">' + rd + '</p>'
        + (R.calls.length > 1 ? '<p class="m1-same">' + esc(t.same) + ' <code>' + esc(R.calls[1]) + '</code></p>' : '') + '</div>';
      q('.m1-stats').innerHTML = '<span><i>' + esc(t.mean) + '</i><b>' + (isFinite(mu) ? esc(num(mu, 4, en)) : esc(t.noMean)) + '</b></span><span><i>' + esc(t.var) + '</i><b>' + (isFinite(va) ? esc(num(va, 4, en)) : esc(t.noMean)) + '</b></span><span><i>' + esc(t.sd) + '</i><b>' + (isFinite(va) ? esc(num(Math.sqrt(va), 4, en)) : esc(t.noMean)) + '</b></span>';
    }
    // ---- eventos de los controles (cambian el estado; el paso de la lección se queda)
    var RT = null;
    function later() { clearTimeout(RT); RT = setTimeout(function () { render(false); }, 60); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-d],[data-q]'); if (!b || !el.contains(b) || !b.closest('.m1-side')) return;
      if (b.hasAttribute('data-d')) { var k = b.getAttribute('data-d'); if (k !== ST.d) { ST.d = k; ST.P = S.params(k, {}); var sp = S.DIST[k].sup(ST.P); ST.Q.a = S.DIST[k].kind === 'd' ? Math.round((sp[0] + sp[1]) / 3) : +((sp[0] + sp[1]) / 2).toFixed(1); ST.Q.b = S.DIST[k].kind === 'd' ? Math.round((sp[0] + sp[1]) / 1.6) : +(sp[0] + (sp[1] - sp[0]) * 0.7).toFixed(1); render(true); } }
      else { ST.Q.t = b.getAttribute('data-q'); render(true); }
    });
    el.addEventListener('input', function (e) {
      var x = e.target; if (!el.contains(x) || !x.closest('.m1-side')) return;
      if (x.hasAttribute('data-p')) { ST.P[x.getAttribute('data-p')] = +x.value; var n = q('[data-pn="' + x.getAttribute('data-p') + '"]'); if (n) n.value = x.value; var R = S.ask(ST.d, S.params(ST.d, ST.P), ST.Q); C.setStrip(R.calls[0], R.kind === 'q' && S.DIST[ST.d].kind === 'd' ? num(R.v, 0, en) : num(R.v, 4, en)); plot(R, false); later(); }
      else if (x.hasAttribute('data-pn')) { if (x.value !== '' && isFinite(+x.value)) { ST.P[x.getAttribute('data-pn')] = +x.value; later(); } }
      else if (x.hasAttribute('data-qi')) { if (x.value !== '' && isFinite(+x.value)) { ST.Q[x.getAttribute('data-qi')] = +x.value; var R2 = S.ask(ST.d, S.params(ST.d, ST.P), ST.Q); C.setStrip(R2.calls[0], num(R2.v, 4, en)); plot(R2, false); clearTimeout(RT); RT = setTimeout(function () { var f = document.activeElement, k = f && f.getAttribute('data-qi'); render(false); if (k) { var n2 = q('[data-qi="' + k + '"]'); if (n2) { n2.focus(); try { n2.setSelectionRange(n2.value.length, n2.value.length); } catch (er) {} } } }, 700); } }
    });
    el.addEventListener('change', function (e) { var x = e.target; if (el.contains(x) && x.closest('.m1-side')) render(false); });
    // ---- «Ponte a prueba»
    function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function dec(x) { return String(+x.toFixed(4)); }
    function scen(d, P) { return 'X ~ ' + NAMES[d][li] + '(' + S.rargs(d, P) + ')'; }
    function mk(d, P, Q, k) {
      var R = S.ask(d, P, Q), tol = Q.t === 'q' ? 0.0051 : 0.00051, ans = Q.t === 'q' ? (S.DIST[d].kind === 'd' ? String(R.v) : R.v.toFixed(2)) : R.v.toFixed(4);
      var e = Q.t === 'le' ? 'P(X ≤ ' + R.a + ')' : Q.t === 'eq' ? 'P(X = ' + R.a + ')' : Q.t === 'ge' ? 'P(X ≥ ' + R.a + ')' : Q.t === 'gt' ? 'P(X > ' + R.a + ')' : Q.t === 'ab' ? 'P(' + R.a + ' ≤ X ≤ ' + R.b + ')' : '';
      var qs = Q.t === 'q' ? fill(t.qQ, { pc: num(Q.p * 100, 1, en) }) + ' ' + t.dec2 : fill(t.qLv, { e: e }) + ' ' + t.dec4;
      return { q: qs, code: scen(d, P), ans: en ? ans : ans.replace('.', ','), norm: M.numNorm(Q.t === 'q' ? +ans : R.v, tol), hint: R.calls[0], mode: 'decimal', st: { d: d, P: P, Q: Q } };
    }
    var LV = [
      { gen: function () { if (Math.random() < 0.55) { var n = rint(5, 20), p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]); return mk('binom', { size: n, prob: p }, { t: pick(['eq', 'le']), a: rint(0, Math.round(n * p) + 2) }); } var l = pick([1.5, 2, 3, 4, 5, 6, 8]); return mk('pois', { lambda: l }, { t: pick(['eq', 'le']), a: rint(0, Math.round(l) + 3) }); } },
      { gen: function () { var bi = Math.random() < 0.5, P = bi ? { size: rint(6, 20), prob: pick([0.2, 0.3, 0.4, 0.5, 0.6]) } : { lambda: pick([2, 3, 4, 5, 6, 7]) }, d = bi ? 'binom' : 'pois', m = bi ? P.size * P.prob : P.lambda;
        if (Math.random() < 0.55) return mk(d, P, { t: 'ge', a: Math.max(1, Math.round(m) + rint(-1, 2)) });
        var a = Math.max(0, Math.round(m) - rint(1, 2)); return mk(d, P, { t: 'ab', a: a, b: a + rint(1, 3) }); } },
      { gen: function () { var mu = pick([50, 60, 100, 170, 6, 12]), sd = pick([2, 5, 8, 10, 15]) * (mu < 20 ? 0.2 : 1), r = Math.random();
        if (r < 0.35) return mk('norm', { mean: mu, sd: sd }, { t: 'q', p: pick([0.1, 0.25, 0.75, 0.9, 0.95, 0.99]) });
        if (r < 0.7) return mk('norm', { mean: mu, sd: sd }, { t: 'gt', a: +(mu + sd * pick([-1, 0.5, 1, 1.5, 2])).toFixed(1) });
        var a = +(mu - sd * pick([0.5, 1, 1.5])).toFixed(1); return mk('norm', { mean: mu, sd: sd }, { t: 'ab', a: a, b: +(mu + sd * pick([0.5, 1, 2])).toFixed(1) }); } }
    ];
    LV.forEach(function (l, i) { l.n = [TX.es.lv[i][0], TX.en.lv[i][0]]; l.d = [TX.es.lv[i][1], TX.en.lv[i][1]]; });
    K.levels(UI, { key: 'sl_sim_distrib_niveles', need: 3, levels: LV, onSol: function (r) {
      ST.d = r.st.d; ST.P = S.params(r.st.d, r.st.P); ST.Q = Object.assign({ a: 3, b: 5, p: 0.5 }, r.st.Q); render(true);
      UI.win.scrollIntoView({ behavior: K.reduced() ? 'auto' : 'smooth', block: 'start' });
    } });
    C.start();
  }
  window.SLDIST = { mount: mount, LES: LES };
  K.boot('.sl-sim[data-sim="distrib"]', mount);
})();
