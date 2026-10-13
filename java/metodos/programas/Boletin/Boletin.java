/*
 * Métodos en java práctica — Programa 3: Boletín del cuatrimestre
 * Del artículo «Métodos en Java — práctica: tres programas que crecen a base de trocitos»
 * https://sergiolearns.com/metodos-en-java-practica/
 */

import java.util.Scanner;

public class Boletin {

    // Recibe el Scanner ya creado (no crea uno nuevo) y el mensaje a mostrar.
    // Devuelve la nota, pero SOLO cuando es válida: el bucle no la deja escapar antes.
    private static double leerNota(Scanner sc, String mensaje) {
        double nota;
        do {
            System.out.print(mensaje);
            nota = sc.nextDouble();
            if (nota < 0 || nota > 10) {
                System.out.println("✗ La nota debe estar entre 0 y 10");
            }
        } while (nota < 0 || nota > 10);    // se repite mientras la nota NO sea válida
        return nota;
    }

    // Un array como parámetro: double[] notas. Devuelve la media como double.
    private static double calcularMedia(double[] notas) {
        double suma = 0;
        for (int i = 0; i < notas.length; i++) {    // length sirve para CUALQUIER tamaño
            suma += notas[i];
        }
        return suma / notas.length;
    }

    // Recibe un número, devuelve un texto. Varios return, uno por camino posible.
    private static String clasificar(double nota) {
        if (nota >= 9) {
            return "Sobresaliente";
        } else if (nota >= 7) {
            return "Notable";
        } else if (nota >= 5) {
            return "Aprobado";
        }
        return "Suspenso";    // si no entró en ningún if, llega aquí: todos los caminos devuelven algo
    }

    // void: pinta el boletín y no devuelve nada. Usa a calcularMedia y a clasificar.
    private static void imprimirBoletin(String[] asignaturas, double[] notas) {
        System.out.println("--- Boletín ---");
        for (int i = 0; i < asignaturas.length; i++) {
            // %-6s = texto alineado a la izquierda en 6 huecos; %5.2f = número en 5 huecos, 2 decimales
            System.out.printf("%-6s %5.2f  %s%n", asignaturas[i], notas[i], clasificar(notas[i]));
        }
        double media = calcularMedia(notas);    // aquí se llama a otro método
        System.out.println("---------------");
        System.out.printf("Media: %.2f (%s)%n", media, clasificar(media));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);    // UN solo Scanner para todo el programa

        String[] asignaturas = {"FP2", "IC2", "AEDV"};
        double[] notas = new double[asignaturas.length];    // mismo tamaño que las asignaturas

        System.out.println("=== BOLETÍN DEL CUATRIMESTRE ===");
        for (int i = 0; i < asignaturas.length; i++) {
            notas[i] = leerNota(sc, "Nota de " + asignaturas[i] + ": ");
        }

        System.out.println();
        imprimirBoletin(asignaturas, notas);

        sc.close();
    }
}
