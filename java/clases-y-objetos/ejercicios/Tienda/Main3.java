/*
 * Solución del nivel 3: una Tienda con varios productos
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public class Main3 {
    public static void main(String[] args) {
        Tienda centro = new Tienda("Centro", 3);
        Tienda playa = new Tienda("Playa", 2);
        centro.agregar(new Producto("Café", 3.5, 10));
        centro.agregar(new Producto("Té", 2.0, 5));
        System.out.println(centro.agregar(new Producto("café", 9, 1)));    // repetido
        centro.agregar(new Producto("Galletas", 1.8, 2));
        System.out.println(centro.agregar(new Producto("Leche", 1.1, 6))); // llena
        playa.agregar(new Producto("Helado", 2.5, 8));

        System.out.println(centro.vender("té", 5) + " " + centro.vender("Galletas", 3) + " " + playa.vender("Helado", 2));
        System.out.printf("Inventario %s: %.2f € · agotados: %d%n", centro.getNombre(), centro.valorInventario(), centro.agotados());
        System.out.println("Ventas totales: " + Tienda.getVentasTotales());
    }
}
