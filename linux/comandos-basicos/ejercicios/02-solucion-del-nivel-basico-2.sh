# Solución del ejercicio 2 (nivel básico): comodines
# Del artículo «Comandos básicos de Linux — ejercicios con rutas, comodines, una entrega de IC2 y una carpeta en caos (y el espacio que se llevó mis archivos .c)»
# https://sergiolearns.com/comandos-basicos-de-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# --- Preparación ---
mkdir comodines
cd comodines
touch archivo1.txt archivo2.txt archivo3.txt datos1.csv datos2.csv datos3.csv
touch script1.sh script2.sh imagen.png foto.jpg video.mp4 .oculto1 .oculto2
ls -a

# --- Solución ---
# 1. solo los .txt
ls *.txt
# 2. .txt y .csv en una sola orden: dos patrones
ls *.txt *.csv
# 3. los que empiezan por datos
ls datos*
# 4. los que tienen una cifra en cualquier parte del nombre
ls *[0-9]*
# 5. los ocultos que empiezan por .o (el patrón ya lleva el punto)
ls -d .o*
# 6. copiar los de texto a una carpeta nueva
mkdir textos
cp *.txt *.csv textos/
ls textos
# 7. un patrón que no encaja con nada llega tal cual a ls
ls *.pdf
