/*
 * Solución Ejercicio 2
 * Del artículo «Bucles en Java — ejercicios con vocales, notas y el bucle que se me colgó a mí»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */

import java.util.Scanner;

public class NotasCentinela {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== NOTAS DE LA ASIGNATURA ===");
        System.out.println("Escribe las notas una a una. Escribe -1 para terminar.");

        double suma = 0;
        int contador = 0;
        double maxima = 0;
        double minima = 0;
        double nota;

        // do-while porque necesitamos leer la primera nota antes de poder
        // comprobar si es el centinela -1
        do {
            System.out.print("Nota: ");
            nota = sc.nextDouble();

            // Si es el centinela, no la procesamos como una nota más
            if (nota != -1) {
                suma += nota;

                // La primera nota real inicializa máxima y mínima;
                // las siguientes solo actualizan si superan el valor guardado
                if (contador == 0) {
                    maxima = nota;
                    minima = nota;
                } else {
                    if (nota > maxima) {
                        maxima = nota;
                    }
                    if (nota < minima) {
                        minima = nota;
                    }
                }
                contador++;
            }
        } while (nota != -1);

        System.out.println();
        System.out.println("--- Resultado ---");

        // Sin notas, calcular la media dividiría entre 0 — lo evitamos
        if (contador == 0) {
            System.out.println("No se introdujo ninguna nota");
        } else {
            double media = suma / contador;
            System.out.println("Notas introducidas: " + contador);
            System.out.printf("Media: %.2f%n", media);
            System.out.println("Nota más alta: " + maxima);
            System.out.println("Nota más baja: " + minima);
        }

        sc.close();
    }
}
