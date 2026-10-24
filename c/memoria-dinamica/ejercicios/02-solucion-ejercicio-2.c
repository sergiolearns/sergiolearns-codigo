/*
 * Solución Ejercicio 2: filtrar los aprobados con la memoria justa
 * Del artículo «Memoria dinámica en C — ejercicios para subir notas, filtrar aprobados y mantener un vector ordenado que crece (y el doble free que me tumbó el acta)»
 * https://sergiolearns.com/memoria-dinamica-en-c-ejercicios/
 */

#include <stdio.h>
#include <stdlib.h>

/* Devuelve un vector nuevo SOLO con los aprobados y deja su tamaño en *k.
   Dos pasadas: contar y luego copiar, para pedir exactamente la memoria justa. */
double *filtrar_aprobados(const double *v, int n, int *k) {
    *k = 0;
    for (int i = 0; i < n; i++)             /* pasada 1: ¿cuántos aprobados hay? */
        if (v[i] >= 5) (*k)++;

    if (*k == 0) return NULL;               /* malloc(0) no sirve para nada: NULL = vacío */

    double *r = malloc(*k * sizeof *r);
    if (r == NULL) { *k = 0; return NULL; }

    int j = 0;                              /* j = siguiente casilla libre de r */
    for (int i = 0; i < n; i++)             /* pasada 2: copiar */
        if (v[i] >= 5) r[j++] = v[i];
    return r;
}

void informe(const char *grupo, const double *v, int n) {
    int k;
    double *ap = filtrar_aprobados(v, n, &k);
    printf("%s: %d de %d aprobados ->", grupo, k, n);
    if (ap == NULL) printf(" nadie");
    for (int i = 0; i < k; i++) printf(" %.1f", ap[i]);
    printf("\n");
    free(ap);                               /* free(NULL) es seguro: no hace falta un if */
}

int main(void) {
    double grupo_a[] = {6.5, 4.0, 9.5, 5.0, 7.0, 3.0, 8.5};
    double grupo_b[] = {2.0, 4.5};
    informe("Grupo A", grupo_a, 7);
    informe("Grupo B", grupo_b, 2);
    return 0;
}
