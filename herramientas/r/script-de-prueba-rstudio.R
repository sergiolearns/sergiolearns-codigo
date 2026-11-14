# RStudio por dentro: un script de prueba
# Del artículo «Instalar R y RStudio — Windows, Mac y Linux, los paquetes de ME1 y tu primer script en 15 minutos (y el día que RStudio no encontraba R)»
# https://sergiolearns.com/instalar-r-y-rstudio/

notas <- c(4.5, 7, 8.25, 5, 6.5, 9, 3.75, 7.5)
grupo <- c("A", "A", "B", "A", "B", "B", "A", "B")
datos <- data.frame(nota = notas, grupo = grupo)

media <- mean(notas)
desv <- sd(notas)
summary(notas)
tapply(datos$nota, datos$grupo, mean)

hist(notas, breaks = 0:10, col = "#A99EF5", border = "white",
     main = "Notas del examen", xlab = "Nota", ylab = "Alumnos")
abline(v = media, col = "#FF6B4A", lwd = 3)
