/*
 * Nivel 1 — Básico: animales del refugio
 * Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)»
 * https://sergiolearns.com/herencia-en-java-ejercicios/
 */

public class Refugio {

    public static void main(String[] args) {
        Animal[] refugio = {
            new Perro("Toby", 3, "beagle"),
            new Gato("Luna", 2, true),
            new Gato("Sombra", -1, false),
            new Perro("Rex", 7, "pastor alemán")
        };

        int perros = 0, sumaEdades = 0;
        for (Animal a : refugio) {
            System.out.println(a.presentarse());       // cada uno con su sonido
            if (a instanceof Perro) perros++;
            sumaEdades += a.getEdad();
        }
        System.out.printf("Perros: %d · edad media: %.1f%n", perros, (double) sumaEdades / refugio.length);
    }
}
