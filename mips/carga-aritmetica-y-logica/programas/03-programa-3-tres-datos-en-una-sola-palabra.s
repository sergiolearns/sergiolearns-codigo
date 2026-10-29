# Carga, aritmética y lógica en MIPS práctica — Programa 3: Tres datos en una sola palabra
# Del artículo «Carga, aritmética y lógica en MIPS — práctica con QtSpim: subir de nivel, un botín de 64 bits y tres datos en una palabra (y el logro que me borró la moral)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-practica/
# estado.s: tres datos metidos en una sola palabra, y un nombre que pide mayuscula
        .data
estado: .word 0xFD00050B           # moral | 00 | rango | logros
nombre: .asciiz "kaelen\n"
t_log:  .asciiz "Logros:        "
t_ran:  .asciiz "\nRango:         "
t_mor:  .asciiz "\nMoral (sra):   "
t_mou:  .asciiz "\nMoral (srl):   "
t_bor:  .asciiz "\nBorrar 1 (bien): "
t_mal:  .asciiz "\nBorrar 1 (andi): "
t_nom:  .asciiz "\nNombre: "
        .text
        .globl main
main:   lw   $t0, estado
        # 1) logros: los 8 bits de abajo
        andi $s0, $t0, 0xFF        # 0x0B = 11
        # 2) rango: los bits 8 a 11
        srl  $t1, $t0, 8           # bajo el campo a la posicion 0
        andi $s1, $t1, 0x0F        # y me quedo con 4 bits
        # 3) moral: los 8 bits de arriba, con signo
        sra  $s2, $t0, 24          # rellena con el signo: -3
        srl  $s3, $t0, 24          # rellena con ceros: 253
        # 4) borrar el logro 1 sin tocar lo demas
        li   $t2, 0xFFFFFFFD       # todo a 1 menos el bit 1
        and  $s4, $t0, $t2         # bien: 0xFD000509
        andi $s5, $t0, 0xFFFD      # mal: andi rellena el inmediato con ceros
        # 5) la inicial del nombre en mayuscula: 'k' (0x6B) -> 'K' (0x4B)
        la   $t3, nombre
        lbu  $t4, 0($t3)           # primer caracter
        andi $t4, $t4, 0xDF        # apaga el bit 5 (0x20)
        sb   $t4, 0($t3)           # y lo devuelve a la cadena
        li   $v0, 4
        la   $a0, t_log
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_ran
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_mor
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, t_mou
        syscall
        li   $v0, 1
        move $a0, $s3
        syscall
        li   $v0, 4
        la   $a0, t_bor
        syscall
        li   $v0, 1
        move $a0, $s4
        syscall
        li   $v0, 4
        la   $a0, t_mal
        syscall
        li   $v0, 1
        move $a0, $s5
        syscall
        li   $v0, 4
        la   $a0, t_nom
        syscall
        li   $v0, 4
        la   $a0, nombre
        syscall
        li   $v0, 10
        syscall
