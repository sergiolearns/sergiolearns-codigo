# Compruébalo con Python · Simulador de una caché de mapeo directo: la secuencia de la nota más alta, con la máxima en 192 y en 208
# Del artículo «Memoria caché de mapeo directo — teoría con una mesa de estudio, la dirección partida en etiqueta e índice y los tres tipos de fallo (y la tabla de AEDV que por columnas tardaba seis veces más)»
# https://sergiolearns.com/memoria-cache/

# Simulador de una caché de mapeo directo: la mesa de estudio con 8 huecos.
# 8 líneas, bloques de 2 palabras de 4 bytes, direcciones de 32 bits; dice acierto o fallo y de qué tipo.
LINEAS, PALABRAS, BYTES = 8, 2, 4
TAM_BLOQUE = PALABRAS * BYTES                     # 8 bytes por bloque


def simula(nombre, direcciones):
    cache = [None] * LINEAS                       # etiqueta de cada línea (None = bit de validez a 0)
    vistos, recientes, fallos = set(), [], 0      # bloques ya usados y su orden de uso
    print(nombre)
    for d in direcciones:
        bloque = d // TAM_BLOQUE                  # número de bloque
        linea = bloque % LINEAS                   # índice: el único sitio posible
        etiqueta = bloque // LINEAS               # lo que se guarda para reconocerlo
        palabra = (d // BYTES) % PALABRAS         # qué palabra del bloque
        if cache[linea] == etiqueta:
            tipo = "acierto"
        else:
            fallos += 1
            if bloque not in vistos:              # primera vez que se pide este bloque
                tipo = "fallo obligatorio"
            elif bloque not in recientes[-LINEAS:]:   # tampoco estaría en una caché sin sitio fijo
                tipo = "fallo de capacidad"
            else:                                 # cabría, pero otro bloque le quitó su línea
                tipo = "fallo de conflicto"
            cache[linea] = etiqueta               # el bloque entra y expulsa al que hubiera
        vistos.add(bloque)
        if bloque in recientes:
            recientes.remove(bloque)
        recientes.append(bloque)
        print(f"  {d:3d} = 00…{d:08b}  línea {linea:03b}  palabra {palabra}  etiqueta {etiqueta}  {tipo}")
    print(f"  tasa de fallos: {fallos}/{len(direcciones)} = {100 * fallos / len(direcciones):.1f} %".replace(".", ","))
    for i, e in enumerate(cache):                 # estado final, línea a línea
        if e is not None:
            b = (e * LINEAS + i) * TAM_BLOQUE     # primera dirección del bloque guardado
            print(f"  línea {i:03b}: V=1  etiqueta {e}  Mem[{b}] Mem[{b + 4}]")


simula("máxima en 192 (bloque 24, línea 0):", [64, 192, 68, 192, 72, 192, 76, 192])
simula("máxima en 208 (bloque 26, línea 2):", [64, 208, 68, 208, 72, 208, 76, 208])
etiqueta = 32 - 3 - 3                             # 32 bits menos índice (3) y desplazamiento (1 + 2)
print(f"tamaño total: {LINEAS} × (1 + {etiqueta} + {PALABRAS * 32}) = {LINEAS * (1 + etiqueta + PALABRAS * 32)} bits")
