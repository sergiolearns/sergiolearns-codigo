# Simulacro práctico de FP2 · versión A · Reserva de pistas del polideportivo (solución)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
from pistas import Pistas


class Reserva:
    """Reserva de pistas de un socio: se añaden horas mientras está pendiente y después se confirma."""
    __confirmadas = 0                 # atributo de clase (oculto): reservas confirmadas correctamente

    def __init__(self, id_reserva, socio):
        self.__id = id_reserva
        self.__socio = socio
        self.__confirmada = False
        self.__horas = {}             # código de pista -> horas (un dict conserva el orden de inserción)

    @property
    def id(self):
        return self.__id

    @property
    def socio(self):
        return self.__socio

    @property
    def confirmada(self):
        return self.__confirmada

    @property
    def total(self):
        # precio por hora de cada pista (Pistas.info(c)[1]) por sus horas
        return sum(Pistas.info(c)[1] * h for c, h in self.__horas.items())

    def agregar(self, codigo, horas=1):
        # type(...) is not int: así ni 1.5 ni True (bool es un int) cuelan como horas
        if type(horas) is not int or horas < 1:
            raise ValueError("horas no válidas")
        if self.__confirmada:
            raise ValueError("la reserva ya está confirmada")
        if Pistas.info(codigo) is None:
            raise ValueError("pista no disponible")
        self.__horas[codigo] = self.__horas.get(codigo, 0) + horas   # si ya estaba, suma

    def quitar(self, codigo):
        if self.__confirmada:
            raise ValueError("la reserva ya está confirmada")
        if codigo not in self.__horas:
            raise ValueError("esa pista no está en la reserva")
        return self.__horas.pop(codigo)   # pop borra la clave y devuelve sus horas

    def lineas(self):
        return list(self.__horas.items())

    def confirmar(self):
        if self.__confirmada:
            raise ValueError("la reserva ya está confirmada")
        if not self.__horas:
            raise ValueError("la reserva está vacía")
        self.__confirmada = True
        Reserva.__confirmadas += 1      # se cuenta en la clase, no en el objeto

    @classmethod
    def total_confirmadas(cls):
        return cls.__confirmadas

    def __str__(self):
        estado = "Confirmada" if self.__confirmada else "Pendiente"
        n, horas = len(self.__horas), sum(self.__horas.values())
        return f"Reserva {self.__id} de {self.__socio}: {n} pistas, {horas} h - {estado} - Total {self.total:.2f}€"
