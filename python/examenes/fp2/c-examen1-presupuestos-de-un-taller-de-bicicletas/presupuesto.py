# Simulacro práctico de FP2 · versión C · Presupuestos de un taller de bicicletas (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from piezas import Piezas


class Presupuesto:
    """Presupuesto de piezas: se cambia mientras está pendiente y se acepta una vez."""
    __aceptados = 0                   # atributo de clase: presupuestos aceptados

    def __init__(self, numero, cliente):
        self.__numero = numero
        self.__cliente = cliente
        self.__aceptado = False
        self.__lineas = {}            # referencia -> unidades

    @property
    def numero(self):
        return self.__numero

    @property
    def cliente(self):
        return self.__cliente

    @property
    def aceptado(self):
        return self.__aceptado

    @property
    def base(self):
        return sum(Piezas.datos(r)[1] * u for r, u in self.__lineas.items())

    @property
    def iva(self):
        # cada pieza con su propio IVA: no vale aplicar un 21 % al total
        return sum(Piezas.datos(r)[1] * u * Piezas.datos(r)[2] / 100 for r, u in self.__lineas.items())

    @property
    def total(self):
        return self.base + self.iva

    @staticmethod
    def __valida(unidades):
        if type(unidades) is not int or unidades < 1:
            raise ValueError("unidades no válidas")

    def agregar(self, ref, unidades=1):
        Presupuesto.__valida(unidades)
        if self.__aceptado:
            raise ValueError("el presupuesto ya está aceptado")
        if Piezas.datos(ref) is None:
            raise ValueError("referencia desconocida")
        self.__lineas[ref] = self.__lineas.get(ref, 0) + unidades

    def quitar(self, ref, unidades=1):
        if self.__aceptado:
            raise ValueError("el presupuesto ya está aceptado")
        if ref not in self.__lineas:
            raise ValueError("esa pieza no está en el presupuesto")
        Presupuesto.__valida(unidades)
        if unidades > self.__lineas[ref]:
            raise ValueError("no hay tantas unidades")
        self.__lineas[ref] -= unidades
        if self.__lineas[ref] == 0:   # se queda en 0: la pieza desaparece
            del self.__lineas[ref]

    def unidades(self, ref):
        return self.__lineas.get(ref, 0)

    def aceptar(self):
        if self.__aceptado:
            raise ValueError("el presupuesto ya está aceptado")
        if not self.__lineas:
            raise ValueError("el presupuesto está vacío")
        self.__aceptado = True
        Presupuesto.__aceptados += 1

    @classmethod
    def aceptados(cls):
        return cls.__aceptados

    def __len__(self):
        return len(self.__lineas)

    def __str__(self):
        estado = "Aceptado" if self.__aceptado else "Pendiente"
        return f"Presupuesto {self.__numero} para {self.__cliente}: {len(self)} piezas - {estado} - Total {self.total:.2f}€"
