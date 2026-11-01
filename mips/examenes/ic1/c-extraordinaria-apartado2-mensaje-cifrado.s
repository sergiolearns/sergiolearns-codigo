# Extraordinaria C · Apartado 2: traduce(c) como subrutina
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Cambios: .word 0
Mensaje: .asciiz "Nos vemos en la base a las 8"
Cifrado: .space 64

	.text
	.globl main
main:
	la   $s0, Mensaje
	la   $s1, Cifrado
	li   $s2, 0                   # Cambios
bucle:
	lbu  $a0, 0($s0)              # argumento: el carácter
	beqz $a0, fin
	jal  traduce
	sb   $v0, 0($s1)              # $v0 = el carácter nuevo
	add  $s2, $s2, $v1            # $v1 = 1 si fue una sustitución
	addi $s0, $s0, 1
	addi $s1, $s1, 1
	j    bucle
fin:
	sb   $zero, 0($s1)
	sw   $s2, Cambios
	li   $v0, 10
	syscall

# traduce(c en $a0) -> $v0 = carácter cifrado, $v1 = 1 si se sustituyó por un dígito (0 si no)
traduce:
	li   $v1, 1
	move $t3, $a0
	blt  $a0, 'A', tr_compara
	bgt  $a0, 'Z', tr_compara
	addi $t3, $a0, 32
tr_compara:
	li   $v0, '4'
	beq  $t3, 'a', tr_fin
	li   $v0, '3'
	beq  $t3, 'e', tr_fin
	li   $v0, '1'
	beq  $t3, 'i', tr_fin
	li   $v0, '0'
	beq  $t3, 'o', tr_fin
	li   $v0, '5'
	beq  $t3, 's', tr_fin
	li   $v1, 0                   # no hubo sustitución
	move $v0, $a0
	blt  $a0, 'a', tr_fin
	bgt  $a0, 'z', tr_fin
	addi $v0, $a0, -32
tr_fin:
	jr   $ra
