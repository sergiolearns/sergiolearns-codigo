# Funciones para tu script
# Del artículo «Intervalos de confianza — ejercicios tipo examen con plátanos, riego y averías (y el pivote exacto que cae en la EC2)»
# https://sergiolearns.com/intervalos-de-confianza-ejercicios/

# Datos de los ejercicios (para las comprobaciones del final)
calibre <- c(20.0, 20.7, 20.7, 20.4, 19.2, 23.4, 21.0, 20.4, 18.5, 22.1,
             23.0, 18.9, 19.8, 19.5, 21.5, 22.3)
goteo <- c(47.6, 36.6, 42.0, 43.3, 32.0, 48.2, 42.5, 42.8, 36.0, 39.7, 40.3, 36.8, 42.4, 28.7)
asper <- c(24.9, 42.8, 40.2, 41.3, 31.4, 40.4, 33.6, 33.7, 30.8, 37.0, 46.6, 36.4, 30.7)
cinta <- c(25.3, 17.3, 39.9, 0.9, 1.7, 9.5, 9.4, 4.4, 81.8, 0.9, 30.1, 14.4)

# ---- Intervalos de confianza (ME1, tema 11) ----
# Media de una normal: sigma conocida (z) o desconocida (t)
ic_media <- function(x, nivel = 0.95, sigma = NULL, d = 2) {
  n <- length(x); a <- 1 - nivel
  if (is.null(sigma)) e <- qt(1 - a / 2, n - 1) * sd(x) / sqrt(n)
  else                e <- qnorm(1 - a / 2) * sigma / sqrt(n)
  round(mean(x) + c(-1, 1) * e, d)
}
# Varianza y desviación típica de una normal (mu desconocida)
ic_var <- function(x, nivel = 0.95, d = 2) {
  n <- length(x); a <- 1 - nivel
  v <- (n - 1) * var(x) / qchisq(c(1 - a / 2, a / 2), n - 1)   # el cuantil grande abajo
  round(rbind(varianza = v, desviacion = sqrt(v)), d)
}
# Diferencia de medias: varianzas conocidas, iguales (combinada) o distintas (Welch)
ic_dif <- function(x, y, nivel = 0.95, s1 = NULL, s2 = NULL, iguales = TRUE, d = 2) {
  m <- length(x); n <- length(y); a <- 1 - nivel; dif <- mean(x) - mean(y)
  if (!is.null(s1)) {
    e <- qnorm(1 - a / 2) * sqrt(s1^2 / m + s2^2 / n)
  } else if (iguales) {
    sp2 <- ((m - 1) * var(x) + (n - 1) * var(y)) / (m + n - 2)
    e <- qt(1 - a / 2, m + n - 2) * sqrt(sp2 * (1 / m + 1 / n))
  } else {
    return(round(as.numeric(t.test(x, y, conf.level = nivel)$conf.int), d))
  }
  round(dif + c(-1, 1) * e, d)
}
# Cociente de varianzas sigma1^2 / sigma2^2
ic_cociente <- function(x, y, nivel = 0.95, d = 2) {
  r <- var(x) / var(y); a <- 1 - nivel
  round(r / qf(c(1 - a / 2, a / 2), length(x) - 1, length(y) - 1), d)
}
# Una proporción y dos proporciones (asintóticos, Wald)
ic_prop <- function(k, n, nivel = 0.95, d = 3) {
  p <- k / n; a <- 1 - nivel
  round(p + c(-1, 1) * qnorm(1 - a / 2) * sqrt(p * (1 - p) / n), d)
}
ic_dos_prop <- function(k1, n1, k2, n2, nivel = 0.95, d = 3) {
  p1 <- k1 / n1; p2 <- k2 / n2; a <- 1 - nivel
  round((p1 - p2) + c(-1, 1) * qnorm(1 - a / 2) * sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2), d)
}
# Exponencial: lambda (exacto con chi^2(2n) y asintótico) y su media 1/lambda
ic_exp <- function(x, nivel = 0.95, d = 4) {
  n <- length(x); T <- sum(x); l <- n / T; a <- 1 - nivel
  ex <- qchisq(c(a / 2, 1 - a / 2), 2 * n) / (2 * T)
  as <- l + c(-1, 1) * qnorm(1 - a / 2) * l / sqrt(n)
  round(rbind(exacto = ex, asintotico = as, media_exacto = 1 / rev(ex),
              media_asintotico = 1 / rev(as)), d)
}
# Poisson (asintótico)
ic_pois <- function(x, nivel = 0.95, d = 3) {
  a <- 1 - nivel; round(mean(x) + c(-1, 1) * qnorm(1 - a / 2) * sqrt(mean(x) / length(x)), d)
}
# Uniforme(0, theta): el intervalo más corto con el máximo
ic_unif <- function(x, nivel = 0.95, d = 2) {
  round(max(x) / c(1, (1 - nivel)^(1 / length(x))), d)
}
# Tamaños muestrales (siempre hacia arriba)
n_media <- function(sigma, delta, nivel = 0.95) ceiling((qnorm(1 - (1 - nivel) / 2) * sigma / delta)^2)
n_prop  <- function(delta, p = 0.5, nivel = 0.95) ceiling((qnorm(1 - (1 - nivel) / 2) / delta)^2 * p * (1 - p))
# Cobertura simulada de un método (devuelve la proporción de aciertos)
cobertura <- function(generar, intervalo, valor, B = 10000) {
  mean(replicate(B, { ic <- intervalo(generar()); ic[1] <= valor & valor <= ic[2] }))
}

# Comprobación con los datos de los ejercicios
ic_media(calibre, 0.90, sigma = 1.8)
ic_media(calibre)
ic_var(calibre)
ic_cociente(goteo, asper, 0.90)
ic_dif(goteo, asper)
ic_exp(cinta, 0.90)
ic_dos_prop(18, 150, 29, 160, 0.99)
n_media(1.8, 0.5)
set.seed(1)
cobertura(function() rnorm(16, 20.5, 1.8), function(x) ic_media(x, d = 6), 20.5, B = 2000)
