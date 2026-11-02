/*
 * Solución del ejercicio 1: conversor de temperaturas
 * Del artículo «Métodos en Java — ejercicios con un conversor, la semana de temperaturas y el adivino del 31 (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */
import java.util.Scanner;

public class ConversorTemperaturas {

    // private: comprobación interna. boolean: sí o no.
    private static boolean esTemperaturaValida(double celsius) {
        return celsius >= -273.15;    // -273,15 °C es el cero absoluto: por debajo no hay nada
    }

    // Reciben grados Celsius y DEVUELVEN el valor convertido. No imprimen: así sirven para cualquier cosa.
    public static double celsiusAFahrenheit(double celsius) {
        return celsius * 9.0 / 5.0 + 32;    // 9.0 / 5.0: con 9 / 5 sería división entera y daría 1
    }

    public static double celsiusAKelvin(double celsius) {
        return celsius + 273.15;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONVERSOR DE TEMPERATURAS ===");
        System.out.print("Temperatura en °C: ");
        double celsius = sc.nextDouble();

        // Se valida ANTES de convertir y se corta con return, como en Control de flujo
        if (!esTemperaturaValida(celsius)) {
            System.out.println("No existe una temperatura por debajo de -273,15 °C");
            sc.close();
            return;
        }

        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.printf("%.1f °C = %.1f °F%n", celsius, celsiusAFahrenheit(celsius));
        System.out.printf("%.1f °C = %.2f K%n", celsius, celsiusAKelvin(celsius));

        sc.close();
    }
}
