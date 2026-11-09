def potencia(base, exp):
    if exp == 0:
        return 1
    mitad = potencia(base, exp // 2)
    if exp % 2 == 0:
        return mitad * mitad
    return mitad * mitad * base


base = 2
exp = 8
print(f"{base}^{exp} = {potencia(base, exp)}")
