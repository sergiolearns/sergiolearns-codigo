/*
 * Programa 1: clasificador de notas con if / else if
 * Del artículo «Condicionales en C — práctica con un clasificador de notas, un adivino de un solo intento y una calculadora con switch (y el punto y coma que me suspendió con un 7,5)»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main(void) {
    float nota;

    printf("=== CLASIFICADOR DE NOTAS ===\n\n");
    printf("Introduce tu nota (0-10): ");

    // scanf devuelve cuántos datos ha leído: si no es 1, no nos han dado un número
    if (scanf("%f", &nota) != 1) {
        printf("Error: eso no es un número\n");
        return 1;
    }

    // Validamos el rango ANTES de clasificar: con un 11 no hay calificación posible
    if (nota < 0 || nota > 10) {
        printf("Error: la nota debe estar entre 0 y 10\n");
        return 1;
    }

    // De la nota más alta a la más baja: cada else if ya sabe que las de arriba fallaron
    if (nota >= 9.0f) {
        printf("Calificación: Sobresaliente\n");
    } else if (nota >= 7.0f) {
        printf("Calificación: Notable\n");
    } else if (nota >= 5.0f) {
        printf("Calificación: Aprobado\n");
    } else {
        printf("Calificación: Suspenso\n");
    }

    // En C no hay True/False: una comparación vale 1 o 0 y se puede guardar en un int
    int aprobado = (nota >= 5.0f);
    printf("¿Aprobado? (1 = sí, 0 = no): %d\n", aprobado);

    // if (aprobado) es lo mismo que if (aprobado != 0)
    if (aprobado) {
        printf("Tienes %.2f puntos sobre el aprobado\n", nota - 5.0f);
    } else {
        printf("Te faltan %.2f puntos para aprobar\n", 5.0f - nota);
    }

    // El ternario elige entre dos textos en una sola línea
    printf("Matrícula de Honor: %s\n", (nota >= 9.0f) ? "puedes optar" : "no");
    return 0;
}
