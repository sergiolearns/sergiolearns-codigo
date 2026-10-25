# Programa 3: separar lo correcto de los avisos (necesita revisar.sh)
# Del artículo «Redirecciones y tuberías en Linux — práctica con un informe que crece con >>, un ranking guardado con tee y avisos separados de lo correcto (y el informe que se comió a sí mismo)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Programa 3: separar lo correcto de los avisos de revisar.sh
bash revisar.sh                                # en pantalla se mezclan stdout y stderr
bash revisar.sh > correctos.txt                # los avisos (stderr) siguen saliendo
bash revisar.sh > correctos.txt 2> avisos.txt  # cada flujo a su fichero: pantalla limpia
cat correctos.txt
cat avisos.txt
bash revisar.sh 2>&1 | grep -c AVISO           # para filtrar avisos, tienen que entrar en la tubería
bash revisar.sh 2> /dev/null | wc -l           # solo los correctos: los avisos, a la basura
bash revisar.sh > todo.txt 2>&1                # todo junto, en su orden, en un solo fichero
cat todo.txt
