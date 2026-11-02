/*
 * Programa 1: validador de datos de usuario (alta en el campus virtual)
 * Del artículo «Control de flujo en Java — práctica con un registro, la ventanilla de secretaría y un adivino de tres intentos (y las contraseñas que no coincidían aunque fueran iguales)»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */
import java.util.Scanner;

/**
 * Alta en el campus virtual: cada dato se valida con if/else y los textos se comparan con equals().
 * Datos de Laura inventados.
 */
public class RegistroUsuario {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== ALTA EN EL CAMPUS VIRTUAL ===");

        System.out.print("Nombre y apellido: ");
        String nombre = sc.nextLine().trim();      // trim() quita los espacios de los bordes

        System.out.print("Edad: ");
        int edad = sc.nextInt();
        sc.nextLine();                             // se lleva el Intro que deja nextInt()

        System.out.print("Correo: ");
        String correo = sc.nextLine().trim();

        System.out.print("Contraseña: ");
        String clave = sc.nextLine();              // sin trim(): un espacio también es parte de la clave

        System.out.print("Repite la contraseña: ");
        String clave2 = sc.nextLine();

        System.out.print("¿Aceptas las normas del campus? (s/n): ");
        String acepta = sc.nextLine().trim();

        System.out.println();
        System.out.println("--- Comprobación ---");
        boolean todoBien = true;                   // empieza en true: cualquier fallo lo pone a false

        // 1. El nombre no puede estar vacío
        if (nombre.isEmpty()) {
            System.out.println("Nombre: vacío");
            todoBien = false;
        } else {
            System.out.println("Nombre: correcto");
        }

        // 2. Edad entre 16 y 99: se tienen que cumplir las DOS cosas, así que &&
        if (edad >= 16 && edad <= 99) {
            System.out.println("Edad: correcta");
        } else {
            System.out.println("Edad: fuera de rango (16-99)");
            todoBien = false;
        }

        // 3. Correo: una @ que no esté al principio y un punto después de la @ (y no al final)
        int arroba = correo.indexOf('@');          // -1 si no hay ninguna
        int punto = correo.lastIndexOf('.');       // el último punto: el de .es, .com...
        if (arroba > 0 && punto > arroba + 1 && punto < correo.length() - 1) {
            System.out.println("Correo: correcto");
        } else {
            System.out.println("Correo: no válido");
            todoBien = false;
        }

        // 4. Contraseña: primero la longitud; si es larga, que no sea el propio nombre
        if (clave.length() < 8) {
            System.out.println("Contraseña: demasiado corta (" + clave.length() + " de 8)");
            todoBien = false;
        } else if (clave.equalsIgnoreCase(nombre)) {
            System.out.println("Contraseña: no puede ser tu nombre");
            todoBien = false;
        } else {
            System.out.println("Contraseña: correcta");
        }

        // 5. Las dos contraseñas: equals() compara las letras, una a una y con mayúsculas
        if (clave.equals(clave2)) {
            System.out.println("Repetición: coincide");
        } else {
            System.out.println("Repetición: no coincide");
            todoBien = false;
        }

        // 6. Vale «s» y «S»: equalsIgnoreCase no distingue mayúsculas de minúsculas
        if (acepta.equalsIgnoreCase("s")) {
            System.out.println("Normas: aceptadas");
        } else {
            System.out.println("Normas: sin aceptar");
            todoBien = false;
        }

        System.out.println();
        if (todoBien) {
            // Solo aquí es seguro cortar el correo: sabemos que la @ existe y no está en la posición 0
            String usuario = correo.substring(0, arroba);
            System.out.println("Alta hecha. Tu usuario es " + usuario + ".");
        } else {
            System.out.println("No se puede dar de alta: revisa lo que está mal.");
        }
        sc.close();
    }
}
