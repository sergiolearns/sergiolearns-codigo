/*
 * Solución del ejercicio 4: biblioteca de vectores de la guagua
 * Del artículo «Punteros en C — ejercicios resueltos con la guagua: copiar horarios, contar viajeros, ajustar retrasos y una biblioteca de vectores (más el chuletario para el examen)»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */
#include <stdio.h>

/* c[i] = a[i] + b[i], con tres punteros que avanzan a la vez */
void sumar(int *a, int *b, int *c, int n) {
    for (int *pa = a, *pb = b, *pc = c; pa < a + n; pa++, pb++, pc++)
        *pc = *pa + *pb;
}

/* Suma de productos casilla a casilla */
int producto_escalar(int *a, int *b, int n) {
    int total = 0;
    for (int *pa = a, *pb = b; pa < a + n; pa++, pb++)
        total += *pa * *pb;              /* el primer * es el producto: (*pa) * (*pb) */
    return total;
}

/* 1 si son iguales casilla a casilla, 0 en cuanto una no coincide */
int iguales(int *a, int *b, int n) {
    for (int *pa = a, *pb = b; pa < a + n; pa++, pb++)
        if (*pa != *pb)
            return 0;
    return 1;
}

/* El último pasa al principio y los demás se corren uno a la derecha */
void rotar_derecha(int *v, int n) {
    int ultimo = *(v + n - 1);           /* lo guardo antes de pisarlo */
    for (int *p = v + n - 1; p > v; p--) /* de atrás hacia delante */
        *p = *(p - 1);
    *v = ultimo;
}

void mostrar(const char *titulo, int *v, int n) {
    printf("%s", titulo);
    for (int *p = v; p < v + n; p++)
        printf("%d ", *p);
    printf("\n");
}

int main(void) {
    int ida[5] = {12, 7, 9, 4, 15};          /* suben en cada parada a la ida */
    int vuelta[5] = {5, 11, 6, 13, 3};       /* suben en la misma parada a la vuelta */
    int tarifa[5] = {155, 155, 140, 140, 120};   /* céntimos por viajero en cada parada */
    int total[5];
    int n = 5;

    printf("=== BIBLIOTECA DE LA GUAGUA ===\n\n");
    mostrar("Ida:              ", ida, n);
    mostrar("Vuelta:           ", vuelta, n);
    sumar(ida, vuelta, total, n);
    mostrar("Ida + vuelta:     ", total, n);
    printf("Recaudación ida:  %d céntimos\n", producto_escalar(ida, tarifa, n));
    printf("¿Ida == vuelta?:  %s\n", iguales(ida, vuelta, n) ? "Sí" : "No");
    printf("¿Ida == ida?:     %s\n\n", iguales(ida, ida, n) ? "Sí" : "No");

    int turnos[5] = {1, 2, 3, 4, 5};         /* orden de los conductores */
    mostrar("Turnos:           ", turnos, n);
    rotar_derecha(turnos, n);
    mostrar("Rotado una vez:   ", turnos, n);
    rotar_derecha(turnos, n);
    mostrar("Rotado dos veces: ", turnos, n);
    return 0;
}
