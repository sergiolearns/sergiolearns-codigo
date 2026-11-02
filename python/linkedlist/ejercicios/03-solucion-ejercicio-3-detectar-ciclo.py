# Solución del ejercicio 3: detectar un ciclo (Floyd)
# Del artículo «LinkedList en Python ejercicios — la reserva número N, los socios repetidos y la cola que no termina nunca (con soluciones y chuletario)»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

class LinkedList:
    """Lista simplemente encadenada, como la del PDF de FP2."""

    class Nodo:
        """Clase interna: los nodos son un detalle de implementación de la lista."""
        def __init__(self, valor, siguiente=None):
            self.valor = valor
            self.siguiente = siguiente

    def __init__(self):
        self.__primero = None    # cabeza: referencia al primer nodo (None si está vacía)
        self.__longitud = 0      # la llevamos al día para que len() no tenga que recorrer

    def insertar_delante(self, valor):
        """Inserta al principio en O(1): enlazar primero, mover la cabeza después."""
        self.__primero = self.Nodo(valor, self.__primero)
        self.__longitud += 1

    def insertar_detras(self, valor):
        """Inserta al final en O(n): hay que llegar hasta el último nodo."""
        nuevo = self.Nodo(valor)
        if self.__primero is None:                 # lista vacía: el nuevo es la cabeza
            self.__primero = nuevo
        else:
            actual = self.__primero
            while actual.siguiente is not None:    # paramos EN el último, no después
                actual = actual.siguiente
            actual.siguiente = nuevo
        self.__longitud += 1

    def eliminar(self, valor):
        """Quita la primera aparición de valor. Lanza ValueError si no está."""
        if self.__primero is None:
            raise ValueError(f"{valor} no está en la lista")
        if self.__primero.valor == valor:          # caso 1: es la cabeza
            self.__primero = self.__primero.siguiente
            self.__longitud -= 1
            return
        anterior = self.__primero                  # casos 2 y 3: buscamos su ANTERIOR
        actual = self.__primero.siguiente
        while actual is not None:
            if actual.valor == valor:
                anterior.siguiente = actual.siguiente   # el anterior se salta a actual
                self.__longitud -= 1
                return
            anterior = actual                      # avanzan los dos, siempre en pareja
            actual = actual.siguiente
        raise ValueError(f"{valor} no está en la lista")

    def contiene(self, valor):
        """True si valor está en la lista (recorrido de principio a fin)."""
        actual = self.__primero
        while actual is not None:
            if actual.valor == valor:
                return True
            actual = actual.siguiente
        return False

    def es_vacia(self):
        return self.__primero is None

    def __len__(self):
        return self.__longitud

    def __contains__(self, valor):    # permite escribir: valor in lista
        return self.contiene(valor)

    def __iter__(self):               # permite recorrerla con for
        actual = self.__primero
        while actual is not None:
            valor = actual.valor
            actual = actual.siguiente    # avanzamos ANTES de la pausa del yield
            yield valor

    def __str__(self):
        return " → ".join([str(v) for v in self] + ["None"])

    def __repr__(self):
        return f"LinkedList({list(self)})"

    # ---- Ejercicio 3 ----
    def tiene_ciclo(self, ver=False):
        """Algoritmo de Floyd: True si algún nodo vuelve a apuntar a uno anterior. Memoria O(1)."""
        tortuga = self.__primero
        liebre = self.__primero
        paso = 0
        while liebre is not None and liebre.siguiente is not None:
            tortuga = tortuga.siguiente           # 1 salto
            liebre = liebre.siguiente.siguiente   # 2 saltos
            paso += 1
            if ver:
                print(f"  paso {paso}: tortuga en {tortuga.valor}, liebre en {liebre.valor}")
            if tortuga is liebre:                 # el MISMO nodo, no el mismo valor
                return True
        return False                              # la liebre llegó a None: hay final

    def crear_ciclo(self, posicion):
        """Solo para las pruebas: el último nodo pasa a apuntar al nodo de esa posición."""
        destino = self.__primero
        for _ in range(posicion):
            destino = destino.siguiente
        ultimo = self.__primero
        while ultimo.siguiente is not None:
            ultimo = ultimo.siguiente
        ultimo.siguiente = destino


def lista(*socios):
    resultado = LinkedList()
    for socio in socios:
        resultado.insertar_detras(socio)
    return resultado


normal = lista("Laura", "Pablo", "Marta")
print("Normal:", normal.tiene_ciclo())

con_ciclo = lista("Laura", "Pablo", "Marta", "Iván")
con_ciclo.crear_ciclo(1)                  # Iván vuelve a apuntar a Pablo
print("Con ciclo (Iván → Pablo):")
print("Resultado:", con_ciclo.tiene_ciclo(ver=True))

print("Vacía:", LinkedList().tiene_ciclo())
sola = lista("Ana")
print("Un nodo sin ciclo:", sola.tiene_ciclo())
sola.crear_ciclo(0)                       # Ana se apunta a sí misma
print("Un nodo con ciclo:", sola.tiene_ciclo())
repetidos = lista("Laura", "Pablo", "Marta", "Iván", "Marta", "Nora")
print("Seis socios, Marta dos veces, sin ciclo:", repetidos.tiene_ciclo())
