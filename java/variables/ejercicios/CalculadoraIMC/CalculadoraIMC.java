/*
 * Solución Ejercicio 1
 * Del artículo «Variables en Java — ejercicios para dominar tipos, casting y Strings»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */

import java.util.Scanner;

public class CalculadoraIMC {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CALCULADORA DE IMC ===");
        System.out.println();

        System.out.print("Peso (kg): ");
        double peso = sc.nextDouble();

        System.out.print("Altura (m): ");
        double altura = sc.nextDouble();

        // Calculamos el IMC — ojo: no existe ^ en Java para potencias
        // altura * altura es lo más directo y claro para este caso
        // Math.pow(altura, 2) también funciona pero es excesivo aquí
        double imc = peso / (altura * altura);

        // Calculamos el rango de peso ideal para esta altura
        // multiplicamos por el IMC límite, no al revés
        double pesoMinimo = 18.5 * (altura * altura);
        double pesoMaximo = 24.9 * (altura * altura);

        // Clasificación — usamos if/else if porque comparamos rangos de double
        // switch no sirve aquí: solo funciona con valores exactos, no rangos
        String clasificacion;
        if (imc < 18.5) {
            clasificacion = "Bajo peso";
        } else if (imc < 25.0) {
            clasificacion = "Normopeso";      // entre 18.5 y 24.9
        } else if (imc < 30.0) {
            clasificacion = "Sobrepeso";      // entre 25 y 29.9
        } else {
            clasificacion = "Obesidad";       // 30 o más
        }

        // Determinamos si está en rango saludable — boolean limpio
        boolean saludable = (imc >= 18.5 && imc < 25.0);

        System.out.println();
        System.out.println("--- Resultado ---");
        // %.2f para mostrar dos decimales — el IMC no necesita más precisión
        System.out.printf("IMC:             %.2f%n", imc);
        System.out.printf("Clasificación:   %s%n", clasificacion);
        System.out.printf("Peso ideal:      entre %.1f kg y %.1f kg%n",
                          pesoMinimo, pesoMaximo);
        System.out.printf("Rango saludable: 18,5 - 24,9%n");
        System.out.println();

        // El operador ternario aquí es más compacto que un if/else
        // si la condición es simple, el ternario lo hace más legible
        System.out.printf("Estado: %s%n",
            saludable
            ? "✓ Tu peso está dentro del rango saludable"
            : "⚠ Tu peso está fuera del rango saludable");

        sc.close();
    }
}
