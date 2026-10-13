/*
 * Programa 3: inventario de un laboratorio con códigos automáticos
 * Del artículo «Clases y objetos en Java — práctica con un banco, una biblioteca y el inventario de un laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */

public class InventarioLab {
    public static void main(String[] args) {
        Equipo[] lab = {
            new Equipo("Portátil"), new Equipo("Monitor"),
            new Equipo("Portátil"), new Equipo("Router")
        };
        lab[1].marcarAveriado();
        lab[3].marcarAveriado();

        int averiados = 0;
        for (Equipo e : lab) {
            System.out.println(e);
            if (e.isAveriado()) averiados++;
        }
        System.out.println("Equipos creados: " + Equipo.getContador() + " · averiados: " + averiados);

        Equipo mismo = lab[0];
        System.out.println(lab[0].equals(mismo) + " " + lab[0].equals(lab[2]));
        lab[1].reparar();
        System.out.println(lab[1]);
    }
}
