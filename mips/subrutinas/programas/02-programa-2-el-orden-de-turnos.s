# Subrutinas en MIPS práctica — Programa 2: El orden de turnos
# Del artículo «Subrutinas en MIPS — práctica con QtSpim: el cartel del combate, el orden de turnos y un hechizo recursivo (y el hechizo de nivel 4 que hacía 0 de daño)»
# https://sergiolearns.com/subrutinas-en-mips-practica/
# orden.s: el orden de turnos: ordena llama a maximo con un vector que encoge
        .data
vel:    .word 14, 6, 17, 3, 11  # velocidad de cada personaje
nombres:.word n0, n1, n2, n3, n4 # direccion del nombre de cada uno
n0:     .asciiz "Kira"
n1:     .asciiz "Slime"
n2:     .asciiz "Arquera"
n3:     .asciiz "Golem"
n4:     .asciiz "Mago"
tit:    .asciiz "Orden de turnos:\n"
pyesp:  .asciiz ". "
abre:   .asciiz " ("
cierra: .asciiz ")\n"
        .text
        .globl main
main:   la $a0, vel             # --- 1. ordenar ---
        la $a1, nombres
        li $a2, 5
        jal ordena
        la $a0, tit             # --- 2. imprimir la lista ---
        li $v0, 4
        syscall
        li $s0, 0               # i
mlista: bge $s0, 5, mfin
        addi $a0, $s0, 1        # el puesto: i + 1
        li $v0, 1
        syscall
        la $a0, pyesp
        li $v0, 4
        syscall
        sll $t0, $s0, 2         # i * 4
        lw $a0, nombres($t0)    # direccion del nombre i
        syscall
        la $a0, abre
        syscall
        lw $a0, vel($t0)
        li $v0, 1
        syscall
        la $a0, cierra
        li $v0, 4
        syscall
        addi $s0, $s0, 1
        j mlista
mfin:   li $v0, 10
        syscall

# ordena: de mayor a menor velocidad, moviendo tambien los nombres
# Entrada: $a0 = vel, $a1 = nombres, $a2 = n. No devuelve nada.
ordena: addi $sp, $sp, -16      # $ra y tres $s: 4 palabras
        sw $ra, 12($sp)
        sw $s0, 8($sp)
        sw $s1, 4($sp)
        sw $s2, 0($sp)
or_dentro:
        move $s0, $a0           # $s0 = &vel[i] (empieza en i = 0)
        sub $s1, $a1, $a0       # $s1 = nombres - vel: la misma distancia para todos
        move $s2, $a2           # $s2 = cuantos quedan por colocar
or_vuelta:
        ble $s2, 1, or_fin      # con uno solo, ya esta en su sitio
        move $a0, $s0           # maximo(&vel[i], quedan)
        move $a1, $s2
        jal maximo              # $v1 = direccion del mas rapido
        lw $t0, 0($s0)          # intercambiar las velocidades
        lw $t1, 0($v1)
        sw $t1, 0($s0)
        sw $t0, 0($v1)
        add $t2, $s0, $s1       # &nombres[i]
        add $t3, $v1, $s1       # &nombres[del maximo]
        lw $t0, 0($t2)          # intercambiar los nombres
        lw $t1, 0($t3)
        sw $t1, 0($t2)
        sw $t0, 0($t3)
        addi $s0, $s0, 4        # el vector empieza una casilla despues...
        addi $s2, $s2, -1       # ...y tiene una menos
        j or_vuelta
or_fin: lw $s2, 0($sp)
        lw $s1, 4($sp)
        lw $s0, 8($sp)
        lw $ra, 12($sp)
        addi $sp, $sp, 16
        jr $ra

# maximo: devuelve la DIRECCION del mayor elemento, no su valor
# Entrada: $a0 = direccion del vector, $a1 = n (>= 1). Salida: $v1. Usa $t0 y $t1 y mueve $a0 y $a1.
maximo: lw $t0, 0($a0)          # $t0 = el mayor hasta ahora
        move $v1, $a0           # $v1 = donde esta
mx_sig: addi $a0, $a0, 4
        addi $a1, $a1, -1
        blez $a1, mx_fin
        lw $t1, 0($a0)
        ble $t1, $t0, mx_sig    # no es mayor: siguiente
        move $t0, $t1
        move $v1, $a0
        j mx_sig
mx_fin: jr $ra
