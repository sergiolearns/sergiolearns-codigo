// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Presion implements Alarmable {
    private final String id;
    private final double lectura;
    private final double umbral;

    public Presion(String id, double lectura, double umbral) {
        this.id = id;
        this.lectura = lectura;
        this.umbral = umbral;
    }

    @Override public String id() { return id; }
    @Override public String unidad() { return "hPa"; }
    @Override public double leer() { return lectura; }
    @Override public double umbral() { return umbral; }
}
