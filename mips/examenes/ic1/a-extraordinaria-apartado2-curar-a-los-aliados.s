# Extraordinaria A · Apartado 2: la cura como subrutina cura(V, i)
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
	la   $s0, V                   # dirección base de V (se pasa en $a0)
	lw   $s1, N
	li   $s2, 0                   # i
	li   $s3, 0                   # Curados
	li   $s4, 0                   # Recorridos
mientras:
	beq  $s2, $s1, fin
	sll  $t0, $s2, 2              # i * 4
	add  $t0, $s0, $t0            # &V[i]
	lw   $t1, 0($t0)
	bltz $t1, fin
	andi $t2, $s2, 1
	bne  $t2, $zero, siguiente    # solo las posiciones pares llaman a cura
	move $a0, $s0                 # argumento 1: V
	move $a1, $s2                 # argumento 2: i
	jal  cura
	add  $s3, $s3, $v0            # $v0 = 1 si curó, 0 si no
siguiente:
	addi $s4, $s4, 1
	addi $s2, $s2, 1
	j    mientras
fin:
	sw   $s3, Curados
	sw   $s4, Recorridos
	li   $v0, 10
	syscall

# cura(V en $a0, i en $a1): si 10 <= V[i] <= 50, V[i] = V[i] + 25 y devuelve 1 en $v0; si no, 0.
# Es una hoja (no llama a nadie) y solo usa registros $t: no necesita la pila.
cura:
	li   $v0, 0
	sll  $t0, $a1, 2
	add  $t0, $a0, $t0            # &V[i]
	lw   $t1, 0($t0)
	slti $t2, $t1, 10
	bne  $t2, $zero, cura_fin
	slti $t2, $t1, 51
	beq  $t2, $zero, cura_fin
	addi $t1, $t1, 25
	sw   $t1, 0($t0)
	li   $v0, 1
cura_fin:
	jr   $ra
