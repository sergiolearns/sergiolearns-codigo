# Programa 3 · Una tienda con IGIC
# Del artículo «Herencia en Python práctica — una nómina, una flota con un híbrido y una tienda con IGIC (y la fórmula que el híbrido copió en vez de heredar)»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod

IGIC_GENERAL = 0.07       # IGIC general de Canarias


class Producto(ABC):
    def __init__(self, nombre, precio_base):
        self.nombre = nombre
        self.precio_base = precio_base

    @abstractmethod
    def precio_final(self):            # sin impuestos: cada tipo lo calcula
        pass

    @abstractmethod
    def tipo(self):
        pass

    def tasa_igic(self):               # gancho con valor por defecto: se PUEDE sustituir
        return IGIC_GENERAL

    def detalle(self):                 # gancho vacío por defecto
        return ''

    def precio_con_igic(self):         # la madre orquesta, las hijas ponen los datos
        return round(self.precio_final() * (1 + self.tasa_igic()), 2)

    def linea(self):
        extra = f' ({self.detalle()})' if self.detalle() else ''
        return (f'[{self.tipo():<8}] {self.nombre:<24}{self.precio_final():8.2f} € '
                f'+ {self.tasa_igic():.0%} = {self.precio_con_igic():8.2f} €{extra}')


class Fisico(Producto):
    def __init__(self, nombre, precio_base, peso_kg):
        super().__init__(nombre, precio_base)
        self.peso_kg = peso_kg

    def envio(self):
        return 4.95 if self.peso_kg < 2 else 7.95

    def precio_final(self):
        return self.precio_base + self.envio()

    def tipo(self):
        return 'Físico'

    def detalle(self):
        return f'{self.peso_kg} kg, envío {self.envio():.2f} €'


class LibroFisico(Fisico):             # en Canarias los libros tienen IGIC 0 %
    def tasa_igic(self):
        return 0.0

    def tipo(self):
        return 'Libro'


class Digital(Producto):
    def __init__(self, nombre, precio_base, licencias=1):
        super().__init__(nombre, precio_base)
        self.licencias = licencias

    def precio_final(self):            # 20 % menos por licencia a partir de 5
        descuento = 0.20 if self.licencias >= 5 else 0
        return self.precio_base * self.licencias * (1 - descuento)

    def tipo(self):
        return 'Digital'

    def detalle(self):
        return f'{self.licencias} licencias' if self.licencias > 1 else ''


class Servicio(Producto):
    def __init__(self, nombre, precio_hora, horas):
        super().__init__(nombre, precio_hora)
        self.horas = horas

    def precio_final(self):
        return self.precio_base * self.horas

    def tipo(self):
        return 'Servicio'

    def detalle(self):
        return f'{self.horas} h a {self.precio_base:.2f} €/h'


carrito = [
    Fisico('Teclado mecánico', 59.90, 1.1),
    LibroFisico('Python para todos', 24.00, 0.6),
    Fisico('Monitor 24 pulgadas', 139.00, 4.3),
    Digital('Licencia de antivirus', 19.99, 5),
    Servicio('Clase particular de FP2', 18.00, 3),
]
for p in carrito:
    print(p.linea())
total = sum(p.precio_con_igic() for p in carrito)
print(f'Total con IGIC: {total:.2f} €')

por_tipo = {}
for p in carrito:
    por_tipo[p.tipo()] = por_tipo.get(p.tipo(), 0) + 1
print('Por tipo:', por_tipo)
print('Físicos (con libros):', sum(isinstance(p, Fisico) for p in carrito))
