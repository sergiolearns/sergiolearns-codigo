/*
 * Solución del nivel 2: una Fraccion inmutable
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public class Main2 {
    public static void main(String[] args) {
        Fraccion a = new Fraccion(1, 2), b = new Fraccion(2, 4), c = new Fraccion(1, -3);
        System.out.println(a + " " + b + " " + c);
        System.out.println(a.equals(b) + " " + (a == b));
        System.out.println(a.sumar(c) + " " + a.multiplicar(new Fraccion(4, 1)) + " " + new Fraccion(6, 3));
        System.out.println(a.sumar(new Fraccion(1, 2)));
        System.out.println("a sigue valiendo " + a);
        try {
            new Fraccion(3, 0);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
