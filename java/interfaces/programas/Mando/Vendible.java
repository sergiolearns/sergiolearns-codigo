// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public interface Vendible {

    String nombre();
    double precio();

    // Por defecto se paga el precio completo; los productos con descuento lo sobrescriben
    default double precioFinal() {
        return precio();
    }
}
