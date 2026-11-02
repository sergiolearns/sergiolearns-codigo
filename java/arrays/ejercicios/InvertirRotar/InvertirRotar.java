/*
 * Ejercicio 1: invertir y rotar un array (sin tocar el original)
 * Del artículo «Arrays en Java — ejercicios con invertir, rotar, quitar duplicados y fusionar (y un error que se esconde donde menos lo esperas)»
 * https://sergiolearns.com/arrays-en-java-ejercicios/
 */

import java.util.Arrays;

public class InvertirRotar {

    static int[] invertir(int[] a) {
        int[] r = new int[a.length];                 // array NUEVO: el original no se toca
        for (int i = 0; i < a.length; i++) {
            r[i] = a[a.length - 1 - i];              // el primero de r es el último de a, etc.
        }
        return r;
    }

    // Rota k posiciones a la derecha (k negativo = a la izquierda)
    static int[] rotar(int[] a, int k) {
        int n = a.length;
        int[] r = new int[n];
        if (n == 0) {
            return r;                                // evita dividir entre cero con %
        }
        int desplazamiento = ((k % n) + n) % n;      // lo deja siempre entre 0 y n-1
        for (int i = 0; i < n; i++) {
            r[(i + desplazamiento) % n] = a[i];      // el que sale por la derecha entra por la izquierda
        }
        return r;
    }

    public static void main(String[] args) {
        int[] notas = {1, 2, 3, 4, 5};
        System.out.println("Original:        " + Arrays.toString(notas));
        System.out.println("Invertido:       " + Arrays.toString(invertir(notas)));
        System.out.println("Rotado 2 (der.): " + Arrays.toString(rotar(notas, 2)));
        System.out.println("Rotado -1 (izq.):" + Arrays.toString(rotar(notas, -1)));
        System.out.println("Rotado 7:        " + Arrays.toString(rotar(notas, 7)));
        System.out.println("Original:        " + Arrays.toString(notas));
        System.out.println("Vacío invertido: " + Arrays.toString(invertir(new int[0])));
    }
}
