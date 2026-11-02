/*
 * Programa 3: un banco con cuentas de ahorro y corrientes
 * Del artículo «Herencia en Java — práctica con una nómina, unas figuras en tres pisos y dos tipos de cuenta (y el saldo que hice public para que compilara)»
 * https://sergiolearns.com/herencia-en-java-practica/
 */

public class Banco {

    public static void main(String[] args) {
        Cuenta[] cuentas = {
            new CuentaAhorro("Laura", 500, 0.02),
            new CuentaCorriente("Pablo", 100, 300),
            new Cuenta("Marta", 50)
        };

        // El mismo bucle, tres reglas distintas
        for (Cuenta c : cuentas) {
            System.out.printf("%-6s %-5b %-5b %-5b%n", c.getTitular(),
                    c.retirar(150), c.retirar(150), c.retirar(150));
        }

        // Fin de mes: intereses solo a las cuentas de ahorro
        for (Cuenta c : cuentas) {
            if (c instanceof CuentaAhorro ahorro) {
                ahorro.aplicarIntereses();
            }
            System.out.println(c);
        }
    }
}
