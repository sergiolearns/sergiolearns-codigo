/*
 * Solución Ejercicio 3
 * Del artículo «Variables en Java — ejercicios para dominar tipos, casting y Strings»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */

import java.util.Scanner;

public class GestionTienda {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== GESTIÓN DE TIENDA ===");
        System.out.println();

        // Arrays para los tres productos — mismo índice = mismo producto
        // Declaramos el tamaño fijo porque sabemos que son 3 productos
        int numProductos = 3;
        String[] nombres = new String[numProductos];
        double[] precios = new double[numProductos];
        int[]    stocks  = new int[numProductos];

        // Recogemos los datos de cada producto con un bucle
        // i va de 0 a 2 — los arrays en Java empiezan en 0, no en 1
        for (int i = 0; i < numProductos; i++) {
            System.out.printf("--- Producto %d ---%n", i + 1); // mostramos 1,2,3 al usuario
            System.out.print("Nombre: ");
            nombres[i] = sc.nextLine();

            System.out.print("Precio base (€): ");
            precios[i] = sc.nextDouble();
            sc.nextLine(); // limpiamos el \n — ya sabes por qué

            System.out.print("Stock: ");
            stocks[i] = sc.nextInt();
            sc.nextLine(); // otro \n sobrante
            System.out.println();
        }

        // Calculamos el IVA y el valor de inventario de cada producto
        double IVA = 0.21;
        double[] preciosConIVA    = new double[numProductos];
        double[] valorInventario  = new double[numProductos];
        double   totalInventario  = 0;

        for (int i = 0; i < numProductos; i++) {
            preciosConIVA[i]   = precios[i] * (1 + IVA);
            // stocks[i] es int, precios[i] es double
            // la multiplicación int*double da double automáticamente — widening
            valorInventario[i] = precios[i] * stocks[i];
            totalInventario   += valorInventario[i];
        }

        // Buscamos el más caro y el más barato
        // Estrategia: empezamos asumiendo que el primero es el extremo
        // y recorremos los demás para ver si hay alguno mayor/menor
        int indiceMasCaro   = 0;
        int indiceMasBarato = 0;
        for (int i = 1; i < numProductos; i++) {
            if (precios[i] > precios[indiceMasCaro]) {
                indiceMasCaro = i;   // encontramos uno más caro
            }
            if (precios[i] < precios[indiceMasBarato]) {
                indiceMasBarato = i; // encontramos uno más barato
            }
        }

        // Mostramos el informe formateado
        System.out.println("╔═══════════════════════════════════════════════╗");
        System.out.println("║              INFORME DE INVENTARIO            ║");
        System.out.println("╠═══════════════╦═══════════╦════════╦══════════╣");
        System.out.println("║ Producto      ║ Base      ║ +IVA   ║ Stock    ║");
        System.out.println("╠═══════════════╬═══════════╬════════╬══════════╣");

        for (int i = 0; i < numProductos; i++) {
            // %-13s alinea a la izquierda con 13 chars — los nombres quedan alineados
            System.out.printf("║ %-13s ║ %7.2f € ║%6.2f€║ %8d ║%n",
                nombres[i], precios[i], preciosConIVA[i], stocks[i]);
        }

        System.out.println("╠═══════════════╩═══════════╩════════╩══════════╣");
        System.out.printf( "║ Valor total inventario:       %12.2f €   ║%n",
                           totalInventario);
        System.out.printf( "║ Producto más caro (sin IVA):  %-14s ║%n",
                           nombres[indiceMasCaro]);
        System.out.printf( "║ Producto más barato (sin IVA):%-14s ║%n",
                           nombres[indiceMasBarato]);
        System.out.println("╚═══════════════════════════════════════════════╝");

        sc.close();
    }
}
