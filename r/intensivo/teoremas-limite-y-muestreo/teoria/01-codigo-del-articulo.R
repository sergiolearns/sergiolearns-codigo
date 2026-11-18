# Todo el código del artículo, en orden (sin los errores a propósito)
# Del artículo «Intensivo de R 4: teoremas límite y muestreo — Monte Carlo, funciones que devuelven listas y el ascensor de 8 personas (y el TCL que me dio un 23 % donde había un 21 %)»
# https://sergiolearns.com/r-intensivo-teoremas-limite-y-muestreo/

# El peso (kg) de una persona que entra en el ascensor: 50 + Gamma(forma 3, tasa 0.12)
r_peso <- function(n) 50 + rgamma(n, shape = 3, rate = 0.12)
mu <- 50 + 3 / 0.12              # media teórica: 75 kg
sigma <- sqrt(3 / 0.12^2)        # desviación teórica
round(c(mu = mu, sigma = sigma), 2)
set.seed(4)
round(r_peso(8), 1)              # un viaje: 8 personas

# Monte Carlo en una línea: la probabilidad como media de un indicador
set.seed(10)
viajes <- replicate(10000, sum(r_peso(8)))
mean(viajes > 630)               # P(los 8 pesan más de 630 kg)

# Una función que devuelve una lista: estimación, error estándar e intervalo
estimar_prob <- function(exito) {
  stopifnot(is.logical(exito))
  B <- length(exito)
  p <- mean(exito)
  ee <- sqrt(p * (1 - p) / B)
  list(p = p, ee = ee, ic95 = p + c(-1, 1) * 1.96 * ee, B = B)
}
r <- estimar_prob(viajes > 630)
str(r)
round(r$ic95, 4)

# Ley de los grandes números: la media acumulada de los pesos se acerca a 75
set.seed(12)
caminos <- replicate(3, cumsum(r_peso(2000)) / (1:2000))
round(caminos[c(10, 100, 2000), ], 2)

matplot(caminos, type = "l", lty = 1, log = "x", col = c("#5B4BDB", "#FF6B4A", "#16794B"),
        main = "La media acumulada de los pesos", xlab = "Personas", ylab = "Media (kg)")
abline(h = mu, lty = 2)

# El TCL simulado: medias de n pesos, frente a la normal que predice el teorema
medias_de <- function(n, B = 10000) replicate(B, mean(r_peso(n)))
set.seed(20)
m1 <- medias_de(1)
m8 <- medias_de(8)
round(c(sd_m8 = sd(m8), sd_tcl = sigma / sqrt(8)), 3)

par(mfrow = c(1, 2))
hist(m1, breaks = 40, freq = FALSE, main = "n = 1", xlab = "kg", col = "#A99EF5", border = "white")
curve(dnorm(x, mean = mu, sd = sigma), add = TRUE, col = "#FF6B4A", lwd = 2)
hist(m8, breaks = 40, freq = FALSE, main = "n = 8", xlab = "kg", col = "#A99EF5", border = "white")
curve(dnorm(x, mean = mu, sd = sigma / sqrt(8)), add = TRUE, col = "#FF6B4A", lwd = 2)
par(mfrow = c(1, 1))

# Chebyshev comprobado: P(|X - mu| >= k sigma) frente a su cota 1/k^2
set.seed(30)
x <- r_peso(100000)
k <- c(1.5, 2, 3)
simulada <- sapply(k, function(kk) mean(abs(x - mu) >= kk * sigma))
round(rbind(k, simulada, cota = 1 / k^2), 4)

# Versión 1: contar viajes con un bucle
set.seed(10)
pasados <- 0
for (b in 1:10000) {
  if (sum(r_peso(8)) > 630) pasados <- pasados + 1
}
pasados / 10000

# Versión 2: los 10.000 viajes de una vez, en una matriz
set.seed(10)
pesos <- matrix(r_peso(10000 * 8), ncol = 8)   # una fila por viaje
dim(pesos)
mean(rowSums(pesos) > 630)

# Versión 3: una función general que recibe el experimento como argumento
monte_carlo <- function(experimento, B = 10000, semilla = NULL) {
  stopifnot(is.function(experimento), B >= 100)
  if (!is.null(semilla)) set.seed(semilla)
  exito <- replicate(B, experimento())
  estimar_prob(exito)
}
ascensor <- function(n = 8, limite = 630) sum(r_peso(n)) > limite
r8 <- monte_carlo(ascensor, semilla = 10)
r9 <- monte_carlo(function() ascensor(n = 9, limite = 700), semilla = 10)
round(c(p8 = r8$p, p9 = r9$p), 4)
round(c(tcl8 = 1 - pnorm(630, 8 * mu, sqrt(8) * sigma),
        tcl9 = 1 - pnorm(700, 9 * mu, sqrt(9) * sigma)), 4)

# ¿Cuántas simulaciones hacen falta? El error estándar baja como 1/raíz(B)
set.seed(40)
B <- c(100, 1000, 10000, 100000)
sapply(B, function(b) round(monte_carlo(ascensor, B = b)$ee, 4))
