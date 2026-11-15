# Funciones para tu script
# Del artículo «Propiedades de los estimadores — ejercicios tipo examen con la flota de patinetes, el máximo que mejor acierta, el velocímetro y Cramér–Rao (y el «más eficiente» que no era)»
# https://sergiolearns.com/propiedades-de-los-estimadores-ejercicios/

## Propiedades de los estimadores (ME1, tema 10)

# Simula un estimador o varios: 'genera' devuelve una muestra, 'estimadores' un vector con nombres.
simular_est <- function(genera, estimadores, B = 10000) replicate(B, estimadores(genera()))

# Resumen de una matriz de simulaciones (un estimador por fila): media, sesgo, varianza (entre B) y ECM.
resumen_est <- function(sims, theta) {
  media <- apply(sims, 1, mean)
  ecm   <- apply(sims, 1, function(v) mean((v - theta)^2))
  round(data.frame(media, sesgo = media - theta, varianza = ecm - (media - theta)^2, ecm), 4)
}

# Varianza asintótica y error estándar del EMV a partir de la log-verosimilitud (un parámetro).
emv_ee <- function(logver, inicio, lower, upper) {
  o <- optim(inicio, logver, method = "Brent", lower = lower, upper = upper,
             control = list(fnscale = -1), hessian = TRUE)
  c(emv = o$par, var_asint = -1 / o$hessian[1, 1], error_est = sqrt(-1 / o$hessian[1, 1]))
}

# Información de Fisher de una observación de una discreta, como E[(d log f / d theta)^2].
info_fisher_disc <- function(dlogf, dmasa, soporte) sum(dlogf(soporte)^2 * dmasa(soporte))

# ECM de c * máximo de una uniforme(0, theta), dividido entre theta^2.
ecm_c_max <- function(c, n) c^2 * n / (n + 2) - 2 * c * n / (n + 1) + 1

# Ejemplos de uso
set.seed(1)
s <- simular_est(function() runif(12, 0, 2400),
                 function(x) c(mom = 2 * mean(x), cor = 13 / 12 * max(x)), B = 2000)
resumen_est(s, 2400)
emv_ee(function(l) 20 * log(l) - l * 238.2, 0.08, 0.001, 1)       # exponencial, n = 20, suma 238,2
info_fisher_disc(function(x) -1 + x / 3, function(x) dpois(x, 3), 0:100)   # Poisson(3): 1/3
optimize(ecm_c_max, c(0.5, 2), n = 10)$minimum                      # (n + 2) / (n + 1)
