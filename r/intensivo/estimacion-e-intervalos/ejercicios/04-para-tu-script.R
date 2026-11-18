# Para tu script: las funciones del bloque, comentadas y sin enunciados
# Del artículo «Intensivo de R 5: estimación e intervalos — ejercicios con la autonomía de mi patinete, optimize, optim y tu propia función de intervalos (y el máximo que estaba en el borde)»
# https://sergiolearns.com/r-intensivo-estimacion-e-intervalos-ejercicios/

# ===================== Bloque R5: máxima verosimilitud, intervalos y cobertura =====================

# emv_1(logL, intervalo): estimador de máxima verosimilitud con un parámetro
emv_1 <- function(logL, intervalo) {
  o <- optimize(logL, interval = intervalo, maximum = TRUE)
  if (min(abs(o$maximum - intervalo)) < 1e-3 * diff(intervalo))
    warning("El máximo está en el borde: amplía el intervalo")
  o$maximum
}

# emv_optim(logL, inicio, x, inferior): estimadores con varios parámetros (logL(par, x))
emv_optim <- function(logL, inicio, x, inferior = rep(1e-3, length(inicio))) {
  a <- optim(inicio, logL, x = x, method = "L-BFGS-B", lower = inferior,
             control = list(fnscale = -1))
  if (a$convergence != 0) warning("optim no ha convergido (código ", a$convergence, ")")
  a$par
}

# Log-verosimilitudes de uso frecuente
logL_pois  <- function(lambda, x) sum(dpois(x, lambda, log = TRUE))
logL_exp   <- function(lambda, x) sum(dexp(x, lambda, log = TRUE))
logL_gamma <- function(par, x) sum(dgamma(x, shape = par[1], rate = par[2], log = TRUE))

# ic_media(x, nivel): intervalo t para la media, con comprobaciones
ic_media <- function(x, nivel = 0.95, digitos = 2) {
  x <- x[!is.na(x)]
  stopifnot(is.numeric(x), length(x) >= 2, nivel > 0, nivel < 1)
  n <- length(x); m <- mean(x); s <- sd(x)
  margen <- qt(1 - (1 - nivel) / 2, df = n - 1) * s / sqrt(n)
  list(n = n, media = round(m, digitos), margen = round(margen, digitos),
       ic = round(c(inf = m - margen, sup = m + margen), digitos), nivel = nivel)
}

# cobertura(genera, mu, B, nivel): proporción de intervalos que atrapan mu
# 'genera' es una función sin argumentos que devuelve una muestra
cobertura <- function(genera, mu, B = 2000, nivel = 0.95) {
  mean(replicate(B, {
    ic <- ic_media(genera(), nivel, digitos = 10)$ic
    ic["inf"] <= mu & mu <= ic["sup"]
  }))
}
