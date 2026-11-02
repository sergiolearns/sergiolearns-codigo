/*
 * Programa 2: la nota final de FP2
 * Del artículo «Variables en Java práctica — el recibo, la nota final y el carné de Laura (con la nota que salía 0.0)»
 * https://sergiolearns.com/variables-en-java-practica/
 */
/**
 * Programa 2: la nota final de FP2 de Laura (pesos y notas inventados).
 * Parcial 1 y parcial 2 hacen la media de teoría (60 %) y la práctica pesa el 40 %.
 */
public class NotaFinal {
    public static void main(String[] args) {
        int parcial1 = 7;                    // las notas de los parciales son enteras
        int parcial2 = 8;
        double practica = 6.5;               // la práctica se puntúa con medio punto
        int pesoTeoria = 60;                 // porcentajes guardados como int
        int pesoPractica = 40;

        // 1. La media de teoría: tres formas de escribirla
        int mediaInt = (parcial1 + parcial2) / 2;                       // 15 / 2 = 7
        double mediaTarde = (double) ((parcial1 + parcial2) / 2);       // el cast llega tarde: 7.0
        double mediaTeoria = (parcial1 + parcial2) / 2.0;               // 15 / 2.0 = 7.5

        // 2. La ponderación: el mismo fallo, ahora con los porcentajes
        double finalMal = pesoTeoria / 100 * mediaTeoria + pesoPractica / 100 * practica;
        double finalBien = pesoTeoria / 100.0 * mediaTeoria + pesoPractica / 100.0 * practica;

        // 3. Lo que se apunta en el acta
        int truncada = (int) finalBien;                  // quita los decimales
        long redondeada = Math.round(finalBien);         // redondea (devuelve long)
        double unDecimal = Math.round(finalBien * 10) / 10.0;   // redondear a un decimal

        System.out.println("Media de teoría (int):         " + mediaInt);
        System.out.println("Media de teoría (cast tarde):  " + mediaTarde);
        System.out.println("Media de teoría (2.0):         " + mediaTeoria);
        System.out.println("Nota final (int / 100):        " + finalMal);
        System.out.println("Nota final (int / 100.0):      " + finalBien);
        System.out.println("Truncada con (int):            " + truncada);
        System.out.println("Redondeada con Math.round:     " + redondeada);
        System.out.println("A un decimal:                  " + unDecimal);
        System.out.printf("Con printf y %%.2f:             %.2f%n", finalBien);
    }
}
