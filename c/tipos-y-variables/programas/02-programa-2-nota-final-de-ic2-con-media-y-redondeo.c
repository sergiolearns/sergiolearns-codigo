/*
 * Programa 2: la nota final de IC2 con media y redondeo
 * Del artículo «Tipos y variables en C — práctica con una calculadora, la nota final de IC2 y una ficha con la letra del DNI (y la división entre cero que mata el programa)»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>

int main(void) {
    float teoria, practica, test, proyecto;   /* las cuatro notas de IC2 */

    printf("=== NOTA FINAL DE IC2 ===\n\n");
    printf("Teoría (0-10): ");
    scanf("%f", &teoria);                     /* float -> %f en scanf */
    printf("Práctica (0-10): ");
    scanf("%f", &practica);
    printf("Test (0-10): ");
    scanf("%f", &test);
    printf("Proyecto (0-10): ");
    scanf("%f", &proyecto);

    float suma = teoria + practica + test + proyecto;
    float media = suma / 4.0f;                /* 4.0f: división real */
    /* pesos de ejemplo: 40 % teoría, 30 % práctica, 20 % test y 10 % proyecto */
    float ponderada = teoria * 0.40f + practica * 0.30f + test * 0.20f + proyecto * 0.10f;
    int media_truncada = (int)media;          /* (int) corta: 7.75 -> 7 */
    int media_redondeada = (int)(media + 0.5f);   /* truco: sumar 0.5 y cortar -> 8 */
    int aprobado = media >= 5.0f;             /* sin if todavía: una comparación da 1 o 0 */
    int notable = media >= 7.0f && media < 9.0f;

    printf("\n--- Resultados ---\n");
    printf("Suma:               %.2f\n", suma);
    printf("Media:              %.2f\n", media);
    printf("Media ponderada:    %.2f\n", ponderada);
    printf("Media truncada:     %d\n", media_truncada);
    printf("Media redondeada:   %d\n", media_redondeada);
    printf("Aprobado (1 = sí):  %d\n", aprobado);
    printf("Notable (1 = sí):   %d\n", notable);
    return 0;
}
