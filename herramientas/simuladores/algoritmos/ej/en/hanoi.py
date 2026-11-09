def hanoi(n, source, dest, spare):
    if n == 0:
        return
    hanoi(n - 1, source, spare, dest)
    print("Disk", n, "from", source, "to", dest)
    hanoi(n - 1, spare, dest, source)


n = 3
hanoi(n, "A", "C", "B")
