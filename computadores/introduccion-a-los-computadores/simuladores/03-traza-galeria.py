# Compruébalo con Python · Traza del problema 1: el contador de fotos de la galería
# Del artículo «Introducción a los computadores — práctica con problemas guiados paso a paso: la traza del ciclo de instrucción, el reloj y una cuestión con el formato del examen (y el contador que acabó con 226 fotos)»
# https://sergiolearns.com/introduccion-a-los-computadores-practica/

# Una máquina de Von Neumann de juguete: palabras de 16 bits = código de operación (4 bits) + dirección (12 bits)
OPS = {0x1: "LOAD", 0x2: "STORE", 0x5: "ADD", 0x6: "SUB", 0x8: "JUMP", 0xF: "HALT"}

# Problema 1 de la práctica: actualizar el contador de fotos de la galería
mem = {0x040: 0x10E0,   # LOAD  0E0 -> AC = fotos que había
       0x041: 0x50E1,   # ADD   0E1 -> + fotos nuevas
       0x042: 0x60E2,   # SUB   0E2 -> - fotos borradas
       0x043: 0x20E0,   # STORE 0E0 -> el contador se sobrescribe
       0x044: 0xF000,   # HALT
       0x0E0: 0x00C7,   # fotos en la galería (199)
       0x0E1: 0x0003,   # fotos nuevas (3)
       0x0E2: 0x0001}   # fotos borradas (1)

pc, ac, accesos, h = 0x040, 0, 0, lambda v, n=4: f"{v:0{n}X}"
while True:
    # Ciclo de captación: la dirección sale del PC, la instrucción llega por el MBR y acaba en el IR
    mar = pc; mbr = mem[mar]; ir = mbr; pc += 1; accesos += 1
    op, dire = ir >> 12, ir & 0xFFF
    print(f"captación  PC={h(pc,3)}  MAR={h(mar,3)}  MBR={h(mbr)}  IR={h(ir)}  -> {OPS[op]} {h(dire,3)}")
    # Ciclo de ejecución: depende del código de operación
    if op == 0xF:
        print("ejecución  HALT: la CPU se para"); break
    elif op == 0x8:
        pc = dire                                    # control: rompe la secuencia
    elif op == 0x2:
        mar = dire; mbr = ac; mem[mar] = mbr; accesos += 1   # procesador -> memoria
    else:
        mar = dire; mbr = mem[mar]; accesos += 1    # memoria -> procesador
        ac = mbr if op == 0x1 else (ac + mbr if op == 0x5 else ac - mbr)
    print(f"ejecución  MAR={h(mar,3)}  MBR={h(mbr)}  AC={h(ac)}  PC={h(pc,3)}")

print(f"\nContador en 0E0: {h(mem[0x0E0])} = {mem[0x0E0]}")
print("Accesos a memoria:", accesos, "(uno por captación y uno por LOAD, ADD, SUB o STORE)")
