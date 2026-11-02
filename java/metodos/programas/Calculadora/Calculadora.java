/*
 * Programa 1: calculadora con métodos
 * Del artículo «Métodos en Java — práctica con la calculadora de Laura, su contraseña del campus y su boletín (y el formato que cambié en tres sitios de cuatro)»
 * https://sergiolearns.com/metodos-en-java-practica/
 */
import java.util.Scanner;

public class Calculadora {

    // ---------- Las cuatro operaciones ----------
    // public: son la "cara visible" de la calculadora; otra clase podría usarlas.
    // double + double → double: reciben dos números y devuelven uno. No imprimen nada.

    public static double sumar(double a, double b) {
        return a + b;    // return manda el resultado de vuelta a quien llamó
    }

    public static double restar(double a, double b) {
        return a - b;
    }

    public static double multiplicar(double a, double b) {
        return a * b;
    }

    public static double dividir(double a, double b) {
        return a / b;    // con double, dividir entre 0 NO da error: da Infinity
    }

    // ---------- Cómo se muestra ----------
    // private: es un detalle de esta clase. void: imprime y no devuelve nada.
    // El formato (%.2f) vive AQUÍ: si cambia, se cambia en un solo sitio.
    private static void mostrarResultado(double a, String operador, double b, double resultado) {
        System.out.printf("%.2f %s %.2f = %.2f%n", a, operador, b, resultado);
    }

    // Sobrecarga: mismo nombre con UN solo parámetro, para los avisos.
    // Java elige la versión por el número (y el tipo) de argumentos.
    private static void mostrarResultado(String aviso) {
        System.out.println("Aviso: " + aviso);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CALCULADORA DE LAURA ===");
        System.out.print("Primer número: ");
        double a = sc.nextDouble();
        System.out.print("Segundo número: ");
        double b = sc.nextDouble();
        System.out.println();

        // main queda corto: solo llama a métodos con nombres que se entienden solos
        mostrarResultado(a, "+", b, sumar(a, b));
        mostrarResultado(a, "-", b, restar(a, b));
        mostrarResultado(a, "*", b, multiplicar(a, b));

        // La comprobación del 0 es nuestra: el lenguaje no la hace con double
        if (b == 0) {
            mostrarResultado("no se puede dividir entre 0");                  // versión de 1 parámetro
            System.out.println("(dividir habría devuelto " + dividir(a, b) + ")");
        } else {
            mostrarResultado(a, "/", b, dividir(a, b));                      // versión de 4 parámetros
        }

        sc.close();
    }
}
