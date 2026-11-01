# Programa 2 · Una flota de coches con un híbrido
# Del artículo «Herencia en Python práctica — una nómina, una flota con un híbrido y una tienda con IGIC (y la fórmula que el híbrido copió en vez de heredar)»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod

AÑO_ACTUAL = 2026
PRECIO_LITRO = 1.65       # €/L (inventado, redondo)
PRECIO_KWH = 0.15         # €/kWh cargando en casa (inventado)


class Vehiculo(ABC):
    def __init__(self, matricula, modelo, anio, precio):
        self.matricula = matricula
        self.modelo = modelo
        self.anio = anio
        self.precio = precio
        self._km = 0

    def conducir(self, km):
        if km <= 0:
            raise ValueError(f'{self.matricula}: los km deben ser positivos ({km})')
        self._km += km

    @abstractmethod
    def coste_por_km(self):
        pass

    @property
    @abstractmethod
    def autonomia(self):               # km con el depósito o la batería llenos
        pass

    def coste_viaje(self, km):         # común a todos: usa el abstracto
        return km * self.coste_por_km()

    def valor_actual(self):            # pierde un 8 % por año, nunca menos del 10 %
        factor = max(0.10, 1 - 0.08 * (AÑO_ACTUAL - self.anio))
        return self.precio * factor

    def __str__(self):
        return f'{type(self).__name__:<9} {self.matricula} {self.modelo} ({self.anio}), {self._km} km'


class Gasolina(Vehiculo):
    def __init__(self, matricula, modelo, anio, precio, litros_100km, deposito=50):
        super().__init__(matricula, modelo, anio, precio)
        self.litros_100km = litros_100km
        self.deposito = deposito

    def coste_por_km(self):
        return self.litros_100km / 100 * PRECIO_LITRO

    @property
    def autonomia(self):
        return self.deposito / self.litros_100km * 100


class Electrico(Vehiculo):
    def __init__(self, matricula, modelo, anio, precio, kwh_100km, bateria):
        super().__init__(matricula, modelo, anio, precio)
        self.kwh_100km = kwh_100km
        self.bateria = bateria

    def coste_por_km(self):
        return self.kwh_100km / 100 * PRECIO_KWH

    @property
    def autonomia(self):
        return self.bateria / self.kwh_100km * 100


class Hibrido(Gasolina):                # nieto de Vehiculo: dos niveles
    def __init__(self, matricula, modelo, anio, precio, litros_100km, ahorro):
        super().__init__(matricula, modelo, anio, precio, litros_100km, deposito=43)
        self.ahorro = ahorro            # parte del recorrido que hace en eléctrico

    def coste_por_km(self):             # AMPLÍA el de Gasolina, no lo repite
        return super().coste_por_km() * (1 - self.ahorro)

    @property
    def autonomia(self):                # la propiedad también se amplía
        return super().autonomia / (1 - self.ahorro)


flota = [
    Gasolina('4821KLM', 'Seat Ibiza', 2019, 16500, 5.8),
    Electrico('7310MNB', 'Renault Zoe', 2023, 29900, 17.2, 52),
    Hibrido('1975LPR', 'Toyota Yaris', 2022, 23400, 4.0, 0.35),
]
print(f'{"Vehículo":<35}{"€/km":>7}{"500 km":>10}{"Autonomía":>11}{"Valor hoy":>11}')
for v in flota:
    print(f'{v.matricula} {v.modelo:<14}{type(v).__name__:<13}{v.coste_por_km():7.4f}'
          f'{v.coste_viaje(500):8.2f} €{v.autonomia:8.0f} km{v.valor_actual():9.0f} €')

print('Hibrido busca coste_por_km en:', [c.__name__ for c in Hibrido.__mro__])
gasolina = [v.matricula for v in flota if isinstance(v, Gasolina)]
print('isinstance(v, Gasolina):', gasolina)
print('type(v) == Gasolina:   ', [v.matricula for v in flota if type(v) == Gasolina])

flota[2].conducir(320)
print(flota[2])
try:
    flota[0].conducir(-40)
except ValueError as err:
    print('Error:', err)
