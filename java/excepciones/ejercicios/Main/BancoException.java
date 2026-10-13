// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

// Madre de todos los problemas del banco: capturándola, se capturan todas sus hijas
public class BancoException extends Exception {

    public BancoException(String mensaje) {
        super(mensaje);
    }
}
