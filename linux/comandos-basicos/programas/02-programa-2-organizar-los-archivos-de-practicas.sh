# Programa 2 · Copiar y organizar los archivos de tus prácticas
# Del artículo «Comandos básicos de Linux — práctica explorando Fedora, montando tu carpeta de IC2 y saliendo de un laberinto de carpetas (y la estructura que creé en el sitio equivocado)»
# https://sergiolearns.com/comandos-basicos-de-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# 1. La estructura de IC2, de una vez (-p crea lo que falte)
mkdir -p IC2/Practicas/P1_introduccion IC2/Practicas/P2_comandos IC2/Apuntes IC2/Entregas
ls -l IC2
ls -R IC2
# 2. Archivos de prueba en la práctica 1
cd IC2/Practicas/P1_introduccion
touch hola.c ejercicio1.c ejercicio2.c
ls -l
# 3. Copiar a la práctica 2 y renombrar
cp ejercicio1.c ../P2_comandos/
ls ../P2_comandos
mv ejercicio2.c practica_final.c
ls
# 4. Contenido: > crea o machaca, >> añade al final
echo '#include <stdio.h>' > hola.c
echo 'int main(void) { return 0; }' >> hola.c
cat hola.c
ls -l hola.c
# 5. Borrar con red: rm -i pregunta y contesto y
rm -i practica_final.c
ls
