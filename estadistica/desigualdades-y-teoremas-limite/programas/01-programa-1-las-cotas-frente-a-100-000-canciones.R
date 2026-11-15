# Programa 1: las cotas frente a 100.000 canciones
# Del artículo «Desigualdades y teoremas límite en R — práctica con 100.000 canciones, medias acumuladas, replicate y qqnorm (y el histograma que era una sola barra)»
# https://sergiolearns.com/desigualdades-y-teoremas-limite-practica/

set.seed(2026)
x <- 2 + rexp(100000, 2/3)                      # 100.000 canciones
# 1. Markov: P(X >= t) <= E(X) / t
t <- c(5, 7, 9)
markov <- data.frame(t, cota = 3.5 / t,
                     simulada = sapply(t, function(s) mean(x >= s)),
                     exacta = 1 - pexp(t - 2, 2/3))     # X - 2 es una exp(2/3)
round(markov, 4)
# 2. Chebyshev: P(|X - mu| >= k sigma) <= 1 / k^2
k <- c(1.5, 2, 3)
cheb <- data.frame(k, cota = 1 / k^2,
                   simulada = sapply(k, function(j) mean(abs(x - 3.5) >= 1.5 * j)),
                   exacta = 1 - pexp(1.5 + 1.5 * k, 2/3))  # solo la cola de arriba
round(cheb, 4)
# 3. La cota y la frecuencia para k de 1 a 4, en un dibujo
kk <- seq(1, 4, by = 0.25)
sim <- sapply(kk, function(j) mean(abs(x - 3.5) >= 1.5 * j))
plot(kk, 1 / kk^2, type = "l", lwd = 2, ylim = c(0, 1), xlab = "k", ylab = "probabilidad")
points(kk, sim, pch = 19, col = "red")
