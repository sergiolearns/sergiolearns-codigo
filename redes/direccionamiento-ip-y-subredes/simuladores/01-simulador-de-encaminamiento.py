# Compruébalo con Python · Simulador de encaminamiento: ¿entrega directa o al router?
# Del artículo «Direccionamiento IP y subredes — teoría con máscaras, un AND bit a bit y un router que solo mira la red (y la máscara que me dejó hablando solo)»
# https://sergiolearns.com/direccionamiento-ip-y-subredes/

# Compruébalo con Python: ¿entrega directa o al router? (Tema 3 de IC2)
# Datos fijos: el portátil del aula 7 y la tabla del router de la facultad.

def a_bits(ip):                      # "10.110.7.24" -> un entero de 32 bits
    a, b, c, d = (int(x) for x in ip.split("."))
    return a << 24 | b << 16 | c << 8 | d   # cada byte ocupa su sitio de 8 bits

def a_texto(n):                      # el camino inverso: entero -> "a.b.c.d"
    return ".".join(str(n >> s & 255) for s in (24, 16, 8, 0))

def red(ip, mascara):                # la red sale de un AND bit a bit
    return a_texto(a_bits(ip) & a_bits(mascara))

def clase(ip):                       # solo miran los primeros bits del primer byte
    b = a_bits(ip) >> 24
    return "A" if b < 128 else "B" if b < 192 else "C" if b < 224 else "D"

PORTATIL, MASCARA, PASARELA = "10.110.7.24", "255.255.255.0", "10.110.7.1"
TABLA = [                            # router de la facultad: red, máscara, siguiente nodo
    ("10.110.7.0", "255.255.255.0", "directo"),
    ("10.110.12.0", "255.255.255.0", "directo"),
    ("10.200.1.0", "255.255.255.0", "10.110.1.2"),
    ("0.0.0.0", "0.0.0.0", "10.110.1.1"),         # por defecto: todo lo demás
]

def encamina(ip):                    # filas en orden, como el algoritmo de los apuntes
    for destino, mascara, siguiente in TABLA:
        if red(ip, mascara) == destino:  # N = ID AND máscara; ¿coincide con la fila?
            return siguiente
    return "descarta"                # sin fila por defecto, el datagrama se tira

bits = lambda ip: ".".join(f"{int(x):08b}" for x in ip.split("."))
for etiqueta, ip in (("destino", "10.200.1.80"), ("máscara", MASCARA), ("AND", red("10.200.1.80", MASCARA))):
    print(f"{etiqueta:>8}  {bits(ip)}  {ip}")
print(f"\n{'Destino':<16}{'Clase':<7}{'Red /24':<15}{'Portátil':<17}Router")
for d in ("10.110.7.200", "10.110.12.5", "10.200.1.80", "193.145.138.32"):
    misma = red(d, MASCARA) == red(PORTATIL, MASCARA)   # ¿la misma red que el portátil?
    p, r = ("directo", "-") if misma else ("a " + PASARELA, encamina(d))
    print(f"{d:<16}{clase(d):<7}{red(d, MASCARA):<15}{p:<17}{r}")
