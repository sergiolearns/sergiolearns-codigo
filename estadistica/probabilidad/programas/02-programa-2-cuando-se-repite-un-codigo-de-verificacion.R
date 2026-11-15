# Programa 2: ¿cuándo se repite un código de verificación?
# Del artículo «Probabilidad — práctica en R con el filtro de spam: simular una semana, contar códigos repetidos y Bayes en una tabla (y el prob que puse al revés)»
# https://sergiolearns.com/probabilidad-practica/

colision <- function(n, N = 1000) 1 - prod((N - n + 1):N) / N^n   # P(algún código repetido) entre n correos
p <- sapply(1:80, colision)                     # la probabilidad para n = 1, 2, ..., 80
round(p[c(10, 20, 30, 37, 38, 40, 60, 80)], 3)  # algunos valores
which(p > 0.5)[1]                               # primer n con probabilidad mayor que 0.5
plot(1:80, p, type = "l", xlab = "n (correos)", ylab = "p")
abline(h = 0.5, lty = 2, col = "red")

# simulación: 10000 veces, 38 códigos al azar con repetición
set.seed(2026)
sim <- replicate(10000, any(duplicated(sample(1:1000, 38, replace = TRUE))))
mean(sim)                                       # proporción de veces con algún código repetido
