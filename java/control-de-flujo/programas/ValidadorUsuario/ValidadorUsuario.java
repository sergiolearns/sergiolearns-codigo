/*
 * Control de flujo en Java práctica — Programa 1: Validador de datos de usuario
 * Del artículo «Control de flujo en Java — práctica con validador, menú y adivina el número»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */

import java.util.Scanner;

public class ValidadorUsuario {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== REGISTRO DE USUARIO ===");
        System.out.println();

        // Edad — nextInt() deja el salto de línea "\n" sin consumir
        System.out.print("Edad: ");
        int edad = sc.nextInt();
        sc.nextLine();    // limpiador — sin esto, el email se leería vacío

        boolean edadValida = edad >= 16 && edad <= 99;
        if (edadValida) {
            System.out.println("✓ Edad válida");
        } else {
            System.out.println("✗ La edad debe estar entre 16 y 99 años");
        }

        // Email — validación básica sin librerías externas
        System.out.print("Email: ");
        String email = sc.nextLine();

        // contains() busca un fragmento de texto dentro del String
        boolean emailValido = email.contains("@") && email.contains(".");
        if (emailValido) {
            System.out.println("✓ Email con formato válido");
        } else {
            System.out.println("✗ El email debe contener @ y un punto");
        }

        // Contraseña — comprobamos varias condiciones a la vez
        System.out.print("Contraseña: ");
        String contrasena = sc.nextLine();

        boolean longitudOk = contrasena.length() >= 8;
        boolean tieneNumero = false;
        for (char c : contrasena.toCharArray()) {
            if (Character.isDigit(c)) {
                tieneNumero = true;
                break;    // en cuanto encontramos un número, no hace falta seguir mirando
            }
        }

        if (longitudOk && tieneNumero) {
            System.out.println("✓ Contraseña válida");
        } else if (!longitudOk && !tieneNumero) {
            System.out.println("✗ Contraseña demasiado corta y sin números");
        } else if (!longitudOk) {
            System.out.println("✗ La contraseña necesita al menos 8 caracteres");
        } else {
            System.out.println("✗ La contraseña necesita al menos un número");
        }

        // Resumen final con operador ternario
        System.out.println();
        boolean todoValido = edadValida && emailValido && longitudOk && tieneNumero;
        System.out.println(todoValido ? "=== REGISTRO COMPLETADO ===" : "=== REVISA LOS CAMPOS MARCADOS ===");

        sc.close();
    }
}
