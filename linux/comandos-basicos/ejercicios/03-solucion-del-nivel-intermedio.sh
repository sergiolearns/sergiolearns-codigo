# Solución del ejercicio 3 (nivel intermedio): la entrega de la práctica 2
# Del artículo «Comandos básicos de Linux — ejercicios con rutas, comodines, una entrega de IC2 y una carpeta en caos (y el espacio que se llevó mis archivos .c)»
# https://sergiolearns.com/comandos-basicos-de-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# --- Preparación ---
mkdir -p IC2/Practicas/P2/pruebas IC2/Entregas
cd IC2/Practicas/P2
touch main.c funciones.c funciones.h notas.txt borrador.c
ls

# --- Solución ---
# 1. copia de seguridad de toda la práctica (carpeta: hace falta -r)
cp -r ../P2 ../P2_copia
ls ..
# 2. renombrar main.c con mi apellido
mv main.c p2_medina.c
# 3. copiar a Entregas solo lo que se entrega: varias fuentes, un destino
cp p2_medina.c funciones.c funciones.h ../../Entregas/
ls ../../Entregas
# 4. borrar el borrador preguntando
rm -i borrador.c
# 5. quitar la carpeta pruebas, que está vacía
rmdir pruebas
# 6. comprobar cómo queda
ls
ls ../P2_copia
