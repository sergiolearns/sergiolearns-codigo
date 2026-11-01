/*
 * Programa 1: funciones de búsqueda en vectores
 * Del artículo «Funciones en C — práctica con 3 programas de la guagua: búsquedas con dos resultados, vectores que se transforman y las estadísticas de la línea (con scanf)»
 * https://sergiolearns.com/funciones-en-c-practica/
 */
#include <stdio.h>

/* Prototipos: arriba, para que main pueda usarlas */
int buscar(int v[], int n, int buscado);
int buscar_pos(int v[], int n, int buscado, int *pos);
int maximo_con_pos(int v[], int n, int *pos);
int minimo_con_pos(int v[], int n, int *pos);
int contar(int v[], int n, int valor);
int esta_ordenado(int v[], int n);
void mostrar(int v[], int n);

int main(void) {
    int retrasos[10] = {42, 7, 19, 7, 85, 26, 7, 54, 13, 7};   /* minutos, 10 viajes */
    int ordenados[5] = {1, 3, 5, 7, 9};
    int n = 10, pos, r;

    printf("Retrasos: ");
    mostrar(retrasos, n);

    r = buscar(retrasos, n, 85);                  /* patrón 1: return con -1 */
    if (r != -1) printf("85 min: viaje %d\n", r);
    r = buscar(retrasos, n, 99);
    if (r == -1) printf("99 min: ningún viaje\n");

    if (buscar_pos(retrasos, n, 26, &pos))        /* patrón 2: 1/0 y posición por puntero */
        printf("26 min: viaje %d\n", pos);

    int max = maximo_con_pos(retrasos, n, &pos);
    printf("\nPeor retraso:   %d min (viaje %d)\n", max, pos);
    int min = minimo_con_pos(retrasos, n, &pos);
    printf("Mejor retraso:  %d min (viaje %d)\n", min, pos);
    printf("Viajes con 7 min: %d\n", contar(retrasos, n, 7));

    printf("\n¿Retrasos ordenados? %s\n", esta_ordenado(retrasos, n) ? "Sí" : "No");
    printf("¿{1,3,5,7,9} ordenado? %s\n", esta_ordenado(ordenados, 5) ? "Sí" : "No");
    return 0;
}

/* Posición de la primera aparición, o -1 (un índice imposible) */
int buscar(int v[], int n, int buscado) {
    for (int i = 0; i < n; i++)
        if (v[i] == buscado)
            return i;                     /* la primera y me voy */
    return -1;
}

/* Devuelve 1/0 y deja la posición en *pos: dos resultados */
int buscar_pos(int v[], int n, int buscado, int *pos) {
    for (int i = 0; i < n; i++)
        if (v[i] == buscado) {
            *pos = i;                     /* escribo en la variable de main */
            return 1;
        }
    return 0;                             /* *pos no se toca */
}

/* El valor por return; la posición, por puntero */
int maximo_con_pos(int v[], int n, int *pos) {
    int p = 0;
    for (int i = 1; i < n; i++)
        if (v[i] > v[p]) p = i;
    *pos = p;
    return v[p];
}

int minimo_con_pos(int v[], int n, int *pos) {
    int p = 0;
    for (int i = 1; i < n; i++)
        if (v[i] < v[p]) p = i;           /* < y no <=: me quedo con el primero */
    *pos = p;
    return v[p];
}

int contar(int v[], int n, int valor) {
    int c = 0;
    for (int i = 0; i < n; i++)
        if (v[i] == valor) c++;
    return c;
}

/* 1 si cada elemento es <= que el siguiente */
int esta_ordenado(int v[], int n) {
    for (int i = 0; i < n - 1; i++)       /* n - 1: comparo con v[i + 1] */
        if (v[i] > v[i + 1])
            return 0;
    return 1;
}

void mostrar(int v[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\n");
}
