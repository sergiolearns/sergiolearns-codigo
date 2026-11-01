# Ordinaria A · Apartado 1: el inventario de pociones
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Pociones:  .word 35, -20, 120, 60, -75, 0, 15, -5, 90, 200, -50, 45
N:         .word 12
Resultado: .space 16              # Vida, Venenos, Grandes, Corruptos (4 palabras)

	.text
	.globl main
main:
	la   $t0, Pociones            # puntero al elemento actual
	lw   $t1, N                   # cuántos elementos hay
	li   $t2, 0                   # i = 0
	li   $s0, 0                   # Vida = 0
	li   $s1, 0                   # Venenos = 0
	li   $s2, 0                   # Grandes = 0
	li   $s3, 0                   # Corruptos = 0
bucle:
	beq  $t2, $t1, fin            # i == N: se acabó el vector
	lw   $t3, 0($t0)              # x = Pociones[i]
	slti $t4, $t3, -50            # ¿x < -50?
	bne  $t4, $zero, corrupto     # sí: fuera del rango válido
	li   $t5, 100
	slt  $t4, $t5, $t3            # ¿100 < x?
	bne  $t4, $zero, corrupto
	add  $s0, $s0, $t3            # válido: entra en la vida total
	bgez $t3, no_veneno           # x >= 0: no es un veneno
	addi $s1, $s1, 1              # Venenos++
no_veneno:
	slti $t4, $t3, 50             # ¿x < 50?
	bne  $t4, $zero, siguiente    # sí: no es una cura grande
	addi $s2, $s2, 1              # Grandes++
	j    siguiente
corrupto:
	addi $s3, $s3, 1              # Corruptos++
siguiente:
	addi $t0, $t0, 4              # siguiente palabra
	addi $t2, $t2, 1              # i++
	j    bucle
fin:
	la   $t6, Resultado
	sw   $s0, 0($t6)              # Resultado[0] = Vida
	sw   $s1, 4($t6)              # Resultado[1] = Venenos
	sw   $s2, 8($t6)              # Resultado[2] = Grandes
	sw   $s3, 12($t6)             # Resultado[3] = Corruptos
	li   $v0, 10
	syscall
