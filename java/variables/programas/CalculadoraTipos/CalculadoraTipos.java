/*
 * Variables en Java práctica — Programa 1: Calculadora con tipos mezclados
 * Del artículo «Variables en Java — práctica con los errores que todo el mundo comete»
 * https://sergiolearns.com/variables-en-java-practica/
 */

import java.util.Scanner;

public class CalculadoraTipos {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CALCULADORA CON TIPOS ===");
        System.out.println();

        System.out.print("Primer número (entero): ");
        int a = sc.nextInt();

        System.out.print("Segundo número (entero): ");
        int b = sc.nextInt();

        System.out.println();
        System.out.println("--- División: el gran engaño ---");

        // División entera — lo que hace Java por defecto
        int divEntera = a / b;
        System.out.printf("%d / %d = %d  ← división ENTERA%n", a, b, divEntera);

        // División real — necesitas al menos un double
        double divReal1 = (double) a / b;
        System.out.printf("%d / %d = %.4f  ← cast antes de dividir%n",
                          a, b, divReal1);

        double divReal2 = a / (double) b;
        System.out.printf("%d / %d = %.4f  ← cast en el divisor%n",
                          a, b, divReal2);

        double divReal3 = (double)(a / b);
        System.out.printf("%d / %d = %.4f  ← cast DESPUÉS (¡trampa!)%n",
                          a, b, divReal3);

        System.out.println();
        System.out.println("--- Desbordamiento de int ---");

        int limite = Integer.MAX_VALUE;
        System.out.printf("Máximo int:    %,d%n", limite);
        System.out.printf("Máximo int + 1: %,d  ← overflow%n", limite + 1);

        long limiteGrande = Integer.MAX_VALUE + 1L;
        System.out.printf("Con long:      %,d  ← correcto%n", limiteGrande);

        System.out.println();
        System.out.println("--- Widening automático ---");
        int entero = 42;
        long grande = entero;        // automático
        double decimal = entero;     // automático — 42.0
        System.out.printf("int:    %d%n", entero);
        System.out.printf("long:   %d  ← widening automático%n", grande);
        System.out.printf("double: %.1f  ← widening automático%n", decimal);

        sc.close();
    }
}
