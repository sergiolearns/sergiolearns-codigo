# Programa 2 · La clase Dinero
# Del artículo «Sobrecarga de operadores en Python práctica — fracciones que se simplifican solas, dinero sin errores de céntimos y la estantería de la biblioteca (y el bote de la cena que no cuadraba por un céntimo)»
# https://sergiolearns.com/sobrecarga-de-operadores-en-python-practica/

from functools import total_ordering

TASAS = {'EUR': 1.0, 'USD': 1.08, 'GBP': 0.85}     # unidades por 1 euro (inventadas, fijas)
SIMBOLO = {'EUR': '€', 'USD': '$', 'GBP': '£'}


@total_ordering
class Dinero:
    def __init__(self, cantidad, moneda='EUR'):
        if moneda not in TASAS:
            raise ValueError(f'moneda no admitida: {moneda!r}')
        self.centimos = round(cantidad * 100)       # entero: nada de 0.1 + 0.2
        self.moneda = moneda

    @classmethod
    def _de_centimos(cls, centimos, moneda):
        d = cls(0, moneda)
        d.centimos = centimos
        return d

    def a(self, moneda):                             # convertir de moneda
        euros = self.centimos / TASAS[self.moneda]
        return Dinero._de_centimos(round(euros * TASAS[moneda]), moneda)

    def __str__(self):
        return f'{self.centimos / 100:.2f} {SIMBOLO[self.moneda]}'

    def __repr__(self):
        return f'Dinero({self.centimos / 100}, {self.moneda!r})'

    def __add__(self, otro):                         # la moneda del resultado: la de la izquierda
        if not isinstance(otro, Dinero):
            return NotImplemented
        return Dinero._de_centimos(self.centimos + otro.a(self.moneda).centimos, self.moneda)

    def __radd__(self, otro):                        # solo para sum(): 0 + dinero
        return self if otro == 0 else NotImplemented

    def __sub__(self, otro):
        if not isinstance(otro, Dinero):
            return NotImplemented
        return Dinero._de_centimos(self.centimos - otro.a(self.moneda).centimos, self.moneda)

    def __mul__(self, n):                            # dinero * número (no dinero * dinero)
        if not isinstance(n, (int, float)):
            return NotImplemented
        return Dinero._de_centimos(round(self.centimos * n), self.moneda)

    def __rmul__(self, n):
        return self * n

    def __truediv__(self, otro):
        if isinstance(otro, Dinero):                 # dinero / dinero -> número (proporción)
            return self.centimos / otro.a(self.moneda).centimos
        if isinstance(otro, (int, float)):           # dinero / número -> dinero (cuotas)
            return Dinero._de_centimos(round(self.centimos / otro), self.moneda)
        return NotImplemented

    def __eq__(self, otro):                          # se compara el valor en euros
        if not isinstance(otro, Dinero):
            return NotImplemented
        return self.a('EUR').centimos == otro.a('EUR').centimos

    def __lt__(self, otro):
        if not isinstance(otro, Dinero):
            return NotImplemented
        return self.a('EUR').centimos < otro.a('EUR').centimos

    def __hash__(self):
        return hash(self.a('EUR').centimos)

    def __bool__(self):
        return self.centimos != 0


print('Con float:  0.1 + 0.2 == 0.3 ->', 0.1 + 0.2 == 0.3)
print('Con Dinero:', Dinero(0.1) + Dinero(0.2), '== 0.30 € ->', Dinero(0.1) + Dinero(0.2) == Dinero(0.3))

multas = [Dinero(1.20), Dinero(2.00), Dinero(0.50), Dinero(0)]
caja = sum(multas)                                   # funciona gracias a __radd__
print('Multas:', [str(m) for m in multas], '-> caja:', caja)
donacion = Dinero(25, 'USD')
print('Donación:', donacion, '=', donacion.a('EUR'))
caja = caja + donacion
print('Caja + donación:', caja, ' (al revés:', donacion + Dinero(3.70), ')')
print('Una cuota de 3:', caja / 3, ' 3 cuotas:', 3 * (caja / 3))
print('Proporción multas/caja:', round(sum(multas) / caja, 3))
print('25 $ > 20 €:', donacion > Dinero(20), ' 17 £ == 20 €:', Dinero(17, 'GBP') == Dinero(20))
print('Ordenado:', sorted([Dinero(20), donacion, Dinero(17, 'GBP')]))
print('Sin multas:', [str(m) for m in multas if not m])
for orden in ['caja * caja', 'caja + 5', "Dinero(3, 'JPY')"]:
    try:
        eval(orden)
    except (TypeError, ValueError) as err:
        print(f'{orden:<16} -> {type(err).__name__}: {err}')
