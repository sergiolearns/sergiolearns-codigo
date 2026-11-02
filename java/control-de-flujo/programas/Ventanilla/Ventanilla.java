/*
 * Programa 2: la ventanilla de secretaría con switch
 * Del artículo «Control de flujo en Java — práctica con un registro, la ventanilla de secretaría y un adivino de tres intentos (y las contraseñas que no coincidían aunque fueran iguales)»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */
import java.util.Scanner;

/**
 * Ventanilla de secretaría: un trámite por ejecución, con las tres formas de switch.
 * Precios y plazos inventados.
 */
public class Ventanilla {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        final int PLAZO = 18040;                   // cada plazo de la matrícula, en céntimos (180,40 €)

        System.out.println("=== VENTANILLA DE SECRETARÍA ===");
        System.out.println("1. Pedir un certificado");
        System.out.println("2. Cambiar de grupo");
        System.out.println("3. Ver lo que queda por pagar");
        System.out.println("0. Salir");
        System.out.print("Trámite: ");
        int tramite = sc.nextInt();
        sc.nextLine();                             // fuera el Intro: después se leen líneas

        // switch con flechas (Java 14+): cada caso hace lo suyo y no cae en el siguiente
        switch (tramite) {
            case 1 -> {
                System.out.print("Formato (digital/papel/urgente): ");
                String formato = sc.nextLine().trim().toLowerCase();
                // switch como EXPRESIÓN: cada caso devuelve un precio y el resultado se guarda
                double precio = switch (formato) {
                    case "digital" -> 0.0;
                    case "papel" -> 6.50;
                    case "urgente" -> 12.75;
                    default -> -1;                 // marca de «formato desconocido»
                };
                if (precio < 0) {
                    System.out.println("Formato desconocido: " + formato);
                } else if (precio == 0) {
                    System.out.println("Certificado digital: gratis, te llega al correo.");
                } else {
                    System.out.printf("Certificado en %s: %.2f €%n", formato, precio);
                }
            }
            case 2 -> {
                System.out.print("Grupo actual (mañana/tarde): ");
                String actual = sc.nextLine().trim().toLowerCase();
                System.out.print("¿Trabajas? (s/n): ");
                boolean trabaja = sc.nextLine().trim().equalsIgnoreCase("s");
                System.out.print("Nota media: ");
                double media = sc.nextDouble();    // en un equipo en español, con coma: 7,4
                // Primero se descarta lo imposible; después, la norma: trabajar O tener un 7 de media
                if (!actual.equals("mañana") && !actual.equals("tarde")) {
                    System.out.println("Grupo no válido: " + actual);
                } else if (trabaja || media >= 7) {
                    String nuevo = actual.equals("mañana") ? "tarde" : "mañana";
                    System.out.println("Cambio concedido: pasas al grupo de " + nuevo + ".");
                } else {
                    System.out.println("Cambio denegado: hay que trabajar o tener un 7 de media.");
                }
            }
            case 3 -> {
                System.out.print("Plazos pagados (0-4): ");
                int pagados = sc.nextInt();
                int pendiente = 0;
                // switch clásico SIN break a propósito: desde el caso de entrada, cada plazo suma el siguiente
                switch (pagados) {
                    case 0:
                        pendiente += PLAZO;        // falta el plazo 1...
                    case 1:
                        pendiente += PLAZO;        // ...el 2...
                    case 2:
                        pendiente += PLAZO;        // ...el 3...
                    case 3:
                        pendiente += PLAZO;        // ...y el 4
                        break;                     // aquí sí: que no siga hasta el default
                    case 4:
                        break;                     // todo pagado: pendiente sigue en 0
                    default:
                        pendiente = -1;            // dato imposible
                }
                if (pendiente < 0) {
                    System.out.println("Dato no válido: la matrícula tiene 4 plazos.");
                } else if (pendiente == 0) {
                    System.out.println("Matrícula pagada. Nada pendiente.");
                } else {
                    System.out.printf("Te quedan %d plazos: %.2f €%n", 4 - pagados, pendiente / 100.0);
                }
            }
            case 0 -> System.out.println("Hasta luego.");
            default -> System.out.println("Trámite no válido: " + tramite);
        }
        sc.close();
    }
}
