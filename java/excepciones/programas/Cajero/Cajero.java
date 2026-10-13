/*
 * El código
 * Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)»
 * https://sergiolearns.com/excepciones-en-java-practica/
 */

public class Cajero {

    public static void main(String[] args) {
        Cuenta cuenta = new Cuenta("1234", 120);

        // Cada operación: {PIN tecleado, cantidad tecleada}
        String[][] operaciones = {
            {"1234", "50"},
            {"1234", "35"},
            {"1234", "veinte"},
            {"1234", "100"},
            {"1111", "20"},
            {"1234", "20"},
            {"0000", "10"},
            {"9999", "10"},
            {"8888", "10"},
            {"1234", "10"}
        };

        int ticket = 0;
        for (String[] op : operaciones) {
            ticket++;
            try {
                cuenta.comprobarPin(op[0]);
                double cantidad = Double.parseDouble(op[1]);
                cuenta.retirar(cantidad);
                System.out.printf("#%d Retirados %s €. Saldo: %.2f €%n", ticket, op[1], cuenta.getSaldo());
            } catch (SaldoInsuficienteException e) {
                System.out.printf("#%d %s (pedías %s €)%n", ticket, e.getMessage(), op[1]);
            } catch (CuentaBloqueadaException e) {
                System.out.println("#" + ticket + " " + e.getMessage() + ". Retenemos la tarjeta.");
                break;                                        // salimos del bucle... pero antes, finally
            } catch (NumberFormatException e) {
                System.out.println("#" + ticket + " \"" + op[1] + "\" no es una cantidad");
            } catch (IllegalArgumentException e) {
                System.out.println("#" + ticket + " " + e.getMessage());
            } finally {
                System.out.println("   (operación " + ticket + " registrada)");
            }
        }
    }
}
