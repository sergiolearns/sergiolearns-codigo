def potencia(base, exp):
    if exp == 0:
        return 1
    if exp == 1:
        return base
    mitad = exp // 2
    return potencia(base, mitad) * potencia(base, exp - mitad)


base = 2
exp = 8
print(f"{base}^{exp} = {potencia(base, exp)}")
