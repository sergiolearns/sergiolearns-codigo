# Para tu script: las funciones del bloque, comentadas y sin enunciados
# Del artículo «Intensivo de R 4: teoremas límite y muestreo — ejercicios con la lotería de Navidad, funciones que devuelven listas y la campana encima del histograma (y la curva que no aparecía)»
# https://sergiolearns.com/r-intensivo-teoremas-limite-y-muestreo-ejercicios/

# ===================== Bloque R4: Monte Carlo, LGN, TCL y Chebyshev =====================

# momentos(valores, prob): media y desviación típica de una variable discreta
momentos <- function(valores, prob) {
  stopifnot(length(valores) == length(prob), abs(sum(prob) - 1) < 1e-8)
  mu <- sum(valores * prob)
  c(mu = mu, sigma = sqrt(sum((valores - mu)^2 * prob)))
}

# media_acumulada(x): media después de cada observación (para ver la LGN)
media_acumulada <- function(x) cumsum(x) / seq_along(x)

# simula_media(n, B, valores, prob): B medias de n valores, con su desviación simulada y teórica
simula_media <- function(n, B, valores, prob) {
  stopifnot(n >= 1, B >= 2, length(valores) == length(prob), abs(sum(prob) - 1) < 1e-8)
  medias <- replicate(B, mean(sample(valores, n, replace = TRUE, prob = prob)))
  m <- momentos(valores, prob)
  list(medias = medias, media = mean(medias), de = sd(medias), de_teorica = m[["sigma"]] / sqrt(n))
}

# hist_normal(x, mu, s, ...): histograma en densidad con la normal N(mu, s) encima
hist_normal <- function(x, mu = mean(x), s = sd(x), ...) {
  hist(x, freq = FALSE, ...)
  curve(dnorm(x, mu, s), add = TRUE, lwd = 2, col = "red")
}

# chebyshev(m, mu, s, k): frecuencia simulada de |m - mu| >= k s frente a la cota 1/k^2
chebyshev <- function(m, mu, s, k = 2) c(simulada = mean(abs(m - mu) >= k * s), cota = 1 / k^2)
