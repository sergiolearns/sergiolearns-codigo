# Solución del nivel 1
# Del artículo «Redirecciones y tuberías en Linux — ejercicios con intentos fallidos, rankings que se parten y un 2>&1 en el sitio equivocado (y un grep que contaba cero errores con la pantalla llena de ellos)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Nivel 1: los intentos fallidos, guardados y contados
grep "LOGIN FAIL" accesos.log > fallos.txt  # > crea fallos.txt solo con las líneas que encajan
cat fallos.txt
wc -l < fallos.txt                          # < : el número a secas, sin el nombre del fichero
