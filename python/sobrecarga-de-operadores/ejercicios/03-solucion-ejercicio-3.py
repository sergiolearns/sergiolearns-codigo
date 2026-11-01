# Solución del ejercicio 3 · Polinomios que se comparan, se llaman y se derivan (incluye la clase del ejercicio 2)
# Del artículo «Sobrecarga de operadores en Python ejercicios — números complejos, polinomios que se suman, se multiplican y se derivan, con soluciones, test y chuletario (y la estantería que se convirtió en None)»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

class Polinomio:
    SUP = str.maketrans('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')

    def __init__(self, coeficientes):
        c = list(coeficientes) or [0]              # [1, -3, 2] = 1 - 3x + 2x²
        while len(c) > 1 and c[-1] == 0:            # fuera los ceros del final
            c.pop()
        self._c = c

    @property
    def coeficientes(self):
        return list(self._c)                        # copia: nadie toca la lista de dentro

    def grado(self):
        return len(self._c) - 1

    def evaluar(self, x):                           # Horner: de mayor a menor grado
        r = 0
        for a in reversed(self._c):
            r = r * x + a
        return r

    @staticmethod
    def _como_poli(x):
        if isinstance(x, Polinomio):
            return x
        if isinstance(x, (int, float)):
            return Polinomio([x])
        return None

    def __add__(self, otro):
        o = Polinomio._como_poli(otro)
        if o is None:
            return NotImplemented
        n = max(len(self._c), len(o._c))
        a = self._c + [0] * (n - len(self._c))      # rellenar con ceros el más corto
        b = o._c + [0] * (n - len(o._c))
        return Polinomio([x + y for x, y in zip(a, b)])

    def __radd__(self, otro):
        return self + otro

    def __neg__(self):
        return Polinomio([-a for a in self._c])

    def __sub__(self, otro):
        o = Polinomio._como_poli(otro)
        return NotImplemented if o is None else self + (-o)

    def __rsub__(self, otro):                       # otro - self
        o = Polinomio._como_poli(otro)
        return NotImplemented if o is None else o + (-self)

    def __mul__(self, otro):
        o = Polinomio._como_poli(otro)
        if o is None:
            return NotImplemented
        r = [0] * (len(self._c) + len(o._c) - 1)
        for i, a in enumerate(self._c):             # cada término por todos los del otro
            for j, b in enumerate(o._c):
                r[i + j] += a * b
        return Polinomio(r)

    def __rmul__(self, otro):
        return self * otro

    def __str__(self):
        partes = []
        for g in range(len(self._c) - 1, -1, -1):   # del grado mayor al menor
            a = self._c[g]
            if a == 0 and len(self._c) > 1:
                continue
            signo = '-' if a < 0 else '+'
            n = abs(a)
            coef = '' if n == 1 and g > 0 else str(n)
            var = '' if g == 0 else 'x' if g == 1 else 'x' + str(g).translate(Polinomio.SUP)
            partes.append((signo, coef + var))
        s = ('-' if partes[0][0] == '-' else '') + partes[0][1]
        return s + ''.join(f' {sg} {t}' for sg, t in partes[1:])

    def __repr__(self):
        return f'Polinomio({self._c})'


class PolinomioPlus(Polinomio):                    # herencia: reutiliza todo lo del ejercicio 2
    def __eq__(self, otro):
        o = Polinomio._como_poli(otro)
        if o is None:
            return NotImplemented
        return self.coeficientes == o.coeficientes  # ya sin ceros al final

    def __hash__(self):
        return hash(tuple(self._c))

    def __call__(self, x):                          # p(3) como una función
        return self.evaluar(x)

    def derivada(self):                             # a·xⁿ -> n·a·xⁿ⁻¹
        return PolinomioPlus([n * a for n, a in enumerate(self._c)][1:])

    def __pow__(self, n):                           # p ** n con n entero >= 0
        if not isinstance(n, int) or n < 0:
            return NotImplemented
        r = PolinomioPlus([1])
        for _ in range(n):
            r = r * self
        return PolinomioPlus(r.coeficientes)        # __mul__ devuelve Polinomio


p = PolinomioPlus([1, -3, 2])
q = PolinomioPlus([2, 1])
print('p =', p, ' p(0), p(1), p(3):', p(0), p(1), p(3))
print("p' =", p.derivada(), "  p'' =", p.derivada().derivada(), "  q' =", q.derivada())
print('q ** 2 =', q ** 2, '  q ** 0 =', q ** 0)
print('p == [1, -3, 2, 0]:', p == PolinomioPlus([1, -3, 2, 0]), '  p == 1:', p == 1, '  -p =', -p)
print('Raíces de p:', [x for x in range(-5, 6) if p(x) == 0], ' p(0.5) =', p(0.5))
print('Conjunto:', len({p, PolinomioPlus([1, -3, 2]), q}))
print('(p * q)(2) =', (p * q).evaluar(2), '= p(2) * q(2) =', p(2) * q(2))
