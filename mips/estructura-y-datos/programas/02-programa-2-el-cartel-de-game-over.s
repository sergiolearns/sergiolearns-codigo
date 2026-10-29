# Estructura y datos en MIPS práctica — Programa 2: El cartel de game over
# Del artículo «Estructura de un programa y datos en MIPS — práctica con el mapa del inventario, un cartel de game over y la misma memoria leída de dos formas (y el cartel que imprimí con cuatro syscalls)»
# https://sergiolearns.com/estructura-y-datos-en-mips-practica/
# cartel.s: la pantalla de fin de partida, montada con trozos .ascii
# y un solo .asciiz al final: una syscall imprime todo de golpe
        .data
cartel:  .ascii  "+----------------+\n"   # .ascii: sin byte 0, sigue la siguiente línea
         .ascii  "|   GAME  OVER   |\n"
         .ascii  "+----------------+\n"
         .asciiz "\tPuntos: "           # el único byte 0: aquí se para la syscall 4
puntos:  .word   48000
nueva:   .asciiz "\n\tArma: \"Espada\"\n"   # \t tabulador, \" comillas dentro de la cadena
        .text
        .globl main
main:   li   $v0, 4                 # imprime desde cartel hasta el primer byte 0
        la   $a0, cartel
        syscall
        li   $v0, 1                 # los puntos, como entero
        lw   $a0, puntos
        syscall
        li   $v0, 4                 # el resto, con su tabulador y sus comillas
        la   $a0, nueva
        syscall
        li   $v0, 10
        syscall
