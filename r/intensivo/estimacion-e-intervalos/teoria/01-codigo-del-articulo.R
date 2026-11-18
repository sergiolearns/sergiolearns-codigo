# Todo el código del artículo, en orden (sin los errores a propósito)
# Del artículo «Intensivo de R 5: estimación e intervalos — optimize, optim y tu propia función de intervalos con los goles de la liga del campus (y el 95 % que acertaba el 87 %)»
# https://sergiolearns.com/r-intensivo-estimacion-e-intervalos/

# Goles totales en los 30 partidos de la liga de fútbol sala del campus
goles <- c(5, 7, 4, 6, 8, 3, 6, 5, 9, 4, 6, 7, 5, 2, 6,
           8, 5, 7, 4, 6, 10, 5, 6, 3, 7, 5, 6, 8, 4, 6)
c(n = length(goles), media = mean(goles), varianza = round(var(goles), 2))

# La log-verosimilitud de una Poisson, como función de lambda
logv <- function(lambda, x) sum(dpois(x, lambda, log = TRUE))
logv(5, goles)
logv(6, goles)
sapply(c(5, 5.5, 5.8, 6, 6.5), logv, x = goles)

curve(sapply(x, logv, x = goles), from = 4, to = 8,
      main = "Log-verosimilitud de los goles", xlab = "lambda", ylab = "log L")
abline(v = mean(goles), lty = 2, col = "#FF6B4A")

# optimize: el máximo de una función de un parámetro en un intervalo
opt <- optimize(logv, interval = c(0.1, 20), x = goles, maximum = TRUE)
opt
round(opt$maximum, 4)

# Minutos hasta el primer gol en 20 partidos: dos parámetros, optim
primer_gol <- c(2.1, 5.4, 0.8, 3.9, 7.2, 1.5, 4.4, 2.8, 9.6, 3.1,
                1.2, 6.3, 2.5, 4.9, 3.6, 0.6, 5.8, 2.2, 8.1, 3.3)
nll_gamma <- function(par, x) {               # menos la log-verosimilitud
  -sum(dgamma(x, shape = par[1], rate = par[2], log = TRUE))
}
o <- optim(c(1, 1), nll_gamma, x = primer_gol, method = "L-BFGS-B", lower = c(1e-6, 1e-6))
round(o$par, 4)
o$convergence

# Mismo problema, sin límites: optimizar en escala logarítmica
nll_gamma_log <- function(lpar, x) nll_gamma(exp(lpar), x)
o2 <- optim(c(0, 0), nll_gamma_log, x = primer_gol)
round(exp(o2$par), 4)
round(c(o$value, o2$value), 4)

# Versión 1: el intervalo para lambda, escrito a mano
lambda_hat <- mean(goles)
n <- length(goles)
lambda_hat + c(-1, 1) * 1.96 * sqrt(lambda_hat / n)

# Versión 2: una función con nivel, comprobaciones y una lista de salida
ic_poisson <- function(x, nivel = 0.95) {
  stopifnot(is.numeric(x), all(x >= 0), all(x == round(x)), nivel > 0, nivel < 1)
  n <- length(x)
  est <- mean(x)
  z <- qnorm(1 - (1 - nivel) / 2)
  list(estimacion = est, ic = est + c(-1, 1) * z * sqrt(est / n), nivel = nivel, n = n)
}
r <- ic_poisson(goles)
round(r$ic, 2)
round(ic_poisson(goles, nivel = 0.99)$ic, 2)

# ¿Acierta el 95 %? Cobertura simulada con lambda conocida
cobertura <- function(lambda, n, B = 5000) {
  dentro <- replicate(B, {
    ic <- ic_poisson(rpois(n, lambda))$ic
    ic[1] <= lambda && lambda <= ic[2]
  })
  mean(dentro)
}
set.seed(2)
cobertura(lambda = 6, n = 30)
cobertura(lambda = 0.5, n = 10)

# Versión 4: dos métodos, elegidos con match.arg
ic_poisson <- function(x, nivel = 0.95, metodo = c("wald", "exacto")) {
  metodo <- match.arg(metodo)
  stopifnot(is.numeric(x), all(x >= 0), all(x == round(x)), nivel > 0, nivel < 1)
  n <- length(x)
  est <- mean(x)
  ic <- if (metodo == "wald") {
    z <- qnorm(1 - (1 - nivel) / 2)
    est + c(-1, 1) * z * sqrt(est / n)
  } else {
    as.numeric(poisson.test(sum(x), T = n, conf.level = nivel)$conf.int)
  }
  list(estimacion = est, ic = ic, nivel = nivel, n = n, metodo = metodo)
}
round(ic_poisson(goles)$ic, 2)
round(ic_poisson(goles, metodo = "exacto")$ic, 2)

cobertura <- function(lambda, n, metodo, B = 5000) {
  mean(replicate(B, {
    ic <- ic_poisson(rpois(n, lambda), metodo = metodo)$ic
    ic[1] <= lambda && lambda <= ic[2]
  }))
}
set.seed(3)
tamanos <- c(5, 10, 20, 40, 80)
tabla <- sapply(c("wald", "exacto"), function(m) sapply(tamanos, cobertura, lambda = 0.5, metodo = m))
rownames(tabla) <- paste0("n=", tamanos)
round(tabla, 3)

matplot(tamanos, tabla, type = "b", pch = 19, lty = 1, log = "x", ylim = c(0.8, 1),
        col = c("#FF6B4A", "#5B4BDB"), main = "Cobertura real del intervalo al 95 % (lambda = 0.5)",
        xlab = "Tamaño de la muestra", ylab = "Cobertura")
abline(h = 0.95, lty = 2)
