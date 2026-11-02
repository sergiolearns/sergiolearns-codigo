# Programa 2: invertir una lista encadenada (nueva e in-place)
# Del artículo «LinkedList en Python práctica — préstamos, la cola de reservas al revés y el catálogo ordenado (tres programas de la biblioteca)»
# https://sergiolearns.com/linkedlist-en-python-practica/

from linked_list import LinkedList


class ColaInvertible(LinkedList):

    def invertir_nueva(self):
        """Estrategia 1: lista NUEVA insertando cada valor delante (la original no cambia)."""
        resultado = ColaInvertible()
        for socio in self:                     # de izquierda a derecha...
            resultado.insertar_delante(socio)  # ...y cada uno se pone delante del anterior
        return resultado

    def invertir_inplace(self):
        """Estrategia 2: dar la vuelta a las flechas de los MISMOS nodos."""
        anterior = None
        actual = self._LinkedList__primero     # atributo privado de la madre (name mangling)
        while actual is not None:
            siguiente = actual.siguiente       # 1. guardar el resto ANTES de tocar nada
            actual.siguiente = anterior        # 2. darle la vuelta a la flecha
            anterior = actual                  # 3. avanzar anterior...
            actual = siguiente                 # 4. ...y actual
        self._LinkedList__primero = anterior   # la nueva cabeza es la antigua cola


cola = ColaInvertible()
for socio in ["Laura", "Pablo", "Marta", "Iván", "Nora"]:
    cola.insertar_detras(socio)
print("Cola:", cola)

invertida = cola.invertir_nueva()
print("Invertida (nueva):", invertida)
print("Original intacta: ", cola)

cola.invertir_inplace()
print("Tras invertir_inplace:", cola, "| len =", len(cola))

vacia = ColaInvertible()
vacia.invertir_inplace()
print("Vacía invertida:", vacia)
sola = ColaInvertible()
sola.insertar_delante("Ana")
sola.invertir_inplace()
print("Un solo nodo invertido:", sola)
