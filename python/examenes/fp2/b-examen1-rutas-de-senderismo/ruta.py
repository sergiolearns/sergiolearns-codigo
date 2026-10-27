# Simulacro práctico de FP2 · versión B · Rutas de senderismo (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from senderos import Senderos


class Ruta:
    """Ruta de senderismo hecha de tramos; solo se enseña (visible) cuando tiene al menos 2."""
    __visibles = 0                    # atributo de clase: rutas visibles ahora mismo

    def __init__(self, nombre, guia):
        self.__nombre = nombre
        self.__guia = guia
        self.__codigos = []           # códigos de los tramos, en orden (en el examen 1 sí se pueden usar listas)
        self.__visible = False

    @property
    def nombre(self):
        return self.__nombre

    @property
    def guia(self):
        return self.__guia

    @property
    def km(self):
        return sum(Senderos.datos(c)[1] for c in self.__codigos)

    @property
    def desnivel(self):
        return sum(Senderos.datos(c)[2] for c in self.__codigos)

    @property
    def visible(self):
        return self.__visible

    @visible.setter
    def visible(self, valor):
        if type(valor) is not bool:
            raise TypeError("visible solo admite True o False")
        if valor and len(self.__codigos) < 2:
            raise ValueError("una ruta visible necesita al menos 2 tramos")
        if valor != self.__visible:           # solo cuenta si cambia de estado
            Ruta.__visibles += 1 if valor else -1
        self.__visible = valor

    def agregar(self, codigo):
        if Senderos.datos(codigo) is None:
            raise ValueError("tramo desconocido")
        if codigo in self.__codigos:
            raise ValueError("ese tramo ya está en la ruta")
        self.__codigos.append(codigo)

    def tramos(self):
        return [Senderos.datos(c)[0] for c in self.__codigos]

    def duracion(self):
        return round(self.km * 15 + self.desnivel / 10)

    def __len__(self):
        return len(self.__codigos)

    @classmethod
    def rutas_visibles(cls):
        return cls.__visibles

    def __str__(self):
        estado = "Visible" if self.__visible else "Oculta"
        return (f"Ruta {self.__nombre} (guía {self.__guia}): {len(self)} tramos, "
                f"{self.km:.1f} km, +{self.desnivel} m - {estado}")
