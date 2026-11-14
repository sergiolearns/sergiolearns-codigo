# R desde cero (2): listas, factores, data frames, leer y escribir un .csv, funciones y paquetes
# Del artículo «R desde cero (2) — data frames, leer un .csv, tus propias funciones y los paquetes (y el read.csv que me convirtió las notas en texto)»
# https://sergiolearns.com/r-desde-cero-data-frames-y-funciones/

## Listas
alumna <- list(nombre = "Lucía", notas = c(6.5, 8), aprobada = TRUE)
alumna$nombre
alumna$notas
alumna[["aprobada"]]
str(alumna)

## Factores
grupo <- c("A", "B", "A", "A", "B", "C", "A")
f <- factor(grupo)
f
levels(f)                  # las categorías distintas
table(f)                   # frecuencias absolutas
prop.table(table(f))       # frecuencias relativas

nivel <- factor(c("Medio", "Alto", "Bajo", "Medio"),
                levels = c("Bajo", "Medio", "Alto"), ordered = TRUE)
nivel
table(nivel)
nivel[1] < nivel[2]

## Data frames
estudio <- data.frame(
  alumno = c("Ana", "Bea", "Carlos", "Dani", "Eva", "Fran"),
  grupo  = factor(c("A", "B", "A", "B", "A", "B")),
  horas  = c(10, 4, 7, 12, 3, 8),
  nota   = c(7.5, 5, 6, 9, 4, 6.5)
)
estudio
str(estudio)
dim(estudio)

estudio$nota                                  # una columna (un vector)
estudio[2, ]                                  # la fila 2 entera
estudio[, c("alumno", "nota")]                # dos columnas por su nombre
estudio[estudio$nota >= 6, ]                  # filas que cumplen una condición
estudio[estudio$grupo == "A" & estudio$horas > 5, "alumno"]

estudio$aprobado <- estudio$nota >= 5
estudio
mean(estudio$nota)
tapply(estudio$nota, estudio$grupo, mean)
summary(estudio[, c("horas", "nota")])
cor(estudio$horas, estudio$nota)

## Escribir y leer un .csv
# En el artículo, estudio.csv venía dado; aquí lo escribimos primero para que el script funcione solo.
write.csv(estudio[, c("alumno", "grupo", "horas", "nota")], "estudio.csv", row.names = FALSE)
datos <- read.csv("estudio.csv")
head(datos, 3)          # las 3 primeras filas
str(datos)
# Un .csv con formato español (separador ";" y coma decimal) se lee con read.csv2("archivo.csv")

write.csv(estudio, "estudio-final.csv", row.names = FALSE)
readLines("estudio-final.csv")     # el archivo, línea a línea

## Tus propias funciones
cuasivarianza <- function(x) {
  n <- length(x)
  sum((x - mean(x))^2) / (n - 1)    # la última línea es lo que devuelve
}
cuasivarianza(estudio$nota)
var(estudio$nota)

resumen <- function(x, decimales = 2) {
  r <- c(media = mean(x), mediana = median(x), desviacion = sd(x))
  round(r, decimales)
}
resumen(estudio$nota)
resumen(estudio$horas, decimales = 1)

calificacion <- function(nota) {
  if (nota >= 9) {
    "Sobresaliente"
  } else if (nota >= 7) {
    "Notable"
  } else if (nota >= 5) {
    "Aprobado"
  } else {
    "Suspenso"
  }
}
calificacion(7.5)
sapply(estudio$nota, calificacion)
for (i in 1:3) cat(estudio$alumno[i], "->", calificacion(estudio$nota[i]), "\n")

## Todo junto: leer, preparar y resumir
datos <- read.csv("estudio.csv")
datos$grupo <- factor(datos$grupo)
datos$aprobado <- datos$nota >= 5
str(datos)
table(datos$grupo, datos$aprobado)
tapply(datos$nota, datos$grupo, mean)
mejores <- datos[datos$nota >= 6, c("alumno", "nota")]
mejores[order(-mejores$nota), ]

## Paquetes: install.packages una vez, library cada vez
# install.packages("MASS")   # MASS ya viene con R
library(MASS)
notas <- c(7.5, 5, 6, 9, 4, 6.5)
fitdistr(notas, "normal")
