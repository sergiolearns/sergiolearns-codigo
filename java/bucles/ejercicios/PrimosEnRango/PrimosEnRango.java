/*
 * Solución del ejercicio 3: números primos en un rango
 * Del artículo «Bucles en Java — ejercicios con vocales, notas hasta el -1 y primos en un rango (y el bucle que se me colgó a mí)»
 * https://sergiolearns.com/bucles-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Primos en un rango: el bucle de fuera recorre los números y el de dentro busca un divisor
 * hasta la raíz cuadrada (d * d <= n), cortando con break en cuanto lo encuentra.
 */
public class PrimosEnRango {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== NÚMEROS PRIMOS EN UN RANGO ===");
        System.out.print("Desde: ");
        int desde = sc.nextInt();
        System.out.print("Hasta: ");
        int hasta = sc.nextInt();

        if (desde > hasta) {
            System.out.println("Rango no válido: «desde» tiene que ser menor o igual que «hasta».");
            return;
        }
        if (desde < 2) {
            desde = 2;                                    // ni el 0 ni el 1 son primos: se empieza en 2
        }

        System.out.println("--- Primos encontrados ---");
        int total = 0, divisiones = 0;
        String fila = "";
        for (int n = desde; n <= hasta; n++) {            // bucle de fuera: cada candidato
            boolean esPrimo = true;                       // se reinicia en CADA candidato
            for (int d = 2; d * d <= n; d++) {            // bucle de dentro: divisores hasta la raíz
                divisiones++;
                if (n % d == 0) {
                    esPrimo = false;
                    break;                                // sale solo del bucle de dentro
                }
            }
            if (esPrimo) {
                total++;
                fila += n + " ";
                if (total % 5 == 0) {                     // cada 5 primos, una línea
                    System.out.println(fila.trim());
                    fila = "";
                }
            }
        }
        if (!fila.isEmpty()) {
            System.out.println(fila.trim());              // la última línea, si quedó a medias
        }
        System.out.println("Total: " + total + " primos (" + divisiones + " divisiones)");
        sc.close();
    }
}
