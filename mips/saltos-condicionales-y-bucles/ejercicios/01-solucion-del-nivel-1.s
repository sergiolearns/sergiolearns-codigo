# Saltos, condicionales y bucles en MIPS ejercicios — Solución del Nivel 1
# Del artículo «Saltos, condicionales y bucles en MIPS — ejercicios con los jefes de la oleada, tres tipos de enemigo y el aguante del brazo (y la oleada de 6 que tenía 7 enemigos)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-ejercicios/
# nivel1.s: cuantos jefes hay en la segunda oleada y cuanta vida suman (solucion del nivel 1)
        .data
oleada: .word 50, 130, 20, 75, 100, 45   # la segunda oleada
n:      .word 6                     # cuantos enemigos hay
t_jef:  .asciiz "Jefes: "
t_vid:  .asciiz "\nVida de los jefes: "

        .text
        .globl main
main:   la   $t0, oleada            # puntero al enemigo actual
        lw   $t1, n                 # $t1 = 6
        li   $t2, 0                 # i = 0
        li   $s0, 0                 # jefes = 0
        li   $s1, 0                 # vida de los jefes = 0
bucle:  beq  $t2, $t1, fin          # parada: i == n
        lw   $t3, 0($t0)            # vida del enemigo i
        blt  $t3, 100, finsi        # contraria de (vida >= 100): no es jefe
        addi $s0, $s0, 1            # jefes = jefes + 1
        add  $s1, $s1, $t3          # sumo su vida
finsi:  addi $t0, $t0, 4            # siguiente enemigo
        addi $t2, $t2, 1            # i = i + 1
        j    bucle
fin:    li   $v0, 4
        la   $a0, t_jef
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_vid
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 10
        syscall
