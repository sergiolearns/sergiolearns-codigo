# Programa 3: ¿qué modelo siguen los tiempos de calentado?
# Del artículo «Variables aleatorias continuas — práctica en R con la cola del microondas simulada, tres tuppers que suman una gamma y un modelo que se ajusta a los datos (y el rgamma que me dio tiempos cuatro veces más cortos)»
# https://sergiolearns.com/variables-aleatorias-continuas-practica/

tiempos <- c(1.9, 2.9, 2.5, 1.0, 0.9, 1.1, 2.2, 1.3, 2.8, 2.6, 1.4, 1.9, 1.5, 2.9, 2.5,
             1.0, 3.0, 1.9, 2.3, 3.6, 1.7, 2.5, 3.2, 2.2, 1.4, 0.9, 3.4, 3.1, 2.6, 4.0,
             2.3, 1.1, 2.9, 3.8, 2.1, 0.8, 1.5, 1.0, 1.4, 2.1, 1.2, 2.5, 3.8, 1.8, 2.0,
             1.5, 1.7, 2.7, 2.0, 2.4, 3.0, 4.6, 4.3, 2.1, 1.3, 1.6, 2.0, 1.2, 0.8, 2.8)
m <- mean(tiempos)
s2 <- var(tiempos)
round(c(n = length(tiempos), media = m, varianza = s2), 3)
# Igualar media y varianza de la gamma a las de los datos y despejar
beta_g <- m / s2
alfa_g <- m^2 / s2
round(c(alfa = alfa_g, beta = beta_g), 2)
# Pasar de 3 minutos: en los datos, según la gamma y según la recta t/8
round(c(datos = mean(tiempos > 3), gamma = 1 - pgamma(3, alfa_g, beta_g), recta = 1 - 9 / 16), 3)
# Los cuartiles de los datos y de cada modelo
round(rbind(datos = quantile(tiempos, c(0.25, 0.5, 0.75)),
            gamma = qgamma(c(0.25, 0.5, 0.75), alfa_g, beta_g),
            recta = 4 * sqrt(c(0.25, 0.5, 0.75))), 2)
# Histograma con las dos densidades
hist(tiempos, breaks = seq(0.5, 5, by = 0.5), freq = FALSE, ylim = c(0, 0.6),
     main = "Tiempo de calentado", xlab = "minutos", ylab = "densidad")
curve(dgamma(x, alfa_g, beta_g), add = TRUE, lwd = 2, col = "red")
curve(ifelse(x > 0 & x < 4, x / 8, 0), add = TRUE, lwd = 2, lty = 2)
