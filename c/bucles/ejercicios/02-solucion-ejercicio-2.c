/*
 * Solución Ejercicio 2:
 * Del artículo «Bucles en C — ejercicios para dominar for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int jugador, maquina = 2;
    int jugando = 1;
    int ronda = 0;
    int victorias = 0, derrotas = 0, empates = 0;

    printf("=== PIEDRA PAPEL TIJERA ===\n");
    printf("1. Piedra  2. Papel  3. Tijera  0. Salir\n\n");

    while (jugando) {
        ronda++;
        printf("Ronda %d\n", ronda);

        /* Pedir jugada válida */
        do {
            printf("Tu elección: ");
            scanf("%d", &jugador);
            if (jugador < 0 || jugador > 3) {
                printf("Error: elige entre 0 y 3\n");
            }
        } while (jugador < 0 || jugador > 3);

        if (jugador == 0) {
            jugando = 0;
            ronda--;    /* no cuenta como ronda */
            break;
        }

        /* Mostrar jugadas */
        printf("Tú: ");
        switch (jugador) {
            case 1: printf("Piedra"); break;
            case 2: printf("Papel");  break;
            case 3: printf("Tijera"); break;
        }
        printf(" | Máquina: Papel\n");

        /* Determinar resultado */
        if (jugador == maquina) {
            printf("→ Empate\n");
            empates++;
        } else if ((jugador == 1 && maquina == 3) ||
                   (jugador == 2 && maquina == 1) ||
                   (jugador == 3 && maquina == 2)) {
            printf("→ ¡Ganaste!\n");
            victorias++;
        } else {
            printf("→ Pierde — la máquina gana\n");
            derrotas++;
        }
        printf("\n");
    }

    printf("--- Resultado final ---\n");
    printf("Rondas jugadas: %d\n", ronda);
    printf("Victorias: %d | Derrotas: %d | Empates: %d\n",
           victorias, derrotas, empates);

    return 0;
}
