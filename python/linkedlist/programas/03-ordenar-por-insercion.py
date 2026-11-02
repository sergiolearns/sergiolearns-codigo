# Programa 3: ordenar una LinkedList por inserción
# Del artículo «LinkedList en Python práctica — préstamos, la cola de reservas al revés y el catálogo ordenado (tres programas de la biblioteca)»
# https://sergiolearns.com/linkedlist-en-python-practica/

from linked_list import LinkedList


class ListaOrdenable(LinkedList):

    def insertar_ordenado(self, valor):
        """Inserta valor en su sitio, manteniendo la lista de menor a mayor."""
        primero = self._LinkedList__primero
        if primero is None or valor <= primero.valor:   # caso 1: vacía, o va delante de todos
            self.insertar_delante(valor)                # reutilizamos: ya suma la longitud
            return
        actual = primero
        while actual.siguiente is not None and actual.siguiente.valor < valor:
            actual = actual.siguiente                   # paramos en el ÚLTIMO menor que valor
        actual.siguiente = self.Nodo(valor, actual.siguiente)   # nuevo → resto, actual → nuevo
        self._LinkedList__longitud += 1

    def ordenar(self):
        """Ordenación por inserción: lista NUEVA ordenada; la original no cambia."""
        resultado = ListaOrdenable()
        for valor in self:
            resultado.insertar_ordenado(valor)
        return resultado


catalogo = ListaOrdenable()          # años de publicación de los libros del carrito de devoluciones
for anio in [2008, 1985, 2019, 1994, 2011, 1978, 2003]:
    catalogo.insertar_detras(anio)
print("Original:", catalogo)
print("Ordenada:", catalogo.ordenar())
print("Original intacta:", catalogo)

print()
print("Vacía:", ListaOrdenable().ordenar())
iguales = ListaOrdenable()
for anio in [2020, 2020, 2020]:
    iguales.insertar_detras(anio)
print("Iguales:", iguales.ordenar())

print()
paso = ListaOrdenable()
for anio in [2008, 1985, 2019, 1994, 2011]:
    paso.insertar_ordenado(anio)
    print(f"Tras insertar {anio}: {paso} (len {len(paso)})")
