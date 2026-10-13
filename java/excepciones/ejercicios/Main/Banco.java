// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

public class Banco {

    private final Cuenta[] cuentas;
    private int numCuentas = 0;

    public Banco(int capacidad) {
        cuentas = new Cuenta[capacidad];
    }

    public void abrir(String iban, double saldoInicial) {
        if (numCuentas == cuentas.length) {
            throw new IllegalStateException("el banco está lleno");
        }
        cuentas[numCuentas++] = new Cuenta(iban, saldoInicial);
    }

    public Cuenta buscar(String iban) throws CuentaNoEncontradaException {
        for (int i = 0; i < numCuentas; i++) {
            if (cuentas[i].getIban().equals(iban)) {
                return cuentas[i];
            }
        }
        throw new CuentaNoEncontradaException(iban);
    }

    public void transferir(String origen, String destino, double cantidad) throws BancoException {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("cantidad no válida: " + cantidad);
        }
        Cuenta o = buscar(origen);                   // buscamos las DOS antes de mover un céntimo
        Cuenta d = buscar(destino);
        if (o == d) {
            throw new IllegalArgumentException("origen y destino son la misma cuenta");
        }
        if (cantidad > o.getSaldo()) {
            throw new SaldoInsuficienteException(origen, cantidad - o.getSaldo());
        }
        o.sacar(cantidad);                           // a partir de aquí ya no puede fallar nada
        d.meter(cantidad);
    }

    public double total() {
        double t = 0;
        for (int i = 0; i < numCuentas; i++) {
            t += cuentas[i].getSaldo();
        }
        return t;
    }

    public void listar() {
        for (int i = 0; i < numCuentas; i++) {
            System.out.printf("  %s: %8.2f €%n", cuentas[i].getIban(), cuentas[i].getSaldo());
        }
    }
}
