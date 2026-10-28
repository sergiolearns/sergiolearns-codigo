# Simulacro práctico de FP1 · versión A · El mejor lector de un autor (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
# Datos de ejemplo (ya hechos: no los toques). Son los de main.py; las pruebas usan otros.
ejemplo = (
    {   # libros: código -> (título, autor, año, {géneros})
        "L-01": ("Marina", "Carlos Ruiz Zafón", 1999, {"juvenil", "misterio"}),
        "L-02": ("La sombra del viento", "Carlos Ruiz Zafón", 2001, {"misterio"}),
        "L-03": ("El príncipe de la niebla", "Carlos Ruiz Zafón", 1993, {"juvenil"}),
        "L-04": ("Manolito Gafotas", "Elvira Lindo", 1994, {"humor", "juvenil"}),
        "L-05": ("Platero y yo", "Juan Ramón Jiménez", 1914, {"poesía"}),
    },
    {   # socios: carné -> (nombre, {códigos de los libros que ha leído})
        "S-101": ("Ana Pérez", {"L-01", "L-04"}),
        "S-102": ("Luis Martín", {"L-01", "L-02", "L-03"}),
        "S-103": ("Eva Santana", {"L-02", "L-03", "L-04"}),
        "S-104": ("Iker Rodríguez", set()),
    },
)
