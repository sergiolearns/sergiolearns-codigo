import java.util.Arrays;

public class Main {
    static void burbuja(int[] lista) {
        int n = lista.length;
        for (int vuelta = 0; vuelta < n - 1; vuelta++) {
            boolean huboCambio = false;
            for (int j = 0; j < n - 1 - vuelta; j++) {
                if (lista[j] > lista[j + 1]) {
                    int aux = lista[j];
                    lista[j] = lista[j + 1];
                    lista[j + 1] = aux;
                    huboCambio = true;
                }
            }
            if (!huboCambio) {
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        burbuja(notas);
        System.out.println(Arrays.toString(notas));
    }
}
