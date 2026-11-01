# Ordinaria B · Apartado 1: los golpes de una oleada
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Golpes:  .word 16, 9, 7, 24, 15, 11, 8, 21, 5, 12, 30, 13
N:       .word 12
Informe: .space 16                # Dano, Criticos, Bloqueados, Normales

	.text
	.globl main
main:
	la   $t0, Golpes
	lw   $t1, N
	li   $t2, 0                   # i = 0
	li   $t7, 3                   # divisor para «múltiplo de 3»
	li   $s0, 0                   # Daño = 0
	li   $s1, 0                   # Críticos = 0
	li   $s2, 0                   # Bloqueados = 0
	li   $s3, 0                   # Normales = 0
bucle:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)              # g = Golpes[i]
	andi $t4, $t3, 3              # los dos bits bajos: 0 si g es múltiplo de 4
	bne  $t4, $zero, no_critico
	sll  $t5, $t3, 1              # crítico: el doble (g << 1)
	add  $s0, $s0, $t5
	addi $s1, $s1, 1
	j    siguiente
no_critico:
	div  $t3, $t7                 # g / 3: el resto queda en hi
	mfhi $t4
	bne  $t4, $zero, normal
	sub  $s0, $s0, $t3            # bloqueado: resta
	addi $s2, $s2, 1
	j    siguiente
normal:
	add  $s0, $s0, $t3            # normal: suma tal cual
	addi $s3, $s3, 1
siguiente:
	addi $t0, $t0, 4
	addi $t2, $t2, 1
	j    bucle
fin:
	la   $t6, Informe
	sw   $s0, 0($t6)
	sw   $s1, 4($t6)
	sw   $s2, 8($t6)
	sw   $s3, 12($t6)
	li   $v0, 10
	syscall
