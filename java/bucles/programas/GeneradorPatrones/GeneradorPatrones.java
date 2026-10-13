/*
 * Bucles en Java práctica — Programa 3: Generador de patrones con validación
 * Del artículo «Bucles en Java — práctica con texto, estadísticas y patrones»
 * https://sergiolearns.com/bucles-en-java-practica/
 */

import java.util.Scanner;

public class GeneradorPatrones {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== GENERADOR DE PATRONES ===");

        int opcion;
        do {
            System.out.println("\n1. Triángulo");
            System.out.println("2. Pirámide");
            System.out.println("3. Tablero de ajedrez");
            System.out.println("4. Salir");
            System.out.print("Opción: ");
            opcion = sc.nextInt();

            if (opcion == 4) {
                System.out.println("Hasta luego");
                break;    // salimos del do-while sin pedir el tamaño
            }

            System.out.print("Tamaño (3-10): ");
            int n = sc.nextInt();

            // Validamos antes de dibujar nada — si el tamaño no vale, avisamos y volvemos al menú
            if (n < 3 || n > 10) {
                System.out.println("✗ El tamaño debe estar entre 3 y 10");
                continue;    // salta directamente a la siguiente vuelta del do-while
            }

            System.out.println();
            switch (opcion) {
                case 1:
                    for (int i = 1; i <= n; i++) {
                        for (int j = 0; j < i; j++) {
                            System.out.print("* ");
                        }
                        System.out.println();
                    }
                    break;

                case 2:
                    for (int i = 1; i <= n; i++) {
                        // Espacios para centrar — decrecen mientras los asteriscos crecen
                        for (int s = 0; s < n - i; s++) {
                            System.out.print(" ");
                        }
                        for (int j = 0; j < i; j++) {
                            System.out.print("* ");
                        }
                        System.out.println();
                    }
                    break;

                case 3:
                    for (int i = 0; i < n; i++) {
                        for (int j = 0; j < n; j++) {
                            // (i + j) par en una casilla, impar en la otra — el truco del ajedrez
                            if ((i + j) % 2 == 0) {
                                System.out.print("■ ");
                            } else {
                                System.out.print("□ ");
                            }
                        }
                        System.out.println();
                    }
                    break;

                default:
                    System.out.println("✗ Opción no válida");
            }
        } while (true);

        sc.close();
    }
}
