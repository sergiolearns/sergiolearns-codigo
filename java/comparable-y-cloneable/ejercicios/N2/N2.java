/*
 * Solución del Nivel 2
 * Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)»
 * https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/
 */

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class N2 {
    // Más puntos primero; si empatan, menos partidos jugados; si siguen empatando, por nombre
    static final Comparator<Jugador> CLASIFICACION = Comparator
            .comparingInt(Jugador::getPuntos).reversed()
            .thenComparingInt(Jugador::getPartidos)
            .thenComparing(Jugador::getNombre);

    public static void main(String[] args) {
        List<Jugador> plantilla = new ArrayList<>(List.of(
            new Jugador("Noa", 120, 10), new Jugador("Iker", 150, 12),
            new Jugador("Lía", 150, 10), new Jugador("Hugo", 90, 8),
            new Jugador("Aitana", 120, 10)));

        plantilla.sort(CLASIFICACION);

        System.out.println("Top 3:");
        for (int i = 0; i < 3; i++) {
            System.out.println("  " + (i + 1) + ". " + plantilla.get(i));
        }
        System.out.println("Último: " + plantilla.get(plantilla.size() - 1));
    }
}
