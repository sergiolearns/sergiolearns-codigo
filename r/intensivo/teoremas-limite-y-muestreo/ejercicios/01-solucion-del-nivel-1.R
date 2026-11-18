# Solución del nivel 1
# Del artículo «Intensivo de R 4: teoremas límite y muestreo — ejercicios con la lotería de Navidad, funciones que devuelven listas y la campana encima del histograma (y la curva que no aparecía)»
# https://sergiolearns.com/r-intensivo-teoremas-limite-y-muestreo-ejercicios/

premios <- c(400000, 125000, 50000, 20000, 6000, 100, 20, 0)
prob    <- c(1, 1, 1, 2, 8, 1794, 9986, 0) / 1e5
prob[8] <- 1 - sum(prob)
mu      <- sum(premios * prob)
sigma   <- sqrt(sum((premios - mu)^2 * prob))
round(c(mu = mu, sigma = sigma), 2)
set.seed(22)
x <- sample(premios, 1e5, replace = TRUE, prob = prob)
table(x)
media_acum <- cumsum(x) / seq_along(x)
round(media_acum[c(10, 100, 1000, 10000, 1e5)], 2)

plot(media_acum, type = "l", log = "x", main = "Lo que cobra de media un décimo",
     xlab = "Décimos jugados (escala logarítmica)", ylab = "Media acumulada (euros)")
abline(h = mu, lty = 2, col = "red")
