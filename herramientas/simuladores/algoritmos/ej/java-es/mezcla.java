import java.util.Arrays;

public class Main {
    static int[] ordenarMezcla(int[] lista) {
        if (lista.length <= 1) {
            return lista;
        }
        int medio = lista.length / 2;
        int[] izq = ordenarMezcla(Arrays.copyOfRange(lista, 0, medio));
        int[] der = ordenarMezcla(Arrays.copyOfRange(lista, medio, lista.length));
        return mezclar(izq, der);
    }

    static int[] mezclar(int[] izq, int[] der) {
        int[] resultado = new int[izq.length + der.length];
        int i = 0;
        int j = 0;
        int k = 0;
        while (i < izq.length && j < der.length) {
            if (izq[i] <= der[j]) {
                resultado[k++] = izq[i++];
            } else {
                resultado[k++] = der[j++];
            }
        }
        while (i < izq.length) {
            resultado[k++] = izq[i++];
        }
        while (j < der.length) {
            resultado[k++] = der[j++];
        }
        return resultado;
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        notas = ordenarMezcla(notas);
        System.out.println(Arrays.toString(notas));
    }
}
