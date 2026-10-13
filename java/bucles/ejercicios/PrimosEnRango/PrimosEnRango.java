/*
 * Solución Ejercicio 3
 * Del artículo «Bucles en Java — ejercicios con vocales, notas y el bucle que se me colgó a mí»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */

import java.util.Scanner;

public class PrimosEnRango {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== NÚMEROS PRIMOS EN UN RANGO ===");
        System.out.print("Desde: ");
        int inicio = sc.nextInt();
        System.out.print("Hasta: ");
        int fin = sc.nextInt();

        // Cortamos aquí mismo si el rango no tiene sentido
        if (inicio > fin) {
            System.out.println("✗ El inicio no puede ser mayor que el fin");
            sc.close();
            return;
        }

        System.out.println();
        System.out.println("--- Primos encontrados ---");
        int totalPrimos = 0;

        // Bucle de fuera: recorre cada número del rango
        for (int numero = inicio; numero <= fin; numero++) {
            // El 1 no cuenta como primo por convención, así que lo saltamos
            if (numero < 2) {
                continue;
            }

            boolean esPrimo = true;

            // Bucle de dentro: busca un divisor de "numero"
            // Basta con llegar hasta su raíz cuadrada — si no hay divisor
            // hasta ahí, tampoco lo habrá más allá
            for (int divisor = 2; divisor <= Math.sqrt(numero); divisor++) {
                if (numero % divisor == 0) {
                    esPrimo = false;
                    break;    // ya sabemos que no es primo, no hace falta seguir
                }
            }

            if (esPrimo) {
                System.out.println(numero);
                totalPrimos++;
            }
        }

        System.out.println("Total: " + totalPrimos + " primos");

        sc.close();
    }
}
