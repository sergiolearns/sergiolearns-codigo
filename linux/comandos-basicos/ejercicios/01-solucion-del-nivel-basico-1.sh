# Solución del ejercicio 1 (nivel básico): rutas sin moverse
# Del artículo «Comandos básicos de Linux — ejercicios con rutas, comodines, una entrega de IC2 y una carpeta en caos (y el espacio que se llevó mis archivos .c)»
# https://sergiolearns.com/comandos-basicos-de-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# --- Preparación ---
mkdir -p proyecto/src/utils proyecto/src/tests proyecto/docs
touch proyecto/src/main.c proyecto/src/utils/helpers.c proyecto/src/utils/math.c
touch proyecto/src/tests/test1.c proyecto/docs/manual.txt
echo 'Proyecto de IC2' > proyecto/docs/readme.txt

# --- Solución ---
# 1. contenido de utils sin moverme de mi carpeta
ls proyecto/src/utils
# 2. ver readme.txt: cat acepta rutas igual que ls
cat proyecto/docs/readme.txt
# 3. copiar helpers.c a tests (destino = carpeta que existe)
cp proyecto/src/utils/helpers.c proyecto/src/tests/
ls proyecto/src/tests
# 4. todos los .c: un * por cada nivel de carpeta
ls proyecto/src/*.c proyecto/src/*/*.c
# ** en bash NO baja a todos los niveles: vale lo mismo que *
ls proyecto/**/*.c
# 5. cuántos .c hay en utils
ls proyecto/src/utils/*.c
