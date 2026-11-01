# Extraordinaria C · Apartado 3: el mensaje por teclado y el cifrado por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Cambios: .word 0
Mensaje: .space 64
Cifrado: .space 64
msg_pide: .asciiz "Mensaje: "
msg_cif:  .asciiz "Cifrado: "
msg_cam:  .asciiz "Cambios: "
salto:    .asciiz "\n"

	.text
	.globl main
main:
	la   $a0, msg_pide
	li   $v0, 4
	syscall
	la   $a0, Mensaje
	li   $a1, 64
	li   $v0, 8
	syscall
	la   $t0, Mensaje             # quitar el '\n' del final
quita_nl:
	lbu  $t2, 0($t0)
	beqz $t2, procesar
	li   $t3, 10
	bne  $t2, $t3, sigue_nl
	sb   $zero, 0($t0)
	j    procesar
sigue_nl:
	addi $t0, $t0, 1
	j    quita_nl
procesar:
	la   $t0, Mensaje
	la   $t1, Cifrado
	li   $s0, 0
bucle:
	lbu  $t2, 0($t0)
	beqz $t2, fin
	move $t3, $t2
	blt  $t2, 'A', compara
	bgt  $t2, 'Z', compara
	addi $t3, $t2, 32
compara:
	li   $t4, '4'
	beq  $t3, 'a', cambia
	li   $t4, '3'
	beq  $t3, 'e', cambia
	li   $t4, '1'
	beq  $t3, 'i', cambia
	li   $t4, '0'
	beq  $t3, 'o', cambia
	li   $t4, '5'
	beq  $t3, 's', cambia
	move $t4, $t2
	blt  $t2, 'a', guarda
	bgt  $t2, 'z', guarda
	addi $t4, $t2, -32
	j    guarda
cambia:
	addi $s0, $s0, 1
guarda:
	sb   $t4, 0($t1)
	addi $t0, $t0, 1
	addi $t1, $t1, 1
	j    bucle
fin:
	sb   $zero, 0($t1)
	sw   $s0, Cambios
	la   $a0, msg_cif
	li   $v0, 4
	syscall
	la   $a0, Cifrado
	li   $v0, 4
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_cam
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	li   $v0, 10
	syscall
