/*
 * El código
 * Del artículo «Iteradores en Java — práctica con borrados seguros, una lista enlazada propia y una playlist de ida y vuelta (y el segundo for-each que no imprimía nada)»
 * https://sergiolearns.com/iteradores-en-java-practica/
 */

import java.util.ArrayList;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class Enlazada {
    static int contar(Iterable<?> coleccion) {
        int n = 0;
        for (Object o : coleccion) {
            n++;
        }
        return n;
    }

    public static void main(String[] args) {
        ListaEnlazada<String> asignaturas = new ListaEnlazada<>();
        asignaturas.anadir("FP2");
        asignaturas.anadir("IC2");
        asignaturas.anadir("AEDV");

        System.out.println("Con for-each:");
        for (String a : asignaturas) {
            System.out.println("  " + a);
        }

        System.out.println("Dos for-each anidados (cada uno con su cursor):");
        for (String a : asignaturas) {
            for (String b : asignaturas) {
                if (!a.equals(b)) {
                    System.out.println("  " + a + " + " + b);
                }
            }
        }

        Iterator<String> it = asignaturas.iterator();
        for (int i = 0; i < asignaturas.tamano(); i++) {
            it.next();
        }
        try {
            it.next();
        } catch (NoSuchElementException e) {
            System.out.println("Iterador agotado: " + e.getClass().getSimpleName());
        }

        ArrayList<Integer> numeros = new ArrayList<>();
        numeros.add(7);
        numeros.add(8);
        System.out.println("contar(mi lista) = " + contar(asignaturas));
        System.out.println("contar(ArrayList) = " + contar(numeros));
    }
}
