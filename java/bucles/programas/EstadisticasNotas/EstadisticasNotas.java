/*
 * Bucles en Java práctica — Programa 2: Estadísticas de un array de notas
 * Del artículo «Bucles en Java — práctica con texto, estadísticas y patrones»
 * https://sergiolearns.com/bucles-en-java-practica/
 */

import java.util.Scanner;

public class EstadisticasNotas {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== ESTADÍSTICAS DE NOTAS ===");
        System.out.println();

        System.out.print("¿Cuántas notas vas a introducir? ");
        int n = sc.nextInt();
        double[] notas = new double[n];

        for (int i = 0; i < n; i++) {
            System.out.printf("Nota %d: ", i + 1);
            notas[i] = sc.nextDouble();
        }

        // Suma con for-each — no necesitamos el índice, solo el valor
        double suma = 0;
        for (double nota : notas) {
            suma += nota;
        }
        double media = suma / n;

        // Mínimo y máximo — empezamos asumiendo que el primero es ambos
        // y vamos comparando con el resto
        double minimo = notas[0];
        double maximo = notas[0];
        for (double nota : notas) {
            if (nota < minimo) minimo = nota;
            if (nota > maximo) maximo = nota;
        }

        // Cuántas notas se alejan más de 1 punto de la media
        // Aquí sí necesitamos el índice, para poder decir cuál es
        int alejadas = 0;
        for (int i = 0; i < n; i++) {
            double distancia = Math.abs(notas[i] - media);
            if (distancia > 1.0) {
                alejadas++;
            }
        }

        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.printf("Media:    %.2f%n", media);
        System.out.printf("Mínimo:   %.2f%n", minimo);
        System.out.printf("Máximo:   %.2f%n", maximo);
        System.out.printf("Rango:    %.2f%n", maximo - minimo);
        System.out.printf("Notas a más de 1 punto de la media: %d de %d%n", alejadas, n);

        sc.close();
    }
}
