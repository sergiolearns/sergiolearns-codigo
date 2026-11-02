/*
 * Programa 2: el horario de FP2 en una tabla de texto
 * Del artículo «Sintaxis de Java práctica — la ficha de matrícula, el horario de FP2 y un recibo con tres errores (para perderle el miedo a javac)»
 * https://sergiolearns.com/sintaxis-java-practica/
 */
/** Horario de FP2 e IC2 en una tabla de texto: a mano con espacios y con printf (horario inventado). */
public class Horario {
    public static void main(String[] args) {
        // 1. A mano: cada espacio contado
        System.out.println("+-----------+-------+-------+");
        System.out.println("| Día       | 9:00  | 11:00 |");
        System.out.println("+-----------+-------+-------+");
        System.out.println("| Lunes     | FP2   | IC2   |");
        System.out.println("| Miércoles | IC2   | FP2   |");
        System.out.println("| Viernes   | FP2   | -     |");
        System.out.println("+-----------+-------+-------+");
        System.out.println();
        // 2. Con printf: el ancho lo pone %-9s y no hay que contar
        System.out.printf("| %-9s | %-5s | %-5s |%n", "Día", "9:00", "11:00");
        System.out.printf("| %-9s | %-5s | %-5s |%n", "Lunes", "FP2", "IC2");
        System.out.printf("| %-9s | %-5s | %-5s |%n", "Miércoles", "IC2", "FP2");
        System.out.printf("| %-9s | %-5s | %-5s |%n", "Viernes", "FP2", "-");
        System.out.println();
        // 3. Con \t: la tabulación salta a la columna 8, 16, 24…
        System.out.println("Día\t9:00\t11:00");
        System.out.println("Lunes\tFP2\tIC2");
        System.out.println("Miércoles\tIC2\tFP2");
        System.out.println("Viernes\tFP2\t-");
    }
}
