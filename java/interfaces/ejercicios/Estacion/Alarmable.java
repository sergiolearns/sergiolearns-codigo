// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Alarmable extends Sensor {
    double umbral();

    default boolean enAlarma() {
        return leer() > umbral();
    }

    @Override
    default String resumen() {
        return Sensor.super.resumen() + ", alarma > " + Sensor.formato(umbral(), unidad());
    }
}
