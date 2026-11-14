# ¿Está el portátil listo para el examen de ME1?
# Del artículo «Instalar R y RStudio — Windows, Mac y Linux, los paquetes de ME1 y tu primer script en 15 minutos (y el día que RStudio no encontraba R)»
# https://sergiolearns.com/instalar-r-y-rstudio/

# Instala una vez los paquetes del curso que no vienen con R (MASS ya viene):
# install.packages(c("fitdistrplus", "TeachingDemos", "UsingR", "extraDistr", "rootSolve"))

R.version.string
paquetes <- c("MASS", "fitdistrplus", "TeachingDemos", "UsingR", "extraDistr", "rootSolve")
instalados <- paquetes %in% rownames(installed.packages())
data.frame(paquete = paquetes, instalado = instalados)   # todo TRUE = listo
getwd()                                                  # la carpeta de trabajo
