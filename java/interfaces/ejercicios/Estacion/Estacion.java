/*
 * Solución del Nivel 3
 * Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)»
 * https://sergiolearns.com/interfaces-en-java-ejercicios/
 */

public class Estacion {

    static void informe(Sensor[] sensores, String titulo) {
        System.out.println("=== " + titulo + " ===");
        int alarmas = 0;
        for (Sensor s : sensores) {
            String linea = s.resumen() + " -> " + Sensor.formato(s.leer(), s.unidad());
            if (s instanceof Alarmable a && a.enAlarma()) {   // ¿tiene la capacidad? ¿y está activada?
                linea += "  ⚠ ALARMA";
                alarmas++;
            }
            System.out.println(linea);
        }
        System.out.println("Alarmas: " + alarmas);
    }

    public static void main(String[] args) {
        Sensor[] sensores = {
            new Termometro("T1", 27.5, 30),
            new Termometro("T2", 32.1, 30),
            new Humedad("H1", 61.0),
            new Presion("P1", 1013.2, 1020)
        };

        informe(sensores, "Informe inicial");

        for (Sensor s : sensores) {
            if (s instanceof Calibrable c) {   // solo los calibrables
                c.calibrar(3.0);
            }
        }

        informe(sensores, "Tras calibrar");
    }
}
