/*
 * El código
 * Del artículo «Arrays en Java — práctica con una tienda, una matriz y las notas de clase (y cómo no estropear el original)»
 * https://sergiolearns.com/arrays-en-java-practica/
 */

import java.util.Arrays;

public class Matriz {

    // Comprueba que todas las filas tienen la misma longitud
    static boolean esRectangular(int[][] m) {
        for (int i = 1; i < m.length; i++) {
            if (m[i].length != m[0].length) {
                return false;
            }
        }
        return true;
    }

    static int[] sumaFilas(int[][] m) {
        int[] sumas = new int[m.length];          // una suma por fila
        for (int f = 0; f < m.length; f++) {
            for (int c = 0; c < m[f].length; c++) {
                sumas[f] += m[f][c];
            }
        }
        return sumas;
    }

    static int[] sumaColumnas(int[][] m) {
        int[] sumas = new int[m[0].length];       // una suma por columna: usamos la longitud de la fila 0
        for (int f = 0; f < m.length; f++) {
            for (int c = 0; c < m[f].length; c++) {
                sumas[c] += m[f][c];              // la suma va a la posición de la COLUMNA
            }
        }
        return sumas;
    }

    // Solo tiene sentido en matrices cuadradas
    static int sumaDiagonal(int[][] m) {
        int suma = 0;
        for (int i = 0; i < m.length; i++) {
            suma += m[i][i];
        }
        return suma;
    }

    // Filas y columnas intercambiadas: la original no se toca
    static int[][] transpuesta(int[][] m) {
        int[][] t = new int[m[0].length][m.length];   // ¡al revés! columnas x filas
        for (int f = 0; f < m.length; f++) {
            for (int c = 0; c < m[f].length; c++) {
                t[c][f] = m[f][c];
            }
        }
        return t;
    }

    static void imprimir(int[][] m) {
        for (int[] fila : m) {
            for (int valor : fila) {
                System.out.printf("%4d", valor);
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        int[][] ventas = {
            { 1,  2,  3,  4},
            { 5,  6,  7,  8},
            { 9, 10, 11, 12}
        };

        System.out.println("Matriz 3x4:");
        imprimir(ventas);
        System.out.println("¿Rectangular? " + esRectangular(ventas));
        System.out.println("Suma por filas:    " + Arrays.toString(sumaFilas(ventas)));
        System.out.println("Suma por columnas: " + Arrays.toString(sumaColumnas(ventas)));

        System.out.println("\nTranspuesta (4x3):");
        imprimir(transpuesta(ventas));

        int[][] cuadrada = {
            {2, 0, 1},
            {3, 5, 4},
            {1, 6, 9}
        };
        System.out.println("\nSuma de la diagonal de la cuadrada: " + sumaDiagonal(cuadrada));

        int[][] irregular = {
            {1, 2, 3},
            {4, 5},
            {6}
        };
        System.out.println("¿Rectangular la irregular? " + esRectangular(irregular));
    }
}
