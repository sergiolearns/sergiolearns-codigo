# Programa 3: la sesión que usa revisar.sh y fija la umask
# Del artículo «Permisos en Linux — práctica con la carpeta de un trabajo en grupo, tres usuarios y un revisor de permisos (y la compañera que no podía compilar)»
# https://sergiolearns.com/permisos-en-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.
# Parte de la carpeta del programa 1 y necesita revisar.sh en la carpeta actual.

chmod u+x revisar.sh                         # el script llega sin x: se la doy a su dueño
chmod 644 practica-ic2/docs/apuntes-privados.txt   # un despiste: alguien lo dejó legible para todos
chmod o+rx practica-ic2                      # y otro: la carpeta abierta a cualquiera
./revisar.sh practica-ic2
chmod -R o-rwx practica-ic2                  # -R: quita todo a otros en todo el árbol
chmod 600 practica-ic2/docs/apuntes-privados.txt
./revisar.sh practica-ic2
umask 027                                    # para lo que creemos a partir de ahora
touch practica-ic2/docs/acta.txt
mkdir practica-ic2/pruebas
stat -c '%a %A %n' practica-ic2/docs/acta.txt practica-ic2/pruebas
./revisar.sh practica-ic2
