// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

public class Fecha {

    private final int dia;
    private final int mes;
    private final int anio;

    public Fecha(int dia, int mes, int anio) {
        if (mes < 1 || mes > 12) {
            throw new IllegalArgumentException("mes no válido: " + mes);
        }
        int max = diasDelMes(mes, anio);
        if (dia < 1 || dia > max) {
            throw new IllegalArgumentException("día no válido: " + dia + " (el mes " + mes + " de " + anio + " tiene " + max + " días)");
        }
        this.dia = dia;                              // solo se guarda si todo es correcto
        this.mes = mes;
        this.anio = anio;
    }

    public static boolean esBisiesto(int anio) {
        return (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;
    }

    public static int diasDelMes(int mes, int anio) {
        switch (mes) {
            case 2:
                return esBisiesto(anio) ? 29 : 28;
            case 4: case 6: case 9: case 11:
                return 30;
            default:
                return 31;
        }
    }

    // "12/10/2026" -> Fecha. Cualquier problema se convierte en IllegalArgumentException
    public static Fecha parse(String texto) {
        String[] partes = texto.trim().split("/");
        if (partes.length != 3) {
            throw new IllegalArgumentException("formato no válido: \"" + texto + "\" (usa dd/mm/aaaa)");
        }
        try {
            int d = Integer.parseInt(partes[0]);
            int m = Integer.parseInt(partes[1]);
            int a = Integer.parseInt(partes[2]);
            return new Fecha(d, m, a);
        } catch (NumberFormatException e) {
            // traducimos el error técnico a uno del dominio, y guardamos el original como causa
            throw new IllegalArgumentException("formato no válido: \"" + texto + "\" (solo números)", e);
        }
    }

    @Override
    public String toString() {
        return String.format("%02d/%02d/%04d", dia, mes, anio);
    }
}
