import java.util.Arrays;

public class Main {
    static void seleccion(int[] lista) {
        int n = lista.length;
        for (int i = 0; i < n - 1; i++) {
            int iMin = i;
            for (int j = i + 1; j < n; j++) {
                if (lista[j] < lista[iMin]) {
                    iMin = j;
                }
            }
            int aux = lista[i];
            lista[i] = lista[iMin];
            lista[iMin] = aux;
        }
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        seleccion(notas);
        System.out.println(Arrays.toString(notas));
    }
}
