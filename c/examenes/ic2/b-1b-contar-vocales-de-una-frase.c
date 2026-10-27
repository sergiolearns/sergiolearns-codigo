/* Versión B, ejercicio 1b: vocales de una frase del usuario
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

int main() {
    char cadena[200];   /* no sabemos el texto: reservamos espacio de sobra */
    int vocales = 0;
    int i;
    char c;

    printf("Introduce una frase: ");
    fgets(cadena, 200, stdin);   /* fgets lee también los espacios (scanf %s cortaría) */

    for (i = 0; cadena[i] != '\0'; i++) {
        c = cadena[i];
        /* ahora el usuario puede escribir mayúsculas: las miramos también */
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
            c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U') {
            vocales++;
        }
    }

    printf("La frase tiene %d vocales\n", vocales);
    return 0;
}
