# Extraordinaria A · Apartado 3: el vector por teclado y el estado final por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
V:          .space 80             # hasta 20 palabras
N:          .word 0
Curados:    .word 0
Recorridos: .word 0
msg_n:      .asciiz "Cuantos aliados (1-20)? "
msg_pide:   .asciiz "Vida del aliado "
msg_dos:    .asciiz ": "
msg_vec:    .asciiz "Vector final: "
msg_cur:    .asciiz "Curados: "
msg_rec:    .asciiz "Recorridos: "
espacio:    .asciiz " "
salto:      .asciiz "\n"

	.text
	.globl main
main:
	la   $a0, msg_n
	li   $v0, 4
	syscall
	li   $v0, 5
	syscall
	sw   $v0, N                   # N se guarda en memoria antes del siguiente syscall
	move $s5, $v0
	la   $s4, V
	li   $s6, 0
leer:
	beq  $s6, $s5, calcular
	la   $a0, msg_pide
	li   $v0, 4
	syscall
	move $a0, $s6                 # las posiciones empiezan en 0, como en el enunciado
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
	la   $t0, V
	lw   $t1, N
	li   $t2, 0
	li   $s0, 0
	li   $s1, 0
mientras:
	beq  $t2, $t1, fin
	lw   $t3, 0($t0)
	bltz $t3, fin
	andi $t4, $t2, 1
	bne  $t4, $zero, siguiente
	slti $t4, $t3, 10
	bne  $t4, $zero, siguiente
	slti $t4, $t3, 51
	beq  $t4, $zero, siguiente
	addi $t3, $t3, 25
	sw   $t3, 0($t0)
	addi $s0, $s0, 1
siguiente:
	addi $s1, $s1, 1
	addi $t0, $t0, 4
	addi $t2, $t2, 1
	j    mientras
fin:
	sw   $s0, Curados
	sw   $s1, Recorridos
	# imprimir el vector entero (los N elementos), separados por espacios
	la   $a0, msg_vec
	li   $v0, 4
	syscall
	la   $s4, V
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
	la   $a0, msg_cur
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_rec
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
