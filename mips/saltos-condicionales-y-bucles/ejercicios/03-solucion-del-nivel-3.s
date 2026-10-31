# Saltos, condicionales y bucles en MIPS ejercicios — Solución del Nivel 3
# Del artículo «Saltos, condicionales y bucles en MIPS — ejercicios con los jefes de la oleada, tres tipos de enemigo y el aguante del brazo (y la oleada de 6 que tenía 7 enemigos)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-ejercicios/
# nivel3.s: cuantos enemigos derroto con 10 golpes de aguante (solucion del nivel 3)
        .data
oleada: .word 50, 130, 20, 75, 100, 45   # la segunda oleada
n:      .word 6                     # cuantos enemigos hay
golpe:  .word 40                    # el dano de la espada
aguante: .word 10                   # golpes que aguanta el brazo del heroe
t_der:  .asciiz "Derrotados: "
t_de:   .asciiz " de "
t_gol:  .asciiz "\nGolpes usados: "
t_sig:  .asciiz "\nEl enemigo "
t_nec:  .asciiz " necesita "
t_que:  .asciiz " golpes y solo quedan "

        .text
        .globl main
main:   la   $t0, oleada            # puntero al enemigo actual
        lw   $t1, n                 # $t1 = 6
        lw   $t5, golpe             # $t5 = 40
        lw   $t6, aguante           # $t6 = 10
        li   $t2, 0                 # i = 0 (al final, i = derrotados)
        li   $s0, 0                 # golpes usados = 0
mientras:
        beq  $t2, $t1, finm         # contraria de (i < n)
        lw   $t3, 0($t0)            # vida del enemigo i (la voy a gastar)
        li   $s1, 0                 # golpes de este enemigo = 0
hacer:  sub  $t3, $t3, $t5          # un golpe
        addi $s1, $s1, 1            # un golpe mas para este enemigo
        bgtz $t3, hacer             # hacer-mientras: sigue si le queda vida
        add  $t7, $s0, $s1          # lo que llevaria usado si lo ataco
        bgt  $t7, $t6, finm         # contraria de (usados + golpes <= aguante)
        move $s0, $t7               # lo ataco: los golpes cuentan
        addi $t0, $t0, 4            # siguiente enemigo
        addi $t2, $t2, 1            # i = i + 1
        j    mientras
finm:   li   $v0, 4                 # "Derrotados: 4 de 6"
        la   $a0, t_der
        syscall
        li   $v0, 1
        move $a0, $t2
        syscall
        li   $v0, 4
        la   $a0, t_de
        syscall
        li   $v0, 1
        move $a0, $t1
        syscall
        li   $v0, 4                 # "Golpes usados: 9"
        la   $a0, t_gol
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        beq  $t2, $t1, salir        # si los derroto a todos, no hay nada mas que decir
        li   $v0, 4                 # "El enemigo 5 necesita 3 golpes y solo quedan 1"
        la   $a0, t_sig
        syscall
        li   $v0, 1
        addi $a0, $t2, 1
        syscall
        li   $v0, 4
        la   $a0, t_nec
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_que
        syscall
        li   $v0, 1
        sub  $a0, $t6, $s0          # aguante - usados
        syscall
salir:  li   $v0, 10
        syscall
