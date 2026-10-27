# Simulacro práctico de FP2 · versión A · Reserva de pistas del polideportivo (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class Pistas:
    """Pistas del polideportivo (ya hecha: no hay que tocarla)."""
    _DATOS = {
        "PADEL-1": ("Pádel 1", 12.0),
        "PADEL-2": ("Pádel 2", 12.0),
        "TENIS-1": ("Tenis 1", 9.5),
        "FUTBOL-7": ("Fútbol 7", 45.0),
        "SQUASH": ("Squash", 7.25),
    }

    @classmethod
    def info(cls, codigo):
        """Devuelve (nombre, precio_hora) o None si la pista no existe."""
        return cls._DATOS.get(codigo)
