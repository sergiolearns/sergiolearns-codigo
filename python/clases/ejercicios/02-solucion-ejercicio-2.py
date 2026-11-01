# Solución del ejercicio 2 · Clase Vehículo
# Del artículo «Clases en Python — ejercicios con un estudiante y sus notas, un vehículo que pierde valor y una pila con sus propias excepciones (y el boletín de Laura con el suspenso de Pablo)»
# https://sergiolearns.com/clases-en-python-ejercicios/

AÑO_ACTUAL = 2026


class Vehiculo:
    _total_vehiculos = 0
    VALOR_BASE = 15000
    VALOR_MINIMO = 1000

    def __init__(self, marca, modelo, anio, kilometraje=0):
        self.marca = marca
        self.modelo = modelo
        self.anio = anio
        if not isinstance(kilometraje, int) or kilometraje < 0:
            raise ValueError('el kilometraje no puede ser negativo')
        self.__kilometraje = kilometraje
        self.__activo = True
        Vehiculo._total_vehiculos += 1

    @property
    def marca(self):
        return self.__marca

    @marca.setter
    def marca(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('la marca debe ser un texto no vacío')
        self.__marca = valor.strip()

    @property
    def modelo(self):
        return self.__modelo

    @modelo.setter
    def modelo(self, valor):
        if not isinstance(valor, str) or not valor.strip():
            raise ValueError('el modelo debe ser un texto no vacío')
        self.__modelo = valor.strip()

    @property
    def anio(self):
        return self.__anio

    @anio.setter
    def anio(self, valor):
        if not isinstance(valor, int) or not 1900 <= valor <= AÑO_ACTUAL:
            raise ValueError(f'año no válido: {valor}')
        self.__anio = valor

    @property
    def kilometraje(self):             # solo lectura: solo sube conduciendo
        return self.__kilometraje

    def conducir(self, km):
        if not self.__activo:
            raise ValueError('el vehículo está dado de baja')
        if km <= 0:
            raise ValueError('los kilómetros deben ser positivos')
        self.__kilometraje += km

    def dar_de_baja(self):
        self.__activo = False

    def valor_estimado(self):
        antiguedad = AÑO_ACTUAL - self.__anio
        valor = Vehiculo.VALOR_BASE - 1000 * antiguedad - 0.01 * self.__kilometraje
        return max(valor, Vehiculo.VALOR_MINIMO)

    @classmethod
    def total_vehiculos(cls):
        return cls._total_vehiculos

    def __str__(self):
        estado = 'activo' if self.__activo else 'baja'
        return f'{self.__marca} {self.__modelo} ({self.__anio}), {self.__kilometraje} km, {estado}'

    def __repr__(self):
        return f'Vehiculo({self.__marca!r}, {self.__modelo!r}, {self.__anio}, {self.__kilometraje})'


v = Vehiculo('Toyota', 'Corolla', 2018, 45000)
moto = Vehiculo('Honda', 'PCX', 2023)
print(v)
print(f'Valor estimado: {v.valor_estimado():.2f} €')
v.conducir(50000)
print(v)
print(f'Valor estimado: {v.valor_estimado():.2f} €')
print(f'Moto: {moto.valor_estimado():.2f} €')
v.dar_de_baja()
print(v)
for orden in ['v.conducir(10)', 'moto.conducir(-5)', 'v.kilometraje = 0', "Vehiculo('Seat', 'Ibiza', 2031)"]:
    try:
        exec(orden)
    except (ValueError, AttributeError) as err:
        print(f'{orden:<32} {type(err).__name__}: {err}')
print('Total vehículos:', Vehiculo.total_vehiculos())
print(repr(moto))
