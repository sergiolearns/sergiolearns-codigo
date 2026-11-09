import java.util.Arrays;

public class Main {
    static void ordenacionRapida(int[] lista, int inf, int sup) {
        if (inf < sup) {
            int p = particion(lista, inf, sup);
            ordenacionRapida(lista, inf, p - 1);
            ordenacionRapida(lista, p + 1, sup);
        }
    }

    static int particion(int[] lista, int inf, int sup) {
        int pivote = lista[sup];
        int i = inf;
        for (int j = inf; j < sup; j++) {
            if (lista[j] <= pivote) {
                int aux = lista[i];
                lista[i] = lista[j];
                lista[j] = aux;
                i = i + 1;
            }
        }
        int aux = lista[i];
        lista[i] = lista[sup];
        lista[sup] = aux;
        return i;
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        ordenacionRapida(notas, 0, notas.length - 1);
        System.out.println(Arrays.toString(notas));
    }
}
