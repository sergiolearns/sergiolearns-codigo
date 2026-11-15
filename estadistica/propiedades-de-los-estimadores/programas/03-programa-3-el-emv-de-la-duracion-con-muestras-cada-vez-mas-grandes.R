# Programa 3: el EMV de la duración, con muestras cada vez más grandes
# Del artículo «Propiedades de los estimadores — práctica en R con simulaciones del sesgo, el ECM, la cota de Cramér–Rao y la consistencia (y las 10.000 varianzas que no pedí)»
# https://sergiolearns.com/propiedades-de-los-estimadores-practica/

lam <- 1 / 12                                         # duración media de 12 minutos
emv <- function(n, B = 5000) replicate(B, 1 / mean(rexp(n, lam)))

set.seed(41)
ns <- c(5, 20, 100, 500)
lista <- lapply(ns, emv)                              # una simulación por cada n
data.frame(n = ns,
           media      = round(sapply(lista, mean), 4),
           sesgo_teo  = round(lam / (ns - 1), 4),     # lambda / (n - 1)
           dentro_001 = sapply(lista, function(l) mean(abs(l - lam) < 0.01)))

# normalidad asintótica: tipificar con la varianza asintótica lambda^2 / n
z5   <- (lista[[1]] - lam) / sqrt(lam^2 / 5)
z100 <- (lista[[3]] - lam) / sqrt(lam^2 / 100)
round(c(media_z5 = mean(z5), sd_z5 = sd(z5), media_z100 = mean(z100), sd_z100 = sd(z100)), 2)
round(c(fuera_z5 = mean(abs(z5) > 1.96), fuera_z100 = mean(abs(z100) > 1.96)), 3)

par(mfrow = c(1, 2))
hist(z5, breaks = seq(-4, 20, by = 0.5), freq = FALSE, xlim = c(-4, 8), main = "n = 5", xlab = "Z")
curve(dnorm(x), add = TRUE, col = "red", lwd = 2)
hist(z100, breaks = seq(-4, 20, by = 0.5), freq = FALSE, xlim = c(-4, 8), main = "n = 100", xlab = "Z")
curve(dnorm(x), add = TRUE, col = "red", lwd = 2)

# los 20 viajes de verdad: la estimación y su error estándar
duracion <- c(0.2, 11.0, 9.0, 18.9, 2.8, 13.0, 27.9, 8.7, 15.5, 8.1,
              5.1, 13.4, 15.8, 5.0, 8.1, 19.6, 0.9, 30.8, 20.9, 3.5)
n <- length(duracion)
logver <- function(l) n * log(l) - l * sum(duracion)
o <- optim(1 / mean(duracion), logver, method = "Brent", lower = 0.001, upper = 1,
           control = list(fnscale = -1), hessian = TRUE)
ee <- sqrt(-1 / o$hessian[1, 1])                     # error estándar = raíz de -1 / l''
round(c(lambda = o$par, error_est = ee,
        desde = o$par - 2 * ee, hasta = o$par + 2 * ee), 4)
