# Solución del ejercicio 2 · Jerarquía de cuentas bancarias
# Del artículo «Herencia en Python ejercicios — animales, cuentas bancarias y los préstamos de la biblioteca, con soluciones, test y chuletario (y la s de más que tumbó un simulacro)»
# https://sergiolearns.com/herencia-en-python-ejercicios/

from abc import ABC, abstractmethod


class ErrorCuenta(Exception):
    pass


class Cuenta(ABC):
    def __init__(self, titular, saldo_inicial):
        self.__titular = titular
        self.__saldo = saldo_inicial
        self.__movimientos = [f'Apertura: {saldo_inicial:.2f} €']

    @property
    def titular(self):
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    def _mover(self, importe, concepto):   # único sitio que toca el saldo
        self.__saldo += importe
        self.__movimientos.append(f'{concepto}: {importe:+.2f} € | saldo {self.__saldo:.2f} €')

    @abstractmethod
    def tipo(self):
        pass

    @abstractmethod
    def interes_anual(self):
        pass

    @abstractmethod
    def puede_retirar(self, cantidad):
        pass

    def depositar(self, cantidad):
        if cantidad <= 0:
            raise ErrorCuenta(f'depósito no válido: {cantidad}')
        self._mover(cantidad, 'Depósito')

    def retirar(self, cantidad):           # plantilla: la regla la pone cada hija
        if cantidad <= 0:
            raise ErrorCuenta(f'retirada no válida: {cantidad}')
        if not self.puede_retirar(cantidad):
            raise ErrorCuenta(f'{self.tipo()} no permite retirar {cantidad:.2f} €')
        self._mover(-cantidad, 'Retirada')
        self._despues_de_retirar(cantidad)

    def _despues_de_retirar(self, cantidad):   # gancho vacío
        pass

    def aplicar_interes(self):
        interes = round(self.__saldo * self.interes_anual(), 2)
        if interes:
            self._mover(interes, f'Interés {self.interes_anual():.1%}')

    def extracto(self):
        cab = f'{self.tipo()} de {self.__titular}'
        return '\n'.join([cab] + ['  ' + m for m in self.__movimientos])


class CuentaCorriente(Cuenta):
    COMISION = 15

    def __init__(self, titular, saldo_inicial, descubierto_max):
        super().__init__(titular, saldo_inicial)
        self.descubierto_max = descubierto_max

    def tipo(self):
        return 'Cuenta corriente'

    def interes_anual(self):
        return 0.0

    def puede_retirar(self, cantidad):
        return self.saldo - cantidad >= -self.descubierto_max

    def _despues_de_retirar(self, cantidad):
        if self.saldo < 0:
            self._mover(-self.COMISION, 'Comisión por descubierto')


class CuentaAhorro(Cuenta):
    def __init__(self, titular, saldo_inicial, interes):
        super().__init__(titular, saldo_inicial)
        self.interes = interes
        self.operaciones = 3               # la primera retirada está permitida

    def tipo(self):
        return 'Cuenta de ahorro'

    def interes_anual(self):
        return self.interes

    def depositar(self, cantidad):         # AMPLÍA: deposita y cuenta la operación
        super().depositar(cantidad)
        self.operaciones += 1

    def puede_retirar(self, cantidad):
        return self.saldo - cantidad >= 0 and self.operaciones >= 3

    def _despues_de_retirar(self, cantidad):
        self.operaciones = 0


class CuentaInversion(Cuenta):
    PERFILES = {'conservador': 0.04, 'moderado': 0.07, 'agresivo': 0.12}
    MINIMO = 1000
    PENALIZACION = 0.02

    def __init__(self, titular, saldo_inicial, perfil):
        if perfil not in self.PERFILES:
            raise ValueError(f'perfil desconocido: {perfil!r}')
        super().__init__(titular, saldo_inicial)
        self.perfil = perfil

    def tipo(self):
        return f'Cuenta de inversión ({self.perfil})'

    def interes_anual(self):
        return self.PERFILES[self.perfil]

    def puede_retirar(self, cantidad):     # el saldo que queda, ya penalizado
        return self.saldo - cantidad * (1 + self.PENALIZACION) >= self.MINIMO

    def _despues_de_retirar(self, cantidad):
        self._mover(-round(cantidad * self.PENALIZACION, 2), 'Penalización 2 %')


cc = CuentaCorriente('Laura', 500, descubierto_max=300)
cc.depositar(200)
cc.retirar(900)
ca = CuentaAhorro('Pablo', 2000, interes=0.035)
ca.aplicar_interes()
ca.retirar(500)
ci = CuentaInversion('Elena', 5000, 'agresivo')
ci.aplicar_interes()
ci.retirar(2000)
intentos = [(cc, 200), (ca, 100), (ci, 3000)]
for cuenta, cantidad in intentos:
    try:
        cuenta.retirar(cantidad)
    except ErrorCuenta as err:
        print('Error:', err)
for cuenta in [cc, ca, ci]:
    print(cuenta.extracto())
