public class Main {
    static void hanoi(int n, String origen, String destino, String auxiliar) {
        if (n == 0) {
            return;
        }
        hanoi(n - 1, origen, auxiliar, destino);
        System.out.println("Disco " + n + " de " + origen + " a " + destino);
        hanoi(n - 1, auxiliar, destino, origen);
    }

    public static void main(String[] args) {
        int n = 3;
        hanoi(n, "A", "C", "B");
    }
}
