/*
 * Diagramas de flujo en C ejercicios — Solución del nivel 2: ¿es segura la contraseña?
 * Del artículo «Diagramas de flujo en C — ejercicios con contadores, contraseñas y dos semanas de pasos (y un programa que se quedó colgado)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    char clave[30];
    int mayus = 0, digitos = 0, minus = 0;
    int i;

    printf("Nueva contraseña de la app: ");
    scanf("%29s", clave);

    for (i = 0; clave[i] != '\0'; i++) {
        // Rombos encadenados: cada carácter cae en UNA sola rama
        if (clave[i] >= 'A' && clave[i] <= 'Z') {
            mayus = mayus + 1;
        } else if (clave[i] >= '0' && clave[i] <= '9') {
            digitos = digitos + 1;
        } else if (clave[i] >= 'a' && clave[i] <= 'z') {
            minus = minus + 1;
        }   // cualquier otro carácter (un punto, un guion) no cuenta en ninguno
    }

    printf("Mayúsculas: %d, dígitos: %d, minúsculas: %d (longitud %d)\n", mayus, digitos, minus, i);

    // i vale la longitud: el bucle paró justo en el '\0'
    if (i >= 8 && mayus >= 1 && digitos >= 2) {
        printf("Contraseña aceptada\n");
    } else {
        printf("Contraseña débil: mínimo 8 caracteres, 1 mayúscula y 2 dígitos\n");
    }
    return 0;
}
