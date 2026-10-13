// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public interface Conectable {

    void conectar(String red);
    String redActual();                              // null si no hay red
}
