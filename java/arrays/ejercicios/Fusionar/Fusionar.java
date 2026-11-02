/*
 * Ejercicio 3: fusionar dos arrays ordenados
 * Del artículo «Arrays en Java — ejercicios con invertir, rotar, quitar duplicados y fusionar (y un error que se esconde donde menos lo esperas)»
 * https://sergiolearns.com/arrays-en-java-ejercicios/
 */

import java.util.Arrays;

public class Fusionar {

    static int[] fusionar(int[] a, int[] b) {
        int[] r = new int[a.length + b.length];
        int i = 0;                                   // posición en a
        int j = 0;                                   // posición en b
        int k = 0;                                   // posición en r
        while (i < a.length && j < b.length) {       // mientras queden de los dos
            if (a[i] <= b[j]) {
                r[k] = a[i];
                i++;
            } else {
                r[k] = b[j];
                j++;
            }
            k++;
        }
        while (i < a.length) {                       // sobras de a (si las hay)
            r[k] = a[i];
            i++;
            k++;
        }
        while (j < b.length) {                       // sobras de b (si las hay)
            r[k] = b[j];
            j++;
            k++;
        }
        return r;
    }

    public static void main(String[] args) {
        int[] a = {1, 4, 6, 9};
        int[] b = {2, 3, 7, 8, 10, 12};
        System.out.println("Fusión:          " + Arrays.toString(fusionar(a, b)));
        System.out.println("Con vacío:       " + Arrays.toString(fusionar(a, new int[0])));
        System.out.println("Con repetidos:   " + Arrays.toString(fusionar(new int[]{1, 3, 3}, new int[]{3, 4})));
    }
}
