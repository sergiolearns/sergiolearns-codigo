/*
 * Instalar gedit en Fedora y compilar con gcc — Programa 2: un programa en varios archivos (saludo.c). Compila con: gcc -Wall main.c saludo.c -o saludo
 * Del artículo «C en Fedora — instala gedit, compila con gcc y entiende sus errores (empezando por el «command not found» de mi primer día en IC2)»
 * https://sergiolearns.com/instalar-gedit-en-fedora-y-compilar-con-gcc/
 */
#include <stdio.h>
#include "saludo.h"

void saludar(const char *nombre) {
    printf("Hola, %s. Bienvenido a IC2\n", nombre);
}
