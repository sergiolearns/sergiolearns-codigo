# Simulacro práctico de FP2 · versión C · Presupuestos de un taller de bicicletas (clase dada)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
class Piezas:
    """Catálogo del taller (ya hecha: no hay que tocarla)."""
    _DATOS = {
        "CAD-11": ("Cadena 11 velocidades", 32.90, 21),
        "CAM-29": ("Cámara 29 pulgadas", 7.50, 21),
        "PAS-FR": ("Pastillas de freno", 14.95, 21),
        "CAS-M": ("Casco talla M", 49.00, 21),
        "MAPA-GC": ("Mapa de rutas en bici", 6.00, 4),
    }

    @classmethod
    def datos(cls, ref):
        """Devuelve (nombre, precio sin IVA, iva en %) o None si la referencia no existe."""
        return cls._DATOS.get(ref)
