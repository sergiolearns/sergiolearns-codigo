/*
 * Solución del ejercicio 2: menú de biblioteca
 * Del artículo «Control de flujo en Java — ejercicios con la nota de acceso, la biblioteca y un cajero de tres intentos (y el 9,5 que salía «Suficiente»)»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Biblioteca de la facultad: una operación por ejecución (préstamo, devolución o normas), sin arrays.
 * Plazos, límites y multas inventados.
 */
public class Biblioteca {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== BIBLIOTECA DE LA FACULTAD ===");
        System.out.println("1. Pedir un préstamo");
        System.out.println("2. Devolver un libro");
        System.out.println("3. Ver las normas");
        System.out.print("Opción: ");
        int opcion = sc.nextInt();
        sc.nextLine();                             // fuera el Intro antes de leer textos

        switch (opcion) {
            case 1: {                              // llaves propias: «tipo» también se declara en el caso 2
                System.out.print("Tipo de socio (estudiante/pdi/visitante): ");
                String tipo = sc.nextLine().trim().toLowerCase();
                System.out.print("Libros que ya tienes: ");
                int tiene = sc.nextInt();
                sc.nextLine();
                System.out.print("Título: ");
                String titulo = sc.nextLine().trim();

                int dias;                          // días de préstamo
                int maximo;                        // libros a la vez
                switch (tipo) {                    // switch con String: compara con equals(), no con ==
                    case "estudiante":
                        dias = 15;
                        maximo = 3;
                        break;
                    case "pdi":
                        dias = 30;
                        maximo = 6;
                        break;
                    case "visitante":
                        dias = 7;
                        maximo = 1;
                        break;
                    default:
                        dias = 0;                  // marca de «tipo desconocido»
                        maximo = 0;
                }

                if (dias == 0) {
                    System.out.println("Tipo de socio desconocido: " + tipo);
                } else if (titulo.isEmpty()) {
                    System.out.println("Falta el título.");
                } else if (tiene >= maximo) {
                    System.out.println("No puedes llevarte más: ya tienes " + tiene + " de " + maximo + ".");
                } else {
                    System.out.printf("Préstamo hecho: «%s» durante %d días (%d de %d libros).%n",
                            titulo, dias, tiene + 1, maximo);
                }
                break;
            }
            case 2: {
                System.out.print("Tipo de socio (estudiante/pdi/visitante): ");
                String tipo = sc.nextLine().trim().toLowerCase();
                System.out.print("Días de retraso: ");
                int retraso = sc.nextInt();

                if (retraso < 0) {
                    System.out.println("Dato no válido.");
                } else if (retraso == 0) {
                    System.out.println("Devuelto a tiempo. Gracias.");
                } else if (tipo.equals("pdi")) {
                    System.out.println("Devuelto con " + retraso + " días de retraso: el PDI no paga multa.");
                } else {
                    double multa = retraso * 0.20;     // 20 céntimos por día...
                    if (multa > 5) {
                        multa = 5;                     // ...con un máximo de 5 €
                    }
                    System.out.printf("Multa: %.2f € (0,20 € por día, como mucho 5 €).%n", multa);
                }
                break;
            }
            case 3:
                System.out.println("Estudiantes: 3 libros, 15 días.");
                System.out.println("PDI: 6 libros, 30 días.");
                System.out.println("Visitantes: 1 libro, 7 días.");
                System.out.println("Retraso: 0,20 € por día, como mucho 5 € (el PDI no paga).");
                break;
            default:
                System.out.println("Opción no válida: " + opcion);
        }
        sc.close();
    }
}
