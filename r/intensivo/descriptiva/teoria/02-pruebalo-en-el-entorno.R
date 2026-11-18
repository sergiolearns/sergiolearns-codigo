# Pruébalo en el entorno de R
# Del artículo «Intensivo de R 1: descriptiva — funciones propias, tapply y gráficos con los MB de mi móvil (y el cv que copié de la línea de arriba)»
# https://sergiolearns.com/r-intensivo-descriptiva/

mb <- c(412, 380, 455, 398, 520, 870, 940, 401, 377, 430, 465, 510, 905, 1020,
        389, 415, 442, 398, 560, 1310, 880, 420, 395, 410, 478, 530, 950, 990,
        405, 2240)
tipo <- ifelse(rep(1:7, length.out = 30) >= 6, "finde", "diario")

resumen <- function(x, na.rm = TRUE, k = 1.5, digitos = 2) {
  stopifnot(is.numeric(x))
  if (na.rm) x <- x[!is.na(x)]
  stopifnot(length(x) >= 2)
  q <- quantile(x, c(0.25, 0.5, 0.75))
  ric <- q[[3]] - q[[1]]
  vallas <- c(q[[1]] - k * ric, q[[3]] + k * ric)
  atipicos <- x[x < vallas[1] | x > vallas[2]]
  tabla <- c(n = length(x), media = mean(x), Q1 = q[[1]], mediana = q[[2]],
             Q3 = q[[3]], cv = sd(x) / mean(x), atipicos = length(atipicos))
  list(tabla = round(tabla, digitos), vallas = vallas, atipicos = atipicos)
}

sapply(split(mb, tipo), function(g) resumen(g)$tabla)
boxplot(mb ~ tipo, main = "MB al día según el tipo de día", ylab = "MB")
