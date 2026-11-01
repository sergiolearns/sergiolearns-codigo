# Subrutinas en MIPS ejercicios — Solución del nivel 2
# Del artículo «Subrutinas en MIPS — ejercicios con la media de una ronda, un veneno que hay que pasar a subrutina y los combos que caben en tu energía (y el contador que con 6 de energía solo veía 4 combos)»
# https://sergiolearns.com/subrutinas-en-mips-ejercicios/
# nivel2.s: el veneno con las subrutinas aplica e imprime (solucion del nivel 2)
        .data
V:      .word 40, 12, 33, 8, 27, 50, 9, 0   # vida de cada enemigo; el 0 marca el final
N:      .word 8
tantes: .asciiz "Antes:   "
tdesp:  .asciiz "Despues: "
tven:   .asciiz "Envenenados: "
        .text
        .globl main
main:   la $a0, tantes
        li $v0, 4
        syscall
        la $a0, V
        jal imprime
        lw $s1, N
        li $s0, 0               # i
        li $s2, 0               # cuenta
mientras:
        bge $s0, $s1, fin       # i <= N - 1 ...
        sll $t0, $s0, 2
        lw $t1, V($t0)
        beqz $t1, fin           # ... y V[i] <> 0
        andi $t2, $s0, 1
        bnez $t2, siguiente     # solo las posiciones pares
        la $a0, V               # aplica(V, i)
        move $a1, $s0
        jal aplica
        addi $s2, $s2, 1
siguiente:
        addi $s0, $s0, 1        # i y la cuenta estan en $s: aplica no los toca
        j mientras
fin:    la $a0, tdesp
        li $v0, 4
        syscall
        la $a0, V
        jal imprime
        la $a0, tven
        li $v0, 4
        syscall
        move $a0, $s2
        li $v0, 1
        syscall
        li $v0, 10
        syscall

# aplica: si V[i] > 15, V[i] = V[i] - 15; si no, V[i] = 1
# Entrada: $a0 = direccion de V, $a1 = i. No devuelve nada. Usa $t0 y $t1.
aplica: sll $t0, $a1, 2         # i * 4
        add $t0, $a0, $t0       # $t0 = &V[i]
        lw $t1, 0($t0)
        ble $t1, 15, ap_uno
        addi $t1, $t1, -15
        j ap_guarda
ap_uno: li $t1, 1
ap_guarda:
        sw $t1, 0($t0)
        jr $ra

# imprime: los numeros de un vector terminado en 0, separados por espacios
# Entrada: $a0 = direccion del vector. Usa $t0.
imprime:
        move $t0, $a0
im_otro:
        lw $a0, 0($t0)
        beqz $a0, im_fin
        li $v0, 1
        syscall
        li $a0, ' '
        li $v0, 11
        syscall
        addi $t0, $t0, 4
        j im_otro
im_fin: li $a0, 10
        li $v0, 11
        syscall
        jr $ra
