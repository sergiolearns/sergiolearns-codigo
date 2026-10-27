/*
 * Diagramas de flujo en C práctica — Programa 1: la racha más larga
 * Del artículo «Diagramas de flujo en C — práctica con la racha de la pulsera, un número capicúa y la media de la semana (diagrama primero, código después)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-practica/
 */

#include <stdio.h>

#define N 14       // dos semanas de datos
#define META 10000

int main(void) {
    int pasos[N] = {6420, 11250, 8900, 12030, 4100, 9870, 10500,
                    10200, 11800, 7300, 10050, 12400, 13100, 9100};
    const char *dias[7] = {"lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"};
    int racha = 0;          // días seguidos llegando a la meta (hasta hoy)
    int mejor = 0;          // la racha más larga vista hasta ahora
    int inicio_mejor = 0;   // posición del primer día de esa racha
    int i;

    for (i = 0; i < N; i++) {
        if (pasos[i] >= META) {
            racha = racha + 1;               // la racha sigue
            if (racha > mejor) {             // > y no >=: con un empate gana la primera racha
                mejor = racha;
                inicio_mejor = i - racha + 1;   // el día de hoy menos lo que lleva la racha
            }
        } else {
            racha = 0;                       // un día flojo rompe la racha
        }
        // i % 7 da el día de la semana (0 = lunes) e i / 7 + 1, la semana
        printf("Semana %d, %s: %d pasos -> racha %d\n", i / 7 + 1, dias[i % 7], pasos[i], racha);
    }

    printf("Racha más larga: %d días, empieza el %s de la semana %d\n",
           mejor, dias[inicio_mejor % 7], inicio_mejor / 7 + 1);
    return 0;
}
