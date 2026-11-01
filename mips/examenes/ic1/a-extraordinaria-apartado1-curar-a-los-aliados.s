# Extraordinaria A · Apartado 1: curar a los aliados
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
V:          .word 40, 12, 33, 55, 18, 7, 26, 49, -1, 30
N:          .word 10
Curados:    .word 0
Recorridos: .word 0

	.text
	.globl main
main:
	la   $t0, V                   # puntero a V[i]
	lw   $t1, N
	li   $t2, 0                   # i = 0
	li   $s0, 0                   # Curados
	li   $s1, 0                   # Recorridos
mientras:
	beq  $t2, $t1, fin            # (i <= N-1) falla: fin
	lw   $t3, 0($t0)
	bltz $t3, fin                 # (V[i] >= 0) falla: fin
	andi $t4, $t2, 1              # bit 0 de i: 1 si i es impar
	bne  $t4, $zero, siguiente    # impar: no se cura
	slti $t4, $t3, 10             # ¿V[i] < 10?
	bne  $t4, $zero, siguiente
	slti $t4, $t3, 51             # ¿V[i] <= 50?  (V[i] < 51)
	beq  $t4, $zero, siguiente
	addi $t3, $t3, 25             # curar: +25
	sw   $t3, 0($t0)              # se guarda en el mismo sitio
	addi $s0, $s0, 1              # Curados++
siguiente:
	addi $s1, $s1, 1              # Recorridos++
	addi $t0, $t0, 4
	addi $t2, $t2, 1              # i++
	j    mientras
fin:
	sw   $s0, Curados
	sw   $s1, Recorridos
	li   $v0, 10
	syscall
