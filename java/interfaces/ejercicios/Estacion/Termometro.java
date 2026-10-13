// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Termometro implements Calibrable, Alarmable {
    private final String id;
    private double lectura;
    private final double umbral;

    public Termometro(String id, double lectura, double umbral) {
        this.id = id;
        this.lectura = lectura;
        this.umbral = umbral;
    }

    @Override public String id() { return id; }
    @Override public String unidad() { return "°C"; }
    @Override public double leer() { return lectura; }
    @Override public double umbral() { return umbral; }
    @Override public void calibrar(double offset) { lectura += offset; }

    // Dos interfaces traen su propio resumen(): hay que decidir cuál manda
    @Override
    public String resumen() {
        return Alarmable.super.resumen() + ", calibrable";
    }
}
