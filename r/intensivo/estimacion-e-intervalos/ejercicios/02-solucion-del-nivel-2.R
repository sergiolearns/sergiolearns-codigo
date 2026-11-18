# Solución del nivel 2 (con los datos y las funciones que necesita)
# Del artículo «Intensivo de R 5: estimación e intervalos — ejercicios con la autonomía de mi patinete, optimize, optim y tu propia función de intervalos (y el máximo que estaba en el borde)»
# https://sergiolearns.com/r-intensivo-estimacion-e-intervalos-ejercicios/

km <- c(27.1, 17.6, 28.9, 19.6, 21.4, 25.0, 35.7, 35.9, 12.7, 21.5, 28.2, 15.3, 15.2, 12.2, 12.1,
        27.5, 32.1, 31.4, 28.3, 34.9)                    # autonomía por carga (km)
baches <- c(3, 5, 2, 4, 6, 3, 1, 4, 5, 3, 2, 4)          # baches fuertes por trayecto
round(c(media_km = mean(km), sd_km = sd(km), media_baches = mean(baches)), 2)

# ic_media(): intervalo t para la media, con sus comprobaciones
ic_media <- function(x, nivel = 0.95, digitos = 2) {
  x <- x[!is.na(x)]                                     # los NA fuera
  stopifnot(is.numeric(x), length(x) >= 2, nivel > 0, nivel < 1)
  n <- length(x); m <- mean(x); s <- sd(x)
  t <- qt(1 - (1 - nivel) / 2, df = n - 1)              # cuantil de dos colas
  margen <- t * s / sqrt(n)
  list(n = n, media = round(m, digitos), margen = round(margen, digitos),
       ic = round(c(inf = m - margen, sup = m + margen), digitos), nivel = nivel)
}
r <- ic_media(km)
r
round(t.test(km)$conf.int, 2)
str(ic_media(km, 0.99))
