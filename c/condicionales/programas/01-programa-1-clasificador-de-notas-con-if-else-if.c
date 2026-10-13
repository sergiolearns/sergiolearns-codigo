/*
 * Condicionales en C práctica — Programa 1: Clasificador de notas con if/else if
 * Del artículo «Condicionales en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main() {
    float nota;
    int aprobado;

    printf("=== CLASIFICADOR DE NOTAS ===\n\n");
    printf("Introduce tu nota (0-10): ");
    scanf("%f", &nota);

    /* Validación del rango */
    if (nota < 0 || nota > 10) {
        printf("Error: la nota debe estar entre 0 y 10\n");
        return 1;
    }

    /* Clasificación */
    if (nota >= 9.0) {
        printf("Calificación: Sobresaliente\n");
    } else if (nota >= 7.0) {
        printf("Calificación: Notable\n");
    } else if (nota >= 6.0) {
        printf("Calificación: Bien\n");
    } else if (nota >= 5.0) {
        printf("Calificación: Aprobado\n");
    } else if (nota >= 3.0) {
        printf("Calificación: Suspenso\n");
    } else {
        printf("Calificación: Muy deficiente\n");
    }

    /* No hay booleano — usamos int */
    aprobado = (nota >= 5.0);
    printf("¿Aprobado? (1=sí, 0=no): %d\n", aprobado);

    /* Puntos para aprobar o sobre el aprobado */
    if (aprobado) {
        printf("Tienes %.2f puntos sobre el aprobado\n", nota - 5.0);
    } else {
        printf("Te faltan %.2f puntos para aprobar\n", 5.0 - nota);
    }

    return 0;
}
