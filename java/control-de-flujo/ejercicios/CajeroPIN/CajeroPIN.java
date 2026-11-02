/*
 * Solución del ejercicio 3: cajero automático con PIN
 * Del artículo «Control de flujo en Java — ejercicios con la nota de acceso, la biblioteca y un cajero de tres intentos (y el 9,5 que salía «Suficiente»)»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */
import java.util.Scanner;

/**
 * Cajero automático: PIN con 3 intentos SIN bucle (un if dentro de otro) y una operación con switch.
 * Se leen siempre líneas (nextLine + parseInt): así no hay trampa del buffer.
 */
public class CajeroPIN {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        final String PIN = "4321";                 // String y no int: un PIN como 0420 perdería el cero
        final int LIMITE = 600;                    // euros por operación
        double saldo = 500.0;
        int intentos = 3;

        System.out.println("=== CAJERO AUTOMÁTICO ===");
        System.out.print("PIN: ");
        String pin = sc.nextLine().trim();
        if (!pin.equals(PIN)) {                    // fallo 1
            intentos--;
            System.out.println("PIN incorrecto (" + intentos + " intentos restantes)");
            System.out.print("PIN: ");
            pin = sc.nextLine().trim();
            if (!pin.equals(PIN)) {                // fallo 2
                intentos--;
                System.out.println("PIN incorrecto (" + intentos + " intento restante)");
                System.out.print("PIN: ");
                pin = sc.nextLine().trim();
                if (!pin.equals(PIN)) {            // fallo 3: se acabó
                    System.out.println("Tarjeta bloqueada. Llama a tu banco.");
                    return;                        // sin esto, el programa seguiría hasta el menú
                }
            }
        }
        // Si llegamos aquí es porque algún intento acertó
        System.out.println("PIN correcto.");
        System.out.println();
        System.out.println("1. Consultar saldo");
        System.out.println("2. Sacar dinero");
        System.out.println("3. Ingresar dinero");
        System.out.print("Operación: ");
        int op = Integer.parseInt(sc.nextLine().trim());

        switch (op) {
            case 1 -> System.out.printf("Saldo: %.2f €%n", saldo);
            case 2 -> {
                System.out.print("Cantidad (múltiplo de 10): ");
                int cantidad = Integer.parseInt(sc.nextLine().trim());
                // De lo más general a lo más concreto: formato, límite del cajero y, por último, el saldo
                if (cantidad <= 0 || cantidad % 10 != 0) {
                    System.out.println("Cantidad no válida: el cajero solo da billetes de 10, 20 y 50.");
                } else if (cantidad > LIMITE) {
                    System.out.println("Supera el límite por operación (" + LIMITE + " €).");
                } else if (cantidad > saldo) {
                    System.out.printf("Saldo insuficiente: tienes %.2f €.%n", saldo);
                } else {
                    saldo -= cantidad;
                    System.out.printf("Retira %d €. Saldo: %.2f €%n", cantidad, saldo);
                }
            }
            case 3 -> {
                System.out.print("Cantidad a ingresar: ");
                int cantidad = Integer.parseInt(sc.nextLine().trim());
                if (cantidad > 0 && cantidad <= 1000) {
                    saldo += cantidad;
                    System.out.printf("Ingreso hecho. Saldo: %.2f €%n", saldo);
                } else {
                    System.out.println("Cantidad no válida (de 1 a 1000 € por ingreso).");
                }
            }
            default -> System.out.println("Operación no válida.");
        }
        sc.close();
    }
}
