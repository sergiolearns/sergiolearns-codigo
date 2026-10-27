/* Versión A, ejercicio 1b: contar los mayores que X con datos del usuario
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

#define N 6

int main() {
    int vec[N];
    int x;
    int cont = 0;
    int i;

    /* primer bucle: rellenar el vector desde el teclado */
    for (i = 0; i < N; i++) {
        printf("Introduce el elemento %d: ", i);
        scanf("%d", &vec[i]);   /* & delante: scanf necesita la dirección */
    }

    printf("Introduce el valor X: ");
    scanf("%d", &x);

    /* segundo bucle: el mismo recorrido del apartado a */
    for (i = 0; i < N; i++) {
        if (vec[i] > x) {
            cont++;
        }
    }

    printf("Hay %d números mayores que %d\n", cont, x);
    return 0;
}
