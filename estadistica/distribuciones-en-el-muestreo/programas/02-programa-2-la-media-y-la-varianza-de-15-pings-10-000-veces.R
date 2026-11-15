# Programa 2: la media y la varianza de 15 pings, 10.000 veces
# Del artículo «Distribuciones en el muestreo — práctica en R con el wifi del campus, replicate, histogramas, qchisq, qt y qf (y la curva que no encajaba por un grado de libertad)»
# https://sergiolearns.com/distribuciones-en-el-muestreo-practica/

set.seed(2026)
mu <- 40; sigma <- 6; n <- 15
una_tarde <- function() {                        # la muestra se fabrica DENTRO
  x <- rnorm(n, mu, sigma)                       # 15 pings de Informática
  c(media = mean(x), s2 = var(x))                # var() divide entre n - 1
}
sim <- replicate(10000, una_tarde())             # matriz 2 x 10000
medias <- sim["media", ]
u <- (n - 1) * sim["s2", ] / sigma^2             # (n - 1) S^2 / sigma^2
round(c(media_medias = mean(medias), sd_medias = sd(medias),
        teorica = sigma / sqrt(n)), 3)
round(c(media_u = mean(u), var_u = var(u)), 2)  # chi^2(14): 14 y 28
round(cor(medias, sim["s2", ]), 3)               # independientes: cerca de 0
# Los dos histogramas, con la distribución teórica encima
par(mfrow = c(1, 2))
hist(medias, freq = FALSE, breaks = 40, main = "Media de 15 pings", xlab = "ms")
curve(dnorm(x, mu, sigma / sqrt(n)), add = TRUE, lwd = 2, col = "red")
hist(u, freq = FALSE, breaks = 40, main = "(n - 1) S^2 / sigma^2", xlab = "")
curve(dchisq(x, n - 1), add = TRUE, lwd = 2, col = "red")   # n - 1, no n
par(mfrow = c(1, 1))
