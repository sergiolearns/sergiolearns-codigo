# Herencia en Python práctica — Programa 3: Tienda con productos específicos
# Del artículo «Herencia en Python — 3 jerarquías de clases reales con polimorfismo»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod

class Producto(ABC):
    _iva = 0.21

    def __init__(self, nombre, precio_base):
        self.__nombre = nombre
        self.__precio_base = precio_base

    @property
    def nombre(self):
        return self.__nombre

    @property
    def precio_base(self):
        return self.__precio_base

    @abstractmethod
    def tipo(self):
        pass

    @abstractmethod
    def precio_final(self):
        pass

    @abstractmethod
    def descripcion_extra(self):
        pass

    def precio_con_iva(self):
        return round(self.precio_final() * (1 + Producto._iva), 2)

    def ficha(self):
        return (f'[{self.tipo()}] {self.__nombre}\n'
                f'  Precio base:   {self.__precio_base:.2f}€\n'
                f'  Precio final:  {self.precio_final():.2f}€\n'
                f'  Con IVA:       {self.precio_con_iva():.2f}€\n'
                f'  {self.descripcion_extra()}')

    def __str__(self):
        return f'{self.__nombre} ({self.tipo()}) — {self.precio_con_iva():.2f}€'


class ProductoFisico(Producto):
    def __init__(self, nombre, precio_base, peso_kg, stock):
        super().__init__(nombre, precio_base)
        self.__peso = peso_kg
        self.__stock = stock

    def tipo(self):
        return 'Físico'

    def precio_final(self):
        gastos_envio = 3.99 if self.__peso <= 1 else self.__peso * 2.5
        return self.precio_base + gastos_envio

    def descripcion_extra(self):
        return f'Peso: {self.__peso}kg | Stock: {self.__stock} uds'

    def vender(self, cantidad=1):
        if cantidad > self.__stock:
            raise ValueError(f'Stock insuficiente: {self.__stock} uds')
        self.__stock -= cantidad


class ProductoDigital(Producto):
    def __init__(self, nombre, precio_base, formato, tamanio_mb):
        super().__init__(nombre, precio_base)
        self.__formato = formato
        self.__tamanio = tamanio_mb

    def tipo(self):
        return 'Digital'

    def precio_final(self):
        return self.precio_base    # sin gastos de envío

    def descripcion_extra(self):
        return f'Formato: {self.__formato} | Tamaño: {self.__tamanio}MB'


class Suscripcion(Producto):
    PERIODOS = {'mensual': 1, 'trimestral': 3, 'anual': 12}

    def __init__(self, nombre, precio_mes, periodo, usuarios_max):
        if periodo not in self.PERIODOS:
            raise ValueError(f'Periodo no válido: {periodo}')
        super().__init__(nombre, precio_mes)
        self.__periodo = periodo
        self.__meses = self.PERIODOS[periodo]
        self.__usuarios = usuarios_max

    def tipo(self):
        return f'Suscripción {self.__periodo}'

    def precio_final(self):
        descuento = 0
        if self.__meses == 3:
            descuento = 0.05
        elif self.__meses == 12:
            descuento = 0.20
        return round(self.precio_base * self.__meses * (1 - descuento), 2)

    def descripcion_extra(self):
        return f'Duración: {self.__meses} mes/es | Usuarios: {self.__usuarios}'


# Tienda
print('=== CATÁLOGO DE PRODUCTOS ===\n')

p1 = ProductoFisico('Teclado Mecánico', 89.99, 1.2, 15)
p2 = ProductoFisico('Monitor 27"', 299.99, 5.5, 8)
p3 = ProductoDigital('Python Avanzado PDF', 24.99, 'PDF', 45)
p4 = ProductoDigital('Pack Iconos SVG', 14.99, 'ZIP', 120)
p5 = Suscripcion('Suite Diseño Pro', 29.99, 'mensual', 1)
p6 = Suscripcion('Suite Diseño Pro', 29.99, 'anual', 5)

productos = [p1, p2, p3, p4, p5, p6]

for prod in productos:
    print(prod.ficha())
    print()

# Venta
print('--- Procesando venta ---')
p1.vender(2)
print(f'{p1.nombre} vendido x2')

try:
    p3.vender(1)
except AttributeError:
    print('Los productos digitales no tienen stock limitado')
