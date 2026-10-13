/*
 * Control de flujo en Java práctica — Programa 3: Adivina el número con pistas
 * Del artículo «Control de flujo en Java — práctica con validador, menú y adivina el número»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */

import java.util.Scanner;
import java.util.Random;

public class AdivinaNumero {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();

        System.out.println("=== ADIVINA EL NÚMERO ===");
        System.out.println("He pensado un número entre 1 y 100");
        System.out.println();

        // nextInt(100) genera un número entre 0 y 99 — sumamos 1 para el rango 1-100
        int secreto = random.nextInt(100) + 1;
        int intentos = 0;
        int intento = -1;    // valor imposible para forzar la primera vuelta del while

        while (intento != secreto) {
            System.out.print("Tu intento: ");
            intento = sc.nextInt();
            intentos++;

            if (intento == secreto) {
                System.out.println("¡Lo has adivinado!");
            } else if (intento < secreto) {
                // Damos más o menos margen según la distancia real
                int diferencia = secreto - intento;
                System.out.println(diferencia > 15 ? "Mucho más alto" : "Un poco más alto");
            } else {
                int diferencia = intento - secreto;
                System.out.println(diferencia > 15 ? "Mucho más bajo" : "Un poco más bajo");
            }
        }

        // Clasificación según los intentos usados
        System.out.println();
        String clasificacion;
        switch (intentos <= 10 ? Math.min(intentos, 10) / 3 : 4) {
            case 0:
            case 1:
                clasificacion = "Sexto sentido";
                break;
            case 2:
                clasificacion = "Muy bien";
                break;
            case 3:
                clasificacion = "Correcto";
                break;
            default:
                clasificacion = "Al menos lo has conseguido";
        }

        System.out.printf("Acertaste en %d intentos — %s%n", intentos, clasificacion);

        sc.close();
    }
}
