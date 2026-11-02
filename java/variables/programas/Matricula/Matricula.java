/*
 * Programa 1: el recibo de matrícula sin datos repetidos
 * Del artículo «Variables en Java práctica — el recibo, la nota final y el carné de Laura (con la nota que salía 0.0)»
 * https://sergiolearns.com/variables-en-java-practica/
 */
/**
 * Programa 1: el recibo de matrícula de Laura, con cada dato en su variable.
 * Datos inventados: 24 créditos a 15,50 €, tasa de secretaría de 27,30 €, descuento del 25 % y 4 plazos.
 */
public class Matricula {
    public static void main(String[] args) {
        // Datos que no cambian en todo el programa: constantes
        final double PRECIO_CREDITO = 15.50;
        final double TASA_SECRETARIA = 27.30;
        final int PLAZOS = 4;

        // Datos de Laura
        String estudiante = "Laura Santana Ruiz";
        int creditos = 24;
        int descuentoPorcentaje = 25;                              // 25 %, guardado como entero

        // Cuentas
        double importeCreditos = creditos * PRECIO_CREDITO;        // int * double = double
        double descuentoMal = descuentoPorcentaje / 100 * importeCreditos;   // 25 / 100 = 0 (int)
        double descuentoBien = descuentoPorcentaje / 100.0 * importeCreditos; // 25 / 100.0 = 0.25
        double total = importeCreditos - descuentoBien + TASA_SECRETARIA;

        // Plazos en céntimos: enteros exactos, sin decimales que se pierdan
        int totalCentimos = (int) Math.round(total * 100);         // 306,30 € → 30630
        int plazoCentimos = totalCentimos / PLAZOS;                // división entera
        int sobran = totalCentimos % PLAZOS;                       // céntimos que no reparte
        int ultimoPlazo = plazoCentimos + sobran;                  // el último paga lo que sobra

        System.out.println("RECIBO DE MATRÍCULA");
        System.out.println("Estudiante: " + estudiante);
        System.out.printf("%-26s %8.2f €%n", creditos + " créditos x " + PRECIO_CREDITO, importeCreditos);
        System.out.printf("%-26s %8.2f €%n", "Descuento (int / 100)", -descuentoMal);
        System.out.printf("%-26s %8.2f €%n", "Descuento (int / 100.0)", -descuentoBien);
        System.out.printf("%-26s %8.2f €%n", "Tasa de secretaría", TASA_SECRETARIA);
        System.out.printf("%-26s %8.2f €%n", "TOTAL", total);
        System.out.println("En céntimos: " + totalCentimos);
        System.out.printf("%d plazos de %.2f € y el último de %.2f € (sobran %d céntimos)%n",
                PLAZOS - 1, plazoCentimos / 100.0, ultimoPlazo / 100.0, sobran);
        System.out.println("Comprobación: " + (plazoCentimos * (PLAZOS - 1) + ultimoPlazo) + " céntimos");
    }
}
