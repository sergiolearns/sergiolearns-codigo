# Subrutinas en MIPS ejercicios — Solución del nivel 1
# Del artículo «Subrutinas en MIPS — ejercicios con la media de una ronda, un veneno que hay que pasar a subrutina y los combos que caben en tu energía (y el contador que con 6 de energía solo veía 4 combos)»
# https://sergiolearns.com/subrutinas-en-mips-ejercicios/
# nivel1.s: la media de dano de cada ronda (solucion del nivel 1)
        .data
ronda1: .word 5, 12, 7, 20, 9, 15   # primero N, despues los N golpes
ronda2: .word 3, 30, 25, 41
rondas: .word ronda1, ronda2        # tabla de direcciones de las rondas
tron:   .asciiz "Ronda "
tmed:   .asciiz ": media "
tres:   .asciiz " (resto "
cierra: .asciiz ")\n"
        .text
        .globl main
main:   li $s0, 0               # i: ronda que toca
mvuelta:
        bge $s0, 2, mfin
        sll $t0, $s0, 2
        lw $a0, rondas($t0)     # $a0 = direccion de la ronda i
        jal media               # $v0 = cociente, $v1 = resto
        move $s1, $v0           # los dos resultados, fuera de $v0/$v1
        move $s2, $v1
        la $a0, tron
        li $v0, 4
        syscall
        addi $a0, $s0, 1        # numero de ronda: i + 1
        li $v0, 1
        syscall
        la $a0, tmed
        li $v0, 4
        syscall
        move $a0, $s1
        li $v0, 1
        syscall
        la $a0, tres
        li $v0, 4
        syscall
        move $a0, $s2
        li $v0, 1
        syscall
        la $a0, cierra
        li $v0, 4
        syscall
        addi $s0, $s0, 1
        j mvuelta
mfin:   li $v0, 10
        syscall

# media: vector con N en la primera palabra y los N datos detras
# Entrada: $a0 = direccion del vector. Salida: $v0 = media entera, $v1 = resto. Usa $t0-$t2.
media:  lw $t0, 0($a0)          # $t0 = N
        move $t1, $t0           # $t1 = cuantos quedan por sumar
        li $t2, 0               # $t2 = suma
me_suma:
        blez $t1, me_div
        addi $a0, $a0, 4        # el primer dato esta en 4($a0)
        lw $t3, 0($a0)
        add $t2, $t2, $t3
        addi $t1, $t1, -1
        j me_suma
me_div: div $t2, $t0            # LO = cociente, HI = resto
        mflo $v0
        mfhi $v1
        jr $ra
