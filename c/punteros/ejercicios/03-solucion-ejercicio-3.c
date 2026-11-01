/*
 * Solución del ejercicio 3: ajustar los retrasos de la línea
 * Del artículo «Punteros en C — ejercicios resueltos con la guagua: copiar horarios, contar viajeros, ajustar retrasos y una biblioteca de vectores (más el chuletario para el examen)»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */
#include <stdio.h>

/* Los adelantos (negativos) cuentan como 0 minutos de retraso */
void reemplazar_negativos(int *v, int n, int valor) {
    for (int *p = v; p < v + n; p++)
        if (*p < 0)
            *p = valor;              /* cambio el original, no una copia */
}

/* Multiplica por factor los retrasos pares */
void multiplicar_pares(int *v, int n, int factor) {
    for (int *p = v; p < v + n; p++)
        if (*p % 2 == 0)
            *p *= factor;
}

/* Resta el mínimo a todos: el más temprano pasa a 0 */
void normalizar(int *v, int n) {
    int minimo = *v;
    for (int *p = v + 1; p < v + n; p++)       /* primera pasada: el mínimo */
        if (*p < minimo)
            minimo = *p;
    for (int *p = v; p < v + n; p++)           /* segunda pasada: restar */
        *p -= minimo;
}

void mostrar(const char *titulo, int *v, int n) {
    printf("%s", titulo);
    for (int *p = v; p < v + n; p++)
        printf("%d ", *p);
    printf("\n");
}

int main(void) {
    int retrasos[10] = {15, -3, 8, -12, 6, 7, -5, 22, 4, -8};   /* minutos, negativo = adelanto */
    int llegadas[5] = {23, 18, 31, 20, 26};                     /* minuto de llegada a Teror */

    mostrar("Retrasos iniciales:   ", retrasos, 10);
    reemplazar_negativos(retrasos, 10, 0);
    mostrar("Adelantos a 0:        ", retrasos, 10);
    multiplicar_pares(retrasos, 10, 2);
    mostrar("Pares por 2:          ", retrasos, 10);

    printf("\n");
    mostrar("Llegadas:             ", llegadas, 5);
    normalizar(llegadas, 5);
    mostrar("Desde la primera:     ", llegadas, 5);
    return 0;
}
