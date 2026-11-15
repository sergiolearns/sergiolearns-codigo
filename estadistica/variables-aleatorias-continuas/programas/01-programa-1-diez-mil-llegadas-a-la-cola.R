# Programa 1: diez mil llegadas a la cola
# Del artículo «Variables aleatorias continuas — práctica en R con la cola del microondas simulada, tres tuppers que suman una gamma y un modelo que se ajusta a los datos (y el rgamma que me dio tiempos cuatro veces más cortos)»
# https://sergiolearns.com/variables-aleatorias-continuas-practica/

set.seed(2026)
t <- rexp(10000, rate = 0.5)        # 10.000 tiempos entre llegadas: ritmo 0,5 por minuto
# 1. Los resúmenes de la simulación frente a los teóricos
round(c(media = mean(t), varianza = var(t), mediana = median(t)), 2)
round(c(media = 1 / 0.5, varianza = 1 / 0.5^2, mediana = qexp(0.5, 0.5)), 2)
# 2. Dos probabilidades: contadas (proporción de TRUE) frente a pexp
round(c(simulado = mean(t < 1), teorico = pexp(1, 0.5)), 4)
round(c(simulado = mean(t > 5), teorico = 1 - pexp(5, 0.5)), 4)
# 3. La falta de memoria: de los que ya pasan de 3, ¿cuántos pasan de 5?
largos <- t[t > 3]                  # nos quedamos solo con las esperas que ya llevan 3 minutos
length(largos)
round(c(mas_de_5_si_ya_3 = mean(largos > 5), mas_de_2 = mean(t > 2)), 4)
# 4. Histograma en escala de densidad y la curva teórica encima
hist(t, breaks = seq(0, ceiling(max(t)), by = 0.5), freq = FALSE, xlim = c(0, 12),
     main = "Tiempo entre llegadas", xlab = "minutos", ylab = "densidad")
curve(dexp(x, 0.5), add = TRUE, lwd = 2, col = "red")
