/*
 * Solución del ejercicio 1: contador de vocales
 * Del artículo «Bucles en Java — ejercicios con vocales, notas hasta el -1 y primos en un rango (y el bucle que se me colgó a mí)»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Contador de vocales: un for recorre la frase y un switch suma a la vocal que toque.
 * Las vocales con tilde cuentan como su vocal (á → a) y da igual la mayúscula.
 */
public class ContadorVocales {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== CONTADOR DE VOCALES ===");
        System.out.print("Palabra o frase: ");
        String texto = sc.nextLine().toLowerCase();       // una sola conversión, fuera del bucle

        int a = 0, e = 0, i = 0, o = 0, u = 0;            // un contador por vocal, todos a 0
        for (int k = 0; k < texto.length(); k++) {        // k: la i ya es el contador de la vocal i
            switch (texto.charAt(k)) {
                case 'a', 'á' -> a++;
                case 'e', 'é' -> e++;
                case 'i', 'í' -> i++;
                case 'o', 'ó' -> o++;
                case 'u', 'ú', 'ü' -> u++;
                default -> { }                            // consonantes, espacios, dígitos: nada
            }
        }
        int total = a + e + i + o + u;
        System.out.println("--- Resultado ---");
        System.out.println("a: " + a + "  e: " + e + "  i: " + i + "  o: " + o + "  u: " + u);
        System.out.println("Total de vocales: " + total);

        if (total == 0) {
            System.out.println("No hay vocales.");
        } else {
            // La más repetida: se empieza suponiendo la a y se compara con las demás (> y no >=: en empate gana la primera)
            char masRepetida = 'a';
            int maximo = a;
            if (e > maximo) { masRepetida = 'e'; maximo = e; }
            if (i > maximo) { masRepetida = 'i'; maximo = i; }
            if (o > maximo) { masRepetida = 'o'; maximo = o; }
            if (u > maximo) { masRepetida = 'u'; maximo = u; }
            System.out.println("La más repetida: " + masRepetida + " (" + maximo + " veces)");
        }
        sc.close();
    }
}
