# Llamadas al sistema en MIPS práctica — Programa 3: El reparto de puntos
# Del artículo «Llamadas al sistema en MIPS — práctica con QtSpim: la ficha del personaje, un menú de clases que no se deja engañar y 20 puntos que repartir (y el saludo que se partió en dos líneas)»
# https://sergiolearns.com/llamadas-al-sistema-en-mips-practica/
# puntos.s: repartir 20 puntos entre 4 caracteristicas
        .data
stats:  .word 0, 0, 0, 0     # fuerza, magia, agilidad, vida
nombres: .word sf, sm, sa, sv
sf:     .asciiz "Fuerza   "  # todas de 9 caracteres: las barras
sm:     .asciiz "Magia    "  # empiezan en la misma columna
sa:     .asciiz "Agilidad "
sv:     .asciiz "Vida     "
tque:   .asciiz "(te quedan "
tdos:   .asciiz "): "
tmal:   .asciiz "No tienes tantos puntos.\n"
tvec:   .asciiz "\nStats: ["
coma:   .asciiz ", "
tcie:   .asciiz "]\n"
        .text
        .globl main
main:   li $s0, 0            # i = 0
        li $s2, 20           # puntos que quedan
pedir:  beq $s0, 4, ver      # 4 caracteristicas
        sll $s1, $s0, 2      # $s1 = i * 4, para las dos tablas
        lw $a0, nombres($s1) # "Fuerza   "...
        li $v0, 4
        syscall
        la $a0, tque
        li $v0, 4
        syscall
        move $a0, $s2        # cuantos quedan
        li $v0, 1
        syscall
        la $a0, tdos
        li $v0, 4
        syscall
        li $v0, 5            # read_int
        syscall
        move $t0, $v0
        bltz $t0, mal        # negativo: no vale
        bgt $t0, $s2, mal    # mas de los que quedan: no vale
        sw $t0, stats($s1)   # stats[i] = valor
        sub $s2, $s2, $t0    # quedan -= valor
        addi $s0, $s0, 1     # solo avanzo si el valor era bueno
        j pedir
mal:    la $a0, tmal
        li $v0, 4
        syscall
        j pedir              # misma i: se vuelve a preguntar lo mismo
ver:    # --- el vector en una linea ---
        la $a0, tvec
        li $v0, 4
        syscall
        li $s0, 0
lista:  beq $s0, 4, barras
        beqz $s0, num        # sin coma antes del primero
        la $a0, coma
        li $v0, 4
        syscall
num:    sll $s1, $s0, 2
        lw $a0, stats($s1)
        li $v0, 1
        syscall
        addi $s0, $s0, 1
        j lista
barras: la $a0, tcie
        li $v0, 4
        syscall
        # --- una barra de '#' por caracteristica ---
        li $s0, 0
fila:   beq $s0, 4, salir
        sll $s1, $s0, 2
        lw $a0, nombres($s1) # nombre de 9 caracteres
        li $v0, 4
        syscall
        lw $t1, stats($s1)   # cuantas almohadillas
alm:    beqz $t1, finfila
        li $a0, '#'
        li $v0, 11           # print_char
        syscall
        addi $t1, $t1, -1
        j alm
finfila: li $a0, '\n'
        li $v0, 11
        syscall
        addi $s0, $s0, 1
        j fila
salir:  li $v0, 10
        syscall
