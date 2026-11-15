# Funciones «para tu script»
# Del artículo «La distribución normal — ejercicios tipo examen con molinos, cajas de 12 y bolsas de medio kilo (y el 10 % que estaba en la cola equivocada)»
# https://sergiolearns.com/distribucion-normal-ejercicios/

# ---------- Distribución normal (ME1, tema 5) ----------
# Recuerda: en R, N(mu, sigma) con la DESVIACIÓN TÍPICA. Si te dan la varianza, sigma <- sqrt(var)

# P(X <= x), P(X > x) y P(a < X < b)
p_menor  <- function(x, mu, sigma) pnorm(x, mu, sigma)
p_mayor  <- function(x, mu, sigma) pnorm(x, mu, sigma, lower.tail = FALSE)
p_entre  <- function(a, b, mu, sigma) pnorm(b, mu, sigma) - pnorm(a, mu, sigma)
# P(|X - mu| <= c) y P(|X - mu| >= c), con c en las unidades de X
p_cerca  <- function(c, sigma) 2 * pnorm(c / sigma) - 1
p_lejos  <- function(c, sigma) 2 * pnorm(-c / sigma)
# Tipificar y volver
tipifica <- function(x, mu, sigma) (x - mu) / sigma
destipifica <- function(z, mu, sigma) mu + sigma * z
# El valor que deja p a la izquierda / el que solo supera la proporción p
cuantil_izq <- function(p, mu, sigma) qnorm(p, mu, sigma)
cuantil_der <- function(p, mu, sigma) qnorm(p, mu, sigma, lower.tail = FALSE)
# Ajustar: la media (o la sigma) para que P(X < L) = p
media_para <- function(L, p, sigma) L - qnorm(p) * sigma
sigma_para <- function(L, p, mu) (L - mu) / qnorm(p)
# Combinaciones de normales INDEPENDIENTES: a1*X1 + ... + ak*Xk + b
combina <- function(a, mu, sigma, b = 0) c(media = sum(a * mu) + b, sd = sqrt(sum(a^2 * sigma^2)))
# Mirar si unos datos son normales y ajustar la campana
mira_normal <- function(x, ...) {
  m <- mean(x); s <- sd(x)
  op <- par(mfrow = c(1, 2)); on.exit(par(op))
  hist(x, freq = FALSE, col = "grey90", main = "Histograma", ...)
  curve(dnorm(x, m, s), add = TRUE, lwd = 2, col = "red")
  qqnorm(x); qqline(x, col = "red", lwd = 2)
  round(c(media = m, sd = s), 2)
}

# ---------- Ejemplos (los ejercicios de este artículo) ----------
round(p_mayor(45, 42, sqrt(16)), 2)            # ej. 1 (a)
round(p_lejos(6, 4), 4)                        # ej. 1 (b)
round(cuantil_der(0.10, 42, 4), 2)             # ej. 1 (c)
W <- combina(a = rep(1, 13), mu = c(rep(1010, 12), 240), sigma = c(rep(6, 12), 10))
W; round(p_mayor(12400, W["media"], W["sd"]), 4)   # ej. 2 (b)
D <- combina(a = c(1, -1), mu = c(1010, 1004), sigma = c(6, 4))
round(p_mayor(0, D["media"], D["sd"]), 4)      # ej. 2 (d)
round(media_para(500, 0.005, 3.27), 2)         # ej. 3 (e)
