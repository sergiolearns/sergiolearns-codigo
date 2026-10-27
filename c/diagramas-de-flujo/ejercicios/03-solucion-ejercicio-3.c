/*
 * Diagramas de flujo en C ejercicios — Solución del nivel 3: ¿qué semana fue mejor?
 * Del artículo «Diagramas de flujo en C — ejercicios con contadores, contraseñas y dos semanas de pasos (y un programa que se quedó colgado)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-ejercicios/
 */

#include <stdio.h>

#define N 7

int main(void) {
    int semana1[N] = {6420, 11250, 8900, 12030, 4100, 9870, 10500};
    int semana2[N] = {10200, 11800, 7300, 10050, 12400, 13100, 9100};
    const char *dias[N] = {"lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"};
    int mejora = 0, empeora = 0, igual = 0;
    int total1 = 0, total2 = 0;
    int i;

    for (i = 0; i < N; i++) {
        total1 = total1 + semana1[i];      // los totales se acumulan en el mismo bucle
        total2 = total2 + semana2[i];

        // Tres caminos: mejor, peor o igual (el último es el else, sin rombo)
        if (semana2[i] > semana1[i]) {
            mejora = mejora + 1;
            printf("%s: %d -> %d (mejora %d)\n", dias[i], semana1[i], semana2[i], semana2[i] - semana1[i]);
        } else if (semana2[i] < semana1[i]) {
            empeora = empeora + 1;
            printf("%s: %d -> %d (empeora %d)\n", dias[i], semana1[i], semana2[i], semana1[i] - semana2[i]);
        } else {
            igual = igual + 1;
            printf("%s: %d -> %d (igual)\n", dias[i], semana1[i], semana2[i]);
        }
    }

    printf("Mejora: %d días, empeora: %d, igual: %d\n", mejora, empeora, igual);
    if (total2 > total1) {
        printf("La semana 2 fue mejor: %d frente a %d (+%d pasos)\n", total2, total1, total2 - total1);
    } else if (total2 < total1) {
        printf("La semana 1 fue mejor: %d frente a %d (+%d pasos)\n", total1, total2, total1 - total2);
    } else {
        printf("Las dos semanas empatan con %d pasos\n", total1);
    }
    return 0;
}
