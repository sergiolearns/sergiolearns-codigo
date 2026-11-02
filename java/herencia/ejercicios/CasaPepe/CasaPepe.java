/*
 * Nivel 3 — Desafío: la plantilla de un restaurante
 * Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)»
 * https://sergiolearns.com/herencia-en-java-ejercicios/
 */

public class CasaPepe {

    public static void main(String[] args) {
        Plantilla casaPepe = new Plantilla(4);
        Camarero lucia = new Camarero("Lucía", 30);
        Encargado tomas = new Encargado("Tomás", 40);

        System.out.println(casaPepe.contratar(new Cocinero("Ana", 40, true)));
        casaPepe.contratar(lucia);
        casaPepe.contratar(tomas);
        System.out.println(casaPepe.contratar(new Cocinero("ana", 20, false)));   // repetida
        casaPepe.contratar(new Cocinero("Raúl", 35, false));
        System.out.println(casaPepe.contratar(new Camarero("Eva", 20)));         // llena

        lucia.registrarPropina(35.5);
        tomas.registrarPropina(20);
        lucia.registrarPropina(-5);                                              // ignorada

        casaPepe.listar();
        System.out.printf("Coste semanal: %.2f €%n", casaPepe.costeTotal());
        System.out.println("Más caro: " + casaPepe.masCaro().getNombre());
        System.out.printf("Propinas de sala: %.2f €%n", casaPepe.propinasSala());
    }
}
