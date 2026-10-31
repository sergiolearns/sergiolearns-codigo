# Vectores y cadenas en MIPS ejercicios — Solución del nivel 1
# Del artículo «Vectores y cadenas en MIPS — ejercicios con vidas extra, un código de guardado cifrado y un récord que se cuela en la tabla (y el código que tenía una llave)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-ejercicios/
# nivel1.s: una vida extra de 2 para los que tienen 0 o 1 (solucion del nivel 1)
        .data
vidas:  .byte 3, 0, 1, 5, 0, 2      # vidas de cada jugador
n:      .word 6
bonus:  .space 6                    # el vector nuevo: un byte por jugador
tvec:   .asciiz "Con bonus:"
esp:    .asciiz " "
tcuan:  .asciiz "\nJugadores con bonus: "
        .text
        .globl main
main:   la   $t0, vidas             # puntero de lectura
        la   $t1, bonus             # puntero de escritura
        lw   $t5, n
        li   $t2, 0                 # i = 0
        li   $s0, 0                 # cuantos reciben bonus
bucle:  beq  $t2, $t5, fin
        lb   $t3, 0($t0)            # vidas[i]
        bgt  $t3, 1, guarda         # contraria de (vidas[i] <= 1)
        addi $t3, $t3, 2            # vida extra
        addi $s0, $s0, 1
guarda: sb   $t3, 0($t1)            # bonus[i] = vidas[i] (con o sin extra)
        addi $t0, $t0, 1            # bytes: los dos punteros +1
        addi $t1, $t1, 1
        addi $t2, $t2, 1
        j    bucle
fin:    li   $v0, 4
        la   $a0, tvec
        syscall
        la   $t1, bonus             # recorro el vector nuevo para imprimirlo
        li   $t2, 0
imp:    beq  $t2, $t5, cuenta
        li   $v0, 4
        la   $a0, esp
        syscall
        lb   $a0, 0($t1)
        li   $v0, 1
        syscall
        addi $t1, $t1, 1
        addi $t2, $t2, 1
        j    imp
cuenta: li   $v0, 4
        la   $a0, tcuan
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 10
        syscall
