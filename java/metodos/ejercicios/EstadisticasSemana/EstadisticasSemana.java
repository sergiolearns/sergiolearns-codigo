/*
 * Solución del ejercicio 2: estadísticas de la semana
 * Del artículo «Métodos en Java — ejercicios con un conversor, la semana de temperaturas y el adivino del 31 (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */
import java.util.Scanner;

public class EstadisticasSemana {

    // Lee la temperatura de un día y la repite hasta que sea razonable.
    // Recibe el Scanner y el número de día; devuelve una temperatura ya validada.
    public static int leerTemperatura(Scanner sc, int dia) {
        int t;
        do {
            System.out.print("Día " + dia + ": ");
            t = sc.nextInt();
            if (t < -50 || t > 60) {
                System.out.println("  Fuera de rango (-50 a 60). Repite el día " + dia + ".");
            }
        } while (t < -50 || t > 60);
        return t;
    }

    // El mayor de dos números. Llamado en cada vuelta, va dejando el máximo de la semana.
    public static int mayor(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static int menor(int a, int b) {
        if (a < b) {
            return a;
        }
        return b;
    }

    // (double) ANTES de dividir: con dos int, 156 / 7 daría 22
    public static double media(int suma, int dias) {
        return (double) suma / dias;
    }

    public static boolean superaUmbral(int temperatura, int umbral) {
        return temperatura > umbral;    // > y no >=: un día de 22 justo no cuenta como caluroso
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        final int DIAS = 7;
        final int UMBRAL = 22;

        int maxima = 0, minima = 0, suma = 0, calurosos = 0;

        System.out.println("=== TEMPERATURAS DE LA SEMANA ===");
        for (int dia = 1; dia <= DIAS; dia++) {
            int t = leerTemperatura(sc, dia);
            if (dia == 1) {
                maxima = t;             // el primer dato es a la vez máximo y mínimo
                minima = t;
            } else {
                maxima = mayor(maxima, t);
                minima = menor(minima, t);
            }
            suma += t;
            if (superaUmbral(t, UMBRAL)) {
                calurosos++;
            }
        }

        System.out.println();
        System.out.println("--- Estadísticas ---");
        System.out.println("Máxima: " + maxima + " °C");
        System.out.println("Mínima: " + minima + " °C");
        System.out.printf("Media: %.2f °C%n", media(suma, DIAS));
        System.out.println("Días por encima de " + UMBRAL + " °C: " + calurosos);

        sc.close();
    }
}
