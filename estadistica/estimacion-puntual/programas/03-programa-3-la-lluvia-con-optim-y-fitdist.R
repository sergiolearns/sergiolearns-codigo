# Programa 3: la lluvia con optim y fitdist
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

s2p  <- mean((lluvia - mean(lluvia))^2)            # S'^2
a_mm <- mean(lluvia)^2 / s2p                       # momentos: forma
b_mm <- mean(lluvia) / s2p                         # momentos: tasa

logver <- function(par, x) sum(dgamma(x, shape = par[1], rate = par[2], log = TRUE))
emv <- optim(par = c(a_mm, b_mm), fn = logver, x = lluvia,
             method = "L-BFGS-B", lower = c(0.01, 0.01),   # parámetros positivos
             control = list(fnscale = -1))                 # maximizar
a_mv <- emv$par[1]; b_mv <- emv$par[2]

round(rbind(momentos = c(forma = a_mm, tasa = b_mm, media = a_mm / b_mm,
                         l = logver(c(a_mm, b_mm), lluvia),
                         p_mas_10 = 1 - pgamma(10, a_mm, b_mm)),
            max_verosimilitud = c(a_mv, b_mv, a_mv / b_mv, emv$value,
                                  1 - pgamma(10, a_mv, b_mv))), 3)
c(convergencia = emv$convergence, dias_mas_10 = mean(lluvia > 10))

plot(ecdf(lluvia), main = "Lluvia: empírica frente a las dos gammas", xlab = "mm")
curve(pgamma(x, a_mv, b_mv), add = TRUE, lwd = 2)          # máxima verosimilitud
curve(pgamma(x, a_mm, b_mm), add = TRUE, lwd = 2, lty = 2) # momentos

# Con fitdist (paquete fitdistrplus, instálalo una vez con install.packages("fitdistrplus"))
suppressMessages(library(fitdistrplus))
ajuste <- fitdist(lluvia, "gamma")                 # method = "mle" por defecto
ajuste
round(c(loglik = ajuste$loglik, aic = ajuste$aic), 3)
fitdist(lluvia, "gamma", method = "mme")$estimate   # el de momentos
