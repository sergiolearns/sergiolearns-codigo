/*
 * Solución del ejercicio 2: contar cómo cambia la guagua en cada parada
 * Del artículo «Punteros en C — ejercicios resueltos con la guagua: copiar horarios, contar viajeros, ajustar retrasos y una biblioteca de vectores (más el chuletario para el examen)»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int cambio[8];       /* en cada parada: los que suben menos los que bajan */
    int n = 8;
    int *p;
    int positivos = 0, negativos = 0, ceros = 0, pares = 0, impares = 0, sobre_media = 0;
    int suma = 0;

    printf("Cambio de viajeros en las 8 paradas:\n");
    for (p = cambio; p < cambio + n; p++) {            /* p ya apunta al vector */
        printf("Parada %td: ", p - cambio + 1);
        while (scanf("%d", p) != 1) {                  /* p ya es una dirección: sin & */
            while (getchar() != '\n');                 /* tira la línea mala */
            printf("Eso no es un número. Parada %td: ", p - cambio + 1);
        }
    }

    printf("\nCambios: ");
    for (p = cambio; p < cambio + n; p++) {            /* primera pasada: suma */
        printf("%d ", *p);
        suma += *p;
    }
    double media = (double)suma / n;

    for (p = cambio; p < cambio + n; p++) {            /* segunda pasada: contar */
        if (*p > 0) positivos++;
        else if (*p < 0) negativos++;
        else ceros++;
        if (*p % 2 == 0) pares++;                      /* -12 % 2 da 0: también par */
        else impares++;
        if (*p > media) sobre_media++;
    }

    printf("\n\n--- Resumen ---\n");
    printf("Suben más que bajan:  %d\n", positivos);
    printf("Bajan más que suben:  %d\n", negativos);
    printf("Se quedan igual:      %d\n", ceros);
    printf("Pares / impares:      %d / %d\n", pares, impares);
    printf("Media:                %.2f\n", media);
    printf("Por encima de media:  %d\n", sobre_media);
    printf("Viajeros al final:    %d\n", suma);
    return 0;
}
