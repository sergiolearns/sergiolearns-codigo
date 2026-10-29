# Carga, aritmética y lógica en MIPS ejercicios — Solución del Nivel 1: Una poción y una compra
# Del artículo «Carga, aritmética y lógica en MIPS — ejercicios con una poción, el tiempo de partida y un código de guardado (y el reloj que marcaba 123 minutos)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-ejercicios/
# nivel1.s: una pocion y una compra (solucion del nivel 1)
        .data
vida:   .half 37                   # vida actual
vmax:   .half 120                  # vida maxima
pocion: .byte 50                   # lo que cura la pocion
        .align 2                   # oro es una palabra: a un multiplo de 4
oro:    .word 300
precio: .half 75                   # lo que cuesta la siguiente pocion
t_vid:  .asciiz "Vida: "
t_bar:  .asciiz " / "
t_oro:  .asciiz "\nOro: "
        .text
        .globl main
main:   lh   $t0, vida             # 37
        lbu  $t1, pocion           # 50 (un byte sin signo: la cura nunca es negativa)
        add  $t0, $t0, $t1         # 87
        sh   $t0, vida             # la vida vuelve a ser media palabra
        lw   $t2, oro              # 300
        lhu  $t3, precio           # 75
        sub  $t2, $t2, $t3         # 225
        sw   $t2, oro
        lh   $t4, vmax
        li   $v0, 4
        la   $a0, t_vid
        syscall
        li   $v0, 1
        move $a0, $t0
        syscall
        li   $v0, 4
        la   $a0, t_bar
        syscall
        li   $v0, 1
        move $a0, $t4
        syscall
        li   $v0, 4
        la   $a0, t_oro
        syscall
        li   $v0, 1
        move $a0, $t2
        syscall
        li   $v0, 10
        syscall
