/*
 * Solución del ejercicio 1: calculadora de IMC
 * Del artículo «Variables en Java ejercicios — IMC, segundos y el inventario de la copistería (y el porcentaje que se quedaba en 100)»
 * https://sergiolearns.com/variables-en-java-ejercicios/
 */
/** Ejercicio 1: IMC con datos fijos y la clasificación con booleanos (sin if, que llega en el tema siguiente). */
public class CalculadoraIMC {
    public static void main(String[] args) {
        final double IMC_MIN = 18.5;            // límites del rango saludable
        final double IMC_MAX = 24.9;
        double peso = 70;                       // el int 70 se convierte solo en 70.0
        double altura = 1.75;

        double imc = peso / (altura * altura);  // altura^2 en Java sería otra cosa (XOR)
        double pesoMin = IMC_MIN * altura * altura;
        double pesoMax = IMC_MAX * altura * altura;
        boolean bajoPeso = imc < IMC_MIN;
        boolean normopeso = imc >= IMC_MIN && imc < 25;
        boolean sobrepeso = imc >= 25 && imc < 30;
        boolean obesidad = imc >= 30;

        System.out.println("=== CALCULADORA DE IMC ===");
        System.out.println("Peso (kg):  " + peso);
        System.out.println("Altura (m): " + altura);
        System.out.printf("IMC:             %.2f%n", imc);
        System.out.printf("Peso saludable:  entre %.1f kg y %.1f kg%n", pesoMin, pesoMax);
        System.out.println("Bajo peso:  " + bajoPeso);
        System.out.println("Normopeso:  " + normopeso);
        System.out.println("Sobrepeso:  " + sobrepeso);
        System.out.println("Obesidad:   " + obesidad);
    }
}
