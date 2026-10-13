# Chuletario — Sobrecarga de operadores en Python
# Del artículo «Sobrecarga de operadores en Python — ejercicios para dominar los métodos mágicos»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-ejercicios/

# ============================================
# CHULETARIO — Sobrecarga de operadores
# Sergio Learns · sergiolearns.com
# ============================================

# COMPARACIÓN CON @total_ordering
from functools import total_ordering

@total_ordering
class MiClase:
    def __eq__(self, other):
        if not isinstance(other, MiClase): return False
        return ...    # comparación real

    def __lt__(self, other):
        if not isinstance(other, MiClase): return NotImplemented
        return ...    # @total_ordering genera >, <=, >=

# TODOS LOS OPERADORES DE COMPARACIÓN
# __eq__  → ==    __ne__  → != (auto si defines __eq__)
# __lt__  → <     __gt__  → >
# __le__  → <=    __ge__  → >=

# ARITMÉTICA BINARIA — self OP other
# __add__      → +     __radd__     → + (reflejado)
# __sub__      → -     __rsub__     → - (reflejado)
# __mul__      → *     __rmul__     → * (reflejado)
# __truediv__  → /     __rtruediv__ → / (reflejado)
# __floordiv__ → //    __mod__      → %
# __pow__      → **

# PATRÓN ARITMÉTICO CORRECTO
def __add__(self, other):
    if isinstance(other, MiClase):
        return MiClase(...)
    elif isinstance(other, (int, float)):
        return MiClase(...)
    return NotImplemented    # NUNCA None

# OPERADORES REFLEJADOS — cuando self está a la DERECHA
# Python prueba: type(a).__add__(a, b)
# Si NotImplemented → type(b).__radd__(b, a)
# Si NotImplemented → TypeError

# CONMUTATIVOS — reflejado igual al directo
def __radd__(self, other): return self.__add__(other)
def __rmul__(self, other): return self.__mul__(other)

# NO CONMUTATIVOS — reflejado invertido
def __rsub__(self, other):
    # other - self ≠ self - other
    if isinstance(other, (int, float)):
        return MiClase(other - self.valor)    # orden invertido
    return NotImplemented

def __rtruediv__(self, other):
    # other / self ≠ self / other
    if isinstance(other, (int, float)):
        return MiClase(other / self.valor)    # orden invertido
    return NotImplemented

# UNARIOS
# __neg__    → -obj
# __pos__    → +obj
# __abs__    → abs(obj)
# __round__  → round(obj, n)
# __invert__ → ~obj

def __neg__(self): return MiClase(-self.valor)
def __abs__(self): return MiClase(abs(self.valor))
def __round__(self, n=0): return MiClase(round(self.valor, n))

# CONVERSIÓN
# __int__   → int(obj)
# __float__ → float(obj)
# __bool__  → bool(obj)
# __str__   → str(obj) / print(obj)
# __repr__  → repr(obj)
# __len__   → len(obj)
# __call__  → obj(args) — hace el objeto llamable como función

def __call__(self, x):
    return self.evaluar(x)    # obj(x) equivale a obj.evaluar(x)

# CONTENEDORES
# __len__      → len(obj)
# __getitem__  → obj[key]
# __setitem__  → obj[key] = value
# __contains__ → x in obj
# __iter__     → for x in obj

# POLIMORFISMO SIN SOBRECARGA REAL
# Parámetros por omisión
def __init__(self, param1, param2=None):
    if param2 is None:
        ...    # comportamiento con un parámetro
    else:
        ...    # comportamiento con dos parámetros

# Por tipo de parámetro
def metodo(self, other):
    if isinstance(other, MiClase): ...
    elif isinstance(other, int): ...
    elif isinstance(other, float): ...
    else: return NotImplemented

# ERRORES TÍPICOS
# 1. return None en vez de NotImplemented → rompe los reflejados
# 2. __rsub__ igual que __sub__ → resultado incorrecto
# 3. __rtruediv__ igual que __truediv__ → resultado incorrecto
# 4. No comprobar isinstance → AttributeError al acceder a atributos
# 5. @total_ordering sin __eq__ → no funciona
# 6. Comparar con == sin isinstance → puede comparar referencias

# FLUJO COMPLETO Python con a OP b
# 1. type(a).__op__(a, b)          → si NotImplemented:
# 2. type(b).__rop__(b, a)         → si NotImplemented:
# 3. TypeError: unsupported operand type(s)

# REGLA PRÁCTICA
# + * → conmutativos → __radd__ = __add__, __rmul__ = __mul__
# - / → NO conmutativos → __rsub__ y __rtruediv__ invertidos
