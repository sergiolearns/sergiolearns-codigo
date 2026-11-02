/*
 * Programa 2: adivina el número con while
 * Del artículo «Bucles en Java — práctica con un analizador de texto, el adivino que por fin repite y un generador de patrones (y la vuelta de más que me tumbó el programa)»
 * https://sergiolearns.com/bucles-en-java-practica/
 */
import java.util.Random;
import java.util.Scanner;

/**
 * Adivina el número, ahora con while: el bloque se escribe UNA vez y se repite
 * hasta acertar o gastar los 7 intentos. Mismo secreto que en Control de flujo (semilla 42).
 */
public class Adivina {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random azar = new Random(42);
        int secreto = azar.nextInt(100) + 1;
        final int MAX = 7;                         // con 7 intentos y búsqueda por la mitad, siempre se acierta

        System.out.println("=== ADIVINA EL NÚMERO (1-100) ===");
        System.out.println("Tienes " + MAX + " intentos. Los números fuera de rango no cuentan.");

        int intentos = 0;                          // contador: cuántos intentos válidos llevas
        boolean acertado = false;                  // bandera: ¿ya lo has adivinado?
        while (intentos < MAX && !acertado) {      // sigue mientras queden intentos Y no hayas acertado
            System.out.print("Intento " + (intentos + 1) + ": ");
            int n = sc.nextInt();
            if (n < 1 || n > 100) {
                System.out.println("Fuera de rango: no cuenta.");
                continue;                          // vuelve a la condición sin sumar el intento
            }
            intentos++;                            // solo llegan aquí los intentos válidos
            if (n == secreto) {
                acertado = true;                   // la condición del while será falsa en la próxima comprobación
            } else if (n < secreto) {
                System.out.println("Más alto.");
            } else {
                System.out.println("Más bajo.");
            }
        }

        // Al salir del while hay dos motivos posibles: la bandera dice cuál fue
        if (acertado) {
            String nivel = intentos <= 3 ? "¡Crack!" : (intentos <= 5 ? "Bien jugado." : "Por los pelos.");
            System.out.println("Era el " + secreto + ". Lo has adivinado en " + intentos + " intentos. " + nivel);
        } else {
            System.out.println("Sin intentos. Era el " + secreto + ".");
        }
        sc.close();
    }
}
