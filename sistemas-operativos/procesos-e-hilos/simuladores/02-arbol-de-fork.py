# Compruébalo con Python · Simulador de fork(): cuántos procesos crea un bucle con fork()
# Del artículo «Procesos e hilos — teoría con un gcc que nace, se bloquea y termina, un fork() que se multiplica y spotify con tres hilos (y el bucle que llenó mi terminal de «Hola»)»
# https://sergiolearns.com/procesos-e-hilos/

# Simulador de fork(): cuántos procesos crea  for (i = 0; i < N; i++) fork();
N = 3                     # vueltas del bucle
siguiente_pid = 4101      # el SO reparte PID nuevos en orden (./practica es el 4100)
procesos = [(4100, None, -1)]   # (pid, pid del padre, vuelta en la que nació; -1 = el original)
for i in range(N):
    vivos = list(procesos)          # foto ANTES de la vuelta: los hijos de esta vuelta no hacen este fork()
    for pid, _, _ in vivos:         # todos los que existen están en el bucle y llegan al fork()
        procesos.append((siguiente_pid, pid, i))   # el hijo sigue el bucle en la vuelta i + 1
        siguiente_pid += 1
    print(f"Tras la vuelta {i}: {len(vivos)} fork() → {len(procesos)} procesos")

hijos = {}                          # pid del padre → lista de sus hijos, para dibujar el árbol
for pid, padre, i in procesos:
    hijos.setdefault(padre, []).append((pid, i))

def dibuja(pid, i, prefijo, ultimo):
    rama = "" if i < 0 else ("└── " if ultimo else "├── ")
    nota = "./practica (el original)" if i < 0 else f"nace en la vuelta {i}"
    print(f"{prefijo}{rama}{pid}  {nota}")
    sub = prefijo + ("" if i < 0 else ("    " if ultimo else "│   "))
    lista = hijos.get(pid, [])
    for k, (h, j) in enumerate(lista):
        dibuja(h, j, sub, k == len(lista) - 1)

dibuja(4100, -1, "", True)
print(f"Procesos en total: {len(procesos)} = 2^{N} · hijos creados: {len(procesos) - 1} = 2^{N} - 1")
print(f"Un printf después del bucle se imprime {len(procesos)} veces (una por proceso)")
