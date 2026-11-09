public class Main {
    static int buscar(int[] lista, int buscado) {
        return buscarEntre(lista, buscado, 0, lista.length - 1);
    }

    static int buscarEntre(int[] lista, int buscado, int inf, int sup) {
        if (inf > sup) {
            return -1;
        }
        int medio = (inf + sup) / 2;
        if (lista[medio] == buscado) {
            return medio;
        }
        if (lista[medio] < buscado) {
            return buscarEntre(lista, buscado, medio + 1, sup);
        }
        return buscarEntre(lista, buscado, inf, medio - 1);
    }

    public static void main(String[] args) {
        int[] turnos = {3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90};
        int buscado = 17;
        System.out.println("Turno en la posición " + buscar(turnos, buscado));
    }
}
