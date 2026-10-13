// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Humedad implements Sensor {
    private final String id;
    private final double lectura;

    public Humedad(String id, double lectura) {
        this.id = id;
        this.lectura = lectura;
    }

    @Override public String id() { return id; }
    @Override public String unidad() { return "%"; }
    @Override public double leer() { return lectura; }
}
