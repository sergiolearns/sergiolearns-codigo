/*
 * Ejercicio 2: eliminar duplicados
 * Del artículo «Arrays en Java — ejercicios con invertir, rotar, quitar duplicados y fusionar (y un error que se esconde donde menos lo esperas)»
 * https://sergiolearns.com/arrays-en-java-ejercicios/
 */

import java.util.Arrays;

public class SinDuplicados {

    // ¿Está valor entre las primeras 'hasta' posiciones de a?
    static boolean contiene(int[] a, int hasta, int valor) {
        for (int i = 0; i < hasta; i++) {
            if (a[i] == valor) {
                return true;
            }
        }
        return false;
    }

    static int[] sinDuplicados(int[] a) {
        int[] temporal = new int[a.length];          // como mucho caben todos
        int cuantos = 0;                             // cuántos valores distintos llevamos
        for (int n : a) {
            if (!contiene(temporal, cuantos, n)) {   // solo miramos lo ya rellenado
                temporal[cuantos] = n;
                cuantos++;
            }
        }
        return Arrays.copyOf(temporal, cuantos);     // recortamos al tamaño real
    }

    public static void main(String[] args) {
        int[] repetidos = {4, 7, 4, 0, 7, 7, 9, 0};
        System.out.println("Con duplicados:  " + Arrays.toString(repetidos));
        System.out.println("Sin duplicados:  " + Arrays.toString(sinDuplicados(repetidos)));
        System.out.println("Sin duplicados (con ceros): " + Arrays.toString(sinDuplicados(new int[]{0, 0, 0})));
    }
}
