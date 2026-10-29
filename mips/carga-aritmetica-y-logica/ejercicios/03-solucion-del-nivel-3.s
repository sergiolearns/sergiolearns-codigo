# Carga, aritmética y lógica en MIPS ejercicios — Solución del Nivel 3: El código de guardado
# Del artículo «Carga, aritmética y lógica en MIPS — ejercicios con una poción, el tiempo de partida y un código de guardado (y el reloj que marcaba 123 minutos)»
# https://sergiolearns.com/carga-aritmetica-y-logica-en-mips-ejercicios/
# nivel3.s: el codigo de guardado de la partida (solucion del nivel 3)
# Formato: nivel en los bits 31-24, vida en los bits 23-8, clase en los bits 7-0
        .data
nivel:  .byte 8
clase:  .byte 3                    # 3 = arquera
vida:   .half 220
codigo: .word 0                    # aqui se guarda el codigo
t_cod:  .asciiz "Codigo: "
t_niv:  .asciiz "\nNivel: "
t_vid:  .asciiz "\nVida: "
t_cla:  .asciiz "\nClase: "
        .text
        .globl main
main:   # 1) empaquetar: cada campo a su sitio con sll y juntos con or
        lbu  $t0, nivel
        sll  $t0, $t0, 24          # nivel a los bits 31-24
        lhu  $t1, vida
        sll  $t1, $t1, 8           # vida a los bits 23-8
        lbu  $t2, clase            # clase ya esta en los bits 7-0
        or   $s0, $t0, $t1
        or   $s0, $s0, $t2
        sw   $s0, codigo
        # 2) desempaquetar: bajar con srl y recortar con andi
        lw   $t3, codigo
        srl  $s1, $t3, 24          # nivel (arriba del todo: no hace falta mascara)
        srl  $t4, $t3, 8
        andi $s2, $t4, 0xFFFF      # vida: 16 bits
        andi $s3, $t3, 0xFF        # clase: 8 bits
        li   $v0, 4
        la   $a0, t_cod
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_niv
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_vid
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, t_cla
        syscall
        li   $v0, 1
        move $a0, $s3
        syscall
        li   $v0, 10
        syscall
