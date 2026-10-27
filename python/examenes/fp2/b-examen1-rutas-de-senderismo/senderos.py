# Simulacro práctico de FP2 · versión B · Rutas de senderismo (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class Senderos:
    """Tramos de sendero de la isla (ya hecha: no hay que tocarla)."""
    _DATOS = {
        "S01": ("Ayacata - Roque Nublo", 3.2, 260),
        "S02": ("Roque Nublo - La Goleta", 2.8, 150),
        "S03": ("La Goleta - Pico de las Nieves", 4.1, 330),
        "S04": ("Tejeda - Cruz de Tejeda", 3.5, 420),
        "S05": ("Artenara - Tamadaba", 6.9, 280),
    }

    @classmethod
    def datos(cls, codigo):
        """Devuelve (nombre, km, desnivel) o None si el tramo no existe."""
        return cls._DATOS.get(codigo)
