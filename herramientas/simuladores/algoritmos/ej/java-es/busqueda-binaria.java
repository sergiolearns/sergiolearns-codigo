public class Main {
    static int busquedaBinaria(int[] lista, int buscado) {
        int inf = 0;
        int sup = lista.length - 1;
        while (inf <= sup) {
            int medio = (inf + sup) / 2;
            if (lista[medio] == buscado) {
                return medio;
            } else if (lista[medio] < buscado) {
                inf = medio + 1;
            } else {
                sup = medio - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] turnos = {3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90};
        int buscado = 58;
        System.out.println("Turno en la posición " + busquedaBinaria(turnos, buscado));
    }
}
