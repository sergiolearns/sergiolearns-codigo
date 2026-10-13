/*
 * Nivel 1 — Animales del refugio
 * Del artículo «Herencia en Java — ejercicios con animales, figuras y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)»
 * https://sergiolearns.com/herencia-en-java-ejercicios/
 */

public class Main {
    public static void main(String[] args) {
        Animal[] refugio = {
            new Perro("Toby", 3, "beagle"),
            new Gato("Luna", 2, true),
            new Gato("Sombra", -1, false),
            new Perro("Rex", 7, "pastor alemán")
        };

        int perros = 0, sumaEdades = 0;
        for (Animal a : refugio) {
            System.out.println(a.presentarse());
            if (a instanceof Perro) perros++;
            sumaEdades += a.getEdad();
        }
        System.out.printf("Perros: %d · edad media: %.1f%n", perros, (double) sumaEdades / refugio.length);
    }
}
