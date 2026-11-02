# Solución del ejercicio 2: iterador de secuencia aritmética
# Del artículo «Iteradores y generadores en Python — ejercicios con múltiplos, una secuencia que se reinicia y números perfectos (y una multa que salió letra a letra)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

class SecuenciaAritmetica:
    def __init__(self, inicio, paso, terminos):
        if paso == 0:
            raise ValueError('El paso no puede ser 0')
        if not isinstance(terminos, int) or terminos <= 0:
            raise ValueError('Los términos deben ser un entero positivo')
        self.__inicio = inicio        # los datos originales no cambian nunca...
        self.__paso = paso
        self.__terminos = terminos
        self.__actual = inicio        # ...y el estado del recorrido se reinicia en __iter__
        self.__restantes = terminos

    def __iter__(self):
        self.__actual = self.__inicio
        self.__restantes = self.__terminos
        return self

    def __next__(self):
        if self.__restantes == 0:
            raise StopIteration
        valor = self.__actual
        self.__actual += self.__paso
        self.__restantes -= 1
        return valor

    def __len__(self):
        return self.__restantes       # los que QUEDAN por dar en el recorrido actual

    def __str__(self):
        return ' → '.join(str(self.__inicio + k * self.__paso) for k in range(self.__terminos))


def probar(inicio, paso, terminos, completo=False):
    seq = SecuenciaAritmetica(inicio, paso, terminos)
    print(f'Secuencia({inicio}, paso={paso}, términos={terminos}):')
    print('  for:  ', ' '.join(str(v) for v in seq))
    if completo:
        print('  list: ', list(seq))  # funciona otra vez porque __iter__ reinicia
        print('  sum:  ', sum(seq))
        print('  str:  ', seq)
        it = iter(seq)
        next(it)
        next(it)
        print('  len tras dos next():', len(seq))


probar(2, 3, 5, completo=True)
probar(10, -2, 6)
probar(0, 0.5, 8)
try:
    SecuenciaAritmetica(1, 0, 5)
except ValueError as err:
    print('Error esperado:', err)
