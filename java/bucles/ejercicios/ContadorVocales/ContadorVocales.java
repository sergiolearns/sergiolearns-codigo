/*
 * Solución Ejercicio 1
 * Del artículo «Bucles en Java — ejercicios con vocales, notas y el bucle que se me colgó a mí»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */

import java.util.Scanner;

public class ContadorVocales {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONTADOR DE VOCALES ===");
        System.out.print("Palabra o frase: ");
        String texto = sc.nextLine();

        // Un contador por cada vocal — todos arrancan en 0
        int contA = 0, contE = 0, contI = 0, contO = 0, contU = 0;

        // Recorremos el texto carácter a carácter
        for (int i = 0; i < texto.length(); i++) {
            // toLowerCase evita tener que comparar mayúscula y minúscula por separado
            char c = Character.toLowerCase(texto.charAt(i));

            // switch sobre un char funciona igual que sobre un int o un String
            switch (c) {
                case 'a':
                    contA++;
                    break;
                case 'e':
                    contE++;
                    break;
                case 'i':
                    contI++;
                    break;
                case 'o':
                    contO++;
                    break;
                case 'u':
                    contU++;
                    break;
                // si no es ninguna vocal, no hacemos nada — no hace falta default
            }
        }

        // El total es la suma de los cinco contadores individuales
        int total = contA + contE + contI + contO + contU;

        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.println("Total de vocales: " + total);
        System.out.println("a: " + contA);
        System.out.println("e: " + contE);
        System.out.println("i: " + contI);
        System.out.println("o: " + contO);
        System.out.println("u: " + contU);

        sc.close();
    }
}
