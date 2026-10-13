/*
 * El código
 * Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)»
 * https://sergiolearns.com/interfaces-en-java-practica/
 */

public class Mando {

    private final Encendible[] dispositivos;

    public Mando(Encendible[] dispositivos) {
        this.dispositivos = dispositivos;
    }

    public void encenderTodo() {
        for (Encendible d : dispositivos) {
            d.encender();
        }
    }

    public void apagarTodo() {
        for (Encendible d : dispositivos) {
            d.apagar();
        }
    }

    // Solo los que además son Conectable / Reproducible reciben la orden
    public void conectarTodo(String red) {
        for (Encendible d : dispositivos) {
            if (d instanceof Conectable c) {
                c.conectar(red);
            }
        }
    }

    public void sonar(String pista) {
        for (Encendible d : dispositivos) {
            if (d instanceof Reproducible r) {
                r.reproducir(pista);
            }
        }
    }

    public void mostrar() {
        for (Encendible d : dispositivos) {
            System.out.println("  " + d.nombre() + ": " + d.estado());
        }
    }

    public static void main(String[] args) {
        Mando mando = new Mando(new Encendible[] { new Linterna(), new Altavoz(), new Television() });

        System.out.println("Todo encendido, sin red:");
        mando.encenderTodo();
        mando.sonar("Bohemian Rhapsody");
        mando.mostrar();

        System.out.println("Con la red conectada:");
        mando.conectarTodo("WiFi-Casa");
        mando.sonar("Bohemian Rhapsody");
        mando.mostrar();

        System.out.println("Apagado:");
        mando.apagarTodo();
        mando.mostrar();
    }
}
