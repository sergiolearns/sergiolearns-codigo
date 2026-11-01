/*
 * Solución del ejercicio 4: login con 3 intentos en un solo bloque
 * Del artículo «Bucles en C — ejercicios con primos, piedra-papel-tijera, un login de 3 intentos y una calculadora con menú (y el ; que dejó la lista de primos vacía)»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */
#include <stdio.h>

#define PIN_OK 5678

int main(void) {
    char inicial;
    int pin;
    int intento;
    int dentro = 0;              // bandera: 1 cuando el login es correcto
    int c;

    printf("=== SISTEMA DE LOGIN ===\n");

    // UN solo bloque que se repite: como mucho 3 veces y antes si entra
    for (intento = 1; intento <= 3 && !dentro; intento++) {
        printf("\nIntento %d de 3\n", intento);
        printf("Inicial del usuario: ");
        scanf(" %c", &inicial);           // el espacio salta el Intro anterior
        printf("PIN: ");
        if (scanf("%d", &pin) != 1) {
            while ((c = getchar()) != '\n' && c != EOF);
            pin = -1;                     // un PIN que nunca es correcto
        }

        if (inicial == 's' && pin == PIN_OK) {
            dentro = 1;
        } else {
            printf("Usuario o PIN incorrectos\n");
        }
    }

    if (dentro) {
        printf("\nAcceso concedido. Bienvenido, sergio.\n");
    } else {
        printf("\nCuenta bloqueada: 3 intentos fallidos\n");
    }
    return 0;
}
