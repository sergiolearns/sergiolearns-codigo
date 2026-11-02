/*
 * Solución del ejercicio 3: el inventario de la copistería
 * Del artículo «Variables en Java ejercicios — IMC, segundos y el inventario de la copistería (y el porcentaje que se quedaba en 100)»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */
/**
 * Desafío: inventario de tres productos de la copistería de la facultad (precios inventados, IGIC del 7 %).
 * Sin arrays ni if: tres juegos de variables, Math.max/Math.min y las cuentas en céntimos.
 */
public class Tienda {
    public static void main(String[] args) {
        final double IGIC = 0.07;                    // impuesto de Canarias, tipo general

        String nombre1 = "Portátil";  double precio1 = 899.99;  int stock1 = 5;
        String nombre2 = "Ratón";     double precio2 = 29.99;   int stock2 = 23;
        String nombre3 = "Teclado";   double precio3 = 79.99;   int stock3 = 12;

        // Valor del inventario con double: precio * stock y suma
        double valorDouble = precio1 * stock1 + precio2 * stock2 + precio3 * stock3;

        // Lo mismo en céntimos (long): enteros exactos
        long cent1 = Math.round(precio1 * 100);      // 89999
        long cent2 = Math.round(precio2 * 100);      // 2999
        long cent3 = Math.round(precio3 * 100);      // 7999
        long valorCent = cent1 * stock1 + cent2 * stock2 + cent3 * stock3;

        double masCaro = Math.max(precio1, Math.max(precio2, precio3));
        double masBarato = Math.min(precio1, Math.min(precio2, precio3));
        int unidades = stock1 + stock2 + stock3;

        System.out.println("INVENTARIO DE LA COPISTERÍA");
        System.out.printf("%-10s %9s %9s %6s%n", "Producto", "Base", "+IGIC", "Stock");
        System.out.printf("%-10s %9.2f %9.2f %6d%n", nombre1, precio1, precio1 * (1 + IGIC), stock1);
        System.out.printf("%-10s %9.2f %9.2f %6d%n", nombre2, precio2, precio2 * (1 + IGIC), stock2);
        System.out.printf("%-10s %9.2f %9.2f %6d%n", nombre3, precio3, precio3 * (1 + IGIC), stock3);
        System.out.println("Unidades: " + unidades);
        System.out.println("Valor con double (println): " + valorDouble);
        System.out.printf("Valor con double (printf):  %.2f €%n", valorDouble);
        System.out.println("Valor en céntimos: " + valorCent + " → " + valorCent / 100 + "," + valorCent % 100 + " €");
        System.out.println("Más caro: " + masCaro + " € | más barato: " + masBarato + " €");
        System.out.printf("Precio medio por unidad: %.2f €%n", (double) valorCent / unidades / 100);
    }
}
