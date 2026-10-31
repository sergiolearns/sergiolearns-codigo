# Vectores y cadenas en MIPS práctica — Programa 1: La tabla de récords
# Del artículo «Vectores y cadenas en MIPS — práctica con QtSpim: la tabla de récords, un letrero que se enciende en mayúsculas y un espejo para los mensajes (y el letrero que se apagó en el primer espacio)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-practica/
# ranking.s: la tabla de records, con un mismo indice para dos vectores
        .data
puntos: .half 9850, 15600, 7320, 12400, 11050, 8800   # 6 records (2 bytes cada uno)
n:      .word 6
minimo: .word 10000                 # a partir de aqui, record destacado
nombres: .asciiz "SAM", "LEO", "ANA", "MAX", "ZOE", "KAI"   # 4 bytes cada nombre
punto:  .asciiz ". "
esp:    .asciiz "  "
marca:  .asciiz "  <- mas de 10000"
nl:     .asciiz "\n"
tcuan:  .asciiz "Records de mas de 10000: "
ttot:   .asciiz "\nPuntos entre todos: "
        .text
        .globl main
main:   la   $s2, puntos            # base de los records
        la   $s3, nombres           # base de los nombres
        lw   $s4, n                 # $s4 = 6
        lw   $s5, minimo            # $s5 = 10000
        li   $s0, 0                 # cuantos superan el minimo
        li   $s1, 0                 # suma de todos los puntos
        li   $t2, 0                 # i = 0
bucle:  beq  $t2, $s4, fin
        li   $v0, 1                 # puesto = i + 1
        addi $a0, $t2, 1
        syscall
        li   $v0, 4
        la   $a0, punto
        syscall
        sll  $t5, $t2, 2            # i * 4: desplazamiento en nombres
        add  $a0, $s3, $t5          # $a0 = direccion de nombres[i]
        li   $v0, 4
        syscall
        li   $v0, 4
        la   $a0, esp
        syscall
        sll  $t4, $t2, 1            # i * 2: desplazamiento en puntos
        add  $t4, $t4, $s2          # $t4 = direccion de puntos[i]
        lh   $t3, 0($t4)            # $t3 = puntos[i]
        add  $s1, $s1, $t3          # suma = suma + puntos[i]
        li   $v0, 1
        move $a0, $t3
        syscall
        blt  $t3, $s5, nomarca      # contraria de (puntos[i] >= 10000)
        addi $s0, $s0, 1            # cuento el record destacado
        li   $v0, 4
        la   $a0, marca
        syscall
nomarca: li  $v0, 4
        la   $a0, nl
        syscall
        addi $t2, $t2, 1            # con indice, solo avanza i
        j    bucle
fin:    li   $v0, 4
        la   $a0, tcuan
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, ttot
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 10
        syscall
