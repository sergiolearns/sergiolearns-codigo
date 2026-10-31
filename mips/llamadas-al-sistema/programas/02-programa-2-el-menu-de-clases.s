# Llamadas al sistema en MIPS práctica — Programa 2: El menú de clases
# Del artículo «Llamadas al sistema en MIPS — práctica con QtSpim: la ficha del personaje, un menú de clases que no se deja engañar y 20 puntos que repartir (y el saludo que se partió en dos líneas)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-practica/
# clases.s: menu de clases con descripcion y confirmacion
        .data
resp:   .space 8             # respuesta s/n
nombres: .word cg, cm, ca    # tabla de nombres
descs:  .word dg, dm, da     # tabla de descripciones (mismo indice)
cg:     .asciiz "Guerrero"
cm:     .asciiz "Maga"
ca:     .asciiz "Arquera"
dg:     .asciiz "Mucha vida y armadura pesada. Lento."
dm:     .asciiz "Hechizos de area. Poca vida."
da:     .asciiz "Ataca de lejos y esquiva bien."
pmenu:  .asciiz "\nElige clase:\n 1) Guerrero\n 2) Maga\n 3) Arquera\nOpcion: "
tmal:   .asciiz "Opcion no valida: escribe 1, 2 o 3.\n"
tsep:   .asciiz ": "
pconf:  .asciiz "\nTe quedas con esta clase? (s/n): "
tfin:   .asciiz "Clase confirmada: "
        .text
        .globl main
main:   # --- 1. pedir una opcion hasta que sea valida ---
menu:   la $a0, pmenu
        li $v0, 4
        syscall
        li $v0, 5            # read_int
        syscall
        move $s0, $v0
        blt $s0, 1, mal
        bgt $s0, 3, mal
        # --- 2. el mismo desplazamiento sirve para las dos tablas ---
        addi $s1, $s0, -1    # indice desde 0
        sll $s1, $s1, 2      # $s1 = (opcion - 1) * 4
        lw $a0, nombres($s1) # direccion del nombre
        li $v0, 4
        syscall
        la $a0, tsep
        li $v0, 4
        syscall
        lw $a0, descs($s1)   # direccion de la descripcion
        li $v0, 4
        syscall
        # --- 3. confirmar: leo la linea entera y miro la primera letra ---
        la $a0, pconf
        li $v0, 4
        syscall
        la $a0, resp
        li $a1, 8
        li $v0, 8            # read_string
        syscall
        lbu $t0, resp
        beq $t0, 's', vale
        beq $t0, 'S', vale
        j menu               # cualquier otra cosa: vuelta al menu
mal:    la $a0, tmal
        li $v0, 4
        syscall
        j menu
vale:   la $a0, tfin
        li $v0, 4
        syscall
        lw $a0, nombres($s1) # $s1 sigue intacto: ninguna syscall lo toca
        li $v0, 4
        syscall
        li $v0, 10
        syscall
