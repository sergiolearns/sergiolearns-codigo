/*
 * Solución del ejercicio 3: fusionar dos horarios ordenados
 * Del artículo «Funciones en C — ejercicios resueltos con la guagua: segundo peor retraso, paradas que se cierran y abren y horarios que se fusionan (más el chuletario para el examen)»
 * https://sergiolearns.com/funciones-en-c-ejercicios/
 */
#include <stdio.h>
#define MAX 20

void fusionar(int a[], int na, int b[], int nb, int res[], int *nr);
void ordenar(int v[], int n);
void mostrar(const char *titulo, int v[], int n);

int main(void) {
    int l201[5] = {610, 710, 810, 910, 1010};                 /* ya ordenadas (hhmm) */
    int l202[7] = {640, 700, 820, 950, 1100, 1210, 1300};
    int todas[MAX], n;

    mostrar("Línea 201: ", l201, 5);
    mostrar("Línea 202: ", l202, 7);
    fusionar(l201, 5, l202, 7, todas, &n);
    mostrar("Juntas:    ", todas, n);
    printf("Salidas: %d\n\n", n);

    int l303[4] = {1500, 730, 1215, 905};                     /* desordenadas */
    ordenar(l303, 4);
    mostrar("Línea 303 ordenada: ", l303, 4);
    fusionar(l201, 5, l303, 4, todas, &n);
    mostrar("201 + 303: ", todas, n);

    int vacia[1];
    fusionar(l201, 5, vacia, 0, todas, &n);                   /* nb = 0 */
    mostrar("201 + nada: ", todas, n);
    return 0;
}

/* Mezcla dos vectores ordenados en res, también ordenado */
void fusionar(int a[], int na, int b[], int nb, int res[], int *nr) {
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) {          /* mientras queden en los dos */
        if (a[i] <= b[j])
            res[k++] = a[i++];          /* el menor de las dos cabezas */
        else
            res[k++] = b[j++];
    }
    while (i < na) res[k++] = a[i++];   /* lo que sobre de a */
    while (j < nb) res[k++] = b[j++];   /* o lo que sobre de b */
    *nr = k;                            /* el tamaño sale por puntero */
}

void ordenar(int v[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (v[j] > v[j + 1]) {
                int t = v[j]; v[j] = v[j + 1]; v[j + 1] = t;
            }
}

void mostrar(const char *titulo, int v[], int n) {
    printf("%s", titulo);
    for (int i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\n");
}
