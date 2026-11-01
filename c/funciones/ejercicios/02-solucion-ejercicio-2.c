/*
 * Solución del ejercicio 2: cerrar y abrir paradas
 * Del artículo «Funciones en C — ejercicios resueltos con la guagua: segundo peor retraso, paradas que se cierran y abren y horarios que se fusionan (más el chuletario para el examen)»
 * https://sergiolearns.com/funciones-en-c-ejercicios/
 */
#include <stdio.h>
#define MAX 10

int eliminar_posicion(int v[], int *n, int pos);
int insertar_posicion(int v[], int *n, int pos, int valor, int max);
void mostrar(int v[], int n);

int main(void) {
    int paradas[MAX] = {101, 104, 112, 118, 125};   /* códigos de la línea */
    int n = 5;

    mostrar(paradas, n);
    int quitada = eliminar_posicion(paradas, &n, 2);  /* cierran la parada 112 */
    printf("Eliminada la %d de la posición 2\n", quitada);
    mostrar(paradas, n);

    if (insertar_posicion(paradas, &n, 3, 120, MAX))  /* abren la 120 */
        printf("Insertada la 120 en la posición 3\n");
    mostrar(paradas, n);

    if (eliminar_posicion(paradas, &n, 9) == -1)      /* posición que no existe */
        printf("Posición 9 no válida: no cambio nada\n");
    if (!insertar_posicion(paradas, &n, 0, 99, 5))    /* ya hay 5 y el máximo es 5 */
        printf("Sin sitio para la 99\n");
    mostrar(paradas, n);
    return 0;
}

/* Quita v[pos], corre el resto a la izquierda y actualiza *n */
int eliminar_posicion(int v[], int *n, int pos) {
    if (pos < 0 || pos >= *n)
        return -1;                        /* no válida: no toco nada */
    int quitado = v[pos];
    for (int i = pos; i < *n - 1; i++)    /* de izquierda a derecha */
        v[i] = v[i + 1];
    (*n)--;
    return quitado;
}

/* Mete valor en pos, corre el resto a la derecha; 1 si pudo, 0 si no */
int insertar_posicion(int v[], int *n, int pos, int valor, int max) {
    if (pos < 0 || pos > *n || *n >= max) /* pos == *n vale: añadir al final */
        return 0;
    for (int i = *n; i > pos; i--)        /* de derecha a izquierda */
        v[i] = v[i - 1];
    v[pos] = valor;
    (*n)++;
    return 1;
}

void mostrar(int v[], int n) {
    printf("Línea (%d paradas): ", n);
    for (int i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\n");
}
