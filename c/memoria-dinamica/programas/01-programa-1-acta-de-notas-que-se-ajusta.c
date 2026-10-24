/*
 * Memoria dinámica en C práctica — Programa 1: El acta de notas que se ajusta
 * Del artículo «Memoria dinámica en C — práctica con un acta de notas que se ajusta, un vector que crece al llegar alumnos y una tabla de notas en el heap (y el realloc que casi me deja sin datos)»
 * https://sergiolearns.com/memoria-dinamica-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>

/* Lo que "teclea" el profe: primero cuántas notas y luego las notas (una vale 11.5 por error) */
const double ENTRADA[] = {8, 6.5, 4.0, 9.5, 11.5, 5.0, 7.0, 3.0, 8.5};

/* Copia en v las notas válidas (0..10) y devuelve cuántas ha guardado */
int leer_notas(double *v, int n, const double *entrada) {
    int k = 0;                              /* k = casillas ocupadas de verdad */
    for (int i = 0; i < n; i++) {
        double x = entrada[i];
        if (x < 0 || x > 10) {              /* nota imposible: avisamos y no la guardamos */
            printf("Descartada la nota %.1f\n", x);
            continue;
        }
        v[k++] = x;                         /* guarda en v[k] y DESPUÉS suma 1 a k */
    }
    return k;
}

double media(const double *v, int n) {
    double suma = 0;
    for (int i = 0; i < n; i++) suma += v[i];
    return suma / n;
}

int main(void) {
    int n = (int)ENTRADA[0];                /* 8: el tamaño solo se conoce al ejecutar */
    double *notas = malloc(n * sizeof *notas);
    if (notas == NULL) { printf("Sin memoria\n"); return 1; }

    int k = leer_notas(notas, n, ENTRADA + 1);   /* ENTRADA + 1: saltamos el 8 */

    if (k < n) {                            /* sobran casillas: encogemos el vector */
        double *tmp = realloc(notas, k * sizeof *notas);
        if (tmp != NULL) {                  /* si fallara, el vector grande sigue sirviendo */
            printf("Vector ajustado de %d a %d casillas (%zu -> %zu bytes)\n",
                   n, k, n * sizeof *notas, k * sizeof *notas);
            notas = tmp;
        }
    }

    double m = media(notas, k);
    int aprobados = 0;
    double max = notas[0], min = notas[0];
    for (int i = 0; i < k; i++) {
        if (notas[i] >= 5) aprobados++;     /* >= porque un 5.0 es aprobado */
        if (notas[i] > max) max = notas[i];
        if (notas[i] < min) min = notas[i];
    }
    printf("Notas validas: %d | media %.2f | aprobados %d\n", k, m, aprobados);
    printf("Maxima %.1f | minima %.1f\n", max, min);
    printf("Por encima de la media:");
    for (int i = 0; i < k; i++)
        if (notas[i] > m) printf(" %.1f", notas[i]);
    printf("\n");

    free(notas);
    notas = NULL;
    return 0;
}
