public class Main {
    static long power(long base, int exp) {
        if (exp == 0) {
            return 1;
        }
        long half = power(base, exp / 2);
        if (exp % 2 == 0) {
            return half * half;
        }
        return half * half * base;
    }

    public static void main(String[] args) {
        long base = 2;
        int exp = 8;
        System.out.println(base + "^" + exp + " = " + power(base, exp));
    }
}
