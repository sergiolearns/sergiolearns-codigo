/*
 * Solución Ejercicio 3: un vector ordenado que crece y se limpia
 * Del artículo «Memoria dinámica en C — ejercicios para subir notas, filtrar aprobados y mantener un vector ordenado que crece (y el doble free que me tumbó el acta)»
 * https://sergiolearns.com/memoria-dinamica-en-c-ejercicios/
 */

#include <stdio.h>
#include <stdlib.h>

void mostrar(const double *v, int n, int cap) {
    printf("[");
    for (int i = 0; i < n; i++) printf(i ? " %.1f" : "%.1f", v[i]);
    printf("] n=%d cap=%d\n", n, cap);
}

/* Inserta x manteniendo el vector ORDENADO de menor a mayor. Duplica la capacidad si hace falta. */
int insertar_ordenado(double **v, int *n, int *cap, double x) {
    if (*n == *cap) {
        double *tmp = realloc(*v, 2 * *cap * sizeof **v);
        if (tmp == NULL) return 0;
        *v = tmp;
        *cap *= 2;
    }
    int i = *n - 1;
    while (i >= 0 && (*v)[i] > x) {         /* desde el final, corremos a la derecha los mayores */
        (*v)[i + 1] = (*v)[i];
        i--;
    }
    (*v)[i + 1] = x;                        /* el hueco que queda es el sitio de x */
    (*n)++;
    return 1;
}

/* Quita los suspensos compactando el vector y lo encoge a su tamaño justo */
void quitar_suspensos(double **v, int *n, int *cap) {
    int j = 0;
    for (int i = 0; i < *n; i++)
        if ((*v)[i] >= 5) (*v)[j++] = (*v)[i];   /* los aprobados se corren a la izquierda */
    *n = j;
    if (j > 0 && j < *cap) {
        double *tmp = realloc(*v, j * sizeof **v);
        if (tmp != NULL) { *v = tmp; *cap = j; }  /* si falla, el vector grande sigue valiendo */
    }
}

int main(void) {
    const double llegan[] = {6.5, 4.0, 9.5, 5.0, 7.0, 3.0, 8.5};
    int n = 0, cap = 1;
    double *notas = malloc(cap * sizeof *notas);
    if (notas == NULL) return 1;

    for (int i = 0; i < 7; i++) {
        if (!insertar_ordenado(&notas, &n, &cap, llegan[i])) break;
        printf("+%.1f -> ", llegan[i]);
        mostrar(notas, n, cap);
    }
    quitar_suspensos(&notas, &n, &cap);
    printf("Sin suspensos -> ");
    mostrar(notas, n, cap);

    free(notas);
    return 0;
}
