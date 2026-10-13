/*
 * El código
 * Del artículo «Iteradores en Java — práctica con borrados seguros, una lista enlazada propia y una playlist de ida y vuelta (y el segundo for-each que no imprimía nada)»
 * https://sergiolearns.com/iteradores-en-java-practica/
 */

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class Ambos {
    public static void main(String[] args) {
        List<Cancion> lista = new ArrayList<>(List.of(
                new Cancion("Amanecer", 215), new Cancion("Carretera", 180),
                new Cancion("Tormenta", 240), new Cancion("Faro", 135)));

        // 1. Ida y vuelta con el mismo iterador
        ListIterator<Cancion> it = lista.listIterator();
        System.out.println("Hacia delante:");
        while (it.hasNext()) {
            int i = it.nextIndex();
            System.out.println("  " + i + ": " + it.next());
        }
        System.out.println("Hacia atrás:");
        while (it.hasPrevious()) {
            int i = it.previousIndex();
            System.out.println("  " + i + ": " + it.previous());
        }

        // 2. set() y add() mientras recorremos
        it = lista.listIterator();
        while (it.hasNext()) {
            Cancion c = it.next();
            if (c.titulo().equals("Carretera")) {
                it.add(new Cancion("Interludio", 30));
            } else if (c.titulo().equals("Tormenta")) {
                it.set(new Cancion("Tormenta (remix)", 250));
            }
        }
        System.out.println("Resultado: " + lista);

        // 3. El mismo iterador, ahora desde el final
        System.out.print("Del final al principio:");
        while (it.hasPrevious()) {
            System.out.print(" " + it.previous().titulo() + ";");
        }
        System.out.println();
    }
}
