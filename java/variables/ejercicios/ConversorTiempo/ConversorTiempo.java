/*
 * Solución Ejercicio 2
 * Del artículo «Variables en Java — ejercicios para dominar tipos, casting y Strings»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */

import java.util.Scanner;

public class ConversorTiempo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONVERSOR DE TIEMPO ===");
        System.out.println();

        System.out.print("Segundos totales: ");
        int totalSegundos = sc.nextInt();

        // Todo esto es división entera y módulo — sin doubles hasta el final
        // El orden importa: primero los valores más grandes

        // ¿Cuántos días completos caben?
        int dias = totalSegundos / 86400;         // 86400 = 60*60*24
        int resto = totalSegundos % 86400;        // lo que sobra tras quitar los días

        // De lo que sobra, ¿cuántas horas completas?
        int horas = resto / 3600;                 // 3600 = 60*60
        resto = resto % 3600;                     // reutilizamos la variable resto

        // De lo que queda, ¿cuántos minutos completos?
        int minutos = resto / 60;
        int segundos = resto % 60;                // lo que sobra son segundos

        System.out.println();
        System.out.println("--- Desglose ---");

        // Singular/plural con ternario — pequeño detalle que marca la diferencia
        System.out.printf("%d %s, %d %s, %d %s y %d %s%n",
            dias,    (dias == 1    ? "día"    : "días"),
            horas,   (horas == 1   ? "hora"   : "horas"),
            minutos, (minutos == 1 ? "minuto" : "minutos"),
            segundos,(segundos == 1? "segundo": "segundos"));

        System.out.println();
        System.out.println("--- En detalle ---");
        System.out.printf("Días:     %-4d (86400 segundos)%n", dias);
        System.out.printf("Horas:    %-4d (3600 segundos)%n",  horas);
        System.out.printf("Minutos:  %-4d (60 segundos)%n",    minutos);
        System.out.printf("Segundos: %d%n",                     segundos);

        System.out.println();
        System.out.println("--- Porcentaje del día ---");

        // Aquí sí necesitamos double — y el cast va ANTES de dividir
        // Si escribiéramos totalSegundos / 86400 * 100, la división entera
        // truncaría el resultado antes de que el double entre en juego
        double porcentaje = (double) totalSegundos / 86400 * 100;

        System.out.printf("%d segundos = %.2f%% de un día completo%n",
                          totalSegundos, porcentaje);

        // Mensaje adicional según el resultado
        if (porcentaje > 100) {
            System.out.println("(más de un día completo)");
        } else if (porcentaje == 100) {
            System.out.println("(exactamente un día completo)");
        } else {
            System.out.printf("(faltan %.2f%% para completar el día)%n",
                              100 - porcentaje);
        }

        sc.close();
    }
}
