# Estructura y datos en MIPS ejercicios — Solución del Nivel 1: La ficha de un personaje
# Del artículo «Estructura de un programa y datos en MIPS — ejercicios con la ficha de un personaje, la memoria de una tienda y un mensaje escrito solo con números (y el programa que no sabía terminar)»
# https://sergiolearns.com/estructura-y-datos-en-mips-ejercicios/
# nivel1.s: la ficha de un personaje (solución del nivel 1)
        .data
nombre:   .asciiz "Aria"            # 4 letras + byte 0 = 5 bytes
vidas:    .byte 5                   # 1 byte, justo detrás
oro:      .half 300                 # 2 bytes, en dirección par (aquí ya lo es)
exp:      .word 12500               # 4 bytes: a un múltiplo de 4
mochila:  .space 8                  # 8 bytes vacíos para objetos
municion: .word 40                  # tras .space 8 ya está alineada
t_nom:    .asciiz "Personaje: "
t_exp:    .asciiz "\nExperiencia: "
t_mun:    .asciiz "\nMunicion: "
salto:    .asciiz "\n"
        .text
        .globl main
main:   li   $v0, 4                 # "Personaje: "
        la   $a0, t_nom
        syscall
        la   $a0, nombre            # la cadena: syscall 4 quiere su DIRECCIÓN
        syscall
        la   $a0, t_exp             # $v0 sigue valiendo 4
        syscall
        li   $v0, 1                 # la experiencia: syscall 1 quiere el VALOR
        lw   $a0, exp
        syscall
        li   $v0, 4
        la   $a0, t_mun
        syscall
        li   $v0, 1
        lw   $a0, municion
        syscall
        li   $v0, 4
        la   $a0, salto
        syscall
        li   $v0, 10
        syscall
