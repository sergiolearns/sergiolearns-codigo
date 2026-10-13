/*
 * Solución Ejercicio 2:
 * Del artículo «Tipos y variables en C — ejercicios para dominar printf, scanf y operadores»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    char inicial;
    float peso, altura, imc;

    printf("Inicial de tu nombre: ");
    scanf(" %c", &inicial);    /* espacio + & obligatorio */
    printf("Peso (kg): ");
    scanf("%f", &peso);
    printf("Altura (m): ");
    scanf("%f", &altura);

    imc = peso / (altura * altura);

    printf("\n--- IMC para %c. ---\n", inicial);
    printf("Peso:   %.2f kg\n", peso);
    printf("Altura: %.2f m\n",  altura);
    printf("IMC:    %.2f\n",    imc);
    printf("Estado: ");

    if (imc < 18.5)       printf("Bajo peso\n");
    else if (imc < 25.0)  printf("Peso normal\n");
    else if (imc < 30.0)  printf("Sobrepeso\n");
    else                  printf("Obesidad\n");

    return 0;
}
