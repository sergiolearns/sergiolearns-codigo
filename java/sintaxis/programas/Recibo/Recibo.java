/*
 * Programa 3: el recibo, ya sin errores
 * Del artículo «Sintaxis de Java práctica — la ficha de matrícula, el horario de FP2 y un recibo con tres errores (para perderle el miedo a javac)»
 * https://sergiolearns.com/sintaxis-java-practica/
 */
public class Recibo {
    public static void main(String[] args) {
        System.out.println("Recibo de matrícula");
        System.out.println("Concepto: 24 créditos");
        System.out.printf("Total: %.2f €%n", 24 * 15.50 + 27.30);              // printf: coma decimal (español)
        System.out.println("Total con +: " + (24 * 15.50 + 27.30) + " €");   // +: siempre con punto
    }
}
