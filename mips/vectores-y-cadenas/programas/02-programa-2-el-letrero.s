# Vectores y cadenas en MIPS práctica — Programa 2: El letrero
# Del artículo «Vectores y cadenas en MIPS — práctica con QtSpim: la tabla de récords, un letrero que se enciende en mayúsculas y un espejo para los mensajes (y el letrero que se apagó en el primer espacio)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-practica/
# letrero.s: el letrero de la recreativa en mayusculas, letra a letra
        .data
aviso:  .asciiz "nuevo record de leo: 15600!"   # lo que llega
letrero: .space 32                  # lo que se enciende
tlet:   .asciiz "Letrero: "
tmay:   .asciiz "\nLetras cambiadas: "
tdig:   .asciiz "\nDigitos: "
tluz:   .asciiz "\nEn luces: "
        .text
        .globl main
main:   la   $t0, aviso             # puntero de lectura
        la   $t1, letrero           # puntero de escritura
        li   $s0, 0                 # letras cambiadas
        li   $s1, 0                 # digitos
bucle:  lbu  $t2, 0($t0)            # caracter actual
        beqz $t2, fin               # '\0': se acabo el aviso
        blt  $t2, 'a', nomin        # contraria de (c >= 'a')
        bgt  $t2, 'z', nomin        # contraria de (c <= 'z')
        addi $t2, $t2, -32          # minuscula -> mayuscula
        addi $s0, $s0, 1
        j    escribe                # una minuscula no es digito: me salto esa pregunta
nomin:  blt  $t2, '0', escribe      # contraria de (c >= '0')
        bgt  $t2, '9', escribe      # contraria de (c <= '9')
        addi $s1, $s1, 1            # es un digito: lo cuento y lo dejo igual
escribe: sb  $t2, 0($t1)            # escribo el caracter (cambiado o no)
        addi $t0, $t0, 1
        addi $t1, $t1, 1
        j    bucle
fin:    sb   $zero, 0($t1)          # cierro el letrero
        li   $v0, 4
        la   $a0, tlet
        syscall
        li   $v0, 4
        la   $a0, letrero
        syscall
        li   $v0, 4
        la   $a0, tmay
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, tdig
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, tluz
        syscall
# --- el letrero en luces: cada caracter seguido de un espacio (syscall 11) ---
        la   $t1, letrero
luces:  lbu  $a0, 0($t1)            # el caracter va directo a $a0
        beqz $a0, salir
        li   $v0, 11                # print_char: imprime el caracter de $a0
        syscall
        li   $a0, ' '
        li   $v0, 11
        syscall
        addi $t1, $t1, 1
        j    luces
salir:  li   $v0, 10
        syscall
