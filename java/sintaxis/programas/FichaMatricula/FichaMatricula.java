/*
 * Programa 1: la ficha de matrícula con printf
 * Del artículo «Sintaxis de Java práctica — la ficha de matrícula, el horario de FP2 y un recibo con tres errores (para perderle el miedo a javac)»
 * https://sergiolearns.com/sintaxis-java-practica/
 */
/** Ficha de matrícula con printf: columnas alineadas y la coma decimal del español (datos inventados). */
public class FichaMatricula {
    public static void main(String[] args) {
        System.out.println("============================================");
        System.out.println("    FICHA DE MATRÍCULA · SEGUNDO SEMESTRE");
        System.out.println("============================================");
        System.out.printf("%-12s %s%n", "Estudiante:", "Laura Santana Ruiz");
        System.out.printf("%-12s %s%n", "Grado:", "GCID");
        System.out.printf("%-12s %d.º%n", "Curso:", 1);
        System.out.println("--------------------------------------------");
        System.out.printf("%-6s %-30s %5s%n", "Cód.", "Asignatura", "ECTS");     // cabecera con los mismos anchos
        System.out.printf("%-6s %-30s %5d%n", "FP2", "Fundamentos de Programación II", 6);
        System.out.printf("%-6s %-30s %5d%n", "IC2", "Ingeniería de Computadores II", 6);
        System.out.printf("%-6s %-30s %5d%n", "EST", "Estadística", 6);
        System.out.printf("%-6s %-30s %5d%n", "ALG", "Álgebra", 6);
        System.out.println("--------------------------------------------");
        System.out.printf("%-37s %5d%n", "Total de créditos", 6 + 6 + 6 + 6);
        System.out.printf("%-30s %10.2f €%n", "Precio (24 x 15,50 €)", 24 * 15.50);
        System.out.printf("%-30s %10.2f €%n", "Tasa de secretaría", 27.30);
        System.out.printf("%-30s %10.2f €%n", "A pagar", 24 * 15.50 + 27.30);
        System.out.println("============================================");
    }
}
