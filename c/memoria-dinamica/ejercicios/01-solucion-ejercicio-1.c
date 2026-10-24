/*
 * Solución Ejercicio 1: subir las notas sin tocar las originales
 * Del artículo «Memoria dinámica en C — ejercicios para subir notas, filtrar aprobados y mantener un vector ordenado que crece (y el doble free que me tumbó el acta)»
 * https://sergiolearns.com/memoria-dinamica-en-c-ejercicios/
 */

#include <stdio.h>
#include <stdlib.h>

/* Devuelve un vector NUEVO con cada nota subida 'extra' puntos (sin pasar de 10).
   El original no se toca: por eso es const. Quien llama libera el resultado. */
double *subir_notas(const double *v, int n, double extra) {
    double *r = malloc(n * sizeof *r);
    if (r == NULL) return NULL;
    for (int i = 0; i < n; i++) {
        r[i] = v[i] + extra;
        if (r[i] > 10) r[i] = 10;           /* tope: nadie saca un 10.3 */
    }
    return r;
}

void mostrar(const char *titulo, const double *v, int n) {
    printf("%s:", titulo);
    for (int i = 0; i < n; i++) printf(" %.1f", v[i]);
    printf("\n");
}

int main(void) {
    double notas[] = {4.5, 6.0, 9.8, 3.0, 7.5};
    int n = sizeof notas / sizeof notas[0];

    double *subidas = subir_notas(notas, n, 0.5);
    if (subidas == NULL) return 1;

    mostrar("Originales", notas, n);
    mostrar("Subidas   ", subidas, n);

    free(subidas);                          /* lo reservó subir_notas, lo libera main */
    return 0;
}
