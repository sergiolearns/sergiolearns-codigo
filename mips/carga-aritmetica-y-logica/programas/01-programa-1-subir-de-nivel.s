# Carga, aritmética y lógica en MIPS práctica — Programa 1: Subir de nivel
# Del artículo «Carga, aritmética y lógica en MIPS — práctica con QtSpim: subir de nivel, un botín de 64 bits y tres datos en una palabra (y el logro que me borró la moral)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-practica/
# sube.s: la experiencia decide el nivel, la vida y lo que cobra el maestro
        .data
ficha:  .word 2750                 # +0  oro
        .word 8384                 # +4  experiencia acumulada
        .half 120                  # +8  vida maxima
        .half 85                   # +10 vida actual
        .byte 7                    # +12 nivel
t_niv:  .asciiz "Nivel: "
t_fal:  .asciiz "\nFalta para el siguiente: "
t_vid:  .asciiz "\nVida maxima: "
t_oro:  .asciiz "\nOro tras pagar al maestro: "
        .text
        .globl main
main:   la   $s0, ficha            # $s0 = base: todo se lee como desplazamiento($s0)
        # 1) nivel = experiencia / 1000 y lo que llevas del siguiente = experiencia % 1000
        lw   $t0, 4($s0)           # experiencia = 8384
        li   $t1, 1000
        div  $t0, $t1              # lo = 8, hi = 384
        mflo $s1                   # nivel nuevo
        mfhi $t2                   # puntos dentro del nivel
        sub  $s2, $t1, $t2         # falta = 1000 - 384
        # 2) vida maxima = 100 + nivel * 15, con 15 = 16 - 1
        sll  $t3, $s1, 4           # nivel * 16
        sub  $t3, $t3, $s1         # nivel * 16 - nivel = nivel * 15
        addi $s3, $t3, 100         # + 100
        # 3) el maestro cobra 50 de oro por nivel
        li   $t4, 50
        mul  $t5, $s1, $t4         # 8 * 50 = 400
        lw   $t6, 0($s0)           # oro = 2750
        sub  $s4, $t6, $t5         # oro - 400
        # 4) guardar en la ficha con el tamano de cada campo
        sw   $s4, 0($s0)           # oro: 4 bytes
        sh   $s3, 8($s0)           # vida maxima: 2 bytes
        sh   $s3, 10($s0)          # subir de nivel te cura del todo
        sb   $s1, 12($s0)          # nivel: 1 byte
        # 5) el resumen por la consola
        li   $v0, 4
        la   $a0, t_niv
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_fal
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, t_vid
        syscall
        li   $v0, 1
        move $a0, $s3
        syscall
        li   $v0, 4
        la   $a0, t_oro
        syscall
        li   $v0, 1
        move $a0, $s4
        syscall
        li   $v0, 10
        syscall
