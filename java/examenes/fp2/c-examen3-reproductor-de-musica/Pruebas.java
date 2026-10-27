/* Simulacro práctico de FP2 · versión C · Reproductor de música (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        MusicPlayer p = new MusicPlayer();
        System.out.println(p.getCurrent() + " " + p.next());   // null false
        p.add(new Song("Isla", 214));
        p.add(new Song("Alisios", 187));
        p.add(new Song("Timanfaya", 243));
        System.out.println(p);                                 // ->{*Isla (214 s)*}<->[Alisios (187 s)]<->[Timanfaya (243 s)]->null
        p.next();
        p.next();
        System.out.println(p.next() + " " + p.getCurrent());   // false Timanfaya (243 s)
        System.out.println(p.removeCurrent());                 // Timanfaya (243 s)
        System.out.println(p);                                 // ->[Isla (214 s)]<->{*Alisios (187 s)*}->null
        System.out.println(p.getTotalSeconds() + " " + p.getSize());   // 401 2
    }
}
