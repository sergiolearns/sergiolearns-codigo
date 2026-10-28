# Programa de ejemplo de las guías de QtSpim y Notepad++
# Del artículo «Instalar QtSpim — Windows, Linux y Mac, los ajustes del laboratorio y tu primer programa MIPS en 10 minutos (y el día que QtSpim no veía mi archivo)»
# https://sergiolearns.com/instalar-qtspim/
# suma.s: suma los minutos de estudio de cuatro días
        .data
minutos: .word 45, 30, 60, 25      # minutos de cada día (palabras de 4 bytes)
dias:    .word 4                   # cuántos días hay
msg:     .asciiz "Minutos en total: "
        .text
        .globl main
main:   la   $t0, minutos          # $t0 = dirección del primer día
        lw   $t1, dias             # $t1 = días que quedan por sumar
        li   $t2, 0                # $t2 = suma acumulada
bucle:  beq  $t1, $zero, fin       # si no quedan días, salimos del bucle
        lw   $t3, 0($t0)           # $t3 = minutos del día actual
        add  $t2, $t2, $t3         # suma = suma + minutos
        addi $t0, $t0, 4           # avanzamos a la siguiente palabra (4 bytes)
        addi $t1, $t1, -1          # queda un día menos
        j    bucle
fin:    li   $v0, 4                # syscall 4: imprimir una cadena
        la   $a0, msg
        syscall
        li   $v0, 1                # syscall 1: imprimir un entero
        move $a0, $t2
        syscall
        li   $v0, 10               # syscall 10: terminar el programa
        syscall
