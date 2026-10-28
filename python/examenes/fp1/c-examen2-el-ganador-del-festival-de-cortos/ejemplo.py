# Simulacro práctico de FP1 · versión C · El ganador del festival de cortos (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
# Datos de ejemplo (ya hechos: no los toques). Son los de main.py; las pruebas usan otros.
ejemplo = (
    {   # cortos: código -> (título, dirección, categoría)
        "C1": ("La última guagua", "Nira Suárez", "ficción"),
        "C2": ("Alisios", "Pablo Rivero", "documental"),
        "C3": ("Bajamar", "Nira Suárez", "ficción"),
        "C4": ("Papas con mojo", "Ruth Déniz", "animación"),
        "C5": ("Calima", "Tomás Vega", "ficción"),
        "C6": ("Volcán", "Iker León", "terror"),
    },
    {   # votantes: DNI -> (nombre, {código del corto: puntos de 1 a 5})
        "11111111A": ("Ana Pérez", {"C1": 4, "C2": 5, "C3": 5}),
        "22222222B": ("Luis Martín", {"C1": 5, "C3": 4, "C4": 3}),
        "33333333C": ("Eva Santana", {"C1": 3, "C3": 5}),
    },
)
