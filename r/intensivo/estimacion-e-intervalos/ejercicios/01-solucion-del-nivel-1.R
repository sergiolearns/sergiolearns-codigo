# Solución del nivel 1 (con los datos y las funciones que necesita)
# Del artículo «Intensivo de R 5: estimación e intervalos — ejercicios con la autonomía de mi patinete, optimize, optim y tu propia función de intervalos (y el máximo que estaba en el borde)»
# https://sergiolearns.com/r-intensivo-estimacion-e-intervalos-ejercicios/

km <- c(27.1, 17.6, 28.9, 19.6, 21.4, 25.0, 35.7, 35.9, 12.7, 21.5, 28.2, 15.3, 15.2, 12.2, 12.1,
        27.5, 32.1, 31.4, 28.3, 34.9)                    # autonomía por carga (km)
baches <- c(3, 5, 2, 4, 6, 3, 1, 4, 5, 3, 2, 4)          # baches fuertes por trayecto
round(c(media_km = mean(km), sd_km = sd(km), media_baches = mean(baches)), 2)

logL <- function(lambda) sum(dpois(baches, lambda, log = TRUE))
optimize(logL, interval = c(0.1, 10), maximum = TRUE)
mean(baches)

curve(sapply(x, logL), from = 1, to = 8, main = "Log-verosimilitud de los baches",
      xlab = expression(lambda), ylab = "log L")
