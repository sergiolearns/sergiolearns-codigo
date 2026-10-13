/*
 * Solución Ejercicio 1
 * Del artículo «Métodos en Java — ejercicios con conversores, estadísticas y un juego de adivinar (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */

import java.util.Scanner;

public class ConversorTemperaturas {

    // private: es una comprobación interna, solo la usa esta clase.
    // boolean: la respuesta es sí o no.
    private static boolean esTemperaturaValida(double celsius) {
        // -273.15 °C es el cero absoluto: por debajo no existe nada
        return celsius >= -273.15;
    }

    // Recibe grados Celsius, devuelve grados Fahrenheit. No imprime nada: solo calcula
    public static double celsiusAFahrenheit(double celsius) {
        // 9.0 / 5.0 con decimales. Con 9 / 5 sería una división entera y daría 1
        return celsius * 9.0 / 5.0 + 32;
    }

    public static double celsiusAKelvin(double celsius) {
        return celsius + 273.15;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONVERSOR DE TEMPERATURAS ===");
        System.out.print("Temperatura en °C: ");
        double celsius = sc.nextDouble();

        // Validamos ANTES de convertir y cortamos con return, igual que en control de flujo
        if (!esTemperaturaValida(celsius)) {
            System.out.println("✗ No existe una temperatura por debajo de -273.15 °C");
            sc.close();
            return;
        }

        System.out.println();
        System.out.println("--- Resultado ---");
        // main es quien imprime; los métodos solo calculan y devuelven el valor
        System.out.printf("%.1f °C = %.1f °F%n", celsius, celsiusAFahrenheit(celsius));
        System.out.printf("%.1f °C = %.2f K%n", celsius, celsiusAKelvin(celsius));

        sc.close();
    }
}
