/*
 * Solución del ejercicio 2: calculadora de IMC con clasificación
 * Del artículo «Tipos y variables en C — ejercicios de figuras, IMC, bases y una calculadora científica (y el scanf sin & que acaba en Segmentation fault)»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    char inicial;
    float peso, altura;

    printf("Inicial de tu nombre: ");
    scanf(" %c", &inicial);             /* espacio + & también con %c */
    printf("Peso (kg): ");
    scanf("%f", &peso);
    printf("Altura (m): ");
    scanf("%f", &altura);

    float imc = peso / (altura * altura);     /* paréntesis: altura² antes de dividir */
    /* cada comparación vale 1 o 0: solo una de las cuatro puede valer 1 */
    int bajo = imc < 18.5f;
    int normal = imc >= 18.5f && imc < 25.0f;
    int sobrepeso = imc >= 25.0f && imc < 30.0f;
    int obesidad = imc >= 30.0f;

    printf("\n--- IMC para %c. ---\n", inicial);
    printf("Peso:   %.2f kg\n", peso);
    printf("Altura: %.2f m\n", altura);
    printf("IMC:    %.2f\n", imc);
    printf("Bajo peso: %d | Normal: %d | Sobrepeso: %d | Obesidad: %d\n",
           bajo, normal, sobrepeso, obesidad);
    printf("Comprobación (debe dar 1): %d\n", bajo + normal + sobrepeso + obesidad);
    return 0;
}
