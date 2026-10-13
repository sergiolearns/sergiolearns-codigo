// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Television implements Encendible, Reproducible, Conectable {

    private boolean encendida;
    private String pista;
    private String red;

    @Override
    public String nombre() { return "Televisión"; }

    @Override
    public void encender() { encendida = true; }

    @Override
    public void apagar() {
        encendida = false;
        pista = null;
    }

    @Override
    public boolean estaEncendido() { return encendida; }

    @Override
    public void conectar(String red) { this.red = red; }

    @Override
    public String redActual() { return red; }

    @Override
    public void reproducir(String pista) {
        if (encendida && red != null) {              // necesita estar encendida Y con red
            this.pista = pista;
        }
    }

    @Override
    public String pistaActual() { return pista; }

    @Override
    public String estado() {
        return Encendible.super.estado() + ", " + Reproducible.super.estado()
                + ", red: " + (red == null ? "sin conectar" : red);
    }
}
