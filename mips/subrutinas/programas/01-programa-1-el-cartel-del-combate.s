# Subrutinas en MIPS práctica — Programa 1: El cartel del combate
# Del artículo «Subrutinas en MIPS — práctica con QtSpim: el cartel del combate, el orden de turnos y un hechizo recursivo (y el hechizo de nivel 4 que hacía 0 de daño)»
# https://sergiolearns.com/subrutinas-en-mips-practica/
# cartel.s: el cartel del combate: cuatro subrutinas hoja y una que no lo es
        .data
heroe:  .space 16
rival:  .space 16
ph:     .asciiz "Heroe: "
pr:     .asciiz "Enemigo: "
vs:     .asciiz " VS "
        .text
        .globl main
main:   la $a0, ph              # --- 1. pedir los nombres ---
        li $v0, 4
        syscall
        la $a0, heroe
        li $a1, 16
        li $v0, 8
        syscall
        la $a0, heroe
        jal quita_nl
        la $a0, pr
        li $v0, 4
        syscall
        la $a0, rival
        li $a1, 16
        li $v0, 8
        syscall
        la $a0, rival
        jal quita_nl
        la $a0, heroe           # --- 2. ancho = largo(heroe) + 4 + largo(rival) + 2 ---
        jal largo
        move $s0, $v0           # en un $s: largo usa $t
        la $a0, rival
        jal largo
        add $s0, $s0, $v0
        addi $s0, $s0, 6        # " VS " son 4 y un espacio a cada lado, 2
        move $a0, $s0           # --- 3. el cartel ---
        jal marco
        li $a0, ' '
        li $v0, 11
        syscall
        la $a0, heroe
        jal grita
        la $a0, vs
        li $v0, 4
        syscall
        la $a0, rival
        jal grita
        li $a0, 10              # '\n'
        li $v0, 11
        syscall
        move $a0, $s0
        jal marco
        li $v0, 10
        syscall

# grita: imprime una cadena en mayusculas, letra a letra, llamando a mayus
# Entrada: $a0 = cadena. Como llama a mayus, guarda $ra; y $s1, que usa de puntero.
grita:  addi $sp, $sp, -8
        sw $ra, 4($sp)
        sw $s1, 0($sp)
        move $s1, $a0           # $s1 recorre la cadena
gr_otra:
        lbu $a0, 0($s1)
        beqz $a0, gr_fin
        jal mayus               # $v0 = la letra en mayuscula
        move $a0, $v0
        li $v0, 11              # print_char
        syscall
        addi $s1, $s1, 1
        j gr_otra
gr_fin: lw $s1, 0($sp)
        lw $ra, 4($sp)
        addi $sp, $sp, 8
        jr $ra

# mayus: $a0 = caracter -> $v0 = el mismo en mayuscula si era 'a'..'z'
mayus:  move $v0, $a0
        blt $a0, 'a', my_fin
        bgt $a0, 'z', my_fin
        addi $v0, $a0, -32      # 'a' (97) - 32 = 'A' (65)
my_fin: jr $ra

# largo: $a0 = cadena -> $v0 = cuantos caracteres tiene (sin el '\0')
largo:  li $v0, 0
la_otro:
        add $t0, $a0, $v0       # direccion del caracter $v0
        lbu $t0, 0($t0)
        beqz $t0, la_fin
        addi $v0, $v0, 1
        j la_otro
la_fin: jr $ra

# marco: imprime $a0 signos '=' y un salto de linea. Usa $t0.
marco:  move $t0, $a0
ma_otro:
        blez $t0, ma_fin
        li $a0, '='
        li $v0, 11
        syscall
        addi $t0, $t0, -1
        j ma_otro
ma_fin: li $a0, 10
        li $v0, 11
        syscall
        jr $ra

# quita_nl: $a0 = cadena; cambia su '\n' final por '\0'. Usa $t0 y $t1.
quita_nl:
        move $t0, $a0
qn_mira:
        lbu $t1, 0($t0)
        beq $t1, 10, qn_quita
        beqz $t1, qn_fin
        addi $t0, $t0, 1
        j qn_mira
qn_quita:
        sb $zero, 0($t0)
qn_fin: jr $ra
