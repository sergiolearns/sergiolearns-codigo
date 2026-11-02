/*
 * Solución del nivel 2: una Fraccion inmutable
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public final class Fraccion {    // final: nadie puede heredar y "romper" la inmutabilidad
    private final int num;
    private final int den;

    public Fraccion(int num, int den) {
        if (den == 0) {
            throw new IllegalArgumentException("El denominador no puede ser 0");
        }
        if (den < 0) {               // el signo, siempre arriba: 1/-3 → -1/3
            num = -num;
            den = -den;
        }
        int m = mcd(Math.abs(num), den);
        this.num = num / m;          // se guarda ya simplificada: 2/4 → 1/2
        this.den = den / m;
    }

    // Ayuda interna que no usa ningún atributo: private y static
    private static int mcd(int a, int b) {
        while (b != 0) {             // algoritmo de Euclides
            int r = a % b;
            a = b;
            b = r;
        }
        return a == 0 ? 1 : a;       // protección: nunca dividir entre 0
    }

    // No cambian this: devuelven una fracción NUEVA
    public Fraccion sumar(Fraccion o) {
        return new Fraccion(num * o.den + o.num * den, den * o.den);
    }

    public Fraccion multiplicar(Fraccion o) {
        return new Fraccion(num * o.num, den * o.den);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Fraccion)) return false;
        Fraccion f = (Fraccion) o;
        return num == f.num && den == f.den;    // basta porque están simplificadas
    }

    @Override
    public int hashCode() {
        return 31 * num + den;
    }

    @Override
    public String toString() {
        return den == 1 ? String.valueOf(num) : num + "/" + den;
    }
}
