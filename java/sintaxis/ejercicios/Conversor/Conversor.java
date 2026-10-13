/*
 * Solución Ejercicio 1
 * Del artículo «Sintaxis de Java — ejercicios para escribir código que funciona a la primera»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */

import java.util.Scanner;

public class Conversor {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONVERSOR DE DISTANCIAS ===");
        System.out.println();

        System.out.print("Distancia en km: ");
        double km = sc.nextDouble();

        double metros      = km * 1000;
        double centimetros = km * 100000;
        double millas      = km / 1.60934;
        double pies        = km * 3280.84;

        System.out.println();
        System.out.println("--- Conversiones ---");
        System.out.printf("Kilómetros:  %10.2f km%n", km);
        System.out.printf("Metros:      %10.2f m%n",  metros);
        System.out.printf("Centímetros: %10.2f cm%n", centimetros);
        System.out.printf("Millas:      %10.2f mi%n", millas);
        System.out.printf("Pies:        %10.2f ft%n", pies);

        sc.close();
    }
}
