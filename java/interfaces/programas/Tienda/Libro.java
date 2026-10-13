// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Libro implements Vendible, Enviable {

    private final String titulo;
    private final double precio;

    public Libro(String titulo, double precio) {
        this.titulo = titulo;
        this.precio = precio;
    }

    @Override
    public String nombre() { return titulo; }

    @Override
    public double precio() { return precio; }

    @Override
    public double gastosEnvio() { return 3.00; }
}
