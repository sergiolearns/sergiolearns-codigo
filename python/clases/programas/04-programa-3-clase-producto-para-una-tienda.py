# Clases en Python práctica — Programa 3: Clase Producto para una tienda
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class Producto:
    _iva = 0.21    # atributo de clase — mismo para todos

    def __init__(self, nombre, precio, stock=0):
        self.nombre = nombre    # usa setter
        self.precio = precio    # usa setter
        self.__stock = 0
        self.añadir_stock(stock)

    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('El nombre debe ser una cadena no vacía')
        self.__nombre = valor.strip()

    @property
    def precio(self):
        return self.__precio

    @precio.setter
    def precio(self, valor):
        if not isinstance(valor, (int, float)) or valor < 0:
            raise ValueError('El precio debe ser un número no negativo')
        self.__precio = round(valor, 2)

    @property
    def precio_con_iva(self):
        return round(self.__precio * (1 + Producto._iva), 2)

    @property
    def stock(self):
        return self.__stock

    def añadir_stock(self, cantidad):
        if not isinstance(cantidad, int) or cantidad < 0:
            raise ValueError('La cantidad debe ser un entero no negativo')
        self.__stock += cantidad

    def vender(self, cantidad=1):
        if not isinstance(cantidad, int) or cantidad <= 0:
            raise ValueError('La cantidad debe ser un entero positivo')
        if cantidad > self.__stock:
            raise ValueError(
                f'Stock insuficiente: quedan {self.__stock} unidades')
        self.__stock -= cantidad
        return self.__precio * cantidad

    def aplicar_descuento(self, porcentaje):
        if not (0 < porcentaje < 100):
            raise ValueError('El descuento debe estar entre 0 y 100')
        self.__precio = round(self.__precio * (1 - porcentaje / 100), 2)

    @classmethod
    def cambiar_iva(cls, nuevo_iva):
        if not (0 <= nuevo_iva <= 1):
            raise ValueError('El IVA debe estar entre 0 y 1')
        cls._iva = nuevo_iva

    def __str__(self):
        return (f'{self.__nombre}: {self.__precio:.2f}€ '
                f'(+IVA: {self.precio_con_iva:.2f}€) — '
                f'stock: {self.__stock}')

    def __repr__(self):
        return f'Producto("{self.__nombre}", {self.__precio}, {self.__stock})'

# Tienda
print('=== TIENDA ===\n')

p1 = Producto('Teclado', 45.99, 10)
p2 = Producto('Ratón', 29.99, 5)
p3 = Producto('Monitor', 299.99, 3)

print(p1)    # → Teclado: 45.99€ (+IVA: 55.65€) — stock: 10
print(p2)    # → Ratón: 29.99€ (+IVA: 36.29€) — stock: 5

# Venta
total = p1.vender(2)
print(f'Venta: {total:.2f}€')    # → Venta: 91.98€
print(p1)    # → Teclado: 45.99€ (+IVA: 55.65€) — stock: 8

# Descuento
p2.aplicar_descuento(10)
print(p2)    # → Ratón: 26.99€ (+IVA: 32.66€) — stock: 5

# Cambio de IVA para todos
Producto.cambiar_iva(0.10)
print(p1.precio_con_iva)    # → 50.59 (IVA al 10%)
print(p3.precio_con_iva)    # → 329.99 (IVA al 10%)

# Errores
try:
    p2.vender(10)
except ValueError as err:
    print(err)    # → Stock insuficiente: quedan 5 unidades

try:
    p3.precio = -50
except ValueError as err:
    print(err)    # → El precio debe ser un número no negativo
