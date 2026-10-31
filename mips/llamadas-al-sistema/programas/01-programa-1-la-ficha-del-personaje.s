# Llamadas al sistema en MIPS práctica — Programa 1: La ficha del personaje
# Del artículo «Llamadas al sistema en MIPS — práctica con QtSpim: la ficha del personaje, un menú de clases que no se deja engañar y 20 puntos que repartir (y el saludo que se partió en dos líneas)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-practica/
# ficha.s: la ficha del personaje (nombre, gremio y edad)
        .data
nombre: .space 16            # hasta 15 caracteres
gremio: .space 20            # hasta 19 caracteres
edad:   .word 0
pnom:   .asciiz "Nombre: "
pgre:   .asciiz "Gremio: "
pedad:  .asciiz "Edad: "
tcab:   .asciiz "\n--- Ficha del personaje ---\n"
tnom:   .asciiz "Nombre:\t"
tgre:   .asciiz "\nGremio:\t"
tedad:  .asciiz "\nEdad:\t"
tfin:   .asciiz "\n---------------------------\n"
        .text
        .globl main
main:   # --- 1. pedir los datos ---
        la $a0, pnom
        li $v0, 4
        syscall
        la $a0, nombre       # read_string(nombre, 16)
        li $a1, 16
        li $v0, 8
        syscall
        la $a0, pgre
        li $v0, 4
        syscall
        la $a0, gremio       # read_string(gremio, 20)
        li $a1, 20
        li $v0, 8
        syscall
        la $a0, pedad
        li $v0, 4
        syscall
        li $v0, 5            # read_int
        syscall
        sw $v0, edad         # a memoria antes de cualquier otra syscall
        # --- 2. quitar el '\n' del nombre ---
        la $t0, nombre
q1:     lbu $t1, 0($t0)
        beq $t1, '\n', f1    # el salto: lo cambio por '\0'
        beqz $t1, h1         # cadena llena: no hay salto
        addi $t0, $t0, 1
        j q1
f1:     sb $zero, 0($t0)
h1:     # --- 3. lo mismo con el gremio ---
        la $t0, gremio
q2:     lbu $t1, 0($t0)
        beq $t1, '\n', f2
        beqz $t1, h2
        addi $t0, $t0, 1
        j q2
f2:     sb $zero, 0($t0)
h2:     # --- 4. imprimir la ficha ---
        la $a0, tcab
        li $v0, 4
        syscall
        la $a0, tnom
        li $v0, 4
        syscall
        la $a0, nombre
        li $v0, 4
        syscall
        la $a0, tgre
        li $v0, 4
        syscall
        la $a0, gremio
        li $v0, 4
        syscall
        la $a0, tedad
        li $v0, 4
        syscall
        lw $a0, edad         # el valor guardado en memoria
        li $v0, 1
        syscall
        la $a0, tfin
        li $v0, 4
        syscall
        li $v0, 10
        syscall
