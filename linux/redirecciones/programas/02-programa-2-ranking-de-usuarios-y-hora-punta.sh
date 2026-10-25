# Programa 2: ranking de usuarios, fallos y hora punta
# Del artículo «Redirecciones y tuberías en Linux — práctica con un informe que crece con >>, un ranking guardado con tee y avisos separados de lo correcto (y el informe que se comió a sí mismo)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas con accesos.log (está en linux/redirecciones/), nunca como root.

# Programa 2: ranking de usuarios, fallos por persona y hora punta
cut -d' ' -f4 accesos.log | sort | uniq -c | sort -nr | tee ranking.txt | head -3
wc -l ranking.txt                                             # tee guardó el ranking ENTERO, no solo el top 3
grep "LOGIN FAIL" accesos.log | cut -d' ' -f4 | sort | uniq -c | sort -nr
cut -d' ' -f2 accesos.log | cut -d: -f1 | sort | uniq -c | sort -nr | head -1
