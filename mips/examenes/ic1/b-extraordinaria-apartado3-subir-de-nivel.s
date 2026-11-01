# Extraordinaria B · Apartado 3: la experiencia por teclado y el resultado por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
XP:      .space 80
N:       .word 0
Niveles: .word 0
Vacios:  .word 0
msg_n:    .asciiz "Cuantos personajes (1-20)? "
msg_pide: .asciiz "Experiencia del personaje "
msg_dos:  .asciiz ": "
msg_vec:  .asciiz "Experiencia final: "
msg_niv:  .asciiz "Niveles ganados: "
msg_vac:  .asciiz "Personajes a cero: "
espacio:  .asciiz " "
salto:    .asciiz "\n"

	.text
	.globl main
main:
	la   $a0, msg_n
	li   $v0, 4
	syscall
	li   $v0, 5
	syscall
	sw   $v0, N
	move $s5, $v0
	la   $s4, XP
	li   $s6, 0
leer:
	beq  $s6, $s5, calcular
	la   $a0, msg_pide
	li   $v0, 4
	syscall
	move $a0, $s6
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
	la   $t0, XP
	lw   $t1, N
	li   $t2, 0
	li   $t7, 100
	li   $s0, 0
	li   $s1, 0
bucle:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)
	slti $t4, $t3, 100
	bne  $t4, $zero, comprueba
	div  $t3, $t7
	mflo $t5
	mfhi $t3
	add  $s0, $s0, $t5
	sw   $t3, 0($t0)
comprueba:
	bne  $t3, $zero, siguiente
	addi $s1, $s1, 1
siguiente:
	addi $t0, $t0, 4
	addi $t2, $t2, 1
	j    bucle
fin:
	sw   $s0, Niveles
	sw   $s1, Vacios
	la   $a0, msg_vec
	li   $v0, 4
	syscall
	la   $s4, XP
	li   $s6, 0
imprime:
	beq  $s6, $s5, contadores
	lw   $a0, 0($s4)
	li   $v0, 1
	syscall
	la   $a0, espacio
	li   $v0, 4
	syscall
	addi $s4, $s4, 4
	addi $s6, $s6, 1
	j    imprime
contadores:
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_niv
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_vac
	li   $v0, 4
	syscall
	move $a0, $s1
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	li   $v0, 10
	syscall
