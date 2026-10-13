# Sobrecarga de operadores en Python práctica — Programa 2: Clase Dinero con conversión de moneda
# Del artículo «Sobrecarga de operadores en Python — 2 clases reales con todos los operadores»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-practica/

from functools import total_ordering

@total_ordering
class Dinero:
    # Tasas de cambio respecto al euro (atributo de clase)
    _tasas = {
        'EUR': 1.0,
        'USD': 1.09,
        'GBP': 0.86,
        'JPY': 162.50,
        'CHF': 0.97
    }

    def __init__(self, cantidad, moneda='EUR'):
        if not isinstance(cantidad, (int, float)):
            raise TypeError('La cantidad debe ser numérica')
        if cantidad < 0:
            raise ValueError('La cantidad no puede ser negativa')
        if moneda not in Dinero._tasas:
            raise ValueError(f'Moneda no soportada: {moneda}. '
                           f'Disponibles: {list(Dinero._tasas.keys())}')
        self.__cantidad = round(float(cantidad), 2)
        self.__moneda = moneda

    @property
    def cantidad(self):
        return self.__cantidad

    @property
    def moneda(self):
        return self.__moneda

    def convertir(self, moneda_destino):
        """Convierte a otra moneda usando las tasas de cambio"""
        if moneda_destino not in Dinero._tasas:
            raise ValueError(f'Moneda no soportada: {moneda_destino}')
        # Convertir a EUR primero, luego a destino
        en_euros = self.__cantidad / Dinero._tasas[self.__moneda]
        en_destino = en_euros * Dinero._tasas[moneda_destino]
        return Dinero(round(en_destino, 2), moneda_destino)

    def _en_euros(self):
        """Valor en euros para comparaciones"""
        return self.__cantidad / Dinero._tasas[self.__moneda]

    @classmethod
    def actualizar_tasa(cls, moneda, tasa):
        """Actualiza la tasa de cambio de una moneda"""
        if tasa <= 0:
            raise ValueError('La tasa debe ser positiva')
        cls._tasas[moneda] = tasa

    # Comparación — compara valores en euros
    def __eq__(self, other):
        if isinstance(other, Dinero):
            return abs(self._en_euros() - other._en_euros()) < 0.001
        elif isinstance(other, (int, float)):
            return self._en_euros() == other
        return False

    def __lt__(self, other):
        if isinstance(other, Dinero):
            return self._en_euros() < other._en_euros()
        elif isinstance(other, (int, float)):
            return self._en_euros() < other
        return NotImplemented

    # Aritmética — opera en la moneda del operando izquierdo
    def __add__(self, other):
        if isinstance(other, Dinero):
            otro_convertido = other.convertir(self.__moneda)
            return Dinero(self.__cantidad + otro_convertido.cantidad,
                         self.__moneda)
        elif isinstance(other, (int, float)):
            return Dinero(self.__cantidad + other, self.__moneda)
        return NotImplemented

    def __radd__(self, other):
        return self.__add__(other)

    def __sub__(self, other):
        if isinstance(other, Dinero):
            otro_convertido = other.convertir(self.__moneda)
            resultado = self.__cantidad - otro_convertido.cantidad
            if resultado < 0:
                raise ValueError('El resultado no puede ser negativo')
            return Dinero(resultado, self.__moneda)
        elif isinstance(other, (int, float)):
            resultado = self.__cantidad - other
            if resultado < 0:
                raise ValueError('El resultado no puede ser negativo')
            return Dinero(resultado, self.__moneda)
        return NotImplemented

    def __mul__(self, other):
        if isinstance(other, (int, float)):
            return Dinero(self.__cantidad * other, self.__moneda)
        return NotImplemented

    def __rmul__(self, other):
        return self.__mul__(other)

    def __truediv__(self, other):
        if isinstance(other, (int, float)):
            if other == 0:
                raise ZeroDivisionError('No se puede dividir por cero')
            return Dinero(self.__cantidad / other, self.__moneda)
        elif isinstance(other, Dinero):
            # División de dinero → ratio sin moneda
            otro_convertido = other.convertir(self.__moneda)
            return self.__cantidad / otro_convertido.cantidad
        return NotImplemented

    def __neg__(self):
        raise ValueError('El dinero no puede ser negativo')

    def __abs__(self):
        return Dinero(abs(self.__cantidad), self.__moneda)

    def __str__(self):
        simbolos = {'EUR': '€', 'USD': '$', 'GBP': '£',
                   'JPY': '¥', 'CHF': 'Fr'}
        simbolo = simbolos.get(self.__moneda, self.__moneda)
        return f'{self.__cantidad:.2f}{simbolo}'

    def __repr__(self):
        return f'Dinero({self.__cantidad}, "{self.__moneda}")'

# Uso completo
print('=== CLASE DINERO ===\n')

precio_eur = Dinero(100, 'EUR')
precio_usd = Dinero(50, 'USD')
precio_gbp = Dinero(80, 'GBP')

print(f'Precio EUR: {precio_eur}')
print(f'Precio USD: {precio_usd}')
print(f'Precio GBP: {precio_gbp}')

print(f'\n--- Conversión ---')
print(f'{precio_usd} → EUR: {precio_usd.convertir("EUR")}')
print(f'{precio_gbp} → USD: {precio_gbp.convertir("USD")}')
print(f'{precio_eur} → JPY: {precio_eur.convertir("JPY")}')

print(f'\n--- Aritmética ---')
total = precio_eur + precio_usd    # USD se convierte a EUR
print(f'{precio_eur} + {precio_usd} = {total}')

descuento = precio_eur * 0.10
print(f'{precio_eur} * 0.10 = {descuento}')

precio_final = precio_eur - descuento
print(f'{precio_eur} - {descuento} = {precio_final}')

cuotas = precio_eur / 3
print(f'{precio_eur} / 3 = {cuotas}')

ratio = precio_eur / precio_usd    # cuántos USD caben en 100€
print(f'{precio_eur} / {precio_usd} = {ratio:.2f}x')

print(f'\n--- Comparación ---')
print(f'{precio_eur} == {precio_usd}: {precio_eur == precio_usd}')
print(f'{precio_eur} > {precio_usd}: {precio_eur > precio_usd}')

print(f'\n--- Ordenación ---')
precios = [Dinero(80, 'GBP'), Dinero(50, 'USD'),
           Dinero(100, 'EUR'), Dinero(10000, 'JPY')]
for p in sorted(precios):
    print(f'  {p} = {p.convertir("EUR")}')
