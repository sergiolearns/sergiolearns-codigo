# Programa 2: probarlo con tres usuarios
# Del artículo «Permisos en Linux — práctica con la carpeta de un trabajo en grupo, tres usuarios y un revisor de permisos (y la compañera que no podía compilar)»
# https://sergiolearns.com/permisos-en-linux-practica/
# Sesión con varios usuarios: cada línea "# @usuario" indica que lo que sigue se teclea en la terminal de esa persona.
# Parte de la carpeta que deja el programa 1.

# @laura — Laura (grupo ic2) prueba la carpeta desde su terminal
ls practica-ic2/docs
cat practica-ic2/docs/apuntes-privados.txt
cd practica-ic2
./compilar.sh
echo "Parte de Laura: ejercicio 2" >> docs/entrega.txt
# @pablo — Pablo (otra clase, no está en ic2) curiosea
ls practica-ic2
cat practica-ic2/docs/entrega.txt
# @sergio — Sergio abre lo justo: escribir en la carpeta y en la entrega
chmod g+w practica-ic2 practica-ic2/docs/entrega.txt
stat -c '%a %A %n' practica-ic2 practica-ic2/docs/entrega.txt
# @laura — Laura vuelve a intentarlo
./compilar.sh
echo "Parte de Laura: ejercicio 2" >> docs/entrega.txt
cat docs/entrega.txt
