def power(base, exp):
    if exp == 0:
        return 1
    if exp == 1:
        return base
    half = exp // 2
    return power(base, half) * power(base, exp - half)


base = 2
exp = 8
print(f"{base}^{exp} = {power(base, exp)}")
