/*
 * Solución Ejercicio 1
 * Del artículo «Control de flujo en Java — ejercicios con validaciones, menús y bucles»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */

import java.util.Scanner;

public class ValidadorNota {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== VALIDADOR DE NOTA DE ACCESO ===");
        System.out.println();

        System.out.print("Nota de acceso (0-14): ");
        double nota = sc.nextDouble();

        // Cortamos aquí mismo si el dato no tiene sentido — no seguimos calculando nada
        if (nota < 0 || nota > 14) {
            System.out.println("✗ La nota debe estar entre 0 y 14");
            sc.close();
            return;
        }

        // Clasificación por rangos — if/else if, no switch, porque son intervalos de double
        String clasificacion;
        if (nota < 5) {
            clasificacion = "No apto";
        } else if (nota < 7) {
            clasificacion = "Suficiente";
        } else if (nota < 9) {
            clasificacion = "Notable";
        } else if (nota < 11) {
            clasificacion = "Muy bueno";
        } else {
            clasificacion = "Excelente";
        }

        // Nota de corte fija para este ejercicio — en la práctica variaría según el grado
        double corte = 10.5;
        boolean accede = nota >= corte;

        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.printf("Clasificación: %s%n", clasificacion);
        // El operador ternario aquí evita un if/else completo para un solo texto
        System.out.printf("¿Accede a un grado con corte %.1f? %s%n",
                          corte, accede ? "SÍ ✓" : "NO ✗");

        // El margen solo tiene sentido mostrarlo si de verdad se accede
        if (accede) {
            System.out.printf("Margen sobre el corte: %.2f puntos%n", nota - corte);
        }

        sc.close();
    }
}
