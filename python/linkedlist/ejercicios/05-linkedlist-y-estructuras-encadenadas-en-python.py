# Chuletario — LinkedList y estructuras encadenadas en Python
# Del artículo «LinkedList en Python — ejercicios para dominar las estructuras encadenadas»
# https://sergiolearns.com/linkedlist-en-python-ejercicios/

# ============================================
# CHULETARIO — LinkedList en Python
# Sergio Learns · sergiolearns.com
# ============================================

# ── NODO ─────────────────────────────────────────────────────

class Nodo:
    def __init__(self, valor, siguiente=None):
        self.valor = valor          # el dato
        self.siguiente = siguiente  # referencia al siguiente o None

# Diagrama: [valor | siguiente ──►] → [valor | siguiente ──►] → None

# ── ESTRUCTURA LinkedList ────────────────────────────────────

class LinkedList:
    class Nodo:
        def __init__(self, valor, siguiente=None):
            self.valor = valor
            self.siguiente = siguiente

    def __init__(self):
        self.__primero = None   # referencia al primer nodo
        self.__longitud = 0     # número de elementos

# Lista vacía:      primero → None
# Lista con datos:  primero → [v1] → [v2] → [v3] → None

# ── OPERACIONES BÁSICAS ──────────────────────────────────────

# INSERTAR AL PRINCIPIO — O(1)
def insertar_delante(self, valor):
    self.__primero = self.Nodo(valor, self.__primero)
    self.__longitud += 1
# Diagrama:
# Antes:  primero → [10] → [20] → None
# Después: primero → [5] → [10] → [20] → None

# INSERTAR AL FINAL — O(n)
def insertar_detras(self, valor):
    nuevo = self.Nodo(valor)
    if self.__primero is None:          # caso especial: lista vacía
        self.__primero = nuevo
    else:
        actual = self.__primero
        while actual.siguiente is not None:   # avanzar al último
            actual = actual.siguiente
        actual.siguiente = nuevo
    self.__longitud += 1

# RECORRIDO — O(n) — el patrón más importante
actual = self.__primero
while actual is not None:
    # hacer algo con actual.valor
    actual = actual.siguiente    # avanzar al siguiente

# ELIMINAR — O(n)
# Caso 1: eliminar el primero
self.__primero = self.__primero.siguiente

# Caso 2: eliminar cualquier otro (patrón anterior/actual)
anterior = self.__primero
actual = self.__primero.siguiente
while actual is not None:
    if actual.valor == buscado:
        anterior.siguiente = actual.siguiente  # saltar el nodo
        self.__longitud -= 1
        break
    anterior = actual       # avanzar AMBOS cuando NO eliminas
    actual = actual.siguiente

# BUSCAR — O(n)
actual = self.__primero
while actual is not None:
    if actual.valor == buscado:
        return True
    actual = actual.siguiente
return False

# OBTENER POR POSICIÓN — O(n)
# Validar primero
if posicion < 0 or posicion >= self.__longitud:
    raise IndexError(...)
actual = self.__primero
for _ in range(posicion):
    actual = actual.siguiente
return actual.valor

# ── PATRONES AVANZADOS ───────────────────────────────────────

# PATRÓN 1 — acumulador en recorrido
# Para: contar, sumar, máximo, mínimo, filtrar
acumulador = valor_inicial
actual = primero
while actual is not None:
    acumulador = operacion(acumulador, actual.valor)
    actual = actual.siguiente

# PATRÓN 2 — tres variables para invertir punteros
# Para: invertir lista, operaciones que invierten referencias
anterior = None
actual = primero
while actual is not None:
    siguiente = actual.siguiente    # ← GUARDAR ANTES de modificar
    actual.siguiente = anterior     # ← invertir
    anterior = actual               # ← avanzar anterior
    actual = siguiente              # ← avanzar actual
primero = anterior                  # ← nuevo primero

