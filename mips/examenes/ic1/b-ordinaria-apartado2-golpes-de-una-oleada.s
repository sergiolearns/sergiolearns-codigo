# Ordinaria B · Apartado 2: los golpes por teclado y el informe por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Golpes:  .word 16, 9, 7, 24, 15, 11, 8, 21, 5, 12, 30, 13
N:       .word 12
Informe: .space 16
msg_pide: .asciiz "Golpe "
msg_dos:  .asciiz ": "
msg_dan:  .asciiz "Dano total: "
msg_cri:  .asciiz "Criticos: "
msg_blo:  .asciiz "Bloqueados: "
msg_nor:  .asciiz "Normales: "
salto:    .asciiz "\n"

	.text
	.globl main
main:
	la   $s4, Golpes
	lw   $s5, N
	li   $s6, 0
leer:
	beq  $s6, $s5, calcular
	la   $a0, msg_pide
	li   $v0, 4
	syscall
	addi $a0, $s6, 1
	li   $v0, 1
	syscall
	la   $a0, msg_dos
	li   $v0, 4
	syscall
	li   $v0, 5
	syscall
	sw   $v0, 0($s4)
	addi $s4, $s4, 4
	addi $s6, $s6, 1
	j    leer
calcular:
	la   $t0, Golpes
	lw   $t1, N
	li   $t2, 0
	li   $t7, 3
	li   $s0, 0
	li   $s1, 0
	li   $s2, 0
	li   $s3, 0
bucle:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)
	andi $t4, $t3, 3
	bne  $t4, $zero, no_critico
	sll  $t5, $t3, 1
	add  $s0, $s0, $t5
	addi $s1, $s1, 1
	j    siguiente
no_critico:
	div  $t3, $t7
	mfhi $t4
	bne  $t4, $zero, normal
	sub  $s0, $s0, $t3
	addi $s2, $s2, 1
	j    siguiente
normal:
	add  $s0, $s0, $t3
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
	la   $a0, msg_dan
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_cri
	li   $v0, 4
	syscall
	move $a0, $s1
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_blo
	li   $v0, 4
	syscall
	move $a0, $s2
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_nor
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
