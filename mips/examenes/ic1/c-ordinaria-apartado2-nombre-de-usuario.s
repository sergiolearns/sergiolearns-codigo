# Ordinaria C · Apartado 2: el nick por teclado y el resultado por pantalla
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Cuenta:  .word 0, 0, 0, 0
Nick:    .space 64                # ahora lo escribe el usuario
Limpio:  .space 64
msg_pide: .asciiz "Escribe tu nick: "
msg_lim:  .asciiz "Nick limpio: "
msg_may:  .asciiz "Mayusculas: "
msg_min:  .asciiz "Minusculas: "
msg_dig:  .asciiz "Digitos: "
msg_otr:  .asciiz "Otros: "
salto:    .asciiz "\n"

	.text
	.globl main
main:
	la   $a0, msg_pide
	li   $v0, 4
	syscall
	la   $a0, Nick                # read_string: buffer en $a0 y tamaño en $a1
	li   $a1, 64
	li   $v0, 8
	syscall
	# quitar el '\n' que deja read_string (si no, contaría como «otro»)
	la   $t0, Nick
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
	la   $t0, Nick
	la   $t1, Limpio
	li   $s0, 0
	li   $s1, 0
	li   $s2, 0
	li   $s3, 0
bucle:
	lbu  $t2, 0($t0)
	beqz $t2, fin
	blt  $t2, 'A', no_mayus
	bgt  $t2, 'Z', no_mayus
	addi $s0, $s0, 1
	sb   $t2, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
no_mayus:
	blt  $t2, 'a', no_minus
	bgt  $t2, 'z', no_minus
	addi $s1, $s1, 1
	addi $t3, $t2, -32
	sb   $t3, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
no_minus:
	blt  $t2, '0', otro
	bgt  $t2, '9', otro
	addi $s2, $s2, 1
	sb   $t2, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
otro:
	addi $s3, $s3, 1
siguiente:
	addi $t0, $t0, 1
	j    bucle
fin:
	sb   $zero, 0($t1)
	la   $t4, Cuenta
	sw   $s0, 0($t4)
	sw   $s1, 4($t4)
	sw   $s2, 8($t4)
	sw   $s3, 12($t4)
	la   $a0, msg_lim
	li   $v0, 4
	syscall
	la   $a0, Limpio
	li   $v0, 4
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_may
	li   $v0, 4
	syscall
	move $a0, $s0
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_min
	li   $v0, 4
	syscall
	move $a0, $s1
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_dig
	li   $v0, 4
	syscall
	move $a0, $s2
	li   $v0, 1
	syscall
	la   $a0, salto
	li   $v0, 4
	syscall
	la   $a0, msg_otr
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
