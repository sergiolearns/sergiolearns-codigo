/*
 * Solución del Nivel 3
 * Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)»
 * https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/
 */

public class N3 {
    public static void main(String[] args) {
        Plantilla original = new Plantilla("Tigres", new Estadio("La Isla", 5000));
        original.fichar(new Jugador("Noa", 10));
        original.fichar(new Jugador("Iker", 12));

        Plantilla copia = original.clone();
        copia.fichar(new Jugador("Lía", 7));
        copia.getJugadores().get(0).sumar(100);
        copia.getEstadio().setAforo(9000);

        System.out.println("Original: " + original);
        System.out.println("Copia:    " + copia);
        System.out.println("¿Mismo jugador en la posición 0? "
                + (original.getJugadores().get(0) == copia.getJugadores().get(0)));
    }
}
