/*
 * Sintaxis Java práctica — Programa 1:  Calculadora básica con Scanner
 * Del artículo «Sintaxis de Java — 3 programas reales para perderle el miedo al punto y coma»
 * https://sergiolearns.com/sintaxis-java-practica/
 */

import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CALCULADORA BÁSICA ===");
        System.out.println();

        System.out.print("Primer número: ");
        double a = sc.nextDouble();

        System.out.print("Segundo número: ");
        double b = sc.nextDouble();

        System.out.println();
        System.out.println("--- Resultados ---");
        System.out.printf("%.2f + %.2f = %.2f%n", a, b, a + b);
        System.out.printf("%.2f - %.2f = %.2f%n", a, b, a - b);
        System.out.printf("%.2f × %.2f = %.2f%n", a, b, a * b);

        if (b != 0) {
            System.out.printf("%.2f / %.2f = %.2f%n", a, b, a / b);
        } else {
            System.out.println("División: no se puede dividir entre cero");
        }

        // División entera y resto — solo con enteros
        int ia = (int) a;
        int ib = (int) b;
        if (ib != 0) {
            System.out.printf("%d // %d = %d (división entera)%n", ia, ib, ia / ib);
            System.out.printf("%d %% %d = %d (resto)%n", ia, ib, ia % ib);
        }

        System.out.println();
        System.out.printf("Potencia: %.2f ^ 2 = %.2f%n", a, a * a);
        System.out.printf("Valor absoluto de %.2f = %.2f%n", a, Math.abs(a));

        sc.close();
    }
}
