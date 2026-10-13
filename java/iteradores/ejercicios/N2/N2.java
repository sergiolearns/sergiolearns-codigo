/*
 * Solución del Nivel 2
 * Del artículo «Iteradores en Java — ejercicios con playlists, títulos repetidos y un rango con paso (y el "Faro" que nunca se iba)»
 * https://sergiolearns.com/iteradores-en-java-ejercicios/
 */

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

public class N2 {
    public static void main(String[] args) {
        List<String> titulos = new ArrayList<>(List.of(
                "Faro", "Marea", "Faro", "Amanecer", "Marea", "Faro"));
        System.out.println("Antes:   " + titulos);

        Set<String> vistos = new HashSet<>();
        Iterator<String> it = titulos.iterator();
        int quitados = 0;
        while (it.hasNext()) {
            String t = it.next();
            if (!vistos.add(t)) {       // add() devuelve false si ya estaba
                it.remove();
                quitados++;
            }
        }
        System.out.println("Después: " + titulos);
        System.out.println("Quitados: " + quitados);
    }
}
