/*
 * Diagramas de flujo en C práctica — Programa 2: ¿es capicúa tu número de pasos?
 * Del artículo «Diagramas de flujo en C — práctica con la racha de la pulsera, un número capicúa y la media de la semana (diagrama primero, código después)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-practica/
 */

#include <stdio.h>
#include <string.h>

int main(void) {
    char cifra[20];   // los pasos se leen como texto para mirar cifra a cifra
    int i, j;

    printf("Pasos de hoy: ");
    scanf("%19s", cifra);          // %19s: deja sitio para el '\0'

    i = 0;                         // un índice por la izquierda
    j = strlen(cifra) - 1;         // y otro por la derecha (el último carácter, no el '\0')

    // Avanzan hacia el centro mientras no se crucen Y las cifras coincidan
    while (i < j && cifra[i] == cifra[j]) {
        i = i + 1;
        j = j - 1;
    }

    // Si se cruzaron (o se encontraron en el centro), todas las parejas coincidían
    if (i >= j) {
        printf("%s es capicúa\n", cifra);
    } else {
        printf("%s no es capicúa: la cifra %d ('%c') no coincide con la %d ('%c')\n",
               cifra, i, cifra[i], j, cifra[j]);
    }
    return 0;
}
