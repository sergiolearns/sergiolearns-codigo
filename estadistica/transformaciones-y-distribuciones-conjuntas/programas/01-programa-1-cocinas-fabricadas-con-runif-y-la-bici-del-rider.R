# Programa 1: cocinas fabricadas con runif y la bici del rider
# Del artículo «Transformaciones y distribuciones conjuntas en R — práctica con runif, integrate dentro de integrate y la normal bivariante del reparto (y el Vectorize que me faltaba)»
# https://sergiolearns.com/transformaciones-y-distribuciones-conjuntas-practica/

set.seed(2026)
n <- 10000
# 1. Cocina con la inversa de F: F(x) = 1 - exp(-0.1 x)  =>  x = -10 log(1 - u)
u <- runif(n)
cocina <- -10 * log(1 - u)
round(c(media = mean(cocina), sd = sd(cocina)), 2)      # exp(0.1): 10 y 10
# 2. Reparto en bici: V ~ U(12, 20) km/h, 3 km  =>  R = 180 / V minutos
v <- runif(n, 12, 20)
reparto <- 180 / v
round(c(simulada = mean(reparto), teorica = 22.5 * log(15 / 9),
        ingenua = 180 / mean(v)), 2)                    # E(R) frente a 180 / E(V)
round(c(mean(reparto > 12), 3 / 8), 3)                  # P(R > 12) = P(V < 15)
# Los dos histogramas con su densidad teórica encima
par(mfrow = c(1, 2))
hist(cocina, freq = FALSE, breaks = 40, main = "Cocina", xlab = "minutos")
curve(dexp(x, 0.1), add = TRUE, col = "red", lwd = 2)
hist(reparto, freq = FALSE, breaks = seq(9, 15, 0.5), main = "Reparto", xlab = "minutos")
curve(22.5 / x^2, from = 9, to = 15, add = TRUE, col = "red", lwd = 2)
