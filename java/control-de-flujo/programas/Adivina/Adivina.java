/*
 * Programa 3: adivina el número con tres intentos (sin bucles)
 * Del artículo «Control de flujo en Java — práctica con un registro, la ventanilla de secretaría y un adivino de tres intentos (y las contraseñas que no coincidían aunque fueran iguales)»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */
import java.util.Random;
import java.util.Scanner;

/**
 * Adivina el número en 3 intentos, SIN bucles: el mismo bloque copiado tres veces.
 * Cuando acabes, cuenta las líneas repetidas: por eso existen los bucles.
 */
public class Adivina {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Semilla fija (42): el número secreto sale siempre igual, así se puede probar. Sin semilla, cambia cada vez.
        Random azar = new Random(42);
        int secreto = azar.nextInt(100) + 1;       // nextInt(100) da de 0 a 99; con +1, de 1 a 100

        System.out.println("=== ADIVINA EL NÚMERO (1-100) ===");
        System.out.println("Tienes 3 intentos.");

        // ---- Intento 1
        System.out.print("Intento 1: ");
        int n = sc.nextInt();
        if (n < 1 || n > 100) {
            System.out.println("Eso no está entre 1 y 100: pierdes el intento.");
        } else if (n == secreto) {
            System.out.println("¡A la primera! Era el " + secreto + ".");
            return;                                // return en main: el programa termina aquí
        } else if (n < secreto) {
            System.out.println("Más alto.");
        } else {
            System.out.println("Más bajo.");
        }

        // ---- Intento 2: el mismo bloque, otra vez
        System.out.print("Intento 2: ");
        n = sc.nextInt();
        if (n < 1 || n > 100) {
            System.out.println("Eso no está entre 1 y 100: pierdes el intento.");
        } else if (n == secreto) {
            System.out.println("¡A la segunda! Era el " + secreto + ".");
            return;
        } else if (n < secreto) {
            System.out.println("Más alto.");
        } else {
            System.out.println("Más bajo.");
        }

        // ---- Intento 3: el último ya no da pistas
        System.out.print("Intento 3: ");
        n = sc.nextInt();
        if (n == secreto) {
            System.out.println("¡Por los pelos! Era el " + secreto + ".");
        } else {
            System.out.println("Sin intentos. El número era el " + secreto + ".");
        }
        sc.close();
    }
}
