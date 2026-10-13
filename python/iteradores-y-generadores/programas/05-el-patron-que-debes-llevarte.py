# El patrón que debes llevarte
# Del artículo «Iteradores y generadores en Python — 3 programas reales que los hacen tangibles»
# https://sergiolearns.com/iteradores-y-generadores-en-python-practica/

# PATRÓN 1 — generador infinito con while True
def secuencia_infinita():
    estado_inicial = ...
    while True:
        yield valor_calculado
        actualizar_estado()

# PATRÓN 2 — generador finito con return como señal de fin
def secuencia_finita(limite):
    for elemento in secuencia_infinita():
        if condicion_de_fin:
            return    # lanza StopIteration
        yield elemento

# PATRÓN 3 — __iter__ como generador en una clase
class MiContenedor:
    def __iter__(self):
        nodo = self.__primero
        while nodo is not None:
            yield nodo.valor
            nodo = nodo.siguiente
