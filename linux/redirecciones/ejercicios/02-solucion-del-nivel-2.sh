# Solución del nivel 2
# Del artículo «Redirecciones y tuberías en Linux — ejercicios con intentos fallidos, rankings que se parten y un 2>&1 en el sitio equivocado (y un grep que contaba cero errores con la pantalla llena de ellos)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Nivel 2: quién falla más, guardado y en pantalla a la vez
grep "LOGIN FAIL" accesos.log | cut -d' ' -f4 | sort | uniq -c | sort -nr | tee fallos-por-usuario.txt
wc -l fallos-por-usuario.txt                # una línea por persona que ha fallado
