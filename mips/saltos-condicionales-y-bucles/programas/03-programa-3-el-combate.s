# Saltos, condicionales y bucles en MIPS práctica — Programa 3: El combate
# Del artículo «Saltos, condicionales y bucles en MIPS — práctica con QtSpim: el informe de la oleada, tres hechizos con «y» y «o» y un combate que para a tiempo (y el héroe que acabó con energía negativa)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-practica/
# combate.s: lucho mientras queden enemigos y me llegue la energia
        .data
oleada: .word 35, 80, 40, 120, 15, 60, 90, 200   # la vida de cada enemigo
n:      .word 8                     # cuantos enemigos hay
energia: .word 200                  # energia del heroe al empezar
t_der:  .asciiz "Derrotados: "
t_ene:  .asciiz "\nEnergia restante: "
t_max:  .asciiz "\nEl mas duro derrotado: "
t_ven:  .asciiz "\nOleada vencida"
t_sin:  .asciiz "\nSin energia ante el enemigo "
t_vid:  .asciiz " (vida "
t_par:  .asciiz ")"

        .text
        .globl main
main:   la   $t0, oleada            # puntero al enemigo actual
        lw   $t1, n                 # $t1 = 8
        lw   $s1, energia           # $s1 = 200
        li   $t2, 0                 # i = 0 (al final, i = derrotados)
        li   $s2, 0                 # el mas duro derrotado (ninguno todavia)
mientras:
        beq  $t2, $t1, finm         # contraria de (i < n)
        lw   $t3, 0($t0)            # vida del enemigo i
        blt  $s1, $t3, finm         # contraria de (energia >= vida): parada anticipada
        sub  $s1, $s1, $t3          # pago la energia del combate
        ble  $t3, $s2, nomax        # contraria de (vida > maximo)
        move $s2, $t3               # nuevo maximo
nomax:  addi $t0, $t0, 4            # siguiente enemigo
        addi $t2, $t2, 1            # i = i + 1
        j    mientras
finm:   li   $v0, 4                 # el informe
        la   $a0, t_der
        syscall
        li   $v0, 1
        move $a0, $t2
        syscall
        li   $v0, 4
        la   $a0, t_ene
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_max
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        bne  $t2, $t1, sinene       # por que paro? si i != n, por la energia
        li   $v0, 4                 # entonces: se acabaron los enemigos
        la   $a0, t_ven
        syscall
        j    salir
sinene: li   $v0, 4                 # sino: se acabo la energia
        la   $a0, t_sin
        syscall
        li   $v0, 1                 # numero del enemigo: i + 1
        addi $a0, $t2, 1
        syscall
        li   $v0, 4
        la   $a0, t_vid
        syscall
        li   $v0, 1                 # su vida sigue en $t3
        move $a0, $t3
        syscall
        li   $v0, 4
        la   $a0, t_par
        syscall
salir:  li   $v0, 10
        syscall
