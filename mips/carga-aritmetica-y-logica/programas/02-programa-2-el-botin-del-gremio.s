# Carga, aritmética y lógica en MIPS práctica — Programa 2: El botín del gremio
# Del artículo «Carga, aritmética y lógica en MIPS — práctica con QtSpim: subir de nivel, un botín de 64 bits y tres datos en una palabra (y el logro que me borró la moral)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-practica/
# botin.s: el tesoro del gremio, demasiado grande para 32 bits
        .data
botin:   .word 98765               # oro que suelta el jefe en cada partida
partid:  .word 50000               # partidas jugadas por el gremio
jugad:   .word 7                   # jugadores del grupo
t_hi:    .asciiz "Tesoro (hi): "
t_lo:    .asciiz "\nTesoro (lo): "
t_mul:   .asciiz "\nCon mul:     "
t_cada:  .asciiz "\nCada jugador: "
t_greg:  .asciiz "\nPara el gremio: "
        .text
        .globl main
main:   lw   $t0, botin
        lw   $t1, partid
        mult $t0, $t1              # hi:lo = 98765 * 50000 = 4938250000
        mfhi $s0                   # los 32 bits de arriba
        mflo $s1                   # los 32 bits de abajo
        mul  $s2, $t0, $t1         # mul: solo los de abajo
        lw   $t2, jugad
        div  $t0, $t2              # reparto de UNA partida: lo = cociente, hi = resto
        mflo $s3                   # oro para cada jugador
        mfhi $s4                   # lo que no se puede repartir va al gremio
        li   $v0, 4
        la   $a0, t_hi
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_lo
        syscall
        li   $v0, 1                # cabe en 31 bits: se lee bien con signo
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_mul
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, t_cada
        syscall
        li   $v0, 1
        move $a0, $s3
        syscall
        li   $v0, 4
        la   $a0, t_greg
        syscall
        li   $v0, 1
        move $a0, $s4
        syscall
        li   $v0, 10
        syscall
