# Soluciones de los ejercicios tipo examen
# Del artículo «Ejercicios de desigualdades y teoremas límite — tipo examen con R, Chebyshev, el TCL y la corrección por continuidad (y el 12,5 que me costó un apartado)»
# https://sergiolearns.com/desigualdades-y-teoremas-limite-ejercicios/

# ---- Ejercicio 1 ----
pnorm(11000, 8000, 1500) - pnorm(5000, 8000, 1500)   # si X fuera N(8000, 1500)
1 - 1500^2 / (30 * 500^2)                      # cota de Chebyshev
2 * pnorm(500 / (1500 / sqrt(30))) - 1         # TCL: P(|media - 8000| < 500)

# ---- Ejercicio 2 ----
f <- function(x) 12 * x^2 * (1 - x)
integrate(f, 0, 1)                                 # 1: es una densidad
integrate(function(x) x * f(x), 0, 1)              # E(X) = 0.6
integrate(function(x) x^2 * f(x), 0, 1)            # E(X^2) = 0.4  =>  Var = 0.4 - 0.36
1 - pnorm(19, 30 * 0.6, sqrt(30 * 0.04))           # TCL para la suma
ceiling((qnorm(0.975) * 0.2 / 0.05)^2)             # TCL
ceiling(0.04 / (0.05 * 0.05^2))                    # Chebyshev
set.seed(2026)
S <- replicate(10000, sum(rbeta(30, 3, 2)))        # 10.000 meses de 30 sesiones
mean(S >= 19)                                      # P(S >= 19) simulada
c(mean(S), sd(S))                                  # frente a 18 y sqrt(1.2) = 1.0954
hist(S, freq = FALSE, breaks = 40, main = "30 sesiones", xlab = "cargas")
curve(dnorm(x, 18, sqrt(1.2)), add = TRUE, col = "red", lwd = 2)

# ---- Ejercicio 3 ----
pnorm(70.5, 60, sqrt(60)) - pnorm(50.5, 60, sqrt(60))   # TCL con corrección
ppois(70, 60) - ppois(50, 60)                           # exacta
p <- dpois(0, 1.5)                                  # = exp(-1.5)
c(p = p, media = 40 * p, var = 40 * p * (1 - p))
1 - pnorm(11.5, 40 * p, sqrt(40 * p * (1 - p)))      # TCL con corrección
1 - pbinom(11, 40, p)                               # exacta: P(Y >= 12) = 1 - P(Y <= 11)
1 / (4 * 0.05 * 0.05^2)                             # Chebyshev, p desconocido
ceiling((qnorm(0.975) * 0.5 / 0.05)^2)              # TCL, p desconocido
ceiling(qnorm(0.975)^2 * p * (1 - p) / 0.05^2)      # TCL, con p = 0.2231

# ---- Bonus ----
x <- c(5000, 8000, 11000); px <- c(1/8, 3/4, 1/8)
mu <- sum(x * px); sigma <- sqrt(sum((x - mu)^2 * px))
c(mu = mu, sigma = sigma, fuera = sum(px[abs(x - mu) >= 2 * sigma]))
