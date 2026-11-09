public class Main {
    static long potencia(long base, int exp) {
        if (exp == 0) {
            return 1;
        }
        if (exp == 1) {
            return base;
        }
        int mitad = exp / 2;
        return potencia(base, mitad) * potencia(base, exp - mitad);
    }

    public static void main(String[] args) {
        long base = 2;
        int exp = 8;
        System.out.println(base + "^" + exp + " = " + potencia(base, exp));
    }
}
