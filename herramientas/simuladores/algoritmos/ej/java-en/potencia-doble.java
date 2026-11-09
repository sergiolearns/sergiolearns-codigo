public class Main {
    static long power(long base, int exp) {
        if (exp == 0) {
            return 1;
        }
        if (exp == 1) {
            return base;
        }
        int half = exp / 2;
        return power(base, half) * power(base, exp - half);
    }

    public static void main(String[] args) {
        long base = 2;
        int exp = 8;
        System.out.println(base + "^" + exp + " = " + power(base, exp));
    }
}
