# Saltos, condicionales y bucles en MIPS ejercicios — Solución del Nivel 2
# Del artículo «Saltos, condicionales y bucles en MIPS — ejercicios con los jefes de la oleada, tres tipos de enemigo y el aguante del brazo (y la oleada de 6 que tenía 7 enemigos)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-ejercicios/
# nivel2.s: debiles, normales y jefes en la segunda oleada (solucion del nivel 2)
        .data
oleada: .word 50, 130, 20, 75, 100, 45   # la segunda oleada
n:      .word 6                     # cuantos enemigos hay
cuenta: .space 12                   # +0 debiles, +4 normales, +8 jefes
t_deb:  .asciiz "Debiles: "
t_nor:  .asciiz "\nNormales: "
t_jef:  .asciiz "\nJefes: "

        .text
        .globl main
main:   la   $t0, oleada            # puntero al enemigo actual
        lw   $t1, n                 # $t1 = 6
        li   $t2, 0                 # i = 0
        li   $s0, 0                 # debiles:  vida <= 40
        li   $s1, 0                 # normales: 40 < vida < 100
        li   $s2, 0                 # jefes:    vida >= 100
bucle:  beq  $t2, $t1, fin
        lw   $t3, 0($t0)            # vida del enemigo i
        bgt  $t3, 40, nodeb         # contraria de (vida <= 40)
        addi $s0, $s0, 1            # entonces: debil
        j    finsi                  # ya esta clasificado: no miro mas
nodeb:  bge  $t3, 100, jefe         # vida >= 100: al ultimo caso
        addi $s1, $s1, 1            # ni debil ni jefe: normal
        j    finsi
jefe:   addi $s2, $s2, 1            # jefe
finsi:  addi $t0, $t0, 4            # siguiente enemigo
        addi $t2, $t2, 1            # i = i + 1
        j    bucle
fin:    la   $t4, cuenta            # las tres cuentas a memoria
        sw   $s0, 0($t4)
        sw   $s1, 4($t4)
        sw   $s2, 8($t4)
        li   $v0, 4
        la   $a0, t_deb
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_nor
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_jef
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 10
        syscall
