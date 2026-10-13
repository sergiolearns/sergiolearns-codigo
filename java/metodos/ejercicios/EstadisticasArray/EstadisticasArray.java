/*
 * Solución Ejercicio 2
 * Del artículo «Métodos en Java — ejercicios con conversores, estadísticas y un juego de adivinar (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */

import java.util.Scanner;

public class EstadisticasArray {

    public static int maximo(int[] datos) {
        int max = datos[0];    // partimos del primer dato real, NO de 0
        for (int i = 1; i < datos.length; i++) {    // empezamos en 1: el 0 ya lo tenemos
            if (datos[i] > max) {
                max = datos[i];
            }
        }
        return max;    // el return va FUERA del bucle: si estuviera dentro, saldría en la primera vuelta
    }

    public static int minimo(int[] datos) {
        int min = datos[0];
        for (int i = 1; i < datos.length; i++) {
            if (datos[i] < min) {
                min = datos[i];
            }
        }
        return min;
    }

    public static double media(int[] datos) {
        int suma = 0;
        for (int i = 0; i < datos.length; i++) {
            suma += datos[i];
        }
        // (double) convierte la suma ANTES de dividir; sin él, 156 / 7 daría 22 en vez de 22.28...
        return (double) suma / datos.length;
    }

    // umbral es double porque le pasaremos la media, que tiene decimales
    public static int contarMayoresQue(int[] datos, double umbral) {
        int contador = 0;
        for (int i = 0; i < datos.length; i++) {
            if (datos[i] > umbral) {
                contador++;
            }
        }
        return contador;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] temperaturas = new int[7];

        System.out.println("=== TEMPERATURAS DE LA SEMANA ===");
        for (int i = 0; i < temperaturas.length; i++) {
            System.out.print("Día " + (i + 1) + ": ");    // i + 1 para que el usuario vea 1..7, no 0..6
            temperaturas[i] = sc.nextInt();
        }

        // Guardamos la media en una variable: la usamos dos veces y así la calculamos una sola vez
        double media = media(temperaturas);

        System.out.println();
        System.out.println("--- Estadísticas ---");
        System.out.println("Máxima: " + maximo(temperaturas) + " °C");
        System.out.println("Mínima: " + minimo(temperaturas) + " °C");
        System.out.printf("Media: %.2f °C%n", media);
        System.out.println("Días por encima de la media: " + contarMayoresQue(temperaturas, media));

        sc.close();
    }
}
