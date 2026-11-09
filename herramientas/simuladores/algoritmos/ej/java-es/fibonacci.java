public class Main {
    static long fibonacci(int n) {
        if (n < 2) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        int n = 5;
        System.out.println("fibonacci(" + n + ") = " + fibonacci(n));
    }
}
