/*
 * Nivel 3: resumen de un log
 * Del artículo «Expresiones regulares en Java — ejercicios con la matrícula del parking, fechas y el log de la secretaría (y la matrícula con vocales que se me coló)»
 * https://sergiolearns.com/expresiones-regulares-en-java-ejercicios/
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ResumenLog {

    static final Pattern LINEA = Pattern.compile(
        "(?<hora>\\d{2}:\\d{2}:\\d{2}) (?<nivel>INFO|WARN|ERROR) "
        + "(?<ip>\\d{1,3}(?:\\.\\d{1,3}){3}) (?<msg>.+)");

    static void resumen(String[] log) {
        String primera = null, ultima = null;
        int validas = 0;
        String[] ips = new String[log.length];        // arrays paralelos: la IP...
        int[] errores = new int[log.length];          // ...y cuántos errores lleva
        int distintas = 0;                            // cuántas casillas usamos

        for (String linea : log) {
            Matcher m = LINEA.matcher(linea.strip());
            if (!m.matches()) {
                continue;                             // sin formato: fuera
            }
            validas++;
            if (primera == null) {
                primera = m.group("hora");
            }
            ultima = m.group("hora");
            if (!m.group("nivel").equals("ERROR")) {
                continue;
            }
            String ip = m.group("ip");
            int i = 0;
            while (i < distintas && !ips[i].equals(ip)) {   // ¿ya la teníamos?
                i++;
            }
            if (i == distintas) {                     // IP nueva: a la primera casilla libre
                ips[distintas] = ip;
                distintas++;
            }
            errores[i]++;
        }
        System.out.println("Líneas válidas: " + validas + " (de " + primera + " a " + ultima + ")");
        System.out.println("IPs con errores:");
        for (int i = 0; i < distintas; i++) {
            System.out.println("  " + ips[i] + " -> " + errores[i] + " error(es)");
        }
    }

    public static void main(String[] args) {
        String[] log = {
            "09:00:01 INFO 10.0.0.7 arranque del servidor de la secretaría",
            "09:00:15 ERROR 10.0.0.7 contraseña incorrecta",
            "09:01:02 WARN 192.168.1.20 sesión a punto de caducar",
            "esto no es una línea de log",
            "09:01:40 ERROR 172.16.0.3 acceso denegado a /actas",
            "9:02:10 ERROR 10.0.0.9 hora sin el cero delante",
            "09:02:30 ERROR 10.0.0.7 contraseña incorrecta",
            "09:03:00 INFO 192.168.1.20 sesión cerrada"
        };
        resumen(log);
    }
}
