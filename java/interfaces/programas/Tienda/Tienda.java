/*
 * El código
 * Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)»
 * https://sergiolearns.com/interfaces-en-java-practica/
 */

public class Tienda {

    public static void main(String[] args) {
        Carrito carrito = new Carrito();
        carrito.anadir(new Libro("Java para FP2", 24.90));
        carrito.anadir(new Camiseta("Camiseta SergioLearns", 20.00));
        carrito.anadir(new Descargable("Curso de Python", 15.00));

        carrito.ticket();

        // Se intenta con varios medios hasta que uno funcione
        Pagable[] medios = { new Tarjeta(50), new Bizum(100) };
        for (Pagable medio : medios) {
            if (carrito.pagar(medio)) {
                break;
            }
        }
    }
}
