# Compruébalo con Python · Simulador de estados: la vida de bash, gcc y spotify en una CPU
# Del artículo «Procesos e hilos — teoría con un gcc que nace, se bloquea y termina, un fork() que se multiplica y spotify con tres hilos (y el bucle que llenó mi terminal de «Hola»)»
# https://sergiolearns.com/procesos-e-hilos/

# Simulador de estados: la vida de bash, gcc y spotify en un portátil con una sola CPU
# Cada evento pide un cambio de estado; el simulador solo deja hacer los que existen en el diagrama.
LEGALES = {("nuevo", "preparado"), ("preparado", "ejecución"),     # admitido / el despachador lo elige
           ("ejecución", "preparado"), ("ejecución", "bloqueado"),  # lo expulsan / espera un evento
           ("bloqueado", "preparado"), ("ejecución", "terminado")}  # llega el evento / exit()
estado = {"bash": "ejecución", "gcc": "-", "spotify": "preparado"}  # "-": gcc aún no existe
EVENTOS = [  # (proceso, estado que se pide, motivo)
    ("gcc", "nuevo", "bash hace fork()"),
    ("gcc", "preparado", "el SO lo admite"),
    ("bash", "bloqueado", "bash llama a wait()"),
    ("gcc", "ejecución", "el despachador lo elige"),
    ("gcc", "ejecución", "exec(gcc): mismo proceso, otro código"),
    ("gcc", "bloqueado", "pide practica.c al disco"),
    ("gcc", "ejecución", "¿y si se cuela en la CPU?"),
    ("spotify", "ejecución", "el despachador lo elige"),
    ("gcc", "preparado", "interrupción: el disco terminó"),
    ("spotify", "preparado", "el temporizador lo expulsa"),
    ("gcc", "ejecución", "el despachador lo elige"),
    ("gcc", "terminado", "exit(0): compilación acabada"),
    ("bash", "preparado", "wait() vuelve: su hijo acabó"),
    ("bash", "ejecución", "el despachador lo elige"),
]
print(f"{'paso':>4} {'proceso':<8}{'de':>10} → {'a':<11}| {'bash':<11}{'gcc':<11}{'spotify':<11}motivo")
rechazados, max_cpu = 0, 0
for paso, (p, a, motivo) in enumerate(EVENTOS, start=1):
    de = estado[p]
    if (de, a) in LEGALES or (de == "-" and a == "nuevo"):  # fork() crea el proceso en estado nuevo
        estado[p] = a
    elif de == a:
        a = "(igual)"        # exec() cambia el código, no el estado
    else:
        a = "✗ no existe"    # transición prohibida: el estado no cambia
        rechazados += 1
    max_cpu = max(max_cpu, list(estado.values()).count("ejecución"))  # nunca más de 1 en una CPU
    print(f"{paso:>4} {p:<8}{de:>10} → {a:<11}| {estado['bash']:<11}{estado['gcc']:<11}{estado['spotify']:<11}{motivo}")
print(f"Transiciones rechazadas: {rechazados} · procesos en ejecución a la vez, como máximo: {max_cpu}")
