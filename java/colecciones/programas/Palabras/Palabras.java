/*
 * El código
 * Del artículo «Colecciones en Java — práctica con un contador de palabras, claves propias y colas de préstamos (y el HashMap que imprimía en un orden que no entendía)»
 * https://sergiolearns.com/colecciones-en-java-practica/
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Palabras {
    public static void main(String[] args) {
        String texto = "to be or not to be that is the question whether it is nobler in the mind to suffer";
        String[] palabras = texto.split(" ");

        Map<String, Integer> hash = new HashMap<>();
        Map<String, Integer> arbol = new TreeMap<>();
        Map<String, Integer> enlazado = new LinkedHashMap<>();
        Map<String, Integer> manual = new HashMap<>();

        for (String p : palabras) {
            hash.merge(p, 1, Integer::sum);
            arbol.merge(p, 1, Integer::sum);
            enlazado.merge(p, 1, Integer::sum);
            manual.put(p, manual.getOrDefault(p, 0) + 1);   // la misma cuenta, sin merge
        }

        System.out.println("Palabras en total: " + palabras.length);
        System.out.println("Palabras distintas: " + hash.size());
        System.out.println("HashMap:       " + hash);
        System.out.println("TreeMap:       " + arbol);
        System.out.println("LinkedHashMap: " + enlazado);
        System.out.println("¿getOrDefault da lo mismo que merge? " + manual.equals(hash));

        String masRepetida = null;
        int max = 0;
        for (Map.Entry<String, Integer> e : arbol.entrySet()) {
            if (e.getValue() > max) {
                max = e.getValue();
                masRepetida = e.getKey();
            }
        }
        System.out.println("La más repetida: " + masRepetida + " (" + max + " veces)");

        List<String> unaVez = new ArrayList<>();
        for (Map.Entry<String, Integer> e : arbol.entrySet()) {
            if (e.getValue() == 1) {
                unaVez.add(e.getKey());
            }
        }
        System.out.println("Aparecen una sola vez: " + unaVez);
    }
}
