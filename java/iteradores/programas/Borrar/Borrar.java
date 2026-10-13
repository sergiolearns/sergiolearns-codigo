/*
 * El código
 * Del artículo «Iteradores en Java — práctica con borrados seguros, una lista enlazada propia y una playlist de ida y vuelta (y el segundo for-each que no imprimía nada)»
 * https://sergiolearns.com/iteradores-en-java-practica/
 */

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;

public class Borrar {
    static List<Cancion> cargar() {
        return new ArrayList<>(List.of(
                new Cancion("Amanecer", 215), new Cancion("Intro", 45),
                new Cancion("Carretera", 180), new Cancion("Faro", 135),
                new Cancion("Silencio", 20)));
    }

    public static void main(String[] args) {
        // 1. for-each + remove(): peligro
        List<Cancion> a = cargar();
        try {
            for (Cancion c : a) {
                if (c.segundos() < 150) {
                    a.remove(c);
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("1. for-each: " + e.getClass().getSimpleName());
        }
        System.out.println("   Se quedó a medias: " + a);

        // 2. Iterator.remove(): la forma segura
        List<Cancion> b = cargar();
        Iterator<Cancion> it = b.iterator();
        int borradas = 0;
        while (it.hasNext()) {
            if (it.next().segundos() < 150) {
                it.remove();
                borradas++;
            }
        }
        System.out.println("2. Iterator: borradas " + borradas + " -> " + b);

        // 3. El atajo: removeIf
        List<Cancion> c = cargar();
        c.removeIf(x -> x.segundos() < 150);
        System.out.println("3. removeIf: " + c);
    }
}
