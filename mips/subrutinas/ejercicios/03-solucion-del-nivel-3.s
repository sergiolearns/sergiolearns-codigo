# Subrutinas en MIPS ejercicios — Solución del nivel 3
# Del artículo «Subrutinas en MIPS — ejercicios con la media de una ronda, un veneno que hay que pasar a subrutina y los combos que caben en tu energía (y el contador que con 6 de energía solo veía 4 combos)»
# https://sergiolearns.com/subrutinas-en-mips-ejercicios/
# nivel3.s: cuantos combos caben en la energia (solucion del nivel 3)
# formas(n) = 1 si n <= 1;  formas(n) = formas(n - 1) + formas(n - 2)
        .data
llamadas: .word 0               # cuantas veces se llama a formas
ta:     .asciiz "Con 6 de energia hay "
tb:     .asciiz " combos posibles ("
tc:     .asciiz " llamadas)"
        .text
        .globl main
main:   li $a0, 6
        jal formas
        move $s0, $v0
        la $a0, ta
        li $v0, 4
        syscall
        move $a0, $s0
        li $v0, 1
        syscall
        la $a0, tb
        li $v0, 4
        syscall
        lw $a0, llamadas
        li $v0, 1
        syscall
        la $a0, tc
        li $v0, 4
        syscall
        li $v0, 10
        syscall

# formas: $a0 = energia -> $v0 = combos de golpes ligeros (1) y fuertes (2) que la gastan entera
formas: lw $t0, llamadas        # una llamada mas
        addi $t0, $t0, 1
        sw $t0, llamadas
        bgt $a0, 1, fo_rec
        li $v0, 1               # caso base: con 0 o 1 de energia, una forma
        jr $ra                  # hoja en este caso: no he tocado la pila
fo_rec: addi $sp, $sp, -12      # $ra, n y el primer resultado
        sw $ra, 8($sp)
        sw $a0, 4($sp)
        addi $a0, $a0, -1
        jal formas              # $v0 = formas(n - 1)
fo_medio:
        sw $v0, 0($sp)          # lo guardo: la siguiente llamada pisa $v0
        lw $a0, 4($sp)
        addi $a0, $a0, -2
        jal formas              # $v0 = formas(n - 2)
        lw $t0, 0($sp)
        add $v0, $v0, $t0       # formas(n - 1) + formas(n - 2)
        lw $ra, 8($sp)
        addi $sp, $sp, 12
        jr $ra
