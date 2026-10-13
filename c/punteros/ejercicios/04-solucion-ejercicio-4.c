/*
 * Solución Ejercicio 4:
 * Del artículo «Punteros en C — ejercicios para dominar la memoria»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */

#include <stdio.h>

void suma_vectores(int *a, int *b, int *resultado, int n) {
    int *pa, *pb, *pr;
    for (pa = a, pb = b, pr = resultado;
         pa < a + n;
         pa++, pb++, pr++) {
        *pr = *pa + *pb;
    }
}

int producto_escalar(int *a, int *b, int n) {
    int *pa, *pb;
    int suma = 0;
    for (pa = a, pb = b; pa < a + n; pa++, pb++) {
        suma += (*pa) * (*pb);
    }
    return suma;
}

int son_iguales(int *a, int *b, int n) {
    int *pa, *pb;
    for (pa = a, pb = b; pa < a + n; pa++, pb++) {
        if (*pa != *pb) return 0;
    }
    return 1;
}

void rotar_derecha(int *vec, int n) {
    int ultimo = *(vec + n - 1);
    int *ptr;
    for (ptr = vec + n - 1; ptr > vec; ptr--) {
        *ptr = *(ptr - 1);
    }
    *vec = ultimo;
}

void mostrar_vector(int *vec, int n) {
    int *ptr;
    for (ptr = vec; ptr < vec + n; ptr++) {
        printf("%d ", *ptr);
    }
    printf("\n");
}

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    int b[5] = {5, 4, 3, 2, 1};
    int resultado[5];
    int n = 5;

    printf("=== BIBLIOTECA DE VECTORES ===\n\n");
    printf("Vector A: "); mostrar_vector(a, n);
    printf("Vector B: "); mostrar_vector(b, n);

    suma_vectores(a, b, resultado, n);
    printf("\nSuma A+B:          "); mostrar_vector(resultado, n);

    printf("Producto escalar:  %d\n", producto_escalar(a, b, n));
    printf("¿Son iguales?:     %s\n", son_iguales(a, b, n) ? "Sí" : "No");

    printf("\nRotando A un puesto a la derecha:\n");
    rotar_derecha(a, n);
    printf("Vector A rotado:   "); mostrar_vector(a, n);

    printf("\nRotando otra vez:\n");
    rotar_derecha(a, n);
    printf("Vector A rotado:   "); mostrar_vector(a, n);

    return 0;
}
