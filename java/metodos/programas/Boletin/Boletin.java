/*
 * Programa 3: boletín del cuatrimestre
 * Del artículo «Métodos en Java — práctica con la calculadora de Laura, su contraseña del campus y su boletín (y el formato que cambié en tres sitios de cuatro)»
 * https://sergiolearns.com/metodos-en-java-practica/
 */
import java.util.Scanner;

public class Boletin {

    // Recibe el Scanner ya creado (no crea otro) y el nombre de la asignatura.
    // Devuelve la nota SOLO cuando es válida: el do-while no la deja salir antes.
    private static double leerNota(Scanner sc, String asignatura) {
        double nota;
        do {
            System.out.print("Nota de " + asignatura + ": ");
            nota = sc.nextDouble();
            if (nota < 0 || nota > 10) {
                System.out.println("  La nota va de 0 a 10. Otra vez.");
            }
        } while (nota < 0 || nota > 10);
        return nota;
    }

    // Recibe un número y devuelve un texto. Varios return: uno por camino.
    private static String clasificar(double nota) {
        if (nota >= 9) {
            return "Sobresaliente";
        } else if (nota >= 7) {
            return "Notable";
        } else if (nota >= 5) {
            return "Aprobado";
        }
        return "Suspenso";
    }

    // Tres parámetros y no un array: los arrays llegan en el tema siguiente
    private static double media(double a, double b, double c) {
        return (a + b + c) / 3;
    }

    // void: pinta una fila del boletín. Usa a clasificar para la última columna.
    private static void imprimirLinea(String asignatura, double nota) {
        // %-6s: texto a la izquierda en 6 huecos; %5.2f: número en 5 huecos con 2 decimales
        System.out.printf("%-6s %5.2f  %s%n", asignatura, nota, clasificar(nota));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);    // UN Scanner para todo el programa

        System.out.println("=== BOLETÍN DE LAURA ===");
        double fp1 = leerNota(sc, "FP1");
        double fp2 = leerNota(sc, "FP2");
        double ic2 = leerNota(sc, "IC2");
        System.out.println();

        System.out.println("--- Boletín ---");
        imprimirLinea("FP1", fp1);
        imprimirLinea("FP2", fp2);
        imprimirLinea("IC2", ic2);
        System.out.println("---------------");
        double m = media(fp1, fp2, ic2);
        System.out.printf("Media: %.2f (%s)%n", m, clasificar(m));    // clasificar sirve también para la media

        sc.close();    // se cierra donde se creó, al final
    }
}
