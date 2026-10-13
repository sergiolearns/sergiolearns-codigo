# Solución Ejercicio 2:
# Del artículo «Iteradores y generadores en Python — ejercicios para dominar yield e iter»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

class SecuenciaAritmetica:
    def __init__(self, inicio, paso, terminos):
        if paso == 0:
            raise ValueError('El paso no puede ser 0')
        if not isinstance(terminos, int) or terminos <= 0:
            raise ValueError('Los términos deben ser un entero positivo')
        self.__inicio = inicio
        self.__paso = paso
        self.__terminos = terminos
        # estado del iterador — se reinicia en __iter__
        self.__actual = inicio
        self.__restantes = terminos

    def __iter__(self):
        self.__actual = self.__inicio      # reinicia al principio
        self.__restantes = self.__terminos # reinicia el contador
        return self

    def __next__(self):
        if self.__restantes == 0:
            raise StopIteration
        valor = self.__actual
        self.__actual += self.__paso
        self.__restantes -= 1
        return valor

    def __len__(self):
        return self.__restantes

    def __str__(self):
        terminos = []
        actual = self.__inicio
        for _ in range(self.__terminos):
            terminos.append(str(actual))
            actual += self.__paso
        return ' → '.join(terminos)

    def __repr__(self):
        return (f'SecuenciaAritmetica({self.__inicio}, '
                f'paso={self.__paso}, términos={self.__terminos})')


# Prueba completa
seq1 = SecuenciaAritmetica(2, 3, 5)
print(f"Secuencia(2, paso=3, términos=5):")
print(f"  for:   ", end='')
for v in seq1:
    print(v, end=' ')
print()
print(f"  list:  {list(seq1)}")   # funciona porque __iter__ reinicia
print(f"  sum:   {sum(seq1)}")
print(f"  str:   {seq1}")

seq2 = SecuenciaAritmetica(10, -2, 6)
print(f"\nSecuencia(10, paso=-2, términos=6):")
print(f"  for:   ", end='')
for v in seq2:
    print(v, end=' ')
print()

seq3 = SecuenciaAritmetica(0, 0.5, 8)
print(f"\nSecuencia(0, paso=0.5, términos=8):")
print(f"  for:   ", end='')
for v in seq3:
    print(v, end=' ')
print()

try:
    seq_mala = SecuenciaAritmetica(1, 0, 5)
except ValueError as err:
    print(f"\nError esperado: {err}")
