/*
 * Solución del ejercicio 1: el segundo peor retraso
 * Del artículo «Funciones en C — ejercicios resueltos con la guagua: segundo peor retraso, paradas que se cierran y abren y horarios que se fusionan (más el chuletario para el examen)»
 * https://sergiolearns.com/funciones-en-c-ejercicios/
 */
#include <stdio.h>

int maximo(int v[], int n);
int segundo_maximo(int v[], int n);
void mostrar(int v[], int n);
void informe(int v[], int n);

int main(void) {
    int lunes[8] = {42, 7, 19, 85, 26, 85, 54, 13};   /* retrasos en minutos */
    int martes[4] = {10, 10, 10, 10};
    int miercoles[2] = {9, 31};
    informe(lunes, 8);
    informe(martes, 4);
    informe(miercoles, 2);
    return 0;
}

int maximo(int v[], int n) {
    int m = v[0];
    for (int i = 1; i < n; i++)
        if (v[i] > m) m = v[i];
    return m;
}

/* El mayor valor ESTRICTAMENTE menor que el máximo, o -1 si no hay */
int segundo_maximo(int v[], int n) {
    int max = maximo(v, n);               /* primera pasada, reutilizando */
    int segundo = -1;                     /* -1: todavía no he visto ninguno */
    for (int i = 0; i < n; i++)
        if (v[i] < max && v[i] > segundo) /* distinto del máximo y mejor que el actual */
            segundo = v[i];
    return segundo;
}

void mostrar(int v[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\n");
}

void informe(int v[], int n) {
    printf("Retrasos: ");
    mostrar(v, n);
    printf("Máximo:         %d\n", maximo(v, n));
    int s = segundo_maximo(v, n);
    if (s == -1)
        printf("Segundo máximo: no hay (todos iguales)\n\n");
    else
        printf("Segundo máximo: %d\n\n", s);
}
