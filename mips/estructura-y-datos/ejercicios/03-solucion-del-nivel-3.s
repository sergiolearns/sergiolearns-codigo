# Estructura y datos en MIPS ejercicios — Solución del Nivel 3: Un mensaje escrito solo con números
# Del artículo «Estructura de un programa y datos en MIPS — ejercicios con la ficha de un personaje, la memoria de una tienda y un mensaje escrito solo con números (y el programa que no sabía terminar)»
# https://sergiolearns.com/estructura-y-datos-en-mips-ejercicios/
# nivel3.s: "GG WP!" escrito solo con .word (solución del nivel 3)
# Bytes que queremos, en orden de dirección: 47 47 20 57 | 50 21 0A 00
# En little endian, el primer byte es el MENOS significativo de cada palabra.
        .data
mensaje: .word 0x57204747           # bytes 47 47 20 57 -> "GG W"
         .word 0x000A2150           # bytes 50 21 0A 00 -> "P!\n" y el byte 0
t_num:   .asciiz "La primera palabra vale "
salto:   .asciiz "\n"
        .text
        .globl main
main:   li   $v0, 4                 # imprimimos las dos palabras como texto
        la   $a0, mensaje
        syscall
        la   $a0, t_num             # y la primera, como número
        syscall
        li   $v0, 1
        lw   $a0, mensaje
        syscall
        li   $v0, 4
        la   $a0, salto
        syscall
        li   $v0, 10
        syscall
