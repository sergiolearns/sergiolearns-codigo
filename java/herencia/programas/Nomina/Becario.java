// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class Becario extends EmpleadoFijo {

    public Becario(String nombre) {
        super(nombre, 600, 0);                        // un becario es un fijo con base 600 y 0 años
    }

    @Override
    public String getTipo() { return "Becario"; }
}
