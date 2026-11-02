/*
 * Solución del ejercicio 2: informe de notas
 * Del artículo «Sintaxis de Java ejercicios — el conversor, el informe de notas y el tique del cajero, alineados al milímetro (con soluciones y chuletario)»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */
/** Ejercicio 2: informe de notas con columnas alineadas y la media calculada en el printf. */
public class InformeNotas {
    public static void main(String[] args) {
        System.out.println("=========================");
        System.out.printf("INFORME: %s%n", "Laura Santana");
        System.out.println("=========================");
        System.out.printf("%-15s %5.2f%n", "FP2", 8.5);
        System.out.printf("%-15s %5.2f%n", "IC2", 7.0);
        System.out.printf("%-15s %5.2f%n", "Álgebra", 4.5);
        System.out.printf("%-15s %5.2f%n", "Estadística", 6.0);
        System.out.printf("%-15s %5.2f%n", "Bases de datos", 9.0);
        System.out.println("-------------------------");
        System.out.printf("%-15s %5.2f%n", "Media", (8.5 + 7.0 + 4.5 + 6.0 + 9.0) / 5);
        System.out.printf("%-15s %5.1f%%%n", "Sobre 100", (8.5 + 7.0 + 4.5 + 6.0 + 9.0) / 5 * 10);
        System.out.println("Asignaturas: " + 5 + " | Créditos: " + 5 * 6);
        System.out.println("=========================");
    }
}
