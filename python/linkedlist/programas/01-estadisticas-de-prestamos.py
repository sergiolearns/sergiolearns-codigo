# Programa 1: buscar y contar elementos con condiciones (préstamos)
# Del artículo «LinkedList en Python práctica — préstamos, la cola de reservas al revés y el catálogo ordenado (tres programas de la biblioteca)»
# https://sergiolearns.com/linkedlist-en-python-practica/

from linked_list import LinkedList

PLAZO = 15   # días que dura un préstamo normal (norma inventada para el ejemplo)


class ListaPrestamos(LinkedList):
    """LinkedList con los días que ha durado cada préstamo y consultas que la recorren."""

    def contar(self, condicion=None):
        """Cuántos cumplen la condición (una función que devuelve True/False). Sin condición, todos."""
        contador = 0
        for dias in self:                   # __iter__ de la madre: nodo a nodo
            if condicion is None or condicion(dias):
                contador += 1
        return contador

    def suma(self):
        total = 0
        for dias in self:
            total += dias
        return total

    def media(self):
        if self.es_vacia():                 # evitamos dividir entre 0
            raise ValueError("la lista está vacía")
        return self.suma() / len(self)

    def maximo(self):
        if self.es_vacia():
            raise ValueError("la lista está vacía")
        mayor = None
        for dias in self:
            if mayor is None or dias > mayor:   # el primero siempre entra
                mayor = dias
        return mayor

    def minimo(self):
        if self.es_vacia():
            raise ValueError("la lista está vacía")
        menor = None
        for dias in self:
            if menor is None or dias < menor:
                menor = dias
        return menor

    def filtrar(self, condicion):
        """Lista NUEVA con los que cumplen la condición; la original no cambia."""
        resultado = ListaPrestamos()
        for dias in self:
            if condicion(dias):
                resultado.insertar_detras(dias)   # detrás: conserva el orden original
        return resultado


prestamos = ListaPrestamos()
for dias in [15, 8, 42, 3, 27, 19, 8, 11, 35, 8]:
    prestamos.insertar_detras(dias)

print("Préstamos (días):", prestamos)
print("Número:", len(prestamos))
print("Suma:", prestamos.suma(), "días")
print(f"Media: {prestamos.media():.2f} días")
print("Máximo:", prestamos.maximo(), "días | Mínimo:", prestamos.minimo(), "días")
print()
print("Con retraso (más de 15):", prestamos.contar(lambda d: d > PLAZO))
print("Devueltos el último día:", prestamos.contar(lambda d: d == PLAZO))
print("De 8 días:", prestamos.contar(lambda d: d == 8))
print("Todos:", prestamos.contar())
retrasados = prestamos.filtrar(lambda d: d > PLAZO)
print()
print("Retrasados:", retrasados)
print("Días de retraso:", [dias - PLAZO for dias in retrasados])
print("Original intacta:", prestamos)
vacia = ListaPrestamos()
try:
    vacia.maximo()
except ValueError as error:
    print("Lista vacía → ValueError:", error)
