// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public interface Pagable {

    boolean pagar(double importe);
    String nombre();

    // Por defecto no hay comisión; quien la cobre, la sobrescribe
    default double comision(double importe) {
        return 0;
    }
}
