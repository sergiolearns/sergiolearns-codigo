# Programa 1 · Explorar el sistema de archivos de Fedora
# Del artículo «Comandos básicos de Linux — práctica explorando Fedora, montando tu carpeta de IC2 y saliendo de un laberinto de carpetas (y la estructura que creé en el sitio equivocado)»
# https://sergiolearns.com/comandos-basicos-de-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# 1. ¿Dónde empiezo? En mi carpeta personal
pwd
# los archivos ocultos son la configuración de tu usuario
ls -a
# 2. Las carpetas importantes del sistema, sin entrar en ellas (-d: la carpeta, no su contenido)
ls -ld /bin /etc /home /tmp /usr /var
# 3. Los comandos son archivos: which dice dónde vive cada uno
which ls cp mv
# 4. Atajos de navegación: ir, volver de golpe y deshacer el último cd
cd /etc
pwd
cd ~
pwd
cd -
cd ..
pwd
