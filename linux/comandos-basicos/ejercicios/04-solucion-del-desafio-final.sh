# Solución del ejercicio 4 (desafío final): organiza el caos
# Del artículo «Comandos básicos de Linux — ejercicios con rutas, comodines, una entrega de IC2 y una carpeta en caos (y el espacio que se llevó mis archivos .c)»
# https://sergiolearns.com/comandos-basicos-de-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# --- Preparación ---
mkdir caos
cd caos
touch practica1.c practica2.c practica3.c examen_final.c examen_parcial.c
touch apuntes_linux.txt apuntes_c.txt apuntes_python.txt foto_clase.jpg foto_lab.jpg
touch borrar_esto.tmp basura.tmp cache.tmp
echo 'int main(void) { return 0; }' > practica1.c
ls

# --- Solución ---
# 1. toda la estructura de una vez
mkdir -p codigo/practicas codigo/examenes apuntes multimedia
# 2-5. un comodín por grupo de archivos
mv practica*.c codigo/practicas/
mv examen*.c codigo/examenes/
mv apuntes*.txt apuntes/
mv *.jpg multimedia/
# 6. revisar antes de borrar y borrar preguntando uno a uno
ls *.tmp
rm -i *.tmp
# 7. el resultado completo
ls -R
