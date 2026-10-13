/*
 * El código
 * Del artículo «Arrays en Java — práctica con una tienda, una matriz y las notas de clase (y cómo no estropear el original)»
 * https://sergiolearns.com/arrays-en-java-practica/
 */

public class Tienda {

    // Devuelve la posición del producto o -1 si no existe
    static int buscar(String[] productos, String nombre) {
        for (int i = 0; i < productos.length; i++) {
            if (productos[i].equals(nombre)) {   // equals, no ==: son String
                return i;
            }
        }
        return -1;                               // -1 nunca es una posición válida
    }

    // Intenta vender. Devuelve true si la venta se hizo.
    static boolean vender(String[] productos, int[] stock, String nombre, int unidades) {
        int pos = buscar(productos, nombre);
        if (pos == -1) {
            System.out.println("  No existe el producto: " + nombre);
            return false;
        }
        if (stock[pos] < unidades) {
            System.out.println("  Stock insuficiente de " + nombre + ": quedan " + stock[pos]);
            return false;
        }
        stock[pos] -= unidades;                  // modifica el array original: no hace falta devolverlo
        return true;
    }

    // Suma precio * unidades de cada producto
    static double valorInventario(double[] precios, int[] stock) {
        double total = 0;
        for (int i = 0; i < precios.length; i++) {
            total += precios[i] * stock[i];
        }
        return total;
    }

    static void listar(String[] productos, double[] precios, int[] stock) {
        for (int i = 0; i < productos.length; i++) {
            System.out.printf("  %-10s %6.2f €  %3d uds%n", productos[i], precios[i], stock[i]);
        }
    }

    static void mostrarAgotados(String[] productos, int[] stock) {
        boolean hayAgotados = false;
        for (int i = 0; i < stock.length; i++) {
            if (stock[i] == 0) {
                System.out.println("  Agotado: " + productos[i]);
                hayAgotados = true;
            }
        }
        if (!hayAgotados) {
            System.out.println("  No hay productos agotados");
        }
    }

    public static void main(String[] args) {
        // Arrays paralelos: la posición i describe el mismo producto en los tres
        String[] productos = {"Cuaderno", "Boli", "Mochila", "Regla", "Carpeta"};
        double[] precios   = {2.50, 0.90, 24.00, 1.20, 3.75};
        int[] stock        = {10, 50, 3, 0, 8};

        System.out.println("Inventario inicial:");
        listar(productos, precios, stock);
        System.out.printf("Valor total: %.2f €%n%n", valorInventario(precios, stock));

        System.out.println("Ventas:");
        vender(productos, stock, "Mochila", 2);
        vender(productos, stock, "Mochila", 2);
        vender(productos, stock, "Compás", 1);
        vender(productos, stock, "Cuaderno", 10);

        System.out.println("\nInventario final:");
        listar(productos, precios, stock);
        System.out.printf("Valor total: %.2f €%n", valorInventario(precios, stock));
        mostrarAgotados(productos, stock);
    }
}
