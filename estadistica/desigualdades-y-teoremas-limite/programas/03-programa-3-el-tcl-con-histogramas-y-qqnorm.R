# Programa 3: el TCL con histogramas y qqnorm
# Del artículo «Desigualdades y teoremas límite en R — práctica con 100.000 canciones, medias acumuladas, replicate y qqnorm (y el histograma que era una sola barra)»
# https://sergiolearns.com/desigualdades-y-teoremas-limite-practica/

set.seed(2026)
media <- function(n) mean(2 + rexp(n, 2/3))       # la media de n canciones NUEVAS cada vez
m <- 10000
medias5  <- replicate(m, media(5))
medias50 <- replicate(m, media(50))
round(c(media = mean(medias5),  sd = sd(medias5),  teorica = 1.5 / sqrt(5)), 3)
round(c(media = mean(medias50), sd = sd(medias50), teorica = 1.5 / sqrt(50)), 3)
# Histogramas con la normal del TCL
par(mfrow = c(1, 2))
hist(medias5, freq = FALSE, breaks = 40, main = "n = 5", xlab = "media")
curve(dnorm(x, 3.5, 1.5 / sqrt(5)), add = TRUE, col = "red", lwd = 2)
hist(medias50, freq = FALSE, breaks = 40, main = "n = 50", xlab = "media")
curve(dnorm(x, 3.5, 1.5 / sqrt(50)), add = TRUE, col = "red", lwd = 2)
# Gráficos cuantil-cuantil de las medias tipificadas
qqnorm((medias5 - mean(medias5)) / sd(medias5), main = "n = 5"); abline(0, 1, col = "red")
qqnorm((medias50 - mean(medias50)) / sd(medias50), main = "n = 50"); abline(0, 1, col = "red")
# Tres probabilidades: simulada, TCL y exacta
round(c(simulada = mean(medias50 > 3.8), TCL = 1 - pnorm(3.8, 3.5, 1.5 / sqrt(50)),
        exacta = 1 - pgamma(50 * (3.8 - 2), 50, 2/3)), 4)
sesiones <- replicate(m, sum(2 + rexp(20, 2/3)))  # 10.000 sesiones de 20 canciones
round(c(simulada = mean(sesiones <= 75), TCL = pnorm(75, 70, 1.5 * sqrt(20)),
        exacta = pgamma(35, 20, 2/3)), 4)
saltos <- rbinom(m, 40, 0.25)                    # canciones saltadas de 40
round(c(simulada = mean(saltos <= 8), exacta = pbinom(8, 40, 0.25),
        sin = pnorm(8, 10, sqrt(7.5)), con = pnorm(8.5, 10, sqrt(7.5))), 4)
