// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public interface Reproducible {

    void reproducir(String pista);
    String pistaActual();                            // null si no suena nada

    default String estado() {
        return pistaActual() == null ? "en silencio" : "sonando \"" + pistaActual() + "\"";
    }
}
