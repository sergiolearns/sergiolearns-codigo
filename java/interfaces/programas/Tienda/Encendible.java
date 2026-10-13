// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public interface Encendible {

    String nombre();
    void encender();
    void apagar();
    boolean estaEncendido();

    default String estado() {
        return estaEncendido() ? "encendido" : "apagado";
    }
}
