# Vectores y cadenas en MIPS práctica — Programa 3: El espejo
# Del artículo «Vectores y cadenas en MIPS — práctica con QtSpim: la tabla de récords, un letrero que se enciende en mayúsculas y un espejo para los mensajes (y el letrero que se apagó en el primer espacio)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-practica/
# espejo.s: el mensaje al reves sin espacios y los nombres capicua
        .data
msg:    .asciiz "INSERT COIN"
nombres: .asciiz "SAM", "LEO", "ANA", "MAX", "ZOE", "KAI"   # 4 bytes cada nombre
n:      .word 6
reves:  .space 16
trev:   .asciiz "Al reves y sin espacios: "
tesp:   .asciiz "\nEspacios quitados: "
tcap:   .asciiz "\nCapicuas: "
esp:    .asciiz " "
        .text
        .globl main
main:
# --- parte 1: al reves y sin espacios ---
        la   $t0, msg               # inicio
        move $t1, $t0
busca:  lbu  $t2, 0($t1)            # busco el '\0'
        beqz $t2, ultimo
        addi $t1, $t1, 1
        j    busca
ultimo: addi $t1, $t1, -1           # $t1 = ultimo caracter
        la   $t3, reves             # puntero de escritura
        li   $s0, 0                 # espacios quitados
copia:  blt  $t1, $t0, cierra       # he pasado el principio
        lbu  $t2, 0($t1)
        bne  $t2, ' ', escribe      # contraria de (c == ' ')
        addi $s0, $s0, 1            # un espacio: lo cuento y no lo escribo
        j    avanza
escribe: sb  $t2, 0($t3)
        addi $t3, $t3, 1            # la escritura solo avanza si escribo
avanza: addi $t1, $t1, -1           # la lectura siempre retrocede
        j    copia
cierra: sb   $zero, 0($t3)
        li   $v0, 4
        la   $a0, trev
        syscall
        li   $v0, 4
        la   $a0, reves
        syscall
        li   $v0, 4
        la   $a0, tesp
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, tcap
        syscall
# --- parte 2: que nombres se leen igual al derecho y al reves ---
        la   $s2, nombres           # $s2 = nombre actual
        lw   $s3, n
        li   $s4, 0                 # i = 0
nombre: beq  $s4, $s3, salir
        move $t0, $s2               # izquierda: primera letra
        move $t1, $s2
fin_n:  lbu  $t2, 0($t1)            # derecha: busco el '\0'...
        beqz $t2, der
        addi $t1, $t1, 1
        j    fin_n
der:    addi $t1, $t1, -1           # ... y me quedo en la ultima letra
compara: bge $t0, $t1, capicua      # se han cruzado: todas las parejas iguales
        lbu  $t2, 0($t0)
        lbu  $t3, 0($t1)
        bne  $t2, $t3, nocap        # una pareja distinta: no es capicua
        addi $t0, $t0, 1            # izquierda hacia delante
        addi $t1, $t1, -1           # derecha hacia atras
        j    compara
capicua: li  $v0, 4
        move $a0, $s2
        syscall
        li   $v0, 4
        la   $a0, esp
        syscall
nocap:  addi $s2, $s2, 4            # siguiente nombre (4 bytes)
        addi $s4, $s4, 1
        j    nombre
salir:  li   $v0, 10
        syscall
