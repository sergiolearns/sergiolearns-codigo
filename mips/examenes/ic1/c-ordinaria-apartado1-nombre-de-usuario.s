# Ordinaria C · Apartado 1: el nombre de usuario
# Del artículo «Simulacro práctico de IC1 — MIPS en QtSpim con otros datos, subrutinas y teclado (y por qué el apartado 1 lo decide casi todo)»
# https://sergiolearns.com/simulacro-examen-ic1-practica/
	.data
Cuenta: .word 0, 0, 0, 0          # Mayusculas, Minusculas, Digitos, Otros
Nick:   .asciiz "Kira_99 la Rapida!"
Limpio: .space 64                 # el nick limpio y en mayúsculas

	.text
	.globl main
main:
	la   $t0, Nick                # puntero de lectura
	la   $t1, Limpio              # puntero de escritura (solo avanza al copiar)
	li   $s0, 0                   # mayúsculas
	li   $s1, 0                   # minúsculas
	li   $s2, 0                   # dígitos
	li   $s3, 0                   # otros
bucle:
	lbu  $t2, 0($t0)              # c = Nick[i]
	beqz $t2, fin                 # el '\0' cierra la cadena
	blt  $t2, 'A', no_mayus
	bgt  $t2, 'Z', no_mayus
	addi $s0, $s0, 1              # mayúscula: se copia tal cual
	sb   $t2, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
no_mayus:
	blt  $t2, 'a', no_minus
	bgt  $t2, 'z', no_minus
	addi $s1, $s1, 1              # minúscula: se copia en mayúscula
	addi $t3, $t2, -32            # 'a' (97) - 32 = 'A' (65)
	sb   $t3, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
no_minus:
	blt  $t2, '0', otro
	bgt  $t2, '9', otro
	addi $s2, $s2, 1              # dígito: se copia
	sb   $t2, 0($t1)
	addi $t1, $t1, 1
	j    siguiente
otro:
	addi $s3, $s3, 1              # cualquier otro carácter: no se copia
siguiente:
	addi $t0, $t0, 1              # +1: las cadenas van byte a byte
	j    bucle
fin:
	sb   $zero, 0($t1)            # cerrar Limpio con su '\0'
	la   $t4, Cuenta
	sw   $s0, 0($t4)
	sw   $s1, 4($t4)
	sw   $s2, 8($t4)
	sw   $s3, 12($t4)
	li   $v0, 10
	syscall
