# Pruébalo en el entorno de R
# Del artículo «Intensivo de R 5: estimación e intervalos — optimize, optim y tu propia función de intervalos con los goles de la liga del campus (y el 95 % que acertaba el 87 %)»
# https://sergiolearns.com/r-intensivo-estimacion-e-intervalos/

goles <- c(5, 7, 4, 6, 8, 3, 6, 5, 9, 4, 6, 7, 5, 2, 6,
           8, 5, 7, 4, 6, 10, 5, 6, 3, 7, 5, 6, 8, 4, 6)

# ---- Máxima verosimilitud --------------------------------------------
logv <- function(lambda, x) sum(dpois(x, lambda, log = TRUE))
optimize(logv, interval = c(0.1, 20), x = goles, maximum = TRUE)

# ---- Intervalo y su cobertura ---------------------------------------
ic_wald <- function(x, nivel = 0.95) {
  z <- qnorm(1 - (1 - nivel) / 2)
  mean(x) + c(-1, 1) * z * sqrt(mean(x) / length(x))
}
ic_wald(goles)

set.seed(2)
dentro <- replicate(5000, {
  ic <- ic_wald(rpois(10, 0.5))
  ic[1] <= 0.5 && 0.5 <= ic[2]
})
mean(dentro)
