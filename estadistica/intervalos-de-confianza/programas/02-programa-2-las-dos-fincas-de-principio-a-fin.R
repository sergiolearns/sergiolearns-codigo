# Programa 2: las dos fincas, de principio a fin
# Del artículo «Intervalos de confianza en R — práctica con la cobertura simulada, las dos fincas y cuándo falla el asintótico»
# https://sergiolearns.com/intervalos-de-confianza-practica/

galdar    <- c(38.9, 36.7, 36.8, 28.8, 37.3, 38.6, 32.0, 34.0, 34.2, 36.0,
               37.3, 36.4, 45.4, 39.6, 41.2)
tazacorte <- c(32.6, 44.8, 30.8, 26.1, 28.9, 30.8, 39.9, 36.0, 34.7, 36.9,
               29.7, 29.2)

# 1. Mirar los datos
b <- boxplot(galdar, tazacorte, names = c("Galdar", "Tazacorte"), ylab = "kg")
b$stats                          # bigote inferior, Q1, mediana, Q3, bigote superior
b$out                            # los datos atípicos

# 2. Nuestro intervalo de la diferencia de medias
ic_dif <- function(x, y, nivel = 0.95, iguales = TRUE) {
  m <- length(x); n <- length(y); a <- 1 - nivel
  dif <- mean(x) - mean(y)
  if (iguales) {                                     # varianza combinada, t(m + n - 2)
    sp2 <- ((m - 1) * var(x) + (n - 1) * var(y)) / (m + n - 2)
    margen <- qt(1 - a / 2, m + n - 2) * sqrt(sp2 * (1 / m + 1 / n))
  } else {                                           # Welch: grados aproximados
    se <- sqrt(var(x) / m + var(y) / n)
    gl <- se^4 / ((var(x) / m)^2 / (m - 1) + (var(y) / n)^2 / (n - 1))
    margen <- qt(1 - a / 2, gl) * se
  }
  round(dif + c(-1, 1) * margen, 2)
}

# 3. ¿Varianzas iguales? Y los dos intervalos
round(var.test(galdar, tazacorte)$conf.int, 2)
rbind(combinada = ic_dif(galdar, tazacorte), welch = ic_dif(galdar, tazacorte, iguales = FALSE))
round(t.test(galdar, tazacorte, var.equal = TRUE)$conf.int, 2)   # comprobación

# 4. El nivel de confianza
rbind(n90 = ic_dif(galdar, tazacorte, 0.90), n95 = ic_dif(galdar, tazacorte, 0.95),
      n99 = ic_dif(galdar, tazacorte, 0.99))
