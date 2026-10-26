# Programa 3 · El mini reto de navegación
# Del artículo «Comandos básicos de Linux — práctica explorando Fedora, montando tu carpeta de IC2 y saliendo de un laberinto de carpetas (y la estructura que creé en el sitio equivocado)»
# https://sergiolearns.com/comandos-basicos-de-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# 1. reto con tres subcarpetas
mkdir -p reto/nivel1 reto/nivel2 reto/nivel3
# 2. secreto.txt dentro de nivel2
touch reto/nivel2/secreto.txt
# 3. copia a nivel3 con otro nombre
cp reto/nivel2/secreto.txt reto/nivel3/copia_secreto.txt
# 4. entrar en nivel3 y subir dos niveles con una sola orden
cd reto/nivel3
cd ../..
pwd
# 5. listar nivel2 y nivel3 sin moverme
ls reto/nivel2 reto/nivel3
# 6. borrar nivel1, que está vacía
rmdir reto/nivel1
ls reto
# 7. ruta absoluta de la copia sin entrar en su carpeta
realpath reto/nivel3/copia_secreto.txt
