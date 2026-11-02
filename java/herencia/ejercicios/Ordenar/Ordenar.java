/*
 * Nivel 2 — Intermedio: figuras que se comparan y se ordenan
 * Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)»
 * https://sergiolearns.com/herencia-en-java-ejercicios/
 */

public class Ordenar {

    public static void main(String[] args) {
        System.out.println(Triangulo.esValido(3, 4, 5) + " " + Triangulo.esValido(1, 2, 10));

        Figura[] figuras = {
            new Circulo(1.5),
            new Triangulo(3, 4, 5),
            new Circulo(1),
            new Triangulo(5, 5, 6)
        };

        System.out.println(figuras[0].esMayorQue(figuras[1]));
        Figura.ordenar(figuras);
        for (Figura f : figuras) {
            System.out.println(f);
        }
    }
}
