// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class Cuadrado extends Rectangulo {

    public Cuadrado(double lado) {
        super("Cuadrado", lado, lado);                // un cuadrado es un rectángulo con base = altura
    }
    // No hace falta escribir area() ni perimetro(): los hereda de Rectangulo
}
