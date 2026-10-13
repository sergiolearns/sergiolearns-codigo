# Herencia en Python práctica — Programa 2: Jerarquía de vehículos con comportamiento diferente
# Del artículo «Herencia en Python — 3 jerarquías de clases reales con polimorfismo»
# https://sergiolearns.com/herencia-en-python-practica/

from abc import ABC, abstractmethod

class Vehiculo(ABC):
    def __init__(self, marca, modelo, anio, precio):
        self.__marca = marca
        self.__modelo = modelo
        self.__anio = anio
        self.__precio = precio
        self.__km = 0

    @property
    def marca(self):
        return self.__marca

    @property
    def modelo(self):
        return self.__modelo

    @property
    def anio(self):
        return self.__anio

    @property
    def precio(self):
        return self.__precio

    @property
    def km(self):
        return self.__km

    def conducir(self, km):
        if km <= 0:
            raise ValueError('Los km deben ser positivos')
        self.__km += km

    @abstractmethod
    def tipo(self):
        pass

    @abstractmethod
    def coste_por_km(self):
        pass

    def coste_viaje(self, km):
        return km * self.coste_por_km()

    def valor_actual(self):
        depreciacion = (2025 - self.__anio) * 0.08
        factor = max(0.1, 1 - depreciacion)
        return round(self.__precio * factor, 2)

    def __str__(self):
        return (f'{self.tipo()}: {self.__marca} {self.__modelo} '
                f'({self.__anio}) — {self.__km:.0f} km')

    def __repr__(self):
        return (f'{self.__class__.__name__}("{self.__marca}", '
                f'"{self.__modelo}", {self.__anio}, {self.__precio})')


class Gasolina(Vehiculo):
    def __init__(self, marca, modelo, anio, precio, consumo_l100km):
        super().__init__(marca, modelo, anio, precio)
        self.__consumo = consumo_l100km
        self.__precio_gasolina = 1.65

    def tipo(self):
        return 'Gasolina'

    def coste_por_km(self):
        return (self.__consumo / 100) * self.__precio_gasolina

    @property
    def autonomia(self):
        return (60 / self.__consumo) * 100    # con 60L de depósito


class Electrico(Vehiculo):
    def __init__(self, marca, modelo, anio, precio, kwh_100km, bateria_kwh):
        super().__init__(marca, modelo, anio, precio)
        self.__consumo_kwh = kwh_100km
        self.__bateria = bateria_kwh
        self.__precio_kwh = 0.15

    def tipo(self):
        return 'Eléctrico'

    def coste_por_km(self):
        return (self.__consumo_kwh / 100) * self.__precio_kwh

    @property
    def autonomia(self):
        return (self.__bateria / self.__consumo_kwh) * 100


class Hibrido(Gasolina):
    def __init__(self, marca, modelo, anio, precio, consumo_l100km, ahorro_electrico):
        super().__init__(marca, modelo, anio, precio, consumo_l100km)
        self.__ahorro = ahorro_electrico    # porcentaje de ahorro 0-1

    def tipo(self):
        return 'Híbrido'

    def coste_por_km(self):
        coste_gasolina = super().coste_por_km()
        return coste_gasolina * (1 - self.__ahorro)


# Uso
g = Gasolina('Toyota', 'Corolla', 2020, 22000, 6.5)
e = Electrico('Tesla', 'Model 3', 2022, 45000, 15, 75)
h = Hibrido('Toyota', 'Prius', 2021, 30000, 4.5, 0.35)

vehiculos = [g, e, h]

for v in vehiculos:
    print(v)
    print(f'  Coste/km:    {v.coste_por_km():.4f}€')
    print(f'  Coste 500km: {v.coste_viaje(500):.2f}€')
    print(f'  Autonomía:   {v.autonomia:.0f} km')
    print(f'  Valor actual: {v.valor_actual():.2f}€')
    print()

g.conducir(15000)
print(g)
