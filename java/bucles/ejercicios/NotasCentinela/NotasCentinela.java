/*
 * Solución del ejercicio 2: notas con valor centinela
 * Del artículo «Bucles en Java — ejercicios con vocales, notas hasta el -1 y primos en un rango (y el bucle que se me colgó a mí)»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Notas con valor centinela: se piden notas hasta que llegue -1. Acumulador para la media,
 * contadores y máximo/mínimo SIN guardar las notas (sin arrays).
 */
public class NotasCentinela {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== NOTAS DE LA ASIGNATURA ===");
        System.out.println("Escribe las notas una a una (de 0 a 10). Escribe -1 para terminar.");

        int cuantas = 0, aprobadas = 0;
        double suma = 0;
        double maxima = 0, minima = 0;            // se sobrescriben con la primera nota válida
        double nota;
        do {
            System.out.print("Nota: ");
            nota = sc.nextDouble();
            if (nota == -1) {
                break;                            // el centinela no es una nota: no se cuenta
            }
            if (nota < 0 || nota > 10) {
                System.out.println("  No vale: va de 0 a 10.");
                continue;                         // do-while: salta a la condición del final
            }
            cuantas++;
            suma += nota;
            if (nota >= 5) {
                aprobadas++;
            }
            if (cuantas == 1) {                   // la primera nota es a la vez la máxima y la mínima
                maxima = nota;
                minima = nota;
            } else if (nota > maxima) {
                maxima = nota;
            } else if (nota < minima) {
                minima = nota;
            }
        } while (true);                           // solo se sale con el break del centinela

        System.out.println("--- Resumen ---");
        if (cuantas == 0) {
            System.out.println("No hay notas: no se puede calcular la media.");
        } else {
            System.out.println("Notas: " + cuantas + " (aprobadas: " + aprobadas + ")");
            System.out.printf("Media: %.2f%n", suma / cuantas);
            System.out.println("Máxima: " + maxima + "  Mínima: " + minima);
        }
        sc.close();
    }
}
