/*
 * Solución del ejercicio 2: piedra papel tijera con reintentos
 * Del artículo «Bucles en C — ejercicios con primos, piedra-papel-tijera, un login de 3 intentos y una calculadora con menú (y el ; que dejó la lista de primos vacía)»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int jugador, maquina;
    int jugando = 1;             // bandera: el bucle sigue mientras valga 1
    int ronda = 1;
    int victorias = 0, derrotas = 0, empates = 0;
    int c;

    printf("=== PIEDRA PAPEL TIJERA ===\n");
    printf("1. Piedra  2. Papel  3. Tijera  0. Salir\n");

    while (jugando) {
        printf("\nRonda %d\n", ronda);

        // Jugada válida: al menos una vez y hasta que esté entre 0 y 3
        do {
            printf("Tu elección: ");
            if (scanf("%d", &jugador) != 1) {
                while ((c = getchar()) != '\n' && c != EOF);
                jugador = -1;
            }
            if (jugador < 0 || jugador > 3) {
                printf("Error: elige entre 0 y 3\n");
            }
        } while (jugador < 0 || jugador > 3);

        if (jugador == 0) {
            jugando = 0;         // el while lo verá al volver arriba
        } else {
            maquina = (ronda - 1) % 3 + 1;   // sin rand(): piedra, papel, tijera, piedra...

            printf("Tú: %s | Máquina: %s\n",
                   jugador == 1 ? "Piedra" : jugador == 2 ? "Papel" : "Tijera",
                   maquina == 1 ? "Piedra" : maquina == 2 ? "Papel" : "Tijera");

            if (jugador == maquina) {
                printf("-> Empate\n");
                empates++;
            } else if ((jugador == 1 && maquina == 3) ||
                       (jugador == 2 && maquina == 1) ||
                       (jugador == 3 && maquina == 2)) {
                printf("-> ¡Ganas tú!\n");
                victorias++;
            } else {
                printf("-> Gana la máquina\n");
                derrotas++;
            }
            ronda++;             // solo cuenta una ronda jugada de verdad
        }
    }

    printf("\n--- Resultado final ---\n");
    printf("Rondas jugadas: %d\n", ronda - 1);
    printf("Victorias: %d | Derrotas: %d | Empates: %d\n", victorias, derrotas, empates);
    return 0;
}
