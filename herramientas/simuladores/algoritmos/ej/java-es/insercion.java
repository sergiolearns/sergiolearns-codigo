import java.util.Arrays;

public class Main {
    static void insercion(int[] lista) {
        for (int i = 1; i < lista.length; i++) {
            int clave = lista[i];
            int j = i - 1;
            while (j >= 0 && lista[j] > clave) {
                lista[j + 1] = lista[j];
                j = j - 1;
            }
            lista[j + 1] = clave;
        }
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        insercion(notas);
        System.out.println(Arrays.toString(notas));
    }
}
