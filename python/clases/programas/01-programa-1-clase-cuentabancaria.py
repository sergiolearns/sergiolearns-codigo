# Programa 1 · Clase CuentaBancaria encapsulada
# Del artículo «Clases en Python — práctica con tres programas: una cuenta que no se deja manipular, la biblioteca de la facultad y una copistería con IVA para todos (y el saldo de −4000 € que nadie frenó)»
# https://sergiolearns.com/clases-en-python-practica/

class CuentaBancaria:
    _total_cuentas = 0                 # atributo de clase: cuántas cuentas hay

    def __init__(self, titular, saldo_inicial=0):
        if not isinstance(titular, str) or not titular.strip():
            raise ValueError('el titular debe ser un texto no vacío')
        self.__titular = titular.strip()
        self.__movimientos = []
        self.saldo = saldo_inicial     # pasa por el setter: valida también al crear
        CuentaBancaria._total_cuentas += 1

    @property
    def titular(self):                 # solo lectura: sin setter
        return self.__titular

    @property
    def saldo(self):
        return self.__saldo

    @saldo.setter
    def saldo(self, valor):
        if not isinstance(valor, (int, float)):
            raise TypeError('el saldo debe ser un número')
        if valor < 0:
            raise ValueError('el saldo no puede ser negativo')
        self.__saldo = valor

    @property
    def movimientos(self):
        return list(self.__movimientos)   # copia: la lista de verdad no sale de aquí

    def depositar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('la cantidad a depositar debe ser positiva')
        self.__saldo += cantidad
        self.__movimientos.append(f'+{cantidad:.2f}')

    def retirar(self, cantidad):
        if cantidad <= 0:
            raise ValueError('la cantidad a retirar debe ser positiva')
        if cantidad > self.__saldo:
            raise ValueError(f'saldo insuficiente: tienes {self.__saldo:.2f} €')
        self.__saldo -= cantidad
        self.__movimientos.append(f'-{cantidad:.2f}')

    @classmethod
    def total_cuentas(cls):
        return cls._total_cuentas

    def __str__(self):
        return f'Cuenta de {self.__titular}: {self.__saldo:.2f} €'

    def __repr__(self):
        return f'CuentaBancaria({self.__titular!r}, {self.__saldo})'


c1 = CuentaBancaria('Laura', 1000)
c2 = CuentaBancaria('Pablo', 500)
c1.depositar(250)
c1.retirar(100)
print(c1)
print(c1.movimientos)
historial = c1.movimientos
historial.append('+1000000.00')        # intento de colar un movimiento
print(c1.movimientos)                  # no ha entrado: era una copia
print(repr(c2), '| cuentas:', CuentaBancaria.total_cuentas())
for orden in ['c1.retirar(5000)', 'c1.saldo = -100', "c1.saldo = 'mucho'", "c1.titular = 'Pablo'"]:
    try:
        exec(orden)
    except (ValueError, TypeError, AttributeError) as err:
        print(f'{orden:<20} {type(err).__name__}: {err}')
