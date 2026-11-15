# Programa 1: momentos para las cinco series
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

s2prima <- function(x) mean((x - mean(x))^2)   # momento central de orden 2: divide entre n

# 1) Estimadores por el método de los momentos
mm <- c(lambda_rafagas = mean(rafagas),                  # Poisson: E(X) = lambda
        p_llueve       = mean(llueve),                   # Bernoulli: E(X) = p
        alpha_viento   = 2 * mean(viento)^2 / pi,        # Rayleigh: E(X) = sqrt(alpha*pi/2)
        forma_lluvia   = mean(lluvia)^2 / s2prima(lluvia),   # gamma: forma
        tasa_lluvia    = mean(lluvia) / s2prima(lluvia),     # gamma: tasa
        theta_retraso  = 2 * mean(retraso))              # uniforme(0, theta): E(X) = theta/2
round(mm, 3)

# 2) ¿Encaja la Poisson con las ráfagas? Observadas frente a esperadas
obs <- table(factor(rafagas, levels = 0:9))      # horas con 0, 1, ..., 9 ráfagas
esp <- 24 * dpois(0:9, mm["lambda_rafagas"])     # horas esperadas si lambda = 3.21
tab <- rbind(observadas = as.vector(obs), esperadas = round(esp, 1))
colnames(tab) <- 0:9                             # una columna por número de ráfagas
tab
barplot(rbind(obs, esp), beside = TRUE, names.arg = 0:9,
        legend.text = c("observadas", "esperadas"), xlab = "ráfagas en una hora")

# 3) ¿Cuántas veces 2 * media queda por debajo del dato más grande?
set.seed(4)
imposible <- replicate(10000, {
  x <- runif(15, 0, 4)          # 15 retrasos con theta = 4
  2 * mean(x) < max(x)          # TRUE si el estimador deja fuera un dato
})
mean(imposible)                 # proporción de muestras con un estimador imposible
