# Pruébalo en el entorno de R
# Del artículo «Intensivo de R 4: teoremas límite y muestreo — Monte Carlo, funciones que devuelven listas y el ascensor de 8 personas (y el TCL que me dio un 23 % donde había un 21 %)»
# https://sergiolearns.com/r-intensivo-teoremas-limite-y-muestreo/

r_peso <- function(n) 50 + rgamma(n, shape = 3, rate = 0.12)
mu <- 75; sigma <- sqrt(3 / 0.12^2)

monte_carlo <- function(experimento, B = 10000) {
  exito <- replicate(B, experimento())
  p <- mean(exito)
  list(p = p, ee = sqrt(p * (1 - p) / B))
}
ascensor <- function(n = 8, limite = 630) sum(r_peso(n)) > limite

set.seed(10)
str(monte_carlo(ascensor))
1 - pnorm(630, 8 * mu, sqrt(8) * sigma)        # lo que dice el TCL

m30 <- replicate(10000, mean(r_peso(30)))
hist(m30, breaks = 40, freq = FALSE, main = "Medias de 30 pesos", xlab = "kg")
curve(dnorm(x, mu, sigma / sqrt(30)), add = TRUE, col = "#FF6B4A", lwd = 2)
