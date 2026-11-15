# Programa 2: la verosimilitud, dibujada y maximizada
# Del artículo «Estimación puntual — práctica en R con la estación del campus, momentos, optimize, optim y fitdist (y la verosimilitud que me salía cero con 400 lecturas)»
# https://sergiolearns.com/estimacion-puntual-practica/

# Datos de la estación de la azotea
viento  <- c(7.9, 12.2, 11.5, 11.8, 7.0, 11.7, 4.6, 20.3, 9.4, 10.6,
             12.9, 3.1, 9.2, 27.3, 12.3, 5.5, 14.2, 14.2, 7.4, 21.1,
             14.6, 6.4, 25.4, 8.2, 14.8, 4.1, 7.1, 18.0, 5.6, 16.4,
             13.1, 19.7, 12.1, 11.0, 9.1, 20.8, 21.7, 18.6, 1.2, 4.5)
rafagas <- c(2, 6, 4, 4, 9, 4, 4, 1, 3, 3, 1, 4, 1, 1, 3, 2, 2, 3, 4, 3, 1, 4, 6, 2)
llueve  <- c(0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1)
lluvia  <- c(5.0, 8.8, 6.8, 6.1, 0.8, 8.7, 3.7, 10.0, 7.4, 1.6,
             7.1, 1.3, 7.5, 6.6, 12.0, 4.0, 7.2, 12.2, 14.8, 6.6)
retraso <- c(1.34, 1.18, 2.95, 3.36, 3.51, 1.17, 3.42, 3.74, 1.62, 0.91, 0.05, 1.01, 3.35, 0.52, 1.37)

drayleigh <- function(x, alpha) x / alpha * exp(-x^2 / (2 * alpha))   # la Rayleigh no viene en R

L_llueve <- function(p) p^sum(llueve) * (1 - p)^(length(llueve) - sum(llueve))  # p^9 (1-p)^21
l_viento <- function(a) sum(log(drayleigh(viento, a)))                          # log-verosimilitud

par(mfrow = c(1, 2))                                  # dos gráficos lado a lado
curve(L_llueve, 0, 1, xlab = "p", ylab = "L(p)", main = "Días de lluvia")
abline(v = mean(llueve), lty = 2)                     # el EMV, p = s/n
curve(Vectorize(l_viento)(x), 40, 250, xlab = "alpha", ylab = "l(alpha)", main = "Viento")
abline(v = sum(viento^2) / 80, lty = 2)               # el EMV, sum(x^2)/(2n)
par(mfrow = c(1, 1))

# El máximo, buscado de dos formas
o1 <- optimize(l_viento, interval = c(10, 500), maximum = TRUE)
o2 <- optim(par = 80, fn = l_viento, method = "Brent", lower = 10, upper = 500,
            control = list(fnscale = -1))
round(c(formula = sum(viento^2) / 80, optimize = o1$maximum, optim = o2$par,
        l_max = o2$value, convergencia = o2$convergence), 4)

# 400 lecturas: producto frente a suma de logaritmos
viento400 <- rep(viento, 10)
c(producto = prod(drayleigh(viento400, 93)), suma_logs = sum(log(drayleigh(viento400, 93))))
L400 <- function(a) prod(drayleigh(viento400, a))
optimize(L400, interval = c(10, 500), maximum = TRUE)$maximum     # con prod: el borde
optimize(function(a) sum(log(drayleigh(viento400, a))), c(10, 500), maximum = TRUE)$maximum
