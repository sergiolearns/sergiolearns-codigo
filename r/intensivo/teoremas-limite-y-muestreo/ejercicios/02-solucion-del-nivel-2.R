# Solución del nivel 2
# Del artículo «Intensivo de R 4: teoremas límite y muestreo — ejercicios con la lotería de Navidad, funciones que devuelven listas y la campana encima del histograma (y la curva que no aparecía)»
# https://sergiolearns.com/r-intensivo-teoremas-limite-y-muestreo-ejercicios/

# simula_media(): Monte Carlo de la media de n valores de una variable discreta, repetido B veces
simula_media <- function(n, B, valores, prob) {
  stopifnot(n >= 1, B >= 2, length(valores) == length(prob), abs(sum(prob) - 1) < 1e-8)
  medias <- replicate(B, mean(sample(valores, n, replace = TRUE, prob = prob)))
  mu     <- sum(valores * prob)
  sigma  <- sqrt(sum((valores - mu)^2 * prob))
  list(medias = medias,              # las B medias, por si quieres dibujarlas
       media = mean(medias),
       de = sd(medias),
       de_teorica = sigma / sqrt(n))
}
peq <- c(0, 20, 100)
pp  <- c(1 - 0.09986 - 0.01794, 0.09986, 0.01794)
set.seed(5)
tabla <- t(sapply(c(1, 10, 50, 200), function(n) {
  r <- simula_media(n, 2000, peq, pp)
  c(n = n, media = r$media, de = r$de, de_teorica = r$de_teorica)
}))
round(tabla, 3)
