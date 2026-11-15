# Funciones «para tu script» de estimación puntual
# Del artículo «Estimación puntual — ejercicios tipo examen con la humedad, los rayos alrededor de la estación y la presión (y la var() que me costó medio punto)»
# https://sergiolearns.com/estimacion-puntual-ejercicios/

# ===== Estimación puntual (ME1, tema 9) =====
s2p <- function(x) mean((x - mean(x))^2)               # S'^2 (divide entre n)

# --- Momentos: fórmulas cerradas
emm_poisson  <- function(x) mean(x)
emm_exp      <- function(x) 1 / mean(x)
emm_gamma    <- function(x) c(forma = mean(x)^2 / s2p(x), tasa = mean(x) / s2p(x))
emm_unif_ab  <- function(x) c(a = mean(x) - sqrt(3 * s2p(x)), b = mean(x) + sqrt(3 * s2p(x)))
emm_rayleigh <- function(x) 2 * mean(x)^2 / pi

# --- Máxima verosimilitud: fórmulas cerradas
emv_bernoulli <- function(x) mean(x)
emv_poisson   <- function(x) mean(x)
emv_exp       <- function(x) 1 / mean(x)
emv_normal    <- function(x) c(mu = mean(x), sigma2 = s2p(x))
emv_unif      <- function(x) max(x)                     # uniforme(0, theta)
emv_rayleigh  <- function(x) sum(x^2) / (2 * length(x))
drayleigh <- function(x, alpha) x / alpha * exp(-x^2 / (2 * alpha))

# --- Máxima verosimilitud numérica
# Un parámetro: la log-verosimilitud como función de theta (datos dentro)
emv_1par <- function(logver, a, b) optimize(logver, c(a, b), maximum = TRUE)$maximum
# Varios parámetros: logver(par, x) con par vector; inicio = estimador de momentos
emv_optim <- function(logver, inicio, x, inf = rep(0.01, length(inicio))) {
  o <- optim(inicio, logver, x = x, method = "L-BFGS-B", lower = inf,
             control = list(fnscale = -1))
  if (o$convergence != 0) warning("optim no ha convergido")
  o
}
logver_gamma <- function(par, x) sum(dgamma(x, shape = par[1], rate = par[2], log = TRUE))
logver_norm  <- function(par, x) sum(dnorm(x, mean = par[1], sd = par[2], log = TRUE))
# Ejemplo: emv_optim(logver_gamma, emm_gamma(lluvia), lluvia)$par

# --- Con fitdistrplus (instalado antes del examen)
# library(fitdistrplus)
# fitdist(x, "gamma"); fitdist(x, "norm"); fitdist(x, "exp")
# fitdist(x, "gamma", method = "mme")     # momentos

# --- Dibujar una log-verosimilitud de un parámetro
dibuja_logver <- function(logver, a, b, marca = NULL) {
  curve(Vectorize(logver)(x), a, b, xlab = "parámetro", ylab = "log-verosimilitud")
  if (!is.null(marca)) abline(v = marca, lty = 2)
}

# --- Invarianza: meter el EMV en la fórmula, por ejemplo
# P(X > c) en la Rayleigh: exp(-c^2 / (2 * emv_rayleigh(x)))
# P(X < c) en la normal:   pnorm(c, mean(x), sqrt(s2p(x)))
