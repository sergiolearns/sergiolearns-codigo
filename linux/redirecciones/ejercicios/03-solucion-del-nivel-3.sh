# Solución del nivel 3
# Del artículo «Redirecciones y tuberías en Linux — ejercicios con intentos fallidos, rankings que se parten y un 2>&1 en el sitio equivocado (y un grep que contaba cero errores con la pantalla llena de ellos)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Nivel 3: informe de uso de cada ordenador, con cabecera y sin ruido de errores
cat << EOF > uso.txt
Uso de los ordenadores del aula 1.3
Generado por $USER
EOF
cat accesos.log martes.log 2> /dev/null | cut -d' ' -f3 | sort | uniq -c >> uso.txt  # martes.log aún no existe
cat uso.txt
tail -n +3 uso.txt | sort -nr | head -1     # desde la línea 3 (sin cabecera): el más usado
