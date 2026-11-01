# Extraordinaria B · Apartado 2: sube_nivel(XP, i) como subrutina
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
	la   $s0, XP
	lw   $s1, N
	li   $s2, 0                   # i
	li   $s3, 0                   # Niveles
	li   $s4, 0                   # Vacios
bucle:
	beq  $s2, $s1, fin
	move $a0, $s0                 # argumento 1: XP
	move $a1, $s2                 # argumento 2: i
	jal  sube_nivel
	add  $s3, $s3, $v0            # niveles ganados con este elemento
	sll  $t0, $s2, 2
	add  $t0, $s0, $t0
	lw   $t1, 0($t0)              # XP[i] ya transformado por la subrutina
	bne  $t1, $zero, siguiente
	addi $s4, $s4, 1
siguiente:
	addi $s2, $s2, 1
	j    bucle
fin:
	sw   $s3, Niveles
	sw   $s4, Vacios
	li   $v0, 10
	syscall

# sube_nivel(XP en $a0, i en $a1): si XP[i] >= 100, XP[i] = XP[i] mod 100 y devuelve XP[i] / 100 en $v0; si no, 0.
sube_nivel:
	li   $v0, 0
	sll  $t0, $a1, 2
	add  $t0, $a0, $t0            # &XP[i]
	lw   $t1, 0($t0)
	slti $t2, $t1, 100
	bne  $t2, $zero, sube_fin
	li   $t3, 100
	div  $t1, $t3
	mflo $v0                      # niveles
	mfhi $t1                      # lo que sobra
	sw   $t1, 0($t0)
sube_fin:
	jr   $ra
