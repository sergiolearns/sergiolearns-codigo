# SergioLearns · Matemática discreta (MD) · Árboles
# Compruébalo con Python
# https://sergiolearns.com/arboles-matematica-discreta-practica/

def evalua_postfija(tokens, valores):
    pila = []
    ops = {"+": lambda x, y: x + y, "-": lambda x, y: x - y,
           "*": lambda x, y: x * y, "/": lambda x, y: x / y, "^": lambda x, y: x ** y}
    for t in tokens:
        if t in ops:
            y = pila.pop()       # el de arriba es el SEGUNDO operando
            x = pila.pop()
            pila.append(ops[t](x, y))
        else:
            pila.append(valores.get(t, None) or float(t))
        print(t.ljust(2), pila)
    return pila[0]

post = "a 2 b * - 2 ^ c 3 + / 4 c * +".split()
print("Resultado:", evalua_postfija(post, {"a": 8, "b": 1, "c": 3}))
