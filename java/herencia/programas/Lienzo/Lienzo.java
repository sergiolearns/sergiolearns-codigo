/*
 * Programa 2: un lienzo de figuras con herencia en varios niveles
 * Del artículo «Herencia en Java — práctica con una nómina, unas figuras en tres pisos y dos tipos de cuenta (y el saldo que hice public para que compilara)»
 * https://sergiolearns.com/herencia-en-java-practica/
 */

public class Lienzo {

    // Recibe figuras de cualquier tipo: solo usa lo que tiene toda Figura
    public static Figura mayor(Figura[] figuras) {
        Figura max = figuras[0];                       // candidato: la primera
        for (Figura f : figuras) {
            if (f.area() > max.area()) max = f;        // polimorfismo: cada una calcula su área
        }
        return max;
    }

    public static void main(String[] args) {
        Figura[] figuras = {
            new Circulo(2),
            new Rectangulo(3, 4.5),
            new Cuadrado(3.5),
            new Circulo(1)
        };

        double areaTotal = 0;
        for (Figura f : figuras) {
            System.out.println(f);                     // el toString de Figura
            areaTotal += f.area();
        }
        System.out.printf("Área total: %.2f%n", areaTotal);
        System.out.println("La mayor: " + mayor(figuras).getNombre());

        int rectangulares = 0;
        for (Figura f : figuras) {
            if (f instanceof Rectangulo) rectangulares++;   // ¿y el cuadrado?
        }
        System.out.println("Rectangulares: " + rectangulares);
    }
}
