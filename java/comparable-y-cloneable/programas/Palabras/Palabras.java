/*
 * El código
 * Del artículo «Comparable y Cloneable en Java — práctica con un ranking, copias de seguridad y árboles ordenados (y la palabra que desapareció del TreeSet)»
 * https://sergiolearns.com/comparable-y-cloneable-en-java-practica/
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.TreeMap;
import java.util.TreeSet;

public class Palabras {
    public static void main(String[] args) {
        List<String> palabras = Arrays.asList("casa", "sol", "mesa", "luna", "pan", "cielo", "árbol");

        // 1. Orden natural de String: alfabético
        TreeSet<String> alfabetico = new TreeSet<>(palabras);
        System.out.println("Alfabético: " + alfabetico);

        // 2. Comparator solo por longitud: ¡empatar es "ser el mismo"!
        TreeSet<String> porLongitud = new TreeSet<>(Comparator.comparingInt(String::length));
        porLongitud.addAll(palabras);
        System.out.println("Solo longitud: " + porLongitud.size() + " de " + palabras.size() + " " + porLongitud);

        // 3. Con desempate no se pierde nada
        TreeSet<String> completo = new TreeSet<>(
                Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        completo.addAll(palabras);
        System.out.println("Longitud + alfabético: " + completo.size() + " " + completo);

        // 4. Navegar un TreeSet
        System.out.println("\nPrimera: " + completo.first() + ", última: " + completo.last());
        System.out.println("Anterior a \"mesa\": " + completo.lower("mesa"));
        System.out.println("Siguiente a \"mesa\": " + completo.higher("mesa"));
        System.out.println("Hasta \"luna\" (inclusive): " + completo.headSet("luna", true));
        System.out.println("Desde \"mesa\": " + completo.tailSet("mesa"));

        // 5. TreeMap: palabras agrupadas por longitud, siempre ordenadas por clave
        TreeMap<Integer, List<String>> porTamano = new TreeMap<>();
        for (String p : palabras) {
            porTamano.computeIfAbsent(p.length(), k -> new ArrayList<>()).add(p);
        }
        System.out.println("\nAgrupadas: " + porTamano);
        System.out.println("Clave menor y mayor: " + porTamano.firstKey() + " y " + porTamano.lastKey());
        System.out.println("Mayor clave <= 4: " + porTamano.floorKey(4));
        System.out.println("Menor clave >= 5: " + porTamano.ceilingKey(5));
        System.out.println("De mayor a menor: " + porTamano.descendingMap());

        // 6. Claves que se comparan sin mirar mayúsculas
        TreeMap<String, Integer> votos = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (String voto : new String[]{"Sol", "luna", "sol", "SOL", "Luna"}) {
            votos.merge(voto, 1, Integer::sum);
        }
        System.out.println("\nVotos: " + votos);
    }
}
