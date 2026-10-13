/*
 * Solución Ejercicio 3
 * Del artículo «Control de flujo en Java — ejercicios con validaciones, menús y bucles»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */

import java.util.Scanner;

public class CajeroPIN {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        final String pinCorrecto = "4321";
        double saldo = 500.0;

        System.out.println("=== CAJERO AUTOMÁTICO ===");
        System.out.println();

        int intentos = 3;
        boolean acceso = false;

        // Seguimos pidiendo PIN mientras queden intentos Y no hayamos acertado
        while (intentos > 0 && !acceso) {
            System.out.print("Introduce tu PIN: ");
            String pin = sc.nextLine();

            if (pin.equals(pinCorrecto)) {
                acceso = true;
                System.out.println("✓ Acceso concedido");
            } else {
                intentos--;
                if (intentos > 0) {
                    System.out.printf("PIN incorrecto (%d intento%s restante%s)%n",
                                      intentos, intentos == 1 ? "" : "s", intentos == 1 ? "" : "s");
                }
            }
        }

        // Si salimos del while sin acceso, es porque se agotaron los intentos
        if (!acceso) {
            System.out.println("✗ Tarjeta bloqueada — demasiados intentos fallidos");
            sc.close();
            return;    // termina el programa — nunca llega al menú
        }

        int opcion;
        do {
            System.out.println("\n--- Menú ---");
            System.out.println("1. Consultar saldo");
            System.out.println("2. Ingresar dinero");
            System.out.println("3. Retirar dinero");
            System.out.println("4. Salir");
            System.out.print("Opción: ");
            opcion = sc.nextInt();

            switch (opcion) {
                case 1:
                    System.out.printf("Saldo actual: %.2f €%n", saldo);
                    break;

                case 2:
                    System.out.print("Cantidad a ingresar: ");
                    double ingreso = sc.nextDouble();
                    saldo += ingreso;
                    System.out.printf("✓ Ingreso realizado. Saldo: %.2f €%n", saldo);
                    break;

                case 3:
                    System.out.print("Cantidad a retirar: ");
                    double retiro = sc.nextDouble();
                    if (retiro > saldo) {
                        System.out.printf("✗ Saldo insuficiente (disponible: %.2f €)%n", saldo);
                    } else {
                        saldo -= retiro;
                        System.out.printf("✓ Retirada realizada. Saldo: %.2f €%n", saldo);
                    }
                    break;

                case 4:
                    System.out.println("Sesión finalizada");
                    break;

                default:
                    System.out.println("✗ Opción no válida");
            }
        } while (opcion != 4);

        sc.close();
    }
}
