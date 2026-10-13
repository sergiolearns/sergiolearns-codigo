// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Camiseta implements Vendible, Enviable {

    private final String modelo;
    private final double precio;

    public Camiseta(String modelo, double precio) {
        this.modelo = modelo;
        this.precio = precio;
    }

    @Override
    public String nombre() { return modelo; }

    @Override
    public double precio() { return precio; }

    @Override
    public double precioFinal() {                  // 10 % de descuento
        return precio * 0.90;
    }

    @Override
    public double gastosEnvio() { return 4.50; }
}
