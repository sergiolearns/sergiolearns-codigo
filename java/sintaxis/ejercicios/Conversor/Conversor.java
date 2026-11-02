/*
 * Solución del ejercicio 1: conversor de unidades
 * Del artículo «Sintaxis de Java ejercicios — el conversor, el informe de notas y el tique del cajero, alineados al milímetro (con soluciones y chuletario)»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */
/** Ejercicio 1: conversor de 5,5 km a otras unidades, alineado con printf. */
public class Conversor {
    public static void main(String[] args) {
        System.out.println("=== CONVERSOR DE DISTANCIAS ===");
        System.out.println("Distancia: 5.5 km");
        System.out.println();
        System.out.println("--- Conversiones ---");
        System.out.printf("Kilómetros:  %10.2f km%n", 5.5);
        System.out.printf("Metros:      %10.2f m%n", 5.5 * 1000);       // 1 km = 1000 m
        System.out.printf("Centímetros: %10.2f cm%n", 5.5 * 100000);    // 1 km = 100 000 cm
        System.out.printf("Millas:      %10.2f mi%n", 5.5 / 1.60934);   // 1 milla = 1,60934 km
        System.out.printf("Pies:        %10.2f ft%n", 5.5 * 3280.84);   // 1 km = 3280,84 pies
    }
}
