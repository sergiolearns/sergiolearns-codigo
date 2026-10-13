/*
 * Solución Ejercicio 3
 * Del artículo «Sintaxis de Java — ejercicios para escribir código que funciona a la primera»
 * https://sergiolearns.com/sintaxis-java-ejercicios/
 */

import java.util.Scanner;

public class Cajero {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CAJERO AUTOMÁTICO ===");
        System.out.println();

        System.out.print("Saldo inicial (€): ");
        double saldo = sc.nextDouble();
        sc.nextLine();

        double saldoInicial    = saldo;
        double totalDepositado = 0;
        double totalRetirado   = 0;
        int operaciones        = 3;

        for (int i = 1; i <= operaciones; i++) {
            System.out.printf("%n--- Operación %d ---%n", i);
            System.out.print("Tipo (D=depósito / R=retirada): ");
            String tipo = sc.next().toUpperCase();
            sc.nextLine();

            switch (tipo) {
                case "D":
                    System.out.print("Cantidad (€): ");
                    double deposito = sc.nextDouble();
                    sc.nextLine();
                    saldo += deposito;
                    totalDepositado += deposito;
                    System.out.println("✓ Depósito realizado");
                    break;

                case "R":
                    System.out.print("Cantidad (€): ");
                    double retirada = sc.nextDouble();
                    sc.nextLine();
                    if (retirada > saldo) {
                        System.out.printf(
                            "✗ Saldo insuficiente (disponible: %.2f €)%n", saldo);
                    } else {
                        saldo -= retirada;
                        totalRetirado += retirada;
                        System.out.println("✓ Retirada realizada");
                    }
                    break;

                default:
                    System.out.println("✗ Tipo no reconocido — use D o R");
                    i--;    // no contar esta operación
            }

            System.out.printf("Saldo actual: %.2f €%n", saldo);
        }

        // Resumen final
        System.out.println();
        System.out.println("==============================");
        System.out.println("RESUMEN DE OPERACIONES");
        System.out.println("==============================");
        System.out.printf("Saldo inicial:    %8.2f €%n", saldoInicial);
        System.out.printf("Total depositado: %8.2f €%n", totalDepositado);
        System.out.printf("Total retirado:   %8.2f €%n", totalRetirado);
        System.out.printf("Saldo final:      %8.2f €%n", saldo);
        System.out.printf("Operaciones:      %d%n", operaciones);
        System.out.println("==============================");

        sc.close();
    }
}
