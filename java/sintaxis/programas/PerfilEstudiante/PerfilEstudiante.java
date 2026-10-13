/*
 * Sintaxis Java práctica — Programa 2: Perfil de estudiante
 * Del artículo «Sintaxis de Java — 3 programas reales para perderle el miedo al punto y coma»
 * https://sergiolearns.com/sintaxis-java-practica/
 */

import java.util.Scanner;

public class PerfilEstudiante {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== REGISTRO DE ESTUDIANTE ===");
        System.out.println();

        // Datos personales
        System.out.print("Nombre completo: ");
        String nombre = sc.nextLine();

        System.out.print("Edad: ");
        int edad = sc.nextInt();
        sc.nextLine();    // consumir el salto de línea sobrante

        System.out.print("Grado: ");
        String grado = sc.nextLine();

        System.out.print("Nota media (0-10): ");
        double nota = sc.nextDouble();

        // Cálculos
        int anyoNacimiento = 2025 - edad;
        double notaSobre100 = nota * 10;
        String estado = (nota >= 5.0) ? "Aprobado" : "Suspenso";

        // Clasificación
        String clasificacion;
        if (nota >= 9.0)      clasificacion = "Sobresaliente";
        else if (nota >= 7.0) clasificacion = "Notable";
        else if (nota >= 5.0) clasificacion = "Aprobado";
        else                  clasificacion = "Suspenso";

        // Mostrar perfil formateado
        System.out.println();
        System.out.println("================================");
        System.out.println("       PERFIL DE ESTUDIANTE     ");
        System.out.println("================================");
        System.out.printf("Nombre:       %s%n", nombre);
        System.out.printf("Edad:         %d años (nacido en %d)%n", edad, anyoNacimiento);
        System.out.printf("Grado:        %s%n", grado);
        System.out.println("--------------------------------");
        System.out.printf("Nota:         %.2f / 10,00%n", nota);
        System.out.printf("Sobre 100:    %.1f%%%n", notaSobre100);
        System.out.printf("Clasificación:%s%n", clasificacion);
        System.out.printf("Estado:       %s%n", estado);
        System.out.println("================================");

        // Longitud del nombre
        System.out.printf("%nEl nombre tiene %d caracteres%n", nombre.length());
        System.out.printf("Primera letra: %c%n", nombre.charAt(0));
        System.out.printf("En mayúsculas: %s%n", nombre.toUpperCase());

        sc.close();
    }
}
