# Programa 3 · Clase Producto para la copistería
# Del artículo «Clases en Python — práctica con tres programas: una cuenta que no se deja manipular, la biblioteca de la facultad y una copistería con IVA para todos (y el saldo de −4000 € que nadie frenó)»
# https://sergiolearns.com/clases-en-python-practica/

class Producto:
    _iva = 0.21                        # atributo de clase: el mismo IVA para todos

    def __init__(self, nombre, precio, stock=0):
        self.nombre = nombre
        self.precio = precio
        self.__stock = 0
        self.añadir_stock(stock)       # reutiliza la validación del método

    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('el nombre debe ser un texto no vacío')
        self.__nombre = valor.strip()

    @property
    def precio(self):
        return self.__precio

    @precio.setter
    def precio(self, valor):
        if not isinstance(valor, (int, float)) or valor < 0:
            raise ValueError('el precio debe ser un número no negativo')
        self.__precio = round(valor, 2)

    @property
    def precio_con_iva(self):          # propiedad calculada: no se guarda, se calcula
        return round(self.__precio * (1 + Producto._iva), 2)

    @property
    def stock(self):
        return self.__stock

    def añadir_stock(self, cantidad):
        if not isinstance(cantidad, int) or cantidad < 0:
            raise ValueError('la cantidad debe ser un entero no negativo')
        self.__stock += cantidad

    def vender(self, cantidad=1):
        if not isinstance(cantidad, int) or cantidad <= 0:
            raise ValueError('la cantidad debe ser un entero positivo')
        if cantidad > self.__stock:
            raise ValueError(f'stock insuficiente: quedan {self.__stock}')
        self.__stock -= cantidad
        return round(self.precio_con_iva * cantidad, 2)

    def aplicar_descuento(self, porcentaje):
        if not 0 < porcentaje < 100:
            raise ValueError('el descuento debe estar entre 0 y 100')
        self.precio = self.__precio * (1 - porcentaje / 100)   # pasa por el setter

    @classmethod
    def cambiar_iva(cls, nuevo):
        if not 0 <= nuevo <= 1:
            raise ValueError('el IVA debe estar entre 0 y 1')
        cls._iva = nuevo

    def __str__(self):
        return f'{self.__nombre}: {self.__precio:.2f} € (con IVA {self.precio_con_iva:.2f} €), stock {self.__stock}'


print('=== COPISTERÍA DE LA FACULTAD ===')
apuntes = Producto('Apuntes de FP2', 12.40, 30)
cuaderno = Producto('Cuaderno A4', 3.50, 50)
usb = Producto('Memoria USB 64 GB', 9.90, 4)
for p in [apuntes, cuaderno, usb]:
    print(p)
print('Venta de 3 cuadernos:', cuaderno.vender(3), '€')
usb.aplicar_descuento(20)
print(usb)
Producto.cambiar_iva(0.07)             # el IGIC canario, para todos a la vez
print([p.precio_con_iva for p in [apuntes, cuaderno, usb]])
for orden in ['usb.vender(10)', 'apuntes.precio = -5', 'cuaderno.vender(1.5)', 'Producto.cambiar_iva(7)']:
    try:
        exec(orden)
    except ValueError as err:
        print(f'{orden:<24} {err}')
