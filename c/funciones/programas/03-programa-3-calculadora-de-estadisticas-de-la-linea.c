/*
 * Programa 3: calculadora de estadísticas de la línea
 * Del artículo «Funciones en C — práctica con 3 programas de la guagua: búsquedas con dos resultados, vectores que se transforman y las estadísticas de la línea (con scanf)»
 * https://sergiolearns.com/funciones-en-c-practica/
 */
#include <stdio.h>
#define MAX 100

int leer_datos(int v[], int max);
double media(int v[], int n);
double mediana(int v[], int n);
int moda(int v[], int n, int *frecuencia);
double varianza(int v[], int n);
void ordenar(int v[], int n);

int main(void) {
    int viajeros[MAX];
    int n = leer_datos(viajeros, MAX);
    if (n == 0) return 1;                  /* sin datos no hay estadística */

    int veces;
    int m = moda(viajeros, n, &veces);     /* valor por return, veces por puntero */

    printf("\n=== ESTADÍSTICAS DE LA LÍNEA 201 ===\n");
    printf("Paradas:   %d\n", n);
    printf("Media:     %.2f\n", media(viajeros, n));
    printf("Mediana:   %.1f\n", mediana(viajeros, n));
    printf("Moda:      %d (%d veces)\n", m, veces);
    printf("Varianza:  %.2f\n", varianza(viajeros, n));
    printf("Datos sin tocar: ");
    for (int i = 0; i < n; i++) printf("%d ", viajeros[i]);
    printf("\n");
    return 0;
}

/* Lee cuántos datos hay y los datos; devuelve n (0 si algo falla) */
int leer_datos(int v[], int max) {
    int n;
    printf("¿Cuántas paradas? (1-%d): ", max);
    if (scanf("%d", &n) != 1 || n < 1 || n > max) {
        printf("Número de paradas no válido\n");
        return 0;
    }
    for (int i = 0; i < n; i++) {
        printf("  Viajeros en la parada %d: ", i + 1);
        if (scanf("%d", &v[i]) != 1) return 0;   /* &v[i]: dirección de esa casilla */
    }
    return n;
}

double media(int v[], int n) {
    int suma = 0;
    for (int i = 0; i < n; i++) suma += v[i];
    return (double)suma / n;              /* el cast, ANTES de dividir */
}

/* Ordena una COPIA: el vector de main no se toca */
double mediana(int v[], int n) {
    int copia[MAX];
    for (int i = 0; i < n; i++) copia[i] = v[i];
    ordenar(copia, n);
    if (n % 2 == 1) return copia[n / 2];
    return (copia[n / 2 - 1] + copia[n / 2]) / 2.0;   /* par: media de los dos centrales */
}

int moda(int v[], int n, int *frecuencia) {
    int mejor = v[0];
    *frecuencia = 0;
    for (int i = 0; i < n; i++) {
        int c = 0;
        for (int j = 0; j < n; j++)
            if (v[j] == v[i]) c++;
        if (c > *frecuencia) {            /* > y no >=: gana el primero que aparece */
            *frecuencia = c;
            mejor = v[i];
        }
    }
    return mejor;
}

/* Llama a otra función: media */
double varianza(int v[], int n) {
    double m = media(v, n), s = 0;
    for (int i = 0; i < n; i++)
        s += (v[i] - m) * (v[i] - m);
    return s / n;
}

void ordenar(int v[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (v[j] > v[j + 1]) {
                int t = v[j]; v[j] = v[j + 1]; v[j + 1] = t;
            }
}
