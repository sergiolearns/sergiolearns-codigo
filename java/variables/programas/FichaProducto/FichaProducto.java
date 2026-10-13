/*
 * Variables en Java práctica — Programa 3: Ficha de producto con String
 * Del artículo «Variables en Java — práctica con los errores que todo el mundo comete»
 * https://sergiolearns.com/variables-en-java-practica/
 */

import java.util.Scanner;

public class FichaProducto {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== FICHA DE PRODUCTO ===");
        System.out.println();

        System.out.print("Nombre del producto: ");
        String nombre = sc.nextLine();

        System.out.print("Categoría (electronica/ropa/hogar): ");
        String categoria = sc.nextLine();

        System.out.print("Precio (€): ");
        double precio = sc.nextDouble();

        System.out.print("Stock disponible: ");
        int stock = sc.nextInt();
        sc.nextLine();

        System.out.print("Código de producto (ej. PROD-001): ");
        String codigo = sc.nextLine();

        // Cálculos con tipos
        double precioConIVA  = precio * 1.21;
        double precioOferta  = precio * 0.85;    // 15% descuento
        boolean disponible   = stock > 0;
        boolean bajoStock    = stock > 0 && stock < 5;

        // Operaciones con String
        String nombreMayus   = nombre.toUpperCase();
        String codigoLimpio  = codigo.trim().toUpperCase();
        int    longNombre    = nombre.length();
        char   primeraLetra  = nombre.charAt(0);
        String categoriaFmt  = categoria.trim().toLowerCase();

        // Clasificación por categoría
        String icono;
        if (categoriaFmt.equals("electronica")) {
            icono = "💻";
        } else if (categoriaFmt.equals("ropa")) {
            icono = "👕";
        } else if (categoriaFmt.equals("hogar")) {
            icono = "🏠";
        } else {
            icono = "📦";
        }

        // Mostrar ficha
        System.out.println();
        System.out.println("╔══════════════════════════════╗");
        System.out.printf( "║  %s %-24s║%n", icono, nombreMayus);
        System.out.println("╠══════════════════════════════╣");
        System.out.printf( "║  Código:    %-17s║%n", codigoLimpio);
        System.out.printf( "║  Categoría: %-17s║%n", categoriaFmt);
        System.out.printf( "║  Precio:    %8.2f €         ║%n", precio);
        System.out.printf( "║  Con IVA:   %8.2f €         ║%n", precioConIVA);
        System.out.printf( "║  Oferta:    %8.2f €         ║%n", precioOferta);
        System.out.printf( "║  Stock:     %-17d║%n", stock);
        System.out.println("╠══════════════════════════════╣");
        System.out.printf( "║  Disponible:  %-15s║%n", disponible ? "SÍ ✓" : "NO ✗");
        System.out.printf( "║  Bajo stock:  %-15s║%n", bajoStock ? "AVISO ⚠" : "---");
        System.out.println("╚══════════════════════════════╝");

        System.out.println();
        System.out.println("--- Análisis del nombre ---");
        System.out.printf("Original:      %s%n", nombre);
        System.out.printf("Mayúsculas:    %s%n", nombreMayus);
        System.out.printf("Longitud:      %d caracteres%n", longNombre);
        System.out.printf("Primera letra: %c%n", primeraLetra);

        // La trampa del ==
        System.out.println();
        System.out.println("--- La trampa del == con Strings ---");
        String cat1 = "electronica";
        String cat2 = categoria.trim().toLowerCase();
        System.out.printf("cat1 == cat2:      %b  ← puede fallar%n", cat1 == cat2);
        System.out.printf("cat1.equals(cat2): %b  ← siempre correcto%n",
                          cat1.equals(cat2));

        sc.close();
    }
}
