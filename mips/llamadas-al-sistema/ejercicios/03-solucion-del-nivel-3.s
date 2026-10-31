# Llamadas al sistema en MIPS ejercicios — Solución del nivel 3
# Del artículo «Llamadas al sistema en MIPS — ejercicios con una tienda de pociones, un código de amigo con su dígito de control y el registro de un gremio (y el menú que con un 7 sacaba al jefe final)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-ejercicios/
# nivel3.s: el registro del gremio con fichas de 16 bytes (solucion del nivel 3)
        .data
gremio: .space 64            # 4 fichas x 16 bytes: nick (12) + nivel (4)
pnick:  .asciiz "Nick: "
pniv:   .asciiz "Nivel: "
potro:  .asciiz "Otro miembro? (1 = si, 0 = no): "
tlleno: .asciiz "El gremio esta lleno.\n"
tcab:   .asciiz "\nMiembros del gremio:\n"
tpun:   .asciiz ". "
tniv:   .asciiz "nivel "
tmed:   .asciiz "Media de nivel: "
        .text
        .globl main
main:   li $s0, 0            # n = miembros registrados
alta:   sll $s1, $s0, 4      # $s1 = n * 16: inicio de la ficha n
        la $a0, pnick
        li $v0, 4
        syscall
        la $a0, gremio($s1)  # el nick va al principio de la ficha
        li $a1, 12           # como mucho 11 letras + '\0'
        li $v0, 8            # read_string
        syscall
        move $t0, $a0        # quitar el '\n' DENTRO de la ficha
q:      lbu $t1, 0($t0)
        beq $t1, '\n', cero
        beqz $t1, nivel
        addi $t0, $t0, 1
        j q
cero:   sb $zero, 0($t0)
nivel:  la $a0, pniv
        li $v0, 4
        syscall
        li $v0, 5            # read_int
        syscall
        sw $v0, gremio+12($s1) # nivel en el byte 12 de la ficha
        addi $s0, $s0, 1     # un miembro mas
        beq $s0, 4, lleno    # no caben mas fichas
        la $a0, potro
        li $v0, 4
        syscall
        li $v0, 5
        syscall
        bnez $v0, alta       # 1 (o cualquier no-cero): otro
        j listar
lleno:  la $a0, tlleno
        li $v0, 4
        syscall
listar: la $a0, tcab
        li $v0, 4
        syscall
        li $t5, 0            # i = 0
        li $s2, 0            # suma de niveles
fila:   beq $t5, $s0, media
        addi $a0, $t5, 1     # numero de miembro, desde 1
        li $v0, 1
        syscall
        la $a0, tpun
        li $v0, 4
        syscall
        sll $s1, $t5, 4      # inicio de la ficha i
        la $a0, gremio($s1)
        li $v0, 4            # el nick
        syscall
        la $t0, gremio($s1)  # cuantas letras tiene el nick?
        li $t2, 0
cuenta: lbu $t1, 0($t0)
        beqz $t1, relleno
        addi $t2, $t2, 1
        addi $t0, $t0, 1
        j cuenta
relleno: li $t3, 12          # completo hasta 12 columnas con espacios
        sub $t3, $t3, $t2
esp:    blez $t3, nv
        li $a0, ' '
        li $v0, 11
        syscall
        addi $t3, $t3, -1
        j esp
nv:     la $a0, tniv
        li $v0, 4
        syscall
        lw $a0, gremio+12($s1)
        add $s2, $s2, $a0    # suma += nivel
        li $v0, 1
        syscall
        li $a0, '\n'
        li $v0, 11
        syscall
        addi $t5, $t5, 1
        j fila
media:  la $a0, tmed
        li $v0, 4
        syscall
        div $s2, $s0         # suma / n (division entera)
        mflo $a0
        li $v0, 1
        syscall
        li $v0, 10
        syscall
