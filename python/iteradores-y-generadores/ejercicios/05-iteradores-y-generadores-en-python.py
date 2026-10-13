# Chuletario — Iteradores y generadores en Python
# Del artículo «Iteradores y generadores en Python — ejercicios para dominar yield e iter»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

# ============================================
# CHULETARIO — Iteradores y generadores
# Sergio Learns · sergiolearns.com
# ============================================

# ITERABLE vs ITERADOR
# Iterable  → tiene __iter__() → puedes usar for con él
# Iterador  → tiene __iter__() y __next__() → produce elementos uno a uno
# Un iterador es siempre iterable pero no al revés

# FUNCIONES BUILT-IN
it = iter(iterable)     # convierte iterable en iterador
valor = next(it)        # devuelve el siguiente elemento
# cuando se agota → StopIteration

# LO QUE HACE EL FOR POR DENTRO
for x in obj:
    cuerpo
# equivale a:
it = iter(obj)
while True:
    try:
        x = next(it)
        cuerpo
    except StopIteration:
        break

# ITERADOR PROPIO — con __iter__ y __next__
class MiIterador:
    def __init__(self, inicio, fin, paso=1):
        self.__inicio = inicio
        self.__fin = fin
        self.__paso = paso

    def __iter__(self):
        self.__actual = self.__inicio    # REINICIAR aquí — no en __init__
        return self                      # devuelve self

    def __next__(self):
        if self.__actual > self.__fin:
            raise StopIteration         # señal de fin
        valor = self.__actual
        self.__actual += self.__paso
        return valor

# GENERADOR — la forma pythónica
def mi_generador(inicio, fin, paso=1):
    actual = inicio
    while actual <= fin:
        yield actual                    # pausa + devuelve + continúa después
        actual += paso

# GENERADOR INFINITO
def infinito():
    n = 0
    while True:
        yield n
        n += 1

# RETURN EN UN GENERADOR → StopIteration
def hasta_limite(limite):
    for x in infinito():
        if x > limite:
            return        # lanza StopIteration, no termina con valor
        yield x

# YIELD vs RETURN
# return → termina la función, el estado desaparece
# yield  → pausa la función, el estado persiste, continúa con next()

# __iter__ COMO GENERADOR EN UNA CLASE
class MiContenedor:
    def __iter__(self):
        nodo = self.__primero
        while nodo is not None:
            yield nodo.valor          # generador dentro de __iter__
            nodo = nodo.siguiente
# ventaja: cada llamada a iter() crea un generador nuevo → múltiples recorridos

# GENERADOR vs LISTA
# Lista     → todos los elementos en memoria desde el principio
# Generador → un elemento en memoria en cada momento
lista = [i * 2 for i in range(1_000_000)]   # ~8MB
gen   = (i * 2 for i in range(1_000_000))   # unos bytes — expresión generadora

# ENCADENAR GENERADORES
def pares():
    n = 0
    while True:
        yield n
        n += 2

def pares_hasta(limite):
    for p in pares():           # consume pares() elemento a elemento
        if p > limite:
            return
        yield p

# ERRORES TÍPICOS

# 1. GENERADOR AGOTADO — no se puede reiniciar
gen = mi_generador(1, 5)
list(gen)    # → [1, 2, 3, 4, 5] — consume el generador
list(gen)    # → [] — agotado, no hay más
# SOLUCIÓN: crear un nuevo generador con mi_generador(1, 5) de nuevo

# 2. __iter__ que no reinicia el estado
class Mal:
    def __iter__(self):
        return self    # sin reiniciar → segunda vez da vacío
class Bien:
    def __iter__(self):
        self.__actual = self.__inicio    # reinicia
        return self

# 3. for sobre generador infinito sin break → bucle infinito
for n in infinito():
    print(n)    # nunca para — siempre añade break o condición

# 4. Confundir yield con return en generadores
def mal():
    return 1    # función normal — devuelve 1 y termina
    return 2    # nunca se ejecuta

def bien():
    yield 1     # pausa y devuelve 1
    yield 2     # pausa y devuelve 2 en el siguiente next()

# 5. next() sobre un iterador agotado → StopIteration sin capturar
it = iter([1])
next(it)    # → 1
next(it)    # → StopIteration — captura si no estás en un for

# PATRÓN COMPLETO — iterador de clase con reinicio
class SecuenciaCompleta:
    def __init__(self, inicio, fin):
        self.__inicio = inicio
        self.__fin = fin

    def __iter__(self):
        self.__actual = self.__inicio    # reinicia cada vez
        return self

    def __next__(self):
        if self.__actual > self.__fin:
            raise StopIteration
        valor = self.__actual
        self.__actual += 1
        return valor

    def __len__(self):
        return max(0, self.__fin - self.__inicio + 1)
