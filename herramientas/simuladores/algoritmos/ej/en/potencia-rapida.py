def power(base, exp):
    if exp == 0:
        return 1
    half = power(base, exp // 2)
    if exp % 2 == 0:
        return half * half
    return half * half * base


base = 2
exp = 8
print(f"{base}^{exp} = {power(base, exp)}")
