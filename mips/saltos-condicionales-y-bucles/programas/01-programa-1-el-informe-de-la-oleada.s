# Saltos, condicionales y bucles en MIPS práctica — Programa 1: El informe de la oleada
# Del artículo «Saltos, condicionales y bucles en MIPS — práctica con QtSpim: el informe de la oleada, tres hechizos con «y» y «o» y un combate que para a tiempo (y el héroe que acabó con energía negativa)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-practica/
# informe.s: el informe de la oleada, enemigo a enemigo
        .data
oleada: .word 35, 80, 40, 120, 15, 60, 90, 200   # la vida de cada enemigo
n:      .word 8                     # cuantos enemigos hay
golpe:  .word 40                    # el dano de la espada
t_ene:  .asciiz "Enemigo "
t_cae:  .asciiz ": cae de un golpe\n"
t_res:  .asciiz ": resiste\n"
t_tot:  .asciiz "Caen de un golpe: "
t_de:   .asciiz " de "

        .text
        .globl main
main:   la   $t0, oleada            # $t0 = puntero al enemigo actual
        lw   $t1, n                 # $t1 = 8, cuantas vueltas
        lw   $t5, golpe             # $t5 = 40
        li   $t2, 0                 # $t2 = i, el indice (empieza en 0)
        li   $s0, 0                 # $s0 = cuantos caen de un golpe
bucle:  beq  $t2, $t1, fin          # parada: i == n, no quedan enemigos
        lw   $t3, 0($t0)            # $t3 = vida del enemigo i
        li   $v0, 4                 # "Enemigo "
        la   $a0, t_ene
        syscall
        li   $v0, 1                 # su numero: i + 1 (la gente cuenta desde 1)
        addi $a0, $t2, 1
        syscall
        bgt  $t3, $t5, resiste      # contraria de (vida <= golpe): al sino
        li   $v0, 4                 # entonces: cae de un golpe
        la   $a0, t_cae
        syscall
        addi $s0, $s0, 1            # uno mas que cae
        j    finsi                  # sin esto, tambien imprimiria "resiste"
resiste:
        li   $v0, 4                 # sino: resiste
        la   $a0, t_res
        syscall
finsi:  addi $t0, $t0, 4            # siguiente palabra del vector
        addi $t2, $t2, 1            # i = i + 1
        j    bucle
fin:    li   $v0, 4                 # "Caen de un golpe: 3 de 8"
        la   $a0, t_tot
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_de
        syscall
        li   $v0, 1
        move $a0, $t1
        syscall
        li   $v0, 10
        syscall
