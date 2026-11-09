# Referencias con contadores explícitos (sin el arnés) para comparar con lo que cuenta el visualizador.
import random, json, re, sys
def c_lineal(l, x):
    c = 0
    for i in range(len(l)):
        c += 1
        if l[i] == x: return c
    return c
def c_binaria(l, x):
    c = 0; inf, sup = 0, len(l) - 1
    while inf <= sup:
        m = (inf + sup) // 2; c += 1
        if l[m] == x: return c
        c += 1
        if l[m] < x: inf = m + 1
        else: sup = m - 1
    return c
def c_burbuja(l):
    l = l[:]; c = 0; n = len(l)
    for v in range(n - 1):
        h = False
        for j in range(n - 1 - v):
            c += 1
            if l[j] > l[j + 1]: l[j], l[j + 1] = l[j + 1], l[j]; h = True
        if not h: break
    return c
def c_seleccion(l):
    n = len(l); return n * (n - 1) // 2
def c_insercion(l):
    l = l[:]; c = 0
    for i in range(1, len(l)):
        k = l[i]; j = i - 1
        while j >= 0:
            c += 1
            if not l[j] > k: break
            l[j + 1] = l[j]; j -= 1
        l[j + 1] = k
    return c
def c_mezcla(l):
    if len(l) <= 1: return l, 0
    m = len(l) // 2; a, ca = c_mezcla(l[:m]); b, cb = c_mezcla(l[m:]); r = []; i = j = 0; c = ca + cb
    while i < len(a) and j < len(b):
        c += 1
        if a[i] <= b[j]: r.append(a[i]); i += 1
        else: r.append(b[j]); j += 1
    return r + a[i:] + b[j:], c
def c_rapida(l):
    l = l[:]; c = [0]
    def q(i0, s):
        if i0 < s:
            p = l[s]; i = i0
            for j in range(i0, s):
                c[0] += 1
                if l[j] <= p: l[i], l[j] = l[j], l[i]; i += 1
            l[i], l[s] = l[s], l[i]; q(i0, i - 1); q(i + 1, s)
    q(0, len(l) - 1); return c[0]
def fib_calls(n): return 1 if n < 2 else 1 + fib_calls(n - 1) + fib_calls(n - 2)
def pot_calls(e): return 1 if e <= 1 else 1 + pot_calls(e // 2) + pot_calls(e - e // 2)
