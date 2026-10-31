# Vectores y cadenas en MIPS ejercicios — Solución del nivel 2
# Del artículo «Vectores y cadenas en MIPS — ejercicios con vidas extra, un código de guardado cifrado y un récord que se cuela en la tabla (y el código que tenía una llave)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-ejercicios/
# nivel2.s: el codigo de guardado, cada minuscula 3 letras mas alla (solucion del nivel 2)
        .data
partida: .asciiz "zoe gana 3 a 1"   # lo que hay que cifrar
codigo: .space 32                   # la cadena cifrada
tcod:   .asciiz "Codigo: "
tcuan:  .asciiz "\nLetras cifradas: "
        .text
        .globl main
main:   la   $t0, partida
        la   $t1, codigo
        li   $s0, 0                 # letras cifradas
bucle:  lbu  $t2, 0($t0)
        beqz $t2, fin
        blt  $t2, 'a', escribe      # contraria de (c >= 'a')
        bgt  $t2, 'z', escribe      # contraria de (c <= 'z')
        addi $t2, $t2, 3            # 3 letras mas alla
        ble  $t2, 'z', cuenta       # si no se pasa de la z, ya esta
        addi $t2, $t2, -26          # se ha pasado: vuelta al principio del abecedario
cuenta: addi $s0, $s0, 1
escribe: sb  $t2, 0($t1)
        addi $t0, $t0, 1
        addi $t1, $t1, 1
        j    bucle
fin:    sb   $zero, 0($t1)          # cierro el codigo
        li   $v0, 4
        la   $a0, tcod
        syscall
        li   $v0, 4
        la   $a0, codigo
        syscall
        li   $v0, 4
        la   $a0, tcuan
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 10
        syscall
