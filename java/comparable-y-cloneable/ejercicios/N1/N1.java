/*
 * Solución del Nivel 1
 * Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)»
 * https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/
 */

import java.util.Arrays;

public class N1 {
    public static void main(String[] args) {
        Libro[] estante = {
            new Libro("El Quijote", 1376),
            new Libro("Platero y yo", 160),
            new Libro("La Celestina", 280),
            new Libro("Fortunata y Jacinta", 1008)
        };

        Arrays.sort(estante);

        System.out.println("De menos a más páginas:");
        for (Libro libro : estante) {
            System.out.println("  " + libro);
        }
        System.out.println("El más corto: " + estante[0]);
        System.out.println("El más largo: " + estante[estante.length - 1]);
    }
}
