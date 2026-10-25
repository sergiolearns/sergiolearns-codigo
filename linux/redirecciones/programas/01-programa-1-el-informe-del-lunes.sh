# Programa 1: el informe del lunes con > y >>
# Del artículo «Redirecciones y tuberías en Linux — práctica con un informe que crece con >>, un ranking guardado con tee y avisos separados de lo correcto (y el informe que se comió a sí mismo)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Programa 1: el informe del lunes, línea a línea con > y >>
echo "== Aula 1.3: lunes 19 de octubre ==" > informe.txt  # > solo la primera vez: informe limpio
echo -n "Registros: " >> informe.txt         # -n: sin salto de línea, el número irá al lado
wc -l < accesos.log >> informe.txt           # < para que wc no escriba el nombre del fichero
echo -n "Entradas correctas: " >> informe.txt
grep -c "LOGIN OK" accesos.log >> informe.txt  # comillas: el patrón lleva un espacio
echo -n "Intentos fallidos: " >> informe.txt
grep -c "LOGIN FAIL" accesos.log >> informe.txt
echo -n "Salidas: " >> informe.txt
grep -c LOGOUT accesos.log >> informe.txt
echo "Usuarios distintos:" >> informe.txt
cut -d' ' -f4 accesos.log | sort -u >> informe.txt  # la redirección va al final de la tubería
cat informe.txt
wc -l informe.txt
