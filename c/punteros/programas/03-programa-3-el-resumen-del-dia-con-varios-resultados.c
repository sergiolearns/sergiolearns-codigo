/*
 * Programa 3: el resumen del día con varios resultados
 * Del artículo «Punteros en C — práctica con 4 programas de la guagua: swap, recorridos, resumen del día y búsqueda con NULL (para perderles el miedo)»
 * https://sergiolearns.com/punteros-en-c-practica/
 */
#include <stdio.h>

/* Calcula suma y media: dos resultados, así que van por puntero */
void calcular_suma_media(int *v, int n, int *suma, double *media) {
    *suma = 0;                           /* escribo en la variable de main */
    for (int *p = v; p < v + n; p++)
        *suma += *p;
    *media = (double)*suma / n;          /* el cast evita la división entera */
}

/* Busca el máximo y el mínimo de una sola pasada */
void encontrar_max_min(int *v, int n, int *maximo, int *minimo) {
    *maximo = *minimo = v[0];            /* empiezo por la primera parada */
    for (int *p = v + 1; p < v + n; p++) {
        if (*p > *maximo) *maximo = *p;
        if (*p < *minimo) *minimo = *p;
    }
}

/* Da la vuelta al vector en su sitio, con dos punteros que se cruzan */
void invertir(int *v, int n) {
    int *ini = v;                        /* primera casilla */
    int *fin = v + n - 1;                /* última casilla */
    while (ini < fin) {
        int temp = *ini;
        *ini = *fin;
        *fin = temp;
        ini++;                           /* avanzan uno hacia el otro */
        fin--;
    }
}

void mostrar(const char *titulo, int *v, int n) {
    printf("%s", titulo);
    for (int *p = v; p < v + n; p++)
        printf("%d ", *p);
    printf("\n");
}

int main(void) {
    int viajeros[8] = {15, 8, 42, 3, 27, 19, 11, 35};   /* suben en cada parada, línea 201 */
    int n = 8;
    int suma, maximo, minimo;
    double media;

    printf("=== LÍNEA 201: RESUMEN DEL DÍA ===\n\n");
    mostrar("Ida:    ", viajeros, n);

    calcular_suma_media(viajeros, n, &suma, &media);    /* & en lo que se va a rellenar */
    encontrar_max_min(viajeros, n, &maximo, &minimo);

    printf("Suma:   %d\n", suma);
    printf("Media:  %.2f\n", media);
    printf("Máximo: %d\n", maximo);
    printf("Mínimo: %d\n", minimo);
    printf("Rango:  %d\n\n", maximo - minimo);

    invertir(viajeros, n);                              /* el vector ya es una dirección */
    mostrar("Vuelta: ", viajeros, n);
    return 0;
}
