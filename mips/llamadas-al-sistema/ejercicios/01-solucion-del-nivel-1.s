# Llamadas al sistema en MIPS ejercicios — Solución del nivel 1
# Del artículo «Llamadas al sistema en MIPS — ejercicios con una tienda de pociones, un código de amigo con su dígito de control y el registro de un gremio (y el menú que con un 7 sacaba al jefe final)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-ejercicios/
# nivel1.s: la tienda de pociones (solucion del nivel 1)
        .data
poro:   .asciiz "Monedas de oro: "
pprec:  .asciiz "Precio de una pocion: "
pcant:  .asciiz "Cuantas quieres: "
ttot:   .asciiz "Total: "
tque:   .asciiz "\nCompra hecha. Te quedan "
tfal:   .asciiz "\nNo te llega: te faltan "
tmon:   .asciiz " monedas.\n"
        .text
        .globl main
main:   la $a0, poro
        li $v0, 4
        syscall
        li $v0, 5            # read_int: oro
        syscall
        move $s0, $v0        # $s0 = oro (fuera de $v0 enseguida)
        la $a0, pprec
        li $v0, 4
        syscall
        li $v0, 5            # read_int: precio
        syscall
        move $s1, $v0        # $s1 = precio
        la $a0, pcant
        li $v0, 4
        syscall
        li $v0, 5            # read_int: cantidad
        syscall
        move $s2, $v0        # $s2 = cantidad
        mul $s3, $s1, $s2    # total = precio * cantidad
        la $a0, ttot
        li $v0, 4
        syscall
        move $a0, $s3
        li $v0, 1
        syscall
        bgt $s3, $s0, falta  # total > oro: no llega
        la $a0, tque
        li $v0, 4
        syscall
        sub $a0, $s0, $s3    # lo que sobra
        j cifra
falta:  la $a0, tfal
        li $v0, 4
        syscall
        sub $a0, $s3, $s0    # lo que falta (positivo)
cifra:  li $v0, 1            # $a0 ya tiene el numero
        syscall
        la $a0, tmon
        li $v0, 4
        syscall
        li $v0, 10
        syscall