# PATRÓN 3 — dos punteros a distinta velocidad
# Para: detectar ciclos (Floyd), encontrar elemento desde el final
tortuga = primero       # avanza 1
liebre = primero        # avanza 2
while liebre is not None and liebre.siguiente is not None:
    if tortuga is liebre:    # se encontraron → hay ciclo
        return True
    tortuga = tortuga.siguiente
    liebre = liebre.siguiente.siguiente
return False

# PATRÓN 4 — inserción ordenada
# Para: mantener la lista ordenada al insertar
actual = primero
while actual.siguiente is not None and actual.siguiente.valor < nuevo_valor:
    actual = actual.siguiente
nuevo.siguiente = actual.siguiente  # conectar al resto
actual.siguiente = nuevo            # conectar nuevo nodo

# PATRÓN 5 — anterior/actual para eliminar con condición
# Para: eliminar duplicados, eliminar todos los que cumplan algo
vistos = set()
anterior = primero
actual = primero.siguiente
while actual is not None:
    if condicion(actual.valor):
        anterior.siguiente = actual.siguiente   # eliminar
        actual = actual.siguiente
        # anterior NO avanza cuando eliminas
    else:
        anterior = actual                       # avanzar AMBOS
        actual = actual.siguiente               # cuando NO eliminas

# ── MÉTODOS MÁGICOS ──────────────────────────────────────────

def __len__(self):
    return self.__longitud

def __str__(self):
    return ' → '.join(str(v) for v in self) + ' → None'

def __repr__(self):
    return f'LinkedList({list(self)})'

def __iter__(self):          # hace la lista iterable con for
    actual = self.__primero
    while actual is not None:
        valor = actual.valor
        actual = actual.siguiente   # avanzar ANTES del yield
        yield valor                 # pausa aquí

def __contains__(self, valor):
    return self.contiene(valor)

# ── LinkedList vs LISTA DE PYTHON ────────────────────────────

#                     Lista Python    LinkedList
# ─────────────────────────────────────────────────
# Acceso por índice:     O(1) ✓        O(n) ✗
# Insertar al principio: O(n) ✗        O(1) ✓
# Insertar al final:     O(1) ✓        O(n) ✗
# Insertar en el medio:  O(n) ✗        O(1) ✓ (con nodo anterior)
# Buscar:                O(n)          O(n)
# Memoria:           más eficiente  menos eficiente

# ── ERRORES TÍPICOS ──────────────────────────────────────────

# ERROR 1 — modificar el puntero antes de guardar el siguiente
# PIERDE el resto de la lista

# MAL
actual.siguiente = anterior    # ← ya no puedes llegar al siguiente
siguiente = actual.siguiente   # ← esto ahora da anterior, no el real

# BIEN
siguiente = actual.siguiente   # ← guardar PRIMERO
actual.siguiente = anterior    # ← luego modificar

# ERROR 2 — olvidar el caso especial de lista vacía
# Siempre comprobar self.__primero is None antes de acceder a .valor o .siguiente

def metodo(self):
    if self.__primero is None:    # ← comprobar siempre
        return None               # o raise o lo que corresponda
    # ... resto del método

# ERROR 3 — olvidar el caso especial de eliminar el primero
# El patrón anterior/actual empieza en el segundo nodo
# Si el elemento a eliminar ES el primero necesitas manejarlo aparte

if self.__primero.valor == buscado:
    self.__primero = self.__primero.siguiente   # caso especial
    return
# ... el resto del código con anterior/actual

# ERROR 4 — avanzar anterior cuando eliminas un nodo
# Al eliminar, anterior NO avanza — sigue apuntando al mismo nodo

if duplicado:
    anterior.siguiente = actual.siguiente   # eliminar
    actual = actual.siguiente               # avanzar solo actual
    # NO hacer: anterior = actual
else:
    anterior = actual                       # avanzar ambos
    actual = actual.siguiente               # solo cuando NO eliminas

# ERROR 5 — recorrer una lista con ciclo sin detectarlo
# Un while actual is not None en una lista con ciclo → bucle infinito
# Detectar ciclo primero con el algoritmo de Floyd si no estás seguro
