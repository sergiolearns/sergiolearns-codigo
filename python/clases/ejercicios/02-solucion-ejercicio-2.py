# Solución Ejercicio 2:
# Del artículo «Clases en Python — ejercicios para dominar objetos y encapsulamiento»
# https://sergiolearns.com/clases-en-python-ejercicios/

class Vehiculo:
    _total_vehiculos = 0

    def __init__(self, marca, modelo, anio, kilometraje=0):
        self.marca = marca
        self.modelo = modelo
        self.anio = anio
        self.__kilometraje = 0
        self.__activo = True
        if kilometraje > 0:
            self.conducir(kilometraje)
        Vehiculo._total_vehiculos += 1

    @property
    def marca(self):
        return self.__marca

    @marca.setter
    def marca(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('La marca debe ser una cadena no vacía')
        self.__marca = valor.strip()

    @property
    def modelo(self):
        return self.__modelo

    @modelo.setter
    def modelo(self, valor):
        if not valor or not isinstance(valor, str):
            raise ValueError('El modelo debe ser una cadena no vacía')
        self.__modelo = valor.strip()

    @property
    def anio(self):
        return self.__anio

    @anio.setter
    def anio(self, valor):
        if not isinstance(valor, int) or not (1900 <= valor <= 2025):
            raise ValueError(f'Año no válido: {valor}')
        self.__anio = valor

    @property
    def kilometraje(self):
        return self.__kilometraje

    @property
    def activo(self):
        return self.__activo

    def conducir(self, km):
        if not self.__activo:
            raise ValueError('El vehículo está dado de baja')
        if not isinstance(km, (int, float)) or km <= 0:
            raise ValueError('Los km deben ser un número positivo')
        self.__kilometraje += km

    def dar_de_baja(self):
        self.__activo = False

    def valor_estimado(self):
        antiguedad = 2025 - self.__anio
        valor = 15000 - (antiguedad * 1000) - (self.__kilometraje * 0.01)
        return max(1000, round(valor, 2))

    @classmethod
    def total_vehiculos(cls):
        return cls._total_vehiculos

    def __str__(self):
        estado = 'activo' if self.__activo else 'baja'
        return (f'{self.__marca} {self.__modelo} ({self.__anio}) '
                f'— {self.__kilometraje:.0f} km — {estado}')

    def __repr__(self):
        return (f'Vehiculo("{self.__marca}", "{self.__modelo}", '
                f'{self.__anio}, {self.__kilometraje})')

# Uso
v1 = Vehiculo('Toyota', 'Corolla', 2018, 45000)
print(v1)
print(f'Valor estimado: {v1.valor_estimado():.2f}€\n')

v1.conducir(50000)
print(v1)
print(f'Valor estimado: {v1.valor_estimado():.2f}€\n')

v1.dar_de_baja()
print(v1)
try:
    v1.conducir(100)
except ValueError as err:
    print(f'Error: {err}\n')

v2 = Vehiculo('Honda', 'Civic', 2020)
print(f'Total vehículos: {Vehiculo.total_vehiculos()}')
