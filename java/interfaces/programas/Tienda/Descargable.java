// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Descargable implements Vendible {     // digital: no es Enviable

    private final String titulo;
    private final double precio;

    public Descargable(String titulo, double precio) {
        this.titulo = titulo;
        this.precio = precio;
    }

    @Override
    public String nombre() { return titulo; }

    @Override
    public double precio() { return precio; }
}
