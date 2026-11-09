def hanoi(n, origen, destino, auxiliar):
    if n == 0:
        return
    hanoi(n - 1, origen, auxiliar, destino)
    print("Disco", n, "de", origen, "a", destino)
    hanoi(n - 1, auxiliar, destino, origen)


n = 3
hanoi(n, "A", "C", "B")
