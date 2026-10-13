/*
 * Bucles en C práctica — Programa 1: Validador de datos con do...while
 * Del artículo «Bucles en C — 3 programas reales con for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-practica/
 */

#include <stdio.h>

int main() {
    float nota;
    int edad;
    char opcion;

    /* Validar nota con do...while */
    printf("=== VALIDADOR DE DATOS ===\n\n");

    do {
        printf("Introduce una nota (0-10): ");
        scanf("%f", &nota);
        if (nota < 0 || nota > 10) {
            printf("Error: la nota debe estar entre 0 y 10\n");
        }
    } while (nota < 0 || nota > 10);

    printf("Nota válida: %.2f\n\n", nota);

    /* Validar edad con do...while */
    do {
        printf("Introduce tu edad (0-120): ");
        scanf("%d", &edad);
        if (edad < 0 || edad > 120) {
            printf("Error: edad fuera de rango\n");
        }
    } while (edad < 0 || edad > 120);

    printf("Edad válida: %d\n\n", edad);

    /* Validar opción s/n con do...while */
    do {
        printf("¿Confirmas los datos? (s/n): ");
        scanf(" %c", &opcion);
        if (opcion != 's' && opcion != 'n') {
            printf("Error: introduce s o n\n");
        }
    } while (opcion != 's' && opcion != 'n');

    if (opcion == 's') {
        printf("\n✓ Datos confirmados\n");
        printf("Nota: %.2f | Edad: %d\n", nota, edad);
    } else {
        printf("\n✗ Datos cancelados\n");
    }

    return 0;
}
