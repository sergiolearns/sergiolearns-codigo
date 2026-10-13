/*
 * Solución Ejercicio 2
 * Del artículo «Sintaxis de Java — ejercicios para escribir código que funciona a la primera»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */

import java.util.Scanner;

public class InformeNotas {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== INFORME DE NOTAS ===");
        System.out.println();

        System.out.print("Nombre del estudiante: ");
        String nombre = sc.nextLine();
        System.out.println();

        int numAsignaturas = 5;
        String[] asignaturas = new String[numAsignaturas];
        double[] notas       = new double[numAsignaturas];

        // Recoger datos
        for (int i = 0; i < numAsignaturas; i++) {
            System.out.printf("Asignatura %d: ", i + 1);
            asignaturas[i] = sc.nextLine();
            System.out.print("Nota: ");
            notas[i] = sc.nextDouble();
            sc.nextLine();    // limpiar salto de línea
            System.out.println();
        }

        // Calcular estadísticas
        double suma = 0;
        int aprobadas = 0;
        for (int i = 0; i < numAsignaturas; i++) {
            suma += notas[i];
            if (notas[i] >= 5.0) aprobadas++;
        }
        double media = suma / numAsignaturas;
        int suspensos = numAsignaturas - aprobadas;

        // Mostrar informe
        System.out.println("==============================");
        System.out.printf("INFORME: %s%n", nombre);
        System.out.println("==============================");

        for (int i = 0; i < numAsignaturas; i++) {
            String clasificacion;
            if (notas[i] >= 9.0)      clasificacion = "Sobresaliente";
            else if (notas[i] >= 7.0) clasificacion = "Notable";
            else if (notas[i] >= 5.0) clasificacion = "Aprobado";
            else                      clasificacion = "Suspenso";

            System.out.printf("%-15s %5.2f  %s%n",
                              asignaturas[i], notas[i], clasificacion);
        }

        System.out.println("------------------------------");
        System.out.printf("Media:        %5.2f%n", media);
        System.out.printf("Aprobadas:    %d / %d%n", aprobadas, numAsignaturas);
        System.out.printf("Suspensos:    %d / %d%n", suspensos, numAsignaturas);
        System.out.printf("Estado:       %s%n",
                          (media >= 5.0) ? "APROBADO" : "SUSPENSO");
        System.out.println("==============================");

        sc.close();
    }
}
