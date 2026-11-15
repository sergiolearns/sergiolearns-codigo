# Soluciones de los ejercicios tipo examen
# Del artículo «La distribución normal — ejercicios tipo examen con molinos, cajas de 12 y bolsas de medio kilo (y el 10 % que estaba en la cola equivocada)»
# https://sergiolearns.com/distribucion-normal-ejercicios/

# ---- Ejercicio 1 ----
1 - pnorm(45, 42, 4)
2 * pnorm(-1.5)
qnorm(0.90, 42, 4)
1 - pnorm(0.75, 42 / 60, 4 / 60)
p <- 1 - pnorm(50, 42, 4)
c(p, 1 - (1 - p)^5)

# ---- Ejercicio 2 ----
mW <- 12 * 1010 + 240; sW <- sqrt(12 * 6^2 + 10^2)
c(mW, sW, 1 - pnorm(12400, mW, sW))
pnorm(1006, 1010, 6 / 3)
c(1 - pnorm(0, 6, sqrt(52)), pnorm(1000, 1010, 6), pnorm(1000, 1004, 4))
set.seed(2026)
W <- replicate(10000, sum(rnorm(12, 1010, 6)) + rnorm(1, 240, 10))
round(c(mean(W), sd(W), mean(W > 12400)), 4)

# ---- Ejercicio 3 ----
bolsas <- c(511.7, 506.0, 509.2, 508.0, 508.1, 507.2, 507.0, 513.6, 506.2, 504.7,
            507.5, 511.5, 501.9, 509.8, 502.9, 509.1, 504.7, 514.6, 503.0, 505.6,
            504.8, 510.5, 504.3, 508.0, 509.8, 508.6, 503.7, 507.5, 502.9, 515.6,
            506.3, 504.8, 503.5, 505.0, 505.2, 509.9, 506.4, 506.6, 507.9, 510.8)
m <- mean(bolsas); s <- sd(bolsas)
round(c(m, s), 2)
summary(bolsas)
hist(bolsas, freq = FALSE, col = "grey90", main = "40 bolsas", xlab = "gramos")
curve(dnorm(x, m, s), add = TRUE, lwd = 2, col = "red")
qqnorm(bolsas); qqline(bolsas, col = "red", lwd = 2)
round(c(datos = mean(bolsas < 500), modelo = pnorm(500, m, s)), 4)
cc <- qnorm(0.95)
round(c(cc, m - cc * s, m + cc * s), 2)
round(500 - qnorm(0.005) * s, 2)

# ---- Bonus ----
integrate(function(z) abs(z) * dnorm(z), -Inf, Inf)$value
c(sqrt(2 / pi), 6 * sqrt(2 / pi))

