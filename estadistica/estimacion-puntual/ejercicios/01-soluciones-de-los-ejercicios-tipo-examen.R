# Soluciones de los ejercicios tipo examen
# Del artículo «Estimación puntual — ejercicios tipo examen con la humedad, los rayos alrededor de la estación y la presión (y la var() que me costó medio punto)»
# https://sergiolearns.com/estimacion-puntual-ejercicios/

# Datos
humedad <- c(0.982, 0.708, 0.873, 0.976, 0.616, 0.610,
             0.841, 0.854, 0.837, 0.861, 0.975, 0.934)
rayos <- c(3.61, 7.22, 3.45, 2.87, 8.27, 5.76, 7.71, 8.50,
           3.85, 8.57, 8.80, 7.75, 6.59, 8.79, 5.21)
presion <- c(1018.7, 1015.3, 1009.3, 1007.0, 1009.1, 1014.8, 1015.3, 1011.6,
             1016.3, 1015.6, 1014.1, 1016.1, 1010.3, 1016.1, 1016.2)

# Ejercicio 1, apartado 3
n <- length(humedad)
theta_mm <- mean(humedad) / (1 - mean(humedad))   # momentos
theta_mv <- -n / sum(log(humedad))                # máxima verosimilitud
round(c(media = mean(humedad), suma_logs = sum(log(humedad)),
        momentos = theta_mm, mv = theta_mv), 2)

# Ejercicio 1, apartado 4
logver <- function(th) n * log(th) + (th - 1) * sum(log(humedad))
o <- optim(par = theta_mm, fn = logver, method = "Brent", lower = 0.01, upper = 50,
           control = list(fnscale = -1))
round(c(optim = o$par, formula = theta_mv, convergencia = o$convergence), 2)

# Ejercicio 1, apartado 5
round(c(emv = 1 - 0.9^theta_mv, en_la_muestra = mean(humedad > 0.9)), 2)

# Ejercicio 2, apartado 4
round(c(momentos = 1.5 * mean(rayos), mv = max(rayos)), 2)

# Ejercicio 2, apartado 5
set.seed(9)
sim <- replicate(10000, {
  r <- 9 * sqrt(runif(15))             # 15 rayos con theta = 9
  c(mv = max(r), mm = 1.5 * mean(r))
})
round(c(media_mv = mean(sim["mv", ]), media_mm = mean(sim["mm", ]),
        mm_imposible = mean(sim["mm", ] < sim["mv", ])), 3)

# Ejercicio 2, apartado 6
round(c(area = pi * max(rayos)^2, mediana = max(rayos) / sqrt(2),
        mediana_muestra = median(rayos)), 2)

# Ejercicio 3, apartado 2
n <- length(presion)
mu_mv  <- mean(presion)
s2_mv  <- mean((presion - mu_mv)^2)          # divide entre n
round(c(mu = mu_mv, sigma2_mv = s2_mv, var_R = var(presion),
        cociente = s2_mv / var(presion), catorce_quinceavos = (n - 1) / n), 4)

# Ejercicio 3, apartado 3: con fitdist (paquete fitdistrplus)
suppressMessages(library(fitdistrplus))
fitdist(presion, "norm")

# Ejercicio 3, apartado 4
round(c(p_borrasca = pnorm(1010, mu_mv, sqrt(s2_mv)), sigma_mv = sqrt(s2_mv),
        en_la_muestra = mean(presion < 1010)), 4)

# Ejercicio 3, apartado 5
round(c(sigma2_mu_conocida = mean((presion - 1013)^2), sigma2_mu_estimada = s2_mv), 4)

# Bonus
c(p = 1 - ppois(84, 72))     # P(suma >= 85) = 1 - P(suma <= 84)

