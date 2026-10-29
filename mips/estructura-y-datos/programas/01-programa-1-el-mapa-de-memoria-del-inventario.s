# Estructura y datos en MIPS práctica — Programa 1: El mapa de memoria del inventario
# Del artículo «Estructura de un programa y datos en MIPS — práctica con el mapa del inventario, un cartel de game over y la misma memoria leída de dos formas (y el cartel que imprimí con cuatro syscalls)»
# https://sergiolearns.com/estructura-y-datos-en-mips-practica/
# mapa.s: imprime en qué dirección ha quedado cada dato del inventario
# y a cuántos bytes está del primero (vidas)
        .data
vidas:   .byte 3                    # 1 byte
nivel:   .byte 12                   # 1 byte
monedas: .half 1250                 # 2 bytes, en dirección par
puntos:  .word 48000                # 4 bytes, en múltiplo de 4
arma:    .asciiz "Espada"           # 7 bytes (6 letras + byte 0)
record:  .word 99999                # 4 bytes: aquí habrá relleno antes
t_vid:   .asciiz "vidas   -> "
t_mon:   .asciiz "monedas -> "
t_pun:   .asciiz "puntos  -> "
t_arm:   .asciiz "arma    -> "
t_rec:   .asciiz "record  -> "
t_mas:   .asciiz "  (+"
t_fin:   .asciiz " bytes)\n"
        .text
        .globl main
main:   la   $s0, vidas             # $s0 = dirección de vidas: todo se mide desde aquí

        li   $v0, 4                 # el nombre del dato
        la   $a0, t_vid
        syscall
        la   $t0, vidas             # $t0 = dirección del dato
        li   $v0, 1                 # la dirección, como entero en decimal
        move $a0, $t0
        syscall
        li   $v0, 4                 # "  (+"
        la   $a0, t_mas
        syscall
        li   $v0, 1                 # distancia = dirección del dato - dirección de vidas
        sub  $a0, $t0, $s0
        syscall
        li   $v0, 4                 # " bytes)" y salto de línea
        la   $a0, t_fin
        syscall

        li   $v0, 4                 # el nombre del dato
        la   $a0, t_mon
        syscall
        la   $t0, monedas           # $t0 = dirección del dato
        li   $v0, 1                 # la dirección, como entero en decimal
        move $a0, $t0
        syscall
        li   $v0, 4                 # "  (+"
        la   $a0, t_mas
        syscall
        li   $v0, 1                 # distancia = dirección del dato - dirección de vidas
        sub  $a0, $t0, $s0
        syscall
        li   $v0, 4                 # " bytes)" y salto de línea
        la   $a0, t_fin
        syscall

        li   $v0, 4                 # el nombre del dato
        la   $a0, t_pun
        syscall
        la   $t0, puntos            # $t0 = dirección del dato
        li   $v0, 1                 # la dirección, como entero en decimal
        move $a0, $t0
        syscall
        li   $v0, 4                 # "  (+"
        la   $a0, t_mas
        syscall
        li   $v0, 1                 # distancia = dirección del dato - dirección de vidas
        sub  $a0, $t0, $s0
        syscall
        li   $v0, 4                 # " bytes)" y salto de línea
        la   $a0, t_fin
        syscall

        li   $v0, 4                 # el nombre del dato
        la   $a0, t_arm
        syscall
        la   $t0, arma              # $t0 = dirección del dato
        li   $v0, 1                 # la dirección, como entero en decimal
        move $a0, $t0
        syscall
        li   $v0, 4                 # "  (+"
        la   $a0, t_mas
        syscall
        li   $v0, 1                 # distancia = dirección del dato - dirección de vidas
        sub  $a0, $t0, $s0
        syscall
        li   $v0, 4                 # " bytes)" y salto de línea
        la   $a0, t_fin
        syscall

        li   $v0, 4                 # el nombre del dato
        la   $a0, t_rec
        syscall
        la   $t0, record            # $t0 = dirección del dato
        li   $v0, 1                 # la dirección, como entero en decimal
        move $a0, $t0
        syscall
        li   $v0, 4                 # "  (+"
        la   $a0, t_mas
        syscall
        li   $v0, 1                 # distancia = dirección del dato - dirección de vidas
        sub  $a0, $t0, $s0
        syscall
        li   $v0, 4                 # " bytes)" y salto de línea
        la   $a0, t_fin
        syscall

        li   $v0, 10                # fin del programa
        syscall
