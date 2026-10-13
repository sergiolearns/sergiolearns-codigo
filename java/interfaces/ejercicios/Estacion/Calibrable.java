// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Calibrable extends Sensor {
    void calibrar(double offset);

    @Override
    default String resumen() {
        return Sensor.super.resumen() + ", calibrable";
    }
}
