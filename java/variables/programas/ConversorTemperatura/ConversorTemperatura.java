/*
 * Variables en Java práctica — Programa 2: Conversor de temperatura con casting
 * Del artículo «Variables en Java — práctica con los errores que todo el mundo comete»
 * https://sergiolearns.com/variables-en-java-practica/
 */

import java.util.Scanner;

public class ConversorTemperatura {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONVERSOR DE TEMPERATURA ===");
        System.out.println();

        System.out.println("¿De qué unidad parto?");
        System.out.println("1. Celsius (°C)");
        System.out.println("2. Fahrenheit (°F)");
        System.out.println("3. Kelvin (K)");
        System.out.print("Opción: ");
        int opcion = sc.nextInt();

        System.out.print("Temperatura: ");
        double temp = sc.nextDouble();

        // Convertir primero a Celsius
        double celsius;
        String unidadOrigen;

        switch (opcion) {
            case 1:
                celsius = temp;
                unidadOrigen = "°C";
                break;
            case 2:
                celsius = (temp - 32) * 5.0 / 9.0;
                unidadOrigen = "°F";
                break;
            case 3:
                celsius = temp - 273.15;
                unidadOrigen = "K";
                break;
            default:
                System.out.println("Opción no válida");
                sc.close();
                return;
        }

        // Cero absoluto: -273.15°C
        if (celsius < -273.15) {
            System.out.println("Temperatura por debajo del cero absoluto — imposible");
            sc.close();
            return;
        }

        // Convertir a las otras dos
        double fahrenheit = celsius * 9.0 / 5.0 + 32;
        double kelvin     = celsius + 273.15;

        // Versión entera — truncada, no redondeada
        int celsiusInt     = (int) celsius;
        int fahrenheitInt  = (int) fahrenheit;
        int kelvinInt      = (int) kelvin;

        System.out.println();
        System.out.printf("%.2f %s equivale a:%n", temp, unidadOrigen);
        System.out.println();
        System.out.printf("  Celsius:    %8.2f °C%n", celsius);
        System.out.printf("  Fahrenheit: %8.2f °F%n", fahrenheit);
        System.out.printf("  Kelvin:     %8.2f K%n",  kelvin);
        System.out.println();
        System.out.println("--- En entero (casting a int — trunca, no redondea) ---");
        System.out.printf("  Celsius:    %d °C%n", celsiusInt);
        System.out.printf("  Fahrenheit: %d °F%n", fahrenheitInt);
        System.out.printf("  Kelvin:     %d K%n",  kelvinInt);

        // Datos curiosos
        System.out.println();
        System.out.println("--- Temperaturas de referencia ---");
        System.out.printf("  Cero absoluto: -273.15 °C = %.2f °F = 0 K%n",
                          -273.15 * 9.0 / 5.0 + 32);
        System.out.printf("  Agua congela:    0.00 °C = 32.00 °F = 273.15 K%n");
        System.out.printf("  Agua hierve:   100.00 °C = 212.00 °F = 373.15 K%n");
        System.out.printf("  Cuerpo humano:  37.00 °C = %.2f °F = %.2f K%n",
                          37.0 * 9.0 / 5.0 + 32, 37.0 + 273.15);

        sc.close();
    }
}
