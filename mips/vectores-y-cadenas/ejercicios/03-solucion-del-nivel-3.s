# Vectores y cadenas en MIPS ejercicios — Solución del nivel 3
# Del artículo «Vectores y cadenas en MIPS — ejercicios con vidas extra, un código de guardado cifrado y un récord que se cuela en la tabla (y el código que tenía una llave)»
# https://sergiolearns.com/vectores-y-cadenas-en-mips-ejercicios/
# nivel3.s: meter un record nuevo en la tabla ordenada (solucion del nivel 3)
        .data
puntos: .half 15600, 12400, 11050, 9850, 8800, 7320   # de mayor a menor
n:      .word 6
nuevo:  .half 11500                 # el record que llega
        .align 2                    # los nombres empiezan en multiplo de 4
nombres: .asciiz "LEO", "MAX", "ZOE", "SAM", "KAI", "ANA"   # 4 bytes = 1 palabra cada uno
quien:  .asciiz "EVA"               # el nombre del record nuevo
punto:  .asciiz ". "
esp:    .asciiz "  "
nl:     .asciiz "\n"
tpos:   .asciiz "Entra en el puesto "
        .text
        .globl main
main:   la   $s2, puntos
        la   $s3, nombres
        lw   $s4, n
        lh   $s5, nuevo             # $s5 = 11500
# --- 1. busco la posicion: el primer record menor que el nuevo ---
        li   $s0, 0                 # pos = 0
busca:  beq  $s0, $s4, salir        # no supera a ninguno: no entra
        sll  $t0, $s0, 1
        add  $t0, $t0, $s2
        lh   $t1, 0($t0)            # puntos[pos]
        blt  $t1, $s5, mueve        # puntos[pos] < nuevo: aqui entra
        addi $s0, $s0, 1
        j    busca
# --- 2. desplazo hacia atras desde el final: j = n-1 ... pos+1 ---
mueve:  addi $t2, $s4, -1           # j = n - 1 (el ultimo se pierde)
baja:   ble  $t2, $s0, mete         # contraria de (j > pos)
        sll  $t0, $t2, 1            # puntos[j] = puntos[j-1]
        add  $t0, $t0, $s2
        lh   $t1, -2($t0)           # -2: la media palabra de antes
        sh   $t1, 0($t0)
        sll  $t0, $t2, 2            # nombres[j] = nombres[j-1]
        add  $t0, $t0, $s3
        lw   $t1, -4($t0)           # un nombre entero de una vez (4 bytes)
        sw   $t1, 0($t0)
        addi $t2, $t2, -1           # j = j - 1
        j    baja
# --- 3. escribo el nuevo en pos ---
mete:   sll  $t0, $s0, 1
        add  $t0, $t0, $s2
        sh   $s5, 0($t0)            # puntos[pos] = nuevo
        sll  $t0, $s0, 2
        add  $t0, $t0, $s3
        lw   $t1, quien             # "EVA" + '\0' cabe en una palabra
        sw   $t1, 0($t0)            # nombres[pos] = quien
        li   $v0, 4
        la   $a0, tpos
        syscall
        li   $v0, 1
        addi $a0, $s0, 1            # puesto = pos + 1
        syscall
        li   $v0, 4
        la   $a0, nl
        syscall
# --- 4. imprimo la tabla ---
salir:  li   $t2, 0                 # i = 0
tabla:  beq  $t2, $s4, adios
        li   $v0, 1
        addi $a0, $t2, 1
        syscall
        li   $v0, 4
        la   $a0, punto
        syscall
        sll  $t0, $t2, 2
        add  $a0, $t0, $s3          # nombres[i]
        li   $v0, 4
        syscall
        li   $v0, 4
        la   $a0, esp
        syscall
        sll  $t0, $t2, 1
        add  $t0, $t0, $s2
        lh   $a0, 0($t0)            # puntos[i]
        li   $v0, 1
        syscall
        li   $v0, 4
        la   $a0, nl
        syscall
        addi $t2, $t2, 1
        j    tabla
adios:  li   $v0, 10
        syscall
