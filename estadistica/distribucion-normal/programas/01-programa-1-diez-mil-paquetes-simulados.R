# Programa 1: diez mil paquetes simulados
# Del artículo «La distribución normal — práctica en R con 10.000 paquetes de gofio, una báscula y cajas de 12 (y la curva que se quedó pegada al suelo)»
# https://sergiolearns.com/distribucion-normal-practica/

set.seed(2026)                         # para que salgan siempre los mismos
pesos <- rnorm(10000, mean = 1010, sd = 6)
head(round(pesos, 1))                  # los seis primeros paquetes
round(c(media = mean(pesos), sd = sd(pesos)), 2)
# Proporción de paquetes de menos de 1 kg: simulada frente a teórica
round(c(simulada = mean(pesos < 1000), teorica = pnorm(1000, 1010, 6)), 4)
# La regla 68-95-99,7 en los datos simulados
dentro <- sapply(1:3, function(k) mean(abs(pesos - 1010) <= k * 6))
round(dentro, 4)
# Cuantiles simulados frente a qnorm
round(quantile(pesos, c(0.01, 0.10, 0.90)), 2)
round(qnorm(c(0.01, 0.10, 0.90), 1010, 6), 2)
# Histograma en escala de densidad con la campana encima
hist(pesos, freq = FALSE, breaks = 40, col = "grey90",
     main = "10.000 paquetes", xlab = "gramos")
curve(dnorm(x, 1010, 6), add = TRUE, lwd = 2, col = "red")
