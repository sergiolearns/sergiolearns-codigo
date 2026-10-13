/*
 * El código
 * Del artículo «Arrays en Java — práctica con una tienda, una matriz y las notas de clase (y cómo no estropear el original)»
 * https://sergiolearns.com/arrays-en-java-practica/
 */

import java.util.Arrays;

public class Estadisticas {

    static double media(int[] datos) {
        int suma = 0;
        for (int n : datos) {
            suma += n;
        }
        return (double) suma / datos.length;
    }

    // Trabaja sobre una COPIA: ordenar el original sería un efecto secundario no deseado
    static double mediana(int[] datos) {
        int[] orden = Arrays.copyOf(datos, datos.length);
        Arrays.sort(orden);
        int n = orden.length;
        if (n % 2 == 1) {
            return orden[n / 2];                              // impar: el del medio
        }
        return (orden[n / 2 - 1] + orden[n / 2]) / 2.0;       // par: media de los dos del medio
    }

    // Notas de 0 a 10: frecuencias[n] cuenta cuántas veces aparece la nota n
    static int[] frecuencias(int[] notas) {
        int[] frec = new int[11];
        for (int nota : notas) {
            frec[nota]++;                                     // la nota ES el índice
        }
        return frec;
    }

    // Devuelve la nota más repetida (si hay empate, la menor)
    static int moda(int[] notas) {
        int[] frec = frecuencias(notas);
        int mejor = 0;
        for (int nota = 1; nota < frec.length; nota++) {
            if (frec[nota] > frec[mejor]) {                   // > estricto: en empate gana la menor
                mejor = nota;
            }
        }
        return mejor;
    }

    static int contarSuperiores(int[] datos, double umbral) {
        int cuenta = 0;
        for (int n : datos) {
            if (n > umbral) {
                cuenta++;
            }
        }
        return cuenta;
    }

    static void histograma(int[] notas) {
        int[] frec = frecuencias(notas);
        for (int nota = 0; nota < frec.length; nota++) {
            System.out.printf("%2d | ", nota);
            for (int i = 0; i < frec[nota]; i++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        int[] notas = {7, 5, 9, 4, 10, 6, 7, 3, 8, 7, 5, 10, 2, 7, 6};

        System.out.println("Notas:   " + Arrays.toString(notas));
        System.out.printf("Media:   %.2f%n", media(notas));
        System.out.println("Mediana: " + mediana(notas));
        System.out.println("Moda:    " + moda(notas));
        System.out.println("Por encima de la media: " + contarSuperiores(notas, media(notas)));

        // Prueba de que mediana no ha tocado el original
        System.out.println("Notas:   " + Arrays.toString(notas));

        System.out.println("\nHistograma:");
        histograma(notas);

        // Con número par de datos
        int[] pares = {4, 8, 6, 2};
        System.out.println("\nMediana de " + Arrays.toString(pares) + " = " + mediana(pares));
    }
}
