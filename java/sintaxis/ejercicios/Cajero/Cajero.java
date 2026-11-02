/*
 * Solución del ejercicio 3: el tique del cajero automático
 * Del artículo «Sintaxis de Java ejercicios — el conversor, el informe de notas y el tique del cajero, alineados al milímetro (con soluciones y chuletario)»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */
/** Desafío: el tique de un cajero automático, con importes fijos (sin if ni bucles). */
public class Cajero {
    public static void main(String[] args) {
        System.out.println("+---------------------------------+");
        System.out.println("|      CAJERO DE LA FACULTAD      |");
        System.out.println("+---------------------------------+");
        System.out.printf("| %-18s %10.2f € |%n", "Saldo inicial", 1000.0);
        System.out.printf("| %-18s %+10.2f € |%n", "Ingreso", 250.0);     // %+ pone siempre el signo
        System.out.printf("| %-18s %+10.2f € |%n", "Retirada", -400.0);
        System.out.printf("| %-18s %+10.2f € |%n", "Comisión", -1.5);
        System.out.println("+---------------------------------+");
        System.out.printf("| %-18s %10.2f € |%n", "Saldo final", 1000.0 + 250.0 - 400.0 - 1.5);
        System.out.println("+---------------------------------+");
        System.out.println("Operaciones: " + 3 + " | Ref. \"FP2-" + 2026 + "\"");
    }
}
