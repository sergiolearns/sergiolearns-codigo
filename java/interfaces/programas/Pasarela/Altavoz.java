// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Altavoz implements Encendible, Reproducible {

    private boolean encendido;
    private String pista;

    @Override
    public String nombre() { return "Altavoz"; }

    @Override
    public void encender() { encendido = true; }

    @Override
    public void apagar() {
        encendido = false;
        pista = null;
    }

    @Override
    public boolean estaEncendido() { return encendido; }

    @Override
    public void reproducir(String pista) {
        if (encendido) {
            this.pista = pista;
        }
    }

    @Override
    public String pistaActual() { return pista; }

    // Las dos interfaces tienen un default estado(): hay que decidir cómo combinarlos
    @Override
    public String estado() {
        return Encendible.super.estado() + ", " + Reproducible.super.estado();
    }
}
