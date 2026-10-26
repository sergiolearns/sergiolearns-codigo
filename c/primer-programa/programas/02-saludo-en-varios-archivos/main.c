/*
 * Instalar gedit en Fedora y compilar con gcc — Programa 2: un programa en varios archivos (main.c). Compila con: gcc -Wall main.c saludo.c -o saludo
 * Del artículo «C en Fedora — instala gedit, compila con gcc y entiende sus errores (empezando por el «command not found» de mi primer día en IC2)»
 * https://sergiolearns.com/instalar-gedit-en-fedora-y-compilar-con-gcc/
 */
#include "saludo.h"

int main() {
    saludar("Laura");
    saludar("Pablo");
    return 0;
}
