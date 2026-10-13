/*
 * Sintaxis Java práctica — Programa 3: Patrones de texto y arte ASCII
 * Del artículo «Sintaxis de Java — 3 programas reales para perderle el miedo al punto y coma»
 * https://sergiolearns.com/sintaxis-java-practica/
 */

import java.util.Scanner;

public class Patrones {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== PATRONES DE TEXTO ===");
        System.out.println();

        System.out.print("Tamaño (3-10): ");
        int n = sc.nextInt();

        // Patrón 1 — Triángulo de asteriscos
        System.out.println("\n--- Triángulo ---");
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }

        // Patrón 2 — Cuadrado con borde
        System.out.println("\n--- Cuadrado con borde ---");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 || i == n-1 || j == 0 || j == n-1) {
                    System.out.print("# ");
                } else {
                    System.out.print("  ");
                }
            }
            System.out.println();
        }

        // Patrón 3 — Tabla de multiplicar formateada
        System.out.println("\n--- Tabla de multiplicar (1 a " + n + ") ---");
        System.out.print("   ");
        for (int j = 1; j <= n; j++) {
            System.out.printf("%4d", j);
        }
        System.out.println();
        System.out.print("   ");
        System.out.println("----".repeat(n));

        for (int i = 1; i <= n; i++) {
            System.out.printf("%2d |", i);
            for (int j = 1; j <= n; j++) {
                System.out.printf("%4d", i * j);
            }
            System.out.println();
        }

        // Patrón 4 — Pirámide de números
        System.out.println("\n--- Pirámide ---");
        for (int i = 1; i <= n; i++) {
            // Espacios iniciales para centrar
            for (int s = 0; s < n - i; s++) {
                System.out.print("  ");
            }
            // Números ascendentes
            for (int j = 1; j <= i; j++) {
                System.out.printf("%2d", j);
            }
            // Números descendentes
            for (int j = i - 1; j >= 1; j--) {
                System.out.printf("%2d", j);
            }
            System.out.println();
        }

        // Arte ASCII — letras con asteriscos
        System.out.println("\n--- La letra J en ASCII ---");
        System.out.println("  * * * *");
        System.out.println("      *  ");
        System.out.println("      *  ");
        System.out.println("*     *  ");
        System.out.println("* * * *  ");

        sc.close();
    }
}
