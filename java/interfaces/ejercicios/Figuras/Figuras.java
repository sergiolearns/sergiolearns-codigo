/*
 * Solución del Nivel 1
 * Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)»
 * https://sergiolearns.com/interfaces-en-java-ejercicios/
 */

public class Figuras {

    static double areaTotal(Medible[] figuras) {
        double total = 0;
        for (Medible m : figuras) {
            total += m.area();
        }
        return total;
    }

    static Medible mayor(Medible[] figuras) {
        Medible mayor = figuras[0];   // partimos de la primera y vamos comparando
        for (Medible m : figuras) {
            if (m.area() > mayor.area()) {
                mayor = m;
            }
        }
        return mayor;
    }

    public static void main(String[] args) {
        Medible[] figuras = { new Rectangulo(3, 4), new Circulo(2), new Cuadrado(3.5) };

        for (Medible m : figuras) {
            System.out.println(m.describir());
        }
        System.out.printf("Área total: %.2f%n", areaTotal(figuras));
        System.out.println("Mayor: " + mayor(figuras).describir());
    }
}
