# Carga, aritmética y lógica en MIPS ejercicios — Solución del Nivel 2: El tiempo de partida
# Del artículo «Carga, aritmética y lógica en MIPS — ejercicios con una poción, el tiempo de partida y un código de guardado (y el reloj que marcaba 123 minutos)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-ejercicios/
# nivel2.s: el tiempo de partida en horas, minutos y segundos (solucion del nivel 2)
        .data
segs:   .word 7384                 # segundos jugados
t_tie:  .asciiz "Tiempo de partida: "
t_h:    .asciiz " h "
t_m:    .asciiz " min "
t_s:    .asciiz " s\n"
        .text
        .globl main
main:   lw   $t0, segs             # 7384
        li   $t1, 3600
        div  $t0, $t1              # 7384 / 3600
        mflo $s0                   # horas = 2
        mfhi $t2                   # lo que sobra: 184 segundos
        li   $t3, 60
        div  $t2, $t3              # 184 / 60 (sobre lo que sobra, no sobre 7384)
        mflo $s1                   # minutos = 3
        mfhi $s2                   # segundos = 4
        li   $v0, 4
        la   $a0, t_tie
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_h
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_m
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, t_s
        syscall
        li   $v0, 10
        syscall
