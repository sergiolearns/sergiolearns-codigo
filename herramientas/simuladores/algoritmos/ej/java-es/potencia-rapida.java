public class Main {
    static long potencia(long base, int exp) {
        if (exp == 0) {
            return 1;
        }
        long mitad = potencia(base, exp / 2);
        if (exp % 2 == 0) {
            return mitad * mitad;
        }
        return mitad * mitad * base;
    }

    public static void main(String[] args) {
        long base = 2;
        int exp = 8;
        System.out.println(base + "^" + exp + " = " + potencia(base, exp));
    }
}
