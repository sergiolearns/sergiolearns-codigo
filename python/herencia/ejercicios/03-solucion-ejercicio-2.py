# Solución Ejercicio 2:
# Del artículo «Herencia en Python — ejercicios para dominar jerarquías de clases»
# https://sergiolearns.com/herencia-en-python-ejercicios/

from abc import ABC, abstractmethod

class ErrorCuenta(Exception):
    pass

class Cuenta(ABC):
    def __init__(self, titular, saldo_inicial):
        if not titular or not isinstance(titular, str):
            raise ValueError('Titular no válido')
        if not isinstance(saldo_inicial, (int, float)) or saldo_inicial < 0:
            raise ValueError('Saldo inicial no válido')
        self.__titular = titular
        self.__saldo = saldo_inicial
        self.__movimientos = []
        self._registrar(f'Apertura: +{saldo_inicial:.2f}€')

    @property
    def titular(self):
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    @abstractmethod
    def tipo(self):
        pass

    @abstractmethod
    def interes_anual(self):
        pass

    @abstractmethod
    def puede_retirar(self, cantidad):
        pass

    def _registrar(self, movimiento):
        self.__movimientos.append(movimiento)

    def _modificar_saldo(self, cantidad):
        self.__saldo += cantidad

    def depositar(self, cantidad):
        if not isinstance(cantidad, (int, float)) or cantidad <= 0:
            raise ErrorCuenta('La cantidad debe ser positiva')
        self.__saldo += cantidad
        self._registrar(f'Depósito: +{cantidad:.2f}€ | Saldo: {self.__saldo:.2f}€')

    def retirar(self, cantidad):
        if not isinstance(cantidad, (int, float)) or cantidad <= 0:
            raise ErrorCuenta('La cantidad debe ser positiva')
        self.puede_retirar(cantidad)    # cada subclase decide
        self.__saldo -= cantidad
        self._registrar(f'Retirada: -{cantidad:.2f}€ | Saldo: {self.__saldo:.2f}€')
        self._post_retirada(cantidad)   # hook para efectos secundarios

    def _post_retirada(self, cantidad):
        pass    # las subclases pueden sobreescribir

    def aplicar_interes(self):
        interes = self.__saldo * self.interes_anual()
        self.__saldo += interes
        self._registrar(
            f'Interés {self.interes_anual()*100:.1f}%: '
            f'+{interes:.2f}€ | Saldo: {self.__saldo:.2f}€')

    def extracto(self):
        lineas = [f'=== Extracto {self.tipo()} — {self.__titular} ===']
        for mov in self.__movimientos:
            lineas.append(f'  {mov}')
        lineas.append(f'  Saldo actual: {self.__saldo:.2f}€')
        return '\n'.join(lineas)

    def __str__(self):
        return f'{self.tipo()} — {self.__titular} | Saldo: {self.__saldo:.2f}€'

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__titular}", {self.__saldo})'


class CuentaCorriente(Cuenta):
    def __init__(self, titular, saldo_inicial, descubierto_max=500):
        super().__init__(titular, saldo_inicial)    # SIEMPRE primero
        self.__descubierto_max = descubierto_max

    def tipo(self):
        return 'CuentaCorriente'

    def interes_anual(self):
        return 0.0

    def puede_retirar(self, cantidad):
        if cantidad > self.saldo + self.__descubierto_max:
            raise ErrorCuenta(
                f'Límite de descubierto: {self.__descubierto_max:.2f}€')

    def _post_retirada(self, cantidad):
        if self.saldo < 0:
            self._modificar_saldo(-15)
            self._registrar(
                f'Comisión descubierto: -15.00€ | Saldo: {self.saldo:.2f}€')


class CuentaAhorro(Cuenta):
    def __init__(self, titular, saldo_inicial, interes=0.02):
        super().__init__(titular, saldo_inicial)
        if not (0 <= interes <= 1):
            raise ValueError('Interés no válido')
        self.__interes = interes
        self.__operaciones_desde_retirada = 0

    def tipo(self):
        return 'CuentaAhorro'

    def interes_anual(self):
        return self.__interes

    def puede_retirar(self, cantidad):
        if self.__operaciones_desde_retirada < 3:
            raise ErrorCuenta(
                'Debes esperar más operaciones antes de retirar')
        if self.saldo - cantidad < 0:
            raise ErrorCuenta('Saldo insuficiente')

    def depositar(self, cantidad):
        super().depositar(cantidad)
        self.__operaciones_desde_retirada += 1

    def _post_retirada(self, cantidad):
        self.__operaciones_desde_retirada = 0


class CuentaInversion(Cuenta):
    PERFILES = {'conservador': 0.04, 'moderado': 0.07, 'agresivo': 0.12}
    SALDO_MINIMO = 1000

    def __init__(self, titular, saldo_inicial, perfil_riesgo):
        if perfil_riesgo not in self.PERFILES:
            raise ValueError(f'Perfil no válido: {perfil_riesgo}')
        if saldo_inicial < self.SALDO_MINIMO:
            raise ValueError(f'Mínimo inicial: {self.SALDO_MINIMO}€')
        super().__init__(titular, saldo_inicial)
        self.__perfil = perfil_riesgo

    def tipo(self):
        return f'CuentaInversion ({self.__perfil})'

    def interes_anual(self):
        return self.PERFILES[self.__perfil]

    def puede_retirar(self, cantidad):
        penalizacion = cantidad * 0.02
        if self.saldo - cantidad - penalizacion < self.SALDO_MINIMO:
            raise ErrorCuenta(
                f'Saldo mínimo de inversión: {self.SALDO_MINIMO}€')

    def _post_retirada(self, cantidad):
        penalizacion = cantidad * 0.02
        self._modificar_saldo(-penalizacion)
        self._registrar(
            f'Penalización 2%: -{penalizacion:.2f}€ | Saldo: {self.saldo:.2f}€')


# Uso
print('=== CUENTA CORRIENTE ===')
cc = CuentaCorriente('Sergio', 500, descubierto_max=300)
cc.depositar(200)
cc.retirar(900)
print(cc.extracto())

print('\n=== CUENTA AHORRO ===')
ca = CuentaAhorro('María', 2000, interes=0.035)
ca.aplicar_interes()
ca.depositar(100)
ca.depositar(100)
ca.depositar(100)
ca.retirar(500)
try:
    ca.retirar(200)
except ErrorCuenta as err:
    print(f'Error: {err}')
print(ca.extracto())

print('\n=== CUENTA INVERSIÓN ===')
ci = CuentaInversion('Juan', 5000, 'agresivo')
ci.aplicar_interes()
ci.retirar(2000)
try:
    ci.retirar(4000)
except ErrorCuenta as err:
    print(f'Error: {err}')
print(ci.extracto())
