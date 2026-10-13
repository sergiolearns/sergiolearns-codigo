/*
 * Tipos y variables en C práctica — Programa 2: Calculadora de notas con media y clasificación
 * Del artículo «Tipos y variables en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>

int main() {
    /* Variables para las notas */
    float nota1, nota2, nota3, nota4;
    float media;
    char clasificacion;
    int aprobado;

    /* Entrada de notas */
    printf("=== CALCULADORA DE NOTAS ===\n\n");
    printf("Nota 1 (0-10): ");
    scanf("%f", &nota1);
    printf("Nota 2 (0-10): ");
    scanf("%f", &nota2);
    printf("Nota 3 (0-10): ");
    scanf("%f", &nota3);
    printf("Nota 4 (0-10): ");
    scanf("%f", &nota4);

    /* Cálculo de media */
    media = (nota1 + nota2 + nota3 + nota4) / 4.0;

    /* Clasificación — sin booleano, usamos int */
    aprobado = (media >= 5.0);

    /* Clasificación por letra */
    if (media >= 9.0)      clasificacion = 'A';
    else if (media >= 7.0) clasificacion = 'B';
    else if (media >= 5.0) clasificacion = 'C';
    else                   clasificacion = 'F';

    /* Resultados */
    printf("\n--- Resultados ---\n");
    printf("Nota 1: %.2f\n", nota1);
    printf("Nota 2: %.2f\n", nota2);
    printf("Nota 3: %.2f\n", nota3);
    printf("Nota 4: %.2f\n", nota4);
    printf("Media:  %.2f\n", media);
    printf("Letra:  %c\n",   clasificacion);
    printf("Aprobado (1=si, 0=no): %d\n", aprobado);

    return 0;
}
