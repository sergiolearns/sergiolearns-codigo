# Ejercicio 2 — Iterador de secuencia aritmética
# Del artículo «Iteradores y generadores en Python — ejercicios para dominar yield e iter»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

# MAL — __iter__ no reinicia el estado
class SecuenciaAritmetica:
    def __init__(self, inicio, paso, terminos):
        self.actual = inicio      # el estado está en __init__
        self.paso = paso
        self.restantes = terminos

    def __iter__(self):
        return self               # se devuelve a sí mismo SIN reiniciar

    def __next__(self):
        if self.restantes == 0:
            raise StopIteration
        valor = self.actual
        self.actual += self.paso
        self.restantes -= 1
        return valor

seq = SecuenciaAritmetica(2, 3, 5)
print(list(seq))    # → [2, 5, 8, 11, 14] — bien
print(list(seq))    # → [] — MAL, el iterador se agotó en el primer list()

# BIEN — __iter__ reinicia el estado cada vez que se llama
def __iter__(self):
    self.__actual = self.__inicio      # reinicia al valor original
    self.__restantes = self.__terminos # reinicia el contador
    return self
