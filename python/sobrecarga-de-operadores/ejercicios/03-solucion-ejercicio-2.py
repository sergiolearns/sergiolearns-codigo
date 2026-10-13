# Solución Ejercicio 2:
# Del artículo «Sobrecarga de operadores en Python — ejercicios para dominar los métodos mágicos»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

class Polinomio:
    def __init__(self, coeficientes):
        if not coeficientes:
            raise ValueError('El polinomio debe tener al menos un coeficiente')
        # Eliminar ceros al final
        self.__coef = list(coeficientes)
        while len(self.__coef) > 1 and self.__coef[-1] == 0:
            self.__coef.pop()

    @property
    def coeficientes(self):
        return list(self.__coef)

    def grado(self):
        return len(self.__coef) - 1

    def evaluar(self, x):
        resultado = 0
        for i, c in enumerate(self.__coef):
            resultado += c * (x ** i)
        return resultado

    def __call__(self, x):
        return self.evaluar(x)

    def derivada(self):
        if self.grado() == 0:
            return Polinomio([0])
        nuevos = [i * c for i, c in enumerate(self.__coef) if i > 0]
        return Polinomio(nuevos)

    # Comparación
    def __eq__(self, other):
        if isinstance(other, Polinomio):
            return self.__coef == other.coeficientes
        return False

    # Aritmética
    def __add__(self, other):
        if isinstance(other, Polinomio):
            n = max(len(self.__coef), len(other.coeficientes))
            c1 = self.__coef + [0] * (n - len(self.__coef))
            c2 = other.coeficientes + [0] * (n - len(other.coeficientes))
            return Polinomio([a + b for a, b in zip(c1, c2)])
        elif isinstance(other, (int, float)):
            nuevos = list(self.__coef)
            nuevos[0] += other
            return Polinomio(nuevos)
        return NotImplemented

    def __radd__(self, other):
        return self.__add__(other)    # suma ES conmutativa

    def __sub__(self, other):
        if isinstance(other, Polinomio):
            return self + (-other)
        elif isinstance(other, (int, float)):
            nuevos = list(self.__coef)
            nuevos[0] -= other
            return Polinomio(nuevos)
        return NotImplemented

    def __rsub__(self, other):
        # other - self ≠ self - other
        if isinstance(other, (int, float)):
            return Polinomio([other]) - self
        return NotImplemented

    def __mul__(self, other):
        if isinstance(other, Polinomio):
            n = len(self.__coef) + len(other.coeficientes) - 1
            resultado = [0] * n
            for i, a in enumerate(self.__coef):
                for j, b in enumerate(other.coeficientes):
                    resultado[i + j] += a * b
            return Polinomio(resultado)
        elif isinstance(other, (int, float)):
            return Polinomio([c * other for c in self.__coef])
        return NotImplemented

    def __rmul__(self, other):
        return self.__mul__(other)    # multiplicación escalar ES conmutativa

    def __neg__(self):
        return Polinomio([-c for c in self.__coef])

    def __str__(self):
        if all(c == 0 for c in self.__coef):
            return '0'
        terminos = []
        for i in range(len(self.__coef) - 1, -1, -1):
            c = self.__coef[i]
            if c == 0:
                continue
            if i == 0:
                terminos.append(str(int(c) if c == int(c) else c))
            elif i == 1:
                if c == 1: terminos.append('x')
                elif c == -1: terminos.append('-x')
                else: terminos.append(f'{int(c) if c == int(c) else c}x')
            else:
                if c == 1: terminos.append(f'x{chr(8304+i) if i < 10 else f"^{i}"}')
                elif c == -1: terminos.append(f'-x{chr(8304+i) if i < 10 else f"^{i}"}')
                else:
                    exp = chr(8304 + i) if i < 10 else f'^{i}'
                    terminos.append(f'{int(c) if c == int(c) else c}x{exp}')

        resultado = terminos[0]
        for t in terminos[1:]:
            if t.startswith('-'):
                resultado += f' - {t[1:]}'
            else:
                resultado += f' + {t}'
        return resultado

    def __repr__(self):
        return f'Polinomio({self.__coef})'

# Uso
p1 = Polinomio([1, -3, 2])     # 2x² - 3x + 1
p2 = Polinomio([2, 1])          # x + 2

print(f'p1 = {p1}')
print(f'p2 = {p2}')
print(f'repr: {repr(p1)}\n')

print('--- Evaluación ---')
print(f'p1(0) = {p1(0)}')
print(f'p1(1) = {p1(1)}')
print(f'p1(3) = {p1(3)}')
print(f'p2(2) = {p2(2)}\n')

print('--- Aritmética ---')
print(f'p1 + p2 = {p1 + p2}')
print(f'p1 - p2 = {p1 - p2}')
print(f'p1 * p2 = {p1 * p2}')
print(f'p1 * 2 = {p1 * 2}')
print(f'2 * p1 = {2 * p1}')
print(f'3 - p1 = {3 - p1}\n')

print('--- Derivada ---')
print(f"p1' = {p1.derivada()}")
print(f"p2' = {p2.derivada()}\n")

print('--- Comparación ---')
print(f'p1 == Polinomio([1, -3, 2]): {p1 == Polinomio([1, -3, 2])}')
