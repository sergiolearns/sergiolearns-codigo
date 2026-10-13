// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Sensor {
    String id();
    String unidad();
    double leer();

    static String formato(double valor, String unidad) {   // se llama como Sensor.formato(...)
        return String.format("%.1f %s", valor, unidad);
    }

    default String resumen() {
        return id() + " (" + unidad() + ")";
    }
}
