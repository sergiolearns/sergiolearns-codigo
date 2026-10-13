/*
 * Programa 2: lector de logs con grupos con nombre
 * Del artículo «Expresiones regulares en Java — práctica con un validador, un lector de logs y un limpiador de texto (y el \r invisible que me rompió todas las líneas)»
 * https://sergiolearns.com/expresiones-regulares-en-java-practica/
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ExtractorLog {

    // fecha hora NIVEL [modulo] mensaje
    static final Pattern LINEA = Pattern.compile(
        "(?<fecha>\\d{4}-\\d{2}-\\d{2}) (?<hora>\\d{2}:\\d{2}:\\d{2}) " +
        "(?<nivel>INFO|WARN|ERROR) \\[(?<modulo>\\w+)\\] (?<mensaje>.*)");
    static final Pattern IP = Pattern.compile("\\b\\d{1,3}(\\.\\d{1,3}){3}\\b");

    public static void main(String[] args) {
        String[] log = {
            "2026-10-07 09:15:02 INFO [auth] Login correcto de sergio desde 192.168.1.20",
            "2026-10-07 09:15:40 ERROR [auth] Contraseña incorrecta para admin desde 10.0.0.7",
            "2026-10-07 09:16:03 WARN [db] Consulta lenta: 1840 ms",
            "línea rota sin formato",
            "2026-10-07 09:17:11 ERROR [auth] Contraseña incorrecta para admin desde 10.0.0.7",
            "2026-10-07 09:18:55 INFO [web] Página /recursos servida en 35 ms\r"
        };
        int info = 0, warn = 0, error = 0, rotas = 0;

        for (String linea : log) {
            Matcher m = LINEA.matcher(linea.strip());     // strip(): fuera espacios y \r del final
            if (!m.matches()) { rotas++; continue; }

            switch (m.group("nivel")) {
                case "INFO" -> info++;
                case "WARN" -> warn++;
                case "ERROR" -> error++;
            }
            if (m.group("nivel").equals("ERROR")) {
                Matcher ip = IP.matcher(m.group("mensaje"));   // buscamos DENTRO del mensaje
                String origen = ip.find() ? ip.group() : "sin IP";
                System.out.println(m.group("hora") + " ERROR en " + m.group("modulo") + " desde " + origen);
            }
        }
        System.out.println("INFO: " + info + " | WARN: " + warn + " | ERROR: " + error + " | líneas rotas: " + rotas);
    }
}
