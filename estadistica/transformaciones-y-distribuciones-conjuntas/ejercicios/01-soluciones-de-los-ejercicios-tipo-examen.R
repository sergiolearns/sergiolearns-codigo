# Soluciones de los ejercicios tipo examen
# Del artículo «Ejercicios de transformaciones y distribuciones conjuntas — tipo examen con R, un triángulo, una fgm conjunta y un jacobiano (y la covarianza 0 que me costó un apartado)»
# https://sergiolearns.com/transformaciones-y-distribuciones-conjuntas-ejercicios/

# ---- Ejercicio 1 ----
set.seed(2026)
x <- -10 * log(runif(10000))    # la inversa de F: -10 log(1 - u), y 1 - U también es uniforme
s <- exp(-0.1 * x)              # nota de rapidez
y <- sqrt(x)
round(c(mean(s <= 0.3), 0.3), 4)
round(c(mean(y > 4), exp(-1.6)), 4)
hist(y, freq = FALSE, breaks = 30, main = "Raíz de la cocina")
curve(0.2 * x * exp(-0.1 * x^2), add = TRUE, col = "red", lwd = 2)

# ---- Ejercicio 2 ----
f <- function(x, y) (x + y) * (x < y)                    # sin la K
inner <- function(x) integrate(function(y) f(x, y), x, 1)$value
1 / integrate(Vectorize(inner), 0, 1)$value             # K
g <- function(x) integrate(function(y) 2 * f(x, y), x + 0.5, 1)$value
integrate(Vectorize(g), 0, 0.5)$value                   # P(Y - X > 1/2)

# ---- Ejercicio 3 ----
1 - pgamma(20, shape = 3, rate = 0.2)

set.seed(2026)
x <- rgamma(10000, 2, 0.2); r <- rexp(10000, 0.2)
t <- x + r; u <- x / t
round(c(mean(u > 0.5), 1 - 0.5^2), 4)          # P(U > 1/2) = 1 - F(1/2) = 3/4
round(cor(t, u), 3)
hist(u, freq = FALSE, breaks = 20, main = "Fracción de cocina")
curve(2 * x, from = 0, to = 1, add = TRUE, col = "red", lwd = 2)
