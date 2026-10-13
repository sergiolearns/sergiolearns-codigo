/*
 * Nivel 3 — Banco con excepciones propias
 * Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)»
 * https://sergiolearns.com/excepciones-en-java-ejercicios/
 */

public class Main {
    public static void main(String[] args) {
        Banco banco = new Banco(3);
        banco.abrir("ES01", 500);
        banco.abrir("ES02", 100);
        banco.abrir("ES03", 0);
        double antes = banco.total();

        String[][] ordenes = {
            {"ES01", "ES02", "200"},
            {"ES02", "ES99", "50"},
            {"ES02", "ES01", "400"},
            {"ES02", "ES02", "10"},
            {"ES01", "ES03", "-5"},
            {"ES02", "ES03", "300"}
        };

        int correctas = 0;
        for (String[] o : ordenes) {
            String texto = o[0] + " -> " + o[1] + " (" + o[2] + " €)";
            try {
                banco.transferir(o[0], o[1], Double.parseDouble(o[2]));
                correctas++;
                System.out.println("OK  " + texto);
            } catch (SaldoInsuficienteException e) {
                System.out.printf("ERR %s: %s. ¿Transferir %.2f € en su lugar?%n",
                        texto, e.getMessage(), Double.parseDouble(o[2]) - e.getFaltan());
            } catch (BancoException e) {
                System.out.println("ERR " + texto + ": " + e.getMessage());
            } catch (IllegalArgumentException e) {
                System.out.println("ERR " + texto + ": " + e.getMessage());
            }
        }

        System.out.println("\nCorrectas: " + correctas + " de " + ordenes.length);
        banco.listar();
        System.out.printf("Dinero total antes: %.2f € · después: %.2f €%n", antes, banco.total());
    }
}
