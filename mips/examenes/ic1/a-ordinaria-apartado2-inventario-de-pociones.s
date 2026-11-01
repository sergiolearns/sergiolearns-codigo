# Ordinaria A · Apartado 2: las pociones por teclado y el resultado por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Pociones:  .word 35, -20, 120, 60, -75, 0, 15, -5, 90, 200, -50, 45
N:         .word 12
Resultado: .space 16              # Vida, Venenos, Grandes, Corruptos
msg_pide:  .asciiz "Pocion "
msg_dos:   .asciiz ": "
msg_vida:  .asciiz "Vida total: "
msg_ven:   .asciiz "Venenos: "
msg_gra:   .asciiz "Curas grandes: "
msg_cor:   .asciiz "Corruptas: "
salto:     .asciiz "\n"

	.text
	.globl main
main:
	# 1) Leer los N valores y guardarlos en Pociones
	la   $s4, Pociones
	lw   $s5, N
	li   $s6, 0                   # i = 0
leer:
	beq  $s6, $s5, calcular
	la   $a0, msg_pide            # "Pocion "
	li   $v0, 4
	syscall
	addi $a0, $s6, 1              # el número que ve el usuario empieza en 1
	li   $v0, 1
	syscall
	la   $a0, msg_dos             # ": "
	li   $v0, 4
	syscall
	li   $v0, 5                   # read_int
	syscall
	sw   $v0, 0($s4)              # se guarda enseguida: $v0 se reutiliza
	addi $s4, $s4, 4
	addi $s6, $s6, 1
	j    leer
calcular:
	# 2) El mismo recorrido del apartado 1
	la   $t0, Pociones
	lw   $t1, N
	li   $t2, 0
	li   $s0, 0
	li   $s1, 0
	li   $s2, 0
	li   $s3, 0
bucle:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)
	slti $t4, $t3, -50
	bne  $t4, $zero, corrupto
	li   $t5, 100
	slt  $t4, $t5, $t3
	bne  $t4, $zero, corrupto
	add  $s0, $s0, $t3
	bgez $t3, no_veneno
	addi $s1, $s1, 1
no_veneno:
	slti $t4, $t3, 50
	bne  $t4, $zero, siguiente
	addi $s2, $s2, 1
	j    siguiente
corrupto:
	addi $s3, $s3, 1
siguiente:
	addi $t0, $t0, 4
	addi $t2, $t2, 1
	j    bucle
fin:
	la   $t6, Resultado
	sw   $s0, 0($t6)
	sw   $s1, 4($t6)
	sw   $s2, 8($t6)
	sw   $s3, 12($t6)
	# 3) Imprimir los cuatro resultados, cada uno en su línea
	la   $a0, msg_vida
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_ven
	li   $v0, 4
	syscall
	move $a0, $s1
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_gra
	li   $v0, 4
	syscall
	move $a0, $s2
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_cor
	li   $v0, 4
	syscall
	move $a0, $s3
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	li   $v0, 10
	syscall
