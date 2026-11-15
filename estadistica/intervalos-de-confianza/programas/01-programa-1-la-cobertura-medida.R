# Programa 1: la cobertura, medida
# Del artículo «Intervalos de confianza en R — práctica con la cobertura simulada, las dos fincas y cuándo falla el asintótico»
# https://sergiolearns.com/intervalos-de-confianza-practica/

set.seed(15)
mu <- 38; sigma <- 4; n <- 15; B <- 10000
z  <- qnorm(0.975)               # 1,96
tq <- qt(0.975, n - 1)           # 2,14: el de la t(14)
sims <- replicate(B, {
  x <- rnorm(n, mu, sigma)       # 15 racimos inventados
  m <- mean(x); s <- sd(x)
  c(z_sigma = abs(m - mu) <= z * sigma / sqrt(n),    # bien: sigma conocida
    t_s     = abs(m - mu) <= tq * s / sqrt(n),       # bien: sigma desconocida
    z_s     = abs(m - mu) <= z * s / sqrt(n),        # mal: S con el cuantil de z
    ancho_t = 2 * tq * s / sqrt(n))                  # longitud del intervalo t
})
round(rowMeans(sims), 4)         # proporción de aciertos y ancho medio

# ¿y con otros tamaños? El de z con S, para varios n
cobertura_z_s <- sapply(c(5, 10, 15, 30, 60, 120), function(n) {
  mean(replicate(4000, { x <- rnorm(n, mu, sigma); abs(mean(x) - mu) <= z * sd(x) / sqrt(n) }))
})
names(cobertura_z_s) <- c(5, 10, 15, 30, 60, 120)
cobertura_z_s

# 50 intervalos t dibujados: los que fallan, en rojo
set.seed(16)
ic <- t(replicate(50, t.test(rnorm(n, mu, sigma))$conf.int))
falla <- which(ic[, 1] > mu | ic[, 2] < mu)
falla
plot(NULL, xlim = c(32, 44), ylim = c(1, 50), xlab = "kg", ylab = "muestra")
segments(ic[, 1], 1:50, ic[, 2], 1:50, col = ifelse(1:50 %in% falla, "red", "grey40"))
abline(v = mu, lwd = 2)
