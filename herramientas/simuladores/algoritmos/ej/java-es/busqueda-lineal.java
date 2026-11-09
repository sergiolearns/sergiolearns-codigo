public class Main {
    static int buscar(int[] lista, int buscado) {
        for (int i = 0; i < lista.length; i++) {
            if (lista[i] == buscado) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] notas = {7, 3, 9, 5, 10, 4, 8, 6};
        int buscado = 10;
        System.out.println("Está en la posición " + buscar(notas, buscado));
    }
}
