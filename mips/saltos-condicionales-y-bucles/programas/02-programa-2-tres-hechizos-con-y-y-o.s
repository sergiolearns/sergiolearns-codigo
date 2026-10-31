# Saltos, condicionales y bucles en MIPS práctica — Programa 2: Tres hechizos con «y» y «o»
# Del artículo «Saltos, condicionales y bucles en MIPS — práctica con QtSpim: el informe de la oleada, tres hechizos con «y» y «o» y un combate que para a tiempo (y el héroe que acabó con energía negativa)»
# https://sergiolearns.com/saltos-condicionales-y-bucles-en-mips-practica/
# hechizos.s: tres preguntas a cada enemigo con condiciones "y" y "o"
        .data
oleada: .word 35, 80, 40, 120, 15, 60, 90, 200   # la vida de cada enemigo
n:      .word 8                     # cuantos enemigos hay
res:    .space 12                   # +0 dos golpes, +4 congelables, +8 pociones
t_dos:  .asciiz "Enemigos de dos golpes: "
t_hie:  .asciiz "\nSe pueden congelar: "
t_poc:  .asciiz "\nSueltan pocion: "

        .text
        .globl main
main:   la   $t0, oleada            # puntero al enemigo actual
        lw   $t1, n                 # $t1 = 8
        li   $t2, 0                 # i = 0
        li   $s0, 0                 # dos golpes:  40 < vida <= 80
        li   $s1, 0                 # congelables: vida < 40 o vida >= 120
        li   $s2, 0                 # pociones:    (40 < vida <= 80) o vida >= 200
bucle:  beq  $t2, $t1, fin
        lw   $t3, 0($t0)            # $t3 = vida del enemigo i
# --- pregunta 1, con "y": las dos contrarias saltan al mismo finsi ---
        ble  $t3, 40, fin1          # contraria de (vida > 40)
        bgt  $t3, 80, fin1          # contraria de (vida <= 80)
        addi $s0, $s0, 1
fin1:
# --- pregunta 2, con "o": la primera salta TAL CUAL al entonces ---
        blt  $t3, 40, ent2          # vida < 40: ya vale
        blt  $t3, 120, fin2         # contraria de (vida >= 120): no vale ninguna
ent2:   addi $s1, $s1, 1
fin2:
# --- pregunta 3, (a y b) o c: si falla el "y", queda c ---
        ble  $t3, 40, otra3         # falla a: probamos c
        ble  $t3, 80, ent3          # a y b: ya vale
otra3:  blt  $t3, 200, fin3         # contraria de c (vida >= 200)
ent3:   addi $s2, $s2, 1
fin3:   addi $t0, $t0, 4            # siguiente enemigo
        addi $t2, $t2, 1            # i = i + 1
        j    bucle
fin:    la   $t4, res               # guardar los tres resultados en memoria
        sw   $s0, 0($t4)
        sw   $s1, 4($t4)
        sw   $s2, 8($t4)
        li   $v0, 4
        la   $a0, t_dos
        syscall
        li   $v0, 1
        move $a0, $s0
        syscall
        li   $v0, 4
        la   $a0, t_hie
        syscall
        li   $v0, 1
        move $a0, $s1
        syscall
        li   $v0, 4
        la   $a0, t_poc
        syscall
        li   $v0, 1
        move $a0, $s2
        syscall
        li   $v0, 10
        syscall
