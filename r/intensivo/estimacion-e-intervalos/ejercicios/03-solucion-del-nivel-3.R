# Solución del nivel 3 (con los datos y las funciones que necesita)
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

# ==== Ejercicio 3a: EMV de la gamma con optim ====
logL_gamma <- function(par, x) sum(dgamma(x, shape = par[1], rate = par[2], log = TRUE))
ini <- c(mean(km)^2 / var(km), mean(km) / var(km))      # método de los momentos
round(ini, 3)
ajuste <- optim(ini, logL_gamma, x = km, method = "L-BFGS-B",
                lower = c(0.01, 0.001), control = list(fnscale = -1))
round(ajuste$par, 3)
ajuste$convergence                                      # 0 = ha convergido
round(ajuste$par[1] / ajuste$par[2], 2)                 # media estimada

# ==== Ejercicio 3b: P(X < 15) con la gamma ajustada ====
k_hat <- ajuste$par[1]; b_hat <- ajuste$par[2]
round(pgamma(15, shape = k_hat, rate = b_hat), 4)       # con el modelo
mean(km < 15)                                           # en la muestra
hist(km, breaks = seq(10, 40, by = 5), freq = FALSE, main = "Autonomía del patinete",
     xlab = "Kilómetros por carga", ylab = "Densidad")
curve(dgamma(x, shape = k_hat, rate = b_hat), add = TRUE, lwd = 2, col = "red")

# ==== Ejercicio 3c: IC al 95 % para la media ====
ic_media(km)$ic

# ==== Ejercicio 3d: cobertura simulada con datos gamma ====
cubre <- function(B, n, shape, rate, nivel = 0.95) {
  mu <- shape / rate                                    # la media verdadera
  dentro <- replicate(B, {
    ic <- ic_media(rgamma(n, shape, rate), nivel, digitos = 10)$ic
    ic["inf"] <= mu & mu <= ic["sup"]                   # ¿la atrapa?
  })
  mean(dentro)                                          # proporción de aciertos
}
set.seed(28)
cubre(2000, 20, 9, 0.4)          # el patinete
cubre(2000, 5, 0.8, 0.04)        # muy asimétrico y con pocos datos
