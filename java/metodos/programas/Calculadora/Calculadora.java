/*
 * Métodos en java práctica — Programa 1:  Calculadora con métodos
 * Del artículo «Métodos en Java — práctica: tres programas que crecen a base de trocitos»
 * https://sergiolearns.com/metodos-en-java-practica/
 */

import java.util.Scanner;

public class Calculadora {

    // ---------- Las cuatro operaciones ----------
    // public: son la "cara visible" de la calculadora.
    // static: por ahora, "así se hace" (lo veremos con clases).
    // double + double → double: reciben dos decimales y devuelven uno.

    public static double sumar(double a, double b) {
        return a + b;    // el return envía el resultado a quien llamó al método
    }

    public static double restar(double a, double b) {
        return a - b;
    }

    public static double multiplicar(double a, double b) {
        return a * b;
    }

    public static double dividir(double a, double b) {
        return a / b;    // ojo: con double, dividir entre 0 NO da error, da "Infinity"
    }

    // ---------- Cómo se muestra ----------
    // private: solo se usa dentro de esta clase, es un detalle interno.
    // void: hace algo (imprime) pero no devuelve nada.
    private static void mostrarResultado(String operacion, double resultado) {
        // %.2f = dos decimales; %n = salto de línea. El formato vive AQUÍ, en un solo sitio
        System.out.printf("%s = %.2f%n", operacion, resultado);
    }

    // Sobrecarga: mismo nombre, pero con UN solo parámetro sirve para mostrar avisos.
    // Java elige la versión mirando cuántos argumentos (y de qué tipo) le pasas.
    private static void mostrarResultado(String aviso) {
        System.out.println("✗ " + aviso);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CALCULADORA ===");
        System.out.print("Primer número: ");
        double a = sc.nextDouble();
        System.out.print("Segundo número: ");
        double b = sc.nextDouble();

        System.out.println();
        // Fíjate en lo corto que queda main: solo llama a métodos con nombres claros
        mostrarResultado(a + " + " + b, sumar(a, b));
        mostrarResultado(a + " - " + b, restar(a, b));
        mostrarResultado(a + " * " + b, multiplicar(a, b));

        // Validamos ANTES de llamar a dividir, igual que en control de flujo
        if (b == 0) {
            mostrarResultado("No se puede dividir entre 0");    // versión de 1 parámetro
        } else {
            mostrarResultado(a + " / " + b, dividir(a, b));     // versión de 2 parámetros
        }

        sc.close();
    }
}
