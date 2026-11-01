/*
 * Programa 2: funciones que transforman vectores
 * Del artículo «Funciones en C — práctica con 3 programas de la guagua: búsquedas con dos resultados, vectores que se transforman y las estadísticas de la línea (con scanf)»
 * https://sergiolearns.com/funciones-en-c-practica/
 */
#include <stdio.h>

void intercambiar(int *a, int *b);
void invertir(int v[], int n);
void rotar_derecha(int v[], int n);
void rotar_izquierda(int v[], int n);
void rotar_k(int v[], int n, int k);
void filtrar_positivos(int v[], int n, int res[], int *m);
void quitar_repetidos(int v[], int *n);
void mostrar(const char *titulo, int v[], int n);

int main(void) {
    int salidas[8] = {10, 20, 30, 40, 50, 60, 70, 80};    /* minutos tras las 9:00 */
    mostrar("Salidas:         ", salidas, 8);
    invertir(salidas, 8);
    mostrar("Invertidas:      ", salidas, 8);
    invertir(salidas, 8);                                 /* otra vez: como estaban */
    rotar_derecha(salidas, 8);
    mostrar("Rotar derecha:   ", salidas, 8);
    rotar_izquierda(salidas, 8);
    rotar_izquierda(salidas, 8);
    mostrar("Rotar izq. x2:   ", salidas, 8);

    int zonas[5] = {1, 2, 3, 4, 5};
    rotar_k(zonas, 5, 2);
    mostrar("Zonas, rotar 2:  ", zonas, 5);

    int cambio[8] = {-3, 7, -1, 15, -8, 4, 0, 12};        /* suben menos bajan */
    int positivos[8], m;
    filtrar_positivos(cambio, 8, positivos, &m);          /* &m: la función lo rellena */
    printf("Positivos (%d):   ", m);
    mostrar("", positivos, m);

    int lineas[9] = {201, 202, 201, 301, 202, 201, 303, 301, 210};
    int n = 9;
    quitar_repetidos(lineas, &n);                         /* &n: el tamaño cambia */
    printf("Líneas (%d):      ", n);
    mostrar("", lineas, n);
    return 0;
}

void intercambiar(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

/* Solo hasta la mitad: n / 2 intercambios */
void invertir(int v[], int n) {
    for (int i = 0; i < n / 2; i++)
        intercambiar(&v[i], &v[n - 1 - i]);
}

/* [1,2,3,4] -> [4,1,2,3] */
void rotar_derecha(int v[], int n) {
    int ultimo = v[n - 1];
    for (int i = n - 1; i > 0; i--)       /* de atrás hacia delante */
        v[i] = v[i - 1];
    v[0] = ultimo;
}

/* [1,2,3,4] -> [2,3,4,1] */
void rotar_izquierda(int v[], int n) {
    int primero = v[0];
    for (int i = 0; i < n - 1; i++)       /* de delante hacia atrás */
        v[i] = v[i + 1];
    v[n - 1] = primero;
}

/* Reutiliza otra función: k rotaciones de una casilla */
void rotar_k(int v[], int n, int k) {
    for (int i = 0; i < k % n; i++)
        rotar_derecha(v, n);
}

/* Copia los positivos a res y deja en *m cuántos hay */
void filtrar_positivos(int v[], int n, int res[], int *m) {
    *m = 0;
    for (int i = 0; i < n; i++)
        if (v[i] > 0) {
            res[*m] = v[i];
            (*m)++;                       /* paréntesis: el valor, no el puntero */
        }
}

/* Deja cada número una vez, en el orden en que aparece */
void quitar_repetidos(int v[], int *n) {
    int i = 0;
    while (i < *n) {
        int j = i + 1;
        while (j < *n) {
            if (v[j] == v[i]) {
                for (int k = j; k < *n - 1; k++)   /* tapo el hueco */
                    v[k] = v[k + 1];
                (*n)--;                            /* el vector encoge */
            } else {
                j++;
            }
        }
        i++;
    }
}

void mostrar(const char *titulo, int v[], int n) {
    printf("%s", titulo);
    for (int i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\n");
}
