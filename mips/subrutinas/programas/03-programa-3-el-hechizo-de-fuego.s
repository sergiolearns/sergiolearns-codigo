# Subrutinas en MIPS práctica — Programa 3: El hechizo de fuego
# Del artículo «Subrutinas en MIPS — práctica con QtSpim: el cartel del combate, el orden de turnos y un hechizo recursivo (y el hechizo de nivel 4 que hacía 0 de daño)»
# https://sergiolearns.com/subrutinas-en-mips-practica/
# hechizo.s: la potencia de un hechizo de fuego: cada nivel multiplica por 3
# pot(base, 0) = 1;  pot(base, n) = base * pot(base, n - 1)
        .data
tentra: .asciiz "entro en el nivel "
tsale:  .asciiz "el nivel "
tdev:   .asciiz " devuelve "
ttot:   .asciiz "Dano del hechizo de nivel 4: "
        .text
        .globl main
main:   li $a0, 3               # base: cada nivel x3
        li $a1, 4               # nivel del hechizo
        jal pot
        move $s0, $v0
        la $a0, ttot
        li $v0, 4
        syscall
        move $a0, $s0
        li $v0, 1
        syscall
        li $v0, 10
        syscall

# pot: $a0 = base, $a1 = n -> $v0 = base elevado a n (y un rastro en la consola)
# Al volver, $a0 ya no es la base: los $a no se conservan (convenio).
pot:    addi $sp, $sp, -12      # mi marco: $ra, base y n
        sw $ra, 8($sp)
        sw $a0, 4($sp)          # las syscalls usan $a0: lo guardo ya
        sw $a1, 0($sp)
po_marco:
        li $a0, 4               # sangria: 2 espacios por cada nivel bajado
        sub $a0, $a0, $a1
        jal sangria
        la $a0, tentra
        li $v0, 4
        syscall
        lw $a0, 0($sp)          # n, desde mi marco
        li $v0, 1
        syscall
        li $a0, 10
        li $v0, 11
        syscall
        lw $a1, 0($sp)
        bnez $a1, po_sigue
        li $v0, 1               # caso base: base^0 = 1
        j po_rastro
po_sigue:
        lw $a0, 4($sp)          # pot(base, n - 1)
        addi $a1, $a1, -1
        jal pot
        lw $t0, 4($sp)          # mi base
        mul $v0, $v0, $t0       # base * pot(base, n - 1)
po_rastro:
        sw $v0, 4($sp)          # el resultado, a mi marco (la base ya no hace falta)
        li $a0, 4
        lw $a1, 0($sp)
        sub $a0, $a0, $a1
        jal sangria
        la $a0, tsale
        li $v0, 4
        syscall
        lw $a0, 0($sp)
        li $v0, 1
        syscall
        la $a0, tdev
        li $v0, 4
        syscall
        lw $a0, 4($sp)          # el resultado, desde mi marco
        li $v0, 1
        syscall
        li $a0, 10
        li $v0, 11
        syscall
        lw $v0, 4($sp)          # lo devuelvo en $v0
        lw $a1, 0($sp)          # n, como estaba
        lw $ra, 8($sp)
        addi $sp, $sp, 12
        jr $ra

# sangria: imprime 2 * $a0 espacios. Usa $t0.
sangria:
        sll $t0, $a0, 1
sa_otro:
        blez $t0, sa_fin
        li $a0, ' '
        li $v0, 11
        syscall
        addi $t0, $t0, -1
        j sa_otro
sa_fin: jr $ra
