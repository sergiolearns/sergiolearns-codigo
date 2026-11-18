# Solución del nivel 3 (con los datos y las funciones que necesita)
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

# ==== Ejercicio 3a: media y desviación de Y y de S ====
mu_y <- sum(peq * pp)
sg_y <- sqrt(sum((peq - mu_y)^2 * pp))
round(c(mu_y = mu_y, sg_y = sg_y, mu_S = 200 * mu_y, sg_S = sg_y * sqrt(200)), 2)

# ==== Ejercicio 3b: simular 5000 peñas ====
set.seed(2412)
r   <- simula_media(200, 5000, peq, pp)
tot <- 200 * r$medias                     # de la media por décimo al total de la peña
round(c(media = mean(tot), de = sd(tot)), 2)

# ==== Ejercicio 3c: histograma en densidad + normal del TCL ====
hist(tot, breaks = seq(0, 1800, by = 100), freq = FALSE,
     main = "Lo que cobra la peña en premios pequeños", xlab = "Total (euros)", ylab = "Densidad")
curve(dnorm(x, 200 * mu_y, sg_y * sqrt(200)), add = TRUE, lwd = 2, col = "red")
round(mean(tot >= 1000), 4)                              # simulada
round(1 - pnorm(1000, 200 * mu_y, sg_y * sqrt(200)), 4)  # normal del TCL

# ==== Ejercicio 3d: la cota de Chebyshev con k = 2 ====
k <- 2
round(mean(abs(r$medias - mu_y) >= k * sg_y / sqrt(200)), 4)   # simulada
1 / k^2                                                           # cota
