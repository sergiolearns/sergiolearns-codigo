/*
 * Solución del Nivel 1
 * Del artículo «Iteradores en Java — ejercicios con playlists, títulos repetidos y un rango con paso (y el "Faro" que nunca se iba)»
 * https://sergiolearns.com/iteradores-en-java-ejercicios/
 */

import java.util.Iterator;
import java.util.List;

public class N1 {
    public static void main(String[] args) {
        List<Cancion> lista = List.of(
                new Cancion("Amanecer", 215), new Cancion("Carretera", 180),
                new Cancion("Tormenta", 240), new Cancion("Faro", 135),
                new Cancion("Marea", 200));

        Iterator<Cancion> it = lista.iterator();
        int numero = 0;
        int total = 0;
        Cancion larga = null;
        while (it.hasNext()) {
            Cancion c = it.next();
            numero++;
            total += c.segundos();
            System.out.println(numero + ". " + c);
            if (larga == null || c.segundos() > larga.segundos()) {
                larga = c;
            }
        }
        System.out.println("Duración total: " + total / 60 + ":" + String.format("%02d", total % 60));
        System.out.println("La más larga: " + larga);
    }
}
