# Simulacro práctico de FP1 · versión B · Guaguas entre dos paradas (dado)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
# Datos de ejemplo (ya hechos: no los toques). Son los de main.py; las pruebas usan otros.
ejemplo = (
    {   # líneas: número -> (nombre, [paradas en orden], {días en los que circula})
        "1": ("Teatro - Puerto", ["P01", "P02", "P03", "P04", "P05"], {"L", "M", "X", "J", "V", "S", "D"}),
        "12": ("Puerto - Hoya de la Plata", ["P05", "P03", "P06", "P07"], {"L", "M", "X", "J", "V"}),
        "17": ("Teatro - Auditorio", ["P01", "P06", "P03", "P08"], {"L", "M", "X", "J", "V", "S"}),
    },
    {   # paradas: código -> (nombre, {líneas que paran en ella})
        "P01": ("Teatro Pérez Galdós", {"1", "17"}),
        "P02": ("San Telmo", {"1"}),
        "P03": ("Mesa y López", {"1", "12", "17"}),
        "P04": ("Santa Catalina", {"1"}),
        "P05": ("Puerto", {"1", "12"}),
        "P06": ("Tomás Morales", {"12", "17"}),
        "P07": ("Hoya de la Plata", {"12"}),
        "P08": ("Auditorio", {"17"}),
    },
)
