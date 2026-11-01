# Extraordinaria B · Apartado 1: subir de nivel
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
XP:      .word 250, 40, 100, 0, 375, 99, 512, 60
N:       .word 8
Niveles: .word 0
Vacios:  .word 0

	.text
	.globl main
main:
	la   $t0, XP
	lw   $t1, N
	li   $t2, 0                   # i
	li   $t7, 100                 # divisor
	li   $s0, 0                   # Niveles
	li   $s1, 0                   # Vacios
bucle:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)
	slti $t4, $t3, 100            # ¿XP[i] < 100?
	bne  $t4, $zero, comprueba    # sí: no sube de nivel
	div  $t3, $t7                 # cociente (lo) = niveles; resto (hi) = lo que sobra
	mflo $t5
	mfhi $t3
	add  $s0, $s0, $t5            # Niveles += XP[i] / 100
	sw   $t3, 0($t0)              # XP[i] = XP[i] mod 100
comprueba:
	bne  $t3, $zero, siguiente    # ya transformado: ¿quedó a 0?
	addi $s1, $s1, 1              # Vacios++
siguiente:
	addi $t0, $t0, 4
	addi $t2, $t2, 1
	j    bucle
fin:
	sw   $s0, Niveles
	sw   $s1, Vacios
	li   $v0, 10
	syscall
