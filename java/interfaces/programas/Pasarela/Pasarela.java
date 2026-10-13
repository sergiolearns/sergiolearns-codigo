/*
 * El código
 * Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)»
 * https://sergiolearns.com/interfaces-en-java-practica/
 */

public class Pasarela {

    // Prueba los medios EN ORDEN y devuelve el primero que consiga cobrar (o null)
    static Pagable cobrar(Pagable[] medios, double importe) {
        for (Pagable medio : medios) {
            double total = importe + medio.comision(importe);
            if (medio.pagar(importe)) {
                System.out.printf("  %s: cobrado %.2f €%n", medio.nombre(), total);
                return medio;
            }
            System.out.printf("  %s: rechazado%n", medio.nombre());
        }
        return null;
    }

    public static void main(String[] args) {
        Pagable[] medios = { new Bizum(60), new Tarjeta(150), new Efectivo(25) };
        double[] compras = { 45, 120, 300 };

        for (int i = 0; i < compras.length; i++) {
            System.out.printf("Compra %d: %.2f €%n", i + 1, compras[i]);
            Pagable usado = cobrar(medios, compras[i]);
            if (usado == null) {
                System.out.println("  No se ha podido cobrar");
            }
        }
    }
}
