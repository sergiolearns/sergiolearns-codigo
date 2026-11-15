# Programa 3: dos edificios con la F y la t de dos muestras
# Del artículo «Distribuciones en el muestreo — práctica en R con el wifi del campus, replicate, histogramas, qchisq, qt y qf (y la curva que no encajaba por un grado de libertad)»
# https://sergiolearns.com/distribuciones-en-el-muestreo-practica/

set.seed(2026)
m <- 15; n <- 12; sigma <- 6
dos_edificios <- function(mu2) {
  a <- rnorm(m, 40, sigma)                       # Informática
  b <- rnorm(n, mu2, sigma)                      # biblioteca
  sp <- sqrt(((m - 1) * var(a) + (n - 1) * var(b)) / (m + n - 2))   # varianza combinada
  c(F = var(a) / var(b),                         # S1^2 / S2^2 ~ F(14, 11)
    t = (mean(a) - mean(b)) / (sp * sqrt(1 / m + 1 / n)))           # ~ t(25) si mu2 = 40
}
iguales <- replicate(10000, dos_edificios(40))
c(F_cola = mean(iguales["F", ] > qf(0.95, m - 1, n - 1)),
  t_colas = mean(abs(iguales["t", ]) > qt(0.975, m + n - 2)))
round(c(media_F = mean(iguales["F", ]), teorica = (n - 1) / (n - 3)), 3)
lenta <- replicate(10000, dos_edificios(46))
c(F_cola = mean(lenta["F", ] > qf(0.95, m - 1, n - 1)),
  t_abajo = mean(lenta["t", ] < qt(0.025, m + n - 2)))
par(mfrow = c(1, 2))
hist(iguales["F", ], freq = FALSE, breaks = 60, xlim = c(0, 5), main = "S1^2 / S2^2", xlab = "")
curve(df(x, m - 1, n - 1), add = TRUE, lwd = 2, col = "red")
hist(iguales["t", ], freq = FALSE, breaks = 40, main = "t de dos muestras", xlab = "")
curve(dt(x, m + n - 2), add = TRUE, lwd = 2, col = "red")
par(mfrow = c(1, 1))
