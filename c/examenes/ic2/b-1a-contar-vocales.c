/* Versión B, ejercicio 1a: contar las vocales de una cadena
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

int main() {
    char cadena[] = "procesos e hilos";   /* C añade el '\0' al final */
    int vocales = 0;
    int i;
    char c;

    /* recorremos hasta el '\0', que marca el final de toda cadena */
    for (i = 0; cadena[i] != '\0'; i++) {
        c = cadena[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vocales++;
        }
    }

    printf("La cadena tiene %d vocales\n", vocales);
    return 0;
}
