/*
 * Memoria dinámica en C práctica — Programa 3: Una tabla de notas en el heap
 * Del artículo «Memoria dinámica en C — práctica con un acta de notas que se ajusta, un vector que crece al llegar alumnos y una tabla de notas en el heap (y el realloc que casi me deja sin datos)»
 * https://sergiolearns.com/memoria-dinamica-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>

#define PRUEBAS 3                             /* practicas, parcial y final */
const double PESO[PRUEBAS] = {0.3, 0.3, 0.4};
const char *NOMBRE[] = {"Ana", "Bruno", "Carla", "Diego"};
const double DATOS[][PRUEBAS] = {{8.0, 6.5, 7.0}, {5.0, 4.0, 3.5},
                                 {9.5, 8.0, 9.0}, {6.0, 7.5, 4.5}};

/* Libera las 'filas' primeras filas y después el vector de punteros (en ese orden) */
void liberar_tabla(double **t, int filas) {
    for (int i = 0; i < filas; i++)
        free(t[i]);                           /* primero cada fila... */
    free(t);                                  /* ...y al final el vector que las apuntaba */
}

/* Tabla filas x cols en el heap: un vector de punteros y una fila por alumno */
double **crear_tabla(int filas, int cols) {
    double **t = malloc(filas * sizeof *t);   /* sizeof *t = sizeof(double *) */
    if (t == NULL) return NULL;
    for (int i = 0; i < filas; i++) {
        t[i] = calloc(cols, sizeof **t);      /* cada fila empieza a 0.0 */
        if (t[i] == NULL) {                   /* si falla la fila i, liberamos las i anteriores */
            liberar_tabla(t, i);
            return NULL;
        }
    }
    return t;
}

int main(void) {
    int alumnos = 4;                          /* el numero de alumnos llega al ejecutar */
    double **tabla = crear_tabla(alumnos, PRUEBAS);
    if (tabla == NULL) { printf("Sin memoria\n"); return 1; }
    printf("Reservado: %d punteros (%zu bytes) + %d filas de %zu bytes\n",
           alumnos, alumnos * sizeof(double *), alumnos, PRUEBAS * sizeof(double));

    for (int i = 0; i < alumnos; i++)
        for (int j = 0; j < PRUEBAS; j++)
            tabla[i][j] = DATOS[i][j];        /* tabla[i] es una fila; [j], su casilla */

    printf("Alumno   Pract.  Parcial  Final  | Nota\n");
    for (int i = 0; i < alumnos; i++) {
        double nota = 0;
        for (int j = 0; j < PRUEBAS; j++)
            nota += tabla[i][j] * PESO[j];
        printf("%-8s %5.1f %8.1f %6.1f  | %.2f %s\n", NOMBRE[i], tabla[i][0], tabla[i][1],
               tabla[i][2], nota, nota >= 5 ? "aprobado" : "suspenso");
    }

    liberar_tabla(tabla, alumnos);
    tabla = NULL;
    return 0;
}
