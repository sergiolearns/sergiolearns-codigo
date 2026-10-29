# Estructura y datos en MIPS práctica — Programa 3: El detective de la memoria
# Del artículo «Estructura de un programa y datos en MIPS — práctica con el mapa del inventario, un cartel de game over y la misma memoria leída de dos formas (y el cartel que imprimí con cuatro syscalls)»
# https://sergiolearns.com/estructura-y-datos-en-mips-practica/
# detective.s: la misma memoria leída como texto y como número
# La palabra 0x544F4F4C guarda, en little endian, los bytes 4C 4F 4F 54: "LOOT"
        .data
botin:   .word   0x544F4F4C         # una palabra escrita como número...
         .byte   0                  # ...y un byte 0 para poder imprimirla como texto
         .align  2                  # la cadena empieza en un múltiplo de 4: así lw puede leerla
texto:   .asciiz "LOOT"             # la misma palabra escrita como cadena
t1:      .asciiz "Como texto:  "
t2:      .asciiz "\nComo numero: "
t3:      .asciiz "\nLa cadena \"LOOT\" como numero: "
salto:   .asciiz "\n"
        .text
        .globl main
main:   li   $v0, 4                 # 1) la palabra impresa como texto
        la   $a0, t1
        syscall
        la   $a0, botin             # syscall 4 recibe la DIRECCIÓN (la)
        syscall
        li   $v0, 4                 # 2) la misma palabra impresa como número
        la   $a0, t2
        syscall
        li   $v0, 1
        lw   $a0, botin             # syscall 1 recibe el VALOR (lw)
        syscall
        li   $v0, 4                 # 3) los cuatro primeros bytes de la cadena, como número
        la   $a0, t3
        syscall
        li   $v0, 1
        lw   $a0, texto
        syscall
        li   $v0, 4
        la   $a0, salto
        syscall
        li   $v0, 10
        syscall
