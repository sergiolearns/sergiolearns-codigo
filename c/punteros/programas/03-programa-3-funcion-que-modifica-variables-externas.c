/*
 * Punteros en C práctica — Programa 3: Función que modifica variables externas
 * Del artículo «Punteros en C — 4 programas reales para perderles el miedo»
 * https://sergiolearns.com/punteros-en-c-practica/
 */

#include <stdio.h>

/* Función que calcula suma y media — devuelve dos resultados */
void calcular_suma_media(int *vec, int n, int *suma, float *media) {
    int i;
    *suma = 0;

    for (i = 0; i < n; i++) {
        *suma += vec[i];
    }

    *media = (float)(*suma) / n;
}

/* Función que encuentra máximo y mínimo */
void encontrar_max_min(int *vec, int n, int *maximo, int *minimo) {
    int i;
    *maximo = vec[0];
    *minimo = vec[0];

    for (i = 1; i < n; i++) {
        if (vec[i] > *maximo) {
            *maximo = vec[i];
        }
        if (vec[i] < *minimo) {
            *minimo = vec[i];
        }
    }
}

/* Función que invierte el vector en su lugar */
void invertir_vector(int *vec, int n) {
    int *inicio = vec;
    int *fin = vec + n - 1;
    int temp;

    while (inicio < fin) {
        temp = *inicio;
        *inicio = *fin;
        *fin = temp;
        inicio++;
        fin--;
    }
}

int main() {
    int vec[8] = {15, 8, 42, 3, 27, 19, 11, 35};
    int n = 8;
    int suma, maximo, minimo;
    float media;
    int i;

    printf("=== ESTADÍSTICAS DEL VECTOR ===\n\n");

    printf("Vector original: ");
    for (i = 0; i < n; i++) {
        printf("%d ", vec[i]);
    }
    printf("\n\n");

    /* Llamadas con punteros */
    calcular_suma_media(vec, n, &suma, &media);
    encontrar_max_min(vec, n, &maximo, &minimo);

    printf("Suma:   %d\n",   suma);
    printf("Media:  %.2f\n", media);
    printf("Máximo: %d\n",   maximo);
    printf("Mínimo: %d\n",   minimo);
    printf("Rango:  %d\n\n", maximo - minimo);

    invertir_vector(vec, n);

    printf("Vector invertido: ");
    for (i = 0; i < n; i++) {
        printf("%d ", vec[i]);
    }
    printf("\n");

    return 0;
}
