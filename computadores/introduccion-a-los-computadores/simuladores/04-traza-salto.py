# Comprobación del nivel 2: una traza con un salto
# Del artículo «Introducción a los computadores — ejercicios resueltos con cronogramas, una traza con salto, una fila de la foto en 2 bits y un cuestionario para practicar (y los 2,5 GHz que convertí en 2,5 ns)»
# https://sergiolearns.com/introduccion-a-los-computadores-ejercicios/

# Una máquina de Von Neumann de juguete: palabras de 16 bits = código de operación (4 bits) + dirección (12 bits)
OPS = {0x1: "LOAD", 0x2: "STORE", 0x5: "ADD", 0x6: "SUB", 0x8: "JUMP", 0xF: "HALT"}

# Nivel 2 de los ejercicios: el filtro con un salto (JUMP) que se salta una instrucción
mem = {0x200: 0x1B00,   # LOAD  B00 -> AC = valor de rojo del píxel
       0x201: 0x5B01,   # ADD   B01 -> + ajuste
       0x202: 0x8204,   # JUMP  204 -> salta a 204
       0x203: 0x5B01,   # ADD   B01 -> (no se ejecuta)
       0x204: 0x2B02,   # STORE B02 -> resultado
       0x205: 0xF000,   # HALT
       0xB00: 0x0030,   # rojo del píxel (48)
       0xB01: 0x0005,   # ajuste (5)
       0xB02: 0x0000}   # resultado

pc, ac, accesos, h = 0x200, 0, 0, lambda v, n=4: f"{v:0{n}X}"
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

print(f"\nResultado en B02: {h(mem[0xB02])} = {mem[0xB02]}")
print("Accesos a memoria:", accesos, "(uno por captación y uno por LOAD, ADD o STORE; JUMP y HALT no tocan datos)")
