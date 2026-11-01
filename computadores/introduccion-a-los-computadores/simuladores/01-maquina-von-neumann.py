# Compruébalo con Python · Una máquina de Von Neumann de juguete: subir el brillo de un píxel
# Del artículo «Introducción a los computadores — teoría con una foto de la pizarra, la arquitectura de Von Neumann, el ciclo de instrucción y un hola mundo que baja 7 pisos (y los «cero» computadores que llevaba encima)»
# https://sergiolearns.com/introduccion-a-los-computadores/

# Una máquina de Von Neumann de juguete: palabras de 16 bits = código de operación (4 bits) + dirección (12 bits)
OPS = {0x1: "LOAD", 0x2: "STORE", 0x5: "ADD", 0x6: "SUB", 0x8: "JUMP", 0xF: "HALT"}

# Programa y datos en LA MISMA memoria (programa almacenado): subir el brillo de un píxel de la foto
mem = {0x100: 0x1A20,   # LOAD  A20 -> AC = brillo
       0x101: 0x5A21,   # ADD   A21 -> AC = AC + subida
       0x102: 0x2A22,   # STORE A22 -> brillo nuevo
       0x103: 0xF000,   # HALT
       0xA20: 0x0040,   # brillo del píxel (64)
       0xA21: 0x0018,   # cuánto lo subimos (24)
       0xA22: 0x0000}   # aquí irá el resultado

pc, ac, accesos, h = 0x100, 0, 0, lambda v, n=4: f"{v:0{n}X}"
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

print(f"\nBrillo nuevo en A22: {h(mem[0xA22])} = {mem[0xA22]}")
print("Accesos a memoria:", accesos, "(uno por captación y uno por LOAD, ADD o STORE)")
