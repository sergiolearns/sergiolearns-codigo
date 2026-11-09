public class Main {
    static void hanoi(int n, String source, String dest, String spare) {
        if (n == 0) {
            return;
        }
        hanoi(n - 1, source, spare, dest);
        System.out.println("Disk " + n + " from " + source + " to " + dest);
        hanoi(n - 1, spare, dest, source);
    }

    public static void main(String[] args) {
        int n = 3;
        hanoi(n, "A", "C", "B");
    }
}
