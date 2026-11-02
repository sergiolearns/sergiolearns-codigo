/*
 * Solución del nivel 1: la clase Producto
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public class Main1 {
    public static void main(String[] args) {
        Producto cafe = new Producto("Café", 3.5, 10);
        Producto raro = new Producto("Error", -2, -5);
        System.out.println(cafe);
        System.out.println(raro);
        System.out.println(cafe.vender(4) + " " + cafe.vender(20) + " " + cafe.setPrecio(-1));
        cafe.reponer(5);
        System.out.println(cafe);
    }
}
