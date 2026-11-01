# Extraordinaria C · Apartado 1: el mensaje cifrado
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Cambios: .word 0
Mensaje: .asciiz "Nos vemos en la base a las 8"
Cifrado: .space 64

	.text
	.globl main
main:
	la   $t0, Mensaje
	la   $t1, Cifrado
	li   $s0, 0                   # Cambios
bucle:
	lbu  $t2, 0($t0)              # c
	beqz $t2, fin
	move $t3, $t2                 # t3 = c en minúscula (solo para comparar)
	blt  $t2, 'A', compara
	bgt  $t2, 'Z', compara
	addi $t3, $t2, 32             # 'A' + 32 = 'a'
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
	# no es a, e, i, o ni s: las minúsculas pasan a mayúsculas; lo demás, igual
	move $t4, $t2
	blt  $t2, 'a', guarda
	bgt  $t2, 'z', guarda
	addi $t4, $t2, -32
	j    guarda
cambia:
	addi $s0, $s0, 1              # Cambios++ (solo las sustituciones por dígito)
guarda:
	sb   $t4, 0($t1)
	addi $t0, $t0, 1
	addi $t1, $t1, 1
	j    bucle
fin:
	sb   $zero, 0($t1)            # cerrar Cifrado
	sw   $s0, Cambios
	li   $v0, 10
	syscall
