# Programa 2: la ley de los grandes números, en marcha
# Del artículo «Desigualdades y teoremas límite en R — práctica con 100.000 canciones, medias acumuladas, replicate y qqnorm (y el histograma que era una sola barra)»
# https://sergiolearns.com/desigualdades-y-teoremas-limite-practica/

set.seed(2026)
# 1. Cuatro playlists de 1000 canciones: la media acumulada de cada una
caminos <- replicate(4, { y <- 2 + rexp(1000, 2/3); cumsum(y) / (1:1000) })
round(caminos[c(10, 100, 1000), ], 3)            # medias tras 10, 100 y 1000 canciones
matplot(caminos, type = "l", lty = 1, log = "x", xlab = "n", ylab = "media")
abline(h = 3.5, lty = 2)
# 2. Probabilidad de que la media se aleje 0.25 o más, frente a la cota
set.seed(2026)
fuera <- function(n, m = 1000) mean(replicate(m, abs(mean(2 + rexp(n, 2/3)) - 3.5) >= 0.25))
n <- c(25, 50, 100, 200, 400)
round(data.frame(n, simulada = sapply(n, fuera),
                 cota = pmin(1, 2.25 / (n * 0.25^2))), 3)
