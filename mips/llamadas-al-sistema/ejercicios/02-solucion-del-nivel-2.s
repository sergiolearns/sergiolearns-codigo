# Llamadas al sistema en MIPS ejercicios — Solución del nivel 2
# Del artículo «Llamadas al sistema en MIPS — ejercicios con una tienda de pociones, un código de amigo con su dígito de control y el registro de un gremio (y el menú que con un 7 sacaba al jefe final)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-ejercicios/
# nivel2.s: el codigo de amigo de 12 digitos (solucion del nivel 2)
        .data
buf:    .space 20            # texto tecleado (de sobra para 12 + '\n')
dig:    .byte 0:12           # las 12 cifras ya como numeros
pcod:   .asciiz "Codigo de amigo (12 digitos): "
tmal:   .asciiz "Codigo no valido: tienen que ser 12 digitos seguidos.\n"
tcod:   .asciiz "Codigo: "
tok:    .asciiz "\nControl correcto.\n"
tko:    .asciiz "\nControl incorrecto: deberia acabar en "
        .text
        .globl main
main:   # --- 1. leer y comprobar: 12 digitos y nada mas ---
leer:   la $a0, pcod
        li $v0, 4
        syscall
        la $a0, buf
        li $a1, 20
        li $v0, 8            # read_string
        syscall
        li $t0, 0            # i = 0 (caracteres validos)
cifra:  lbu $t1, buf($t0)    # c = buf[i]
        beq $t1, '\n', fin   # se acabo lo tecleado
        beqz $t1, fin
        blt $t1, '0', mal    # un caracter que no es cifra
        bgt $t1, '9', mal
        beq $t0, 12, mal     # ya llevaba 12: sobran cifras
        addi $t1, $t1, -48   # caracter -> numero
        sb $t1, dig($t0)     # dig[i] = cifra
        addi $t0, $t0, 1
        j cifra
fin:    bne $t0, 12, mal     # menos de 12: tambien mal
        # --- 2. control: suma de las 11 primeras, modulo 10 ---
        li $t0, 0
        li $s0, 0            # suma = 0
suma:   beq $t0, 11, resto
        lb $t1, dig($t0)
        add $s0, $s0, $t1
        addi $t0, $t0, 1
        j suma
resto:  li $t2, 10
        div $s0, $t2         # LO = cociente, HI = resto
        mfhi $s1             # $s1 = suma % 10, el control esperado
        # --- 3. imprimir en grupos de 4 ---
        la $a0, tcod
        li $v0, 4
        syscall
        li $t0, 0
grupo:  beq $t0, 12, ctrl
        beqz $t0, uno        # sin espacio delante del primero
        andi $t3, $t0, 3     # i % 4 == 0 -> empieza un grupo
        bnez $t3, uno
        li $a0, ' '
        li $v0, 11
        syscall
uno:    lb $a0, dig($t0)     # la cifra como numero...
        li $v0, 1            # ...y print_int la escribe
        syscall
        addi $t0, $t0, 1
        j grupo
ctrl:   lb $t1, dig+11       # la ultima cifra
        beq $t1, $s1, bien
        la $a0, tko
        li $v0, 4
        syscall
        move $a0, $s1
        li $v0, 1
        syscall
        li $a0, '\n'
        li $v0, 11
        syscall
        j salir
bien:   la $a0, tok
        li $v0, 4
        syscall
salir:  li $v0, 10
        syscall
mal:    la $a0, tmal
        li $v0, 4
        syscall
        j leer
