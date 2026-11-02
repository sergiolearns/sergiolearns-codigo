/*
 * Solución del ejercicio 1: validador de nota de acceso
 * Del artículo «Control de flujo en Java — ejercicios con la nota de acceso, la biblioteca y un cajero de tres intentos (y el 9,5 que salía «Suficiente»)»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Nota de acceso a la universidad (0-14): validar el rango ANTES de calcular y clasificar
 * con else if de mayor a menor. Nota de corte inventada.
 */
public class ValidadorNota {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        final double CORTE = 10.5;                 // nota de corte de GCID (inventada)

        System.out.println("=== VALIDADOR DE NOTA DE ACCESO ===");
        System.out.print("Nota de acceso (0-14): ");
        double nota = sc.nextDouble();             // equipo en español: se teclea con coma (11,8)

        // 1. Validar primero: si el dato no tiene sentido, se corta aquí y no se calcula nada más
        if (nota < 0 || nota > 14) {
            System.out.println("Dato no válido: la nota de acceso va de 0 a 14.");
            return;
        }

        // 2. Clasificar de MAYOR a menor: la primera condición verdadera gana y las demás ni se miran.
        //    Por eso basta con «nota >= 9» y no hace falta «nota >= 9 && nota < 11».
        String clase;
        if (nota >= 11) {
            clase = "Excelente";
        } else if (nota >= 9) {
            clase = "Muy bueno";
        } else if (nota >= 7) {
            clase = "Notable";
        } else if (nota >= 5) {
            clase = "Suficiente";
        } else {
            clase = "No apto";
        }
        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.println("Clasificación: " + clase);

        // 3. Margen sobre el corte: positivo si entra, negativo si le falta
        double margen = nota - CORTE;
        if (margen >= 0) {
            System.out.printf("Entras en GCID: %.2f por encima del corte (%.1f).%n", margen, CORTE);
        } else {
            System.out.printf("Te faltan %.2f para el corte (%.1f).%n", -margen, CORTE);
        }
        // println no usa el idioma del equipo: punto decimal y todos los decimales que tenga el double
        System.out.println("Margen sin redondear: " + margen);
        sc.close();
    }
}
