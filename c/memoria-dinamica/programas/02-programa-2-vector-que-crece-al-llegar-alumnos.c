/*
 * Memoria dinámica en C práctica — Programa 2: Un vector que crece cuando llegan alumnos
 * Del artículo «Memoria dinámica en C — práctica con un acta de notas que se ajusta, un vector que crece al llegar alumnos y una tabla de notas en el heap (y el realloc que casi me deja sin datos)»
 * https://sergiolearns.com/memoria-dinamica-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>

/* Las notas llegan una a una y no sabemos cuántas serán: -1 marca el final */
const double ENTRADA[] = {7.5, 6.0, 8.0, 4.5, 9.0, 5.5, 6.5, 3.5, 10.0, -1};

/* Añade x al final. Si no cabe, DUPLICA la capacidad. Devuelve 1 si va bien y 0 si no.
   Recibe double **v porque realloc puede mover el bloque y main tiene que enterarse. */
int anadir(double **v, int *n, int *cap, double x) {
    if (*n == *cap) {                                  /* lleno: toca crecer */
        int nueva = *cap * 2;
        double *tmp = realloc(*v, nueva * sizeof **v);
        if (tmp == NULL) return 0;                     /* *v sigue intacto */
        printf("  [crece] capacidad %d -> %d (%zu -> %zu bytes)\n",
               *cap, nueva, *cap * sizeof **v, nueva * sizeof **v);
        *v = tmp;
        *cap = nueva;
    }
    (*v)[*n] = x;        /* paréntesis: primero *v (el vector), luego [*n] */
    (*n)++;              /* (*n)++ suma al contador; *n++ movería el puntero */
    return 1;
}

int main(void) {
    int n = 0, cap = 2;                          /* empezamos con sitio para 2 */
    double *notas = malloc(cap * sizeof *notas);
    if (notas == NULL) return 1;

    for (int i = 0; ENTRADA[i] != -1; i++) {
        if (!anadir(&notas, &n, &cap, ENTRADA[i])) {
            printf("Sin memoria: me quedo con %d notas\n", n);
            break;
        }
        printf("Nota %.1f guardada (n=%d, cap=%d)\n", ENTRADA[i], n, cap);
    }

    double *tmp = realloc(notas, n * sizeof *notas);   /* al final, sobra sitio: ajustamos */
    if (tmp != NULL) {
        printf("Ajuste final: capacidad %d -> %d\n", cap, n);
        notas = tmp;
        cap = n;
    }

    double suma = 0;
    for (int i = 0; i < n; i++) suma += notas[i];
    printf("%d notas, media %.2f\n", n, suma / n);

    free(notas);
    return 0;
}
