// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Linterna implements Encendible {        // solo se enciende y se apaga

    private boolean encendida;

    @Override
    public String nombre() { return "Linterna"; }

    @Override
    public void encender() { encendida = true; }

    @Override
    public void apagar() { encendida = false; }

    @Override
    public boolean estaEncendido() { return encendida; }
}
