/*
 * Solución del ejercicio 2: conversor de tiempo
 * Del artículo «Variables en Java ejercicios — IMC, segundos y el inventario de la copistería (y el porcentaje que se quedaba en 100)»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */
/** Ejercicio 2: descomponer 90061 segundos con / y %, y el porcentaje de un día con el cast en su sitio. */
public class ConversorTiempo {
    public static void main(String[] args) {
        final int SEG_DIA = 24 * 60 * 60;       // 86400: que lo calcule Java
        final int SEG_HORA = 60 * 60;           // 3600
        int totalSegundos = 90061;

        int dias = totalSegundos / SEG_DIA;     // días completos
        int resto = totalSegundos % SEG_DIA;    // lo que sobra tras quitar los días
        int horas = resto / SEG_HORA;
        resto = resto % SEG_HORA;               // reutilizamos resto
        int minutos = resto / 60;
        int segundos = resto % 60;

        double porcentaje = (double) totalSegundos / SEG_DIA * 100;   // cast ANTES de dividir
        int vuelta = dias * SEG_DIA + horas * SEG_HORA + minutos * 60 + segundos;

        System.out.println("=== CONVERSOR DE TIEMPO ===");
        System.out.println("Segundos totales: " + totalSegundos);
        System.out.printf("%d d, %d h, %d min y %d s%n", dias, horas, minutos, segundos);
        System.out.printf("Formato reloj: %d d %02d:%02d:%02d%n", dias, horas, minutos, segundos);
        System.out.printf("Porcentaje de un día: %.2f %%%n", porcentaje);
        System.out.println("Comprobación: " + vuelta + " segundos");
    }
}
