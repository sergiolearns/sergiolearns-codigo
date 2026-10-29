# Estructura y datos en MIPS ejercicios — Solución del Nivel 2: La memoria de la tienda
# Del artículo «Estructura de un programa y datos en MIPS — ejercicios con la ficha de un personaje, la memoria de una tienda y un mensaje escrito solo con números (y el programa que no sabía terminar)»
# https://sergiolearns.com/estructura-y-datos-en-mips-ejercicios/
# nivel2.s: el segmento de datos de la tienda del juego (solución del nivel 2)
        .data
tienda:  .asciiz "POCION"           # 6 letras + byte 0: de 0x10010000 a 0x10010006
         .align 2                   # salta a 0x10010008
precio:  .word 150                  # 0x00000096
stock:   .half 12                   # 0x000c en 0x1001000c
nivel:   .byte 7                    # en 0x1001000e
         .align 2                   # salta a 0x10010010
oferta:  .word 0x00C0FFEE           # una palabra escrita en hexadecimal
        .text
        .globl main
main:   li   $v0, 10                # solo nos interesa la memoria
        syscall
