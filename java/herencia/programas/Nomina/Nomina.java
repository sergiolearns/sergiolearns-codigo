/*
 * Programa 1: una nómina con tres tipos de empleado
 * Del artículo «Herencia en Java — práctica con una nómina, unas figuras en tres pisos y dos tipos de cuenta (y el saldo que hice public para que compilara)»
 * https://sergiolearns.com/herencia-en-java-practica/
 */

public class Nomina {

    public static void main(String[] args) {
        Freelance marta = new Freelance("Marta", 25);
        marta.registrarHoras(40);
        marta.registrarHoras(32);
        marta.registrarHoras(-5);                      // se ignora

        Empleado[] plantilla = {
            new EmpleadoFijo("Carmen", 1800, 7),
            marta,
            new Becario("Iván"),
            new EmpleadoFijo("Jorge", 1500, 2)
        };

        double total = 0;
        for (Empleado e : plantilla) {
            System.out.println(e.lineaNomina());       // cada uno calcula su salario
            total += e.salarioMensual();
        }
        System.out.printf("TOTAL%22.2f €%n", total);

        int fijos = 0, fijosPuros = 0;
        for (Empleado e : plantilla) {
            if (e instanceof EmpleadoFijo) fijos++;            // ¿cuenta el becario?
            if (e.getClass() == EmpleadoFijo.class) fijosPuros++;   // solo la clase exacta
        }
        System.out.println("Con contrato fijo: " + fijos);
        System.out.println("Fijos que no son becarios: " + fijosPuros);
    }
}
