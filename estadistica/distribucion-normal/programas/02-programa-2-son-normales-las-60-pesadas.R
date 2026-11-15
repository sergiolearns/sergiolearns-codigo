# Programa 2: ¿son normales las 60 pesadas de la báscula?
# Del artículo «La distribución normal — práctica en R con 10.000 paquetes de gofio, una báscula y cajas de 12 (y la curva que se quedó pegada al suelo)»
# https://sergiolearns.com/distribucion-normal-practica/

bascula <- c(1012.3, 1004.8, 1009.1, 1006.9, 1015.5, 1009.4, 1006.9, 1007.8, 1004.1, 1011.7,
             1009.5, 1010.1, 1008.4, 1011.4, 1006.3, 1006.6, 1001.7, 1004.2, 1013.7, 1005.9,
             1011.3, 1007.5, 1017.0, 1008.4, 1002.0, 1011.0, 1014.9, 1010.9, 1005.5, 1008.2,
             1018.4, 1003.9, 1004.7, 1006.4, 1008.4, 1005.3, 1009.0,  998.2, 1013.2, 1016.5,
             1007.1, 1004.3, 1005.7, 1006.9, 1005.7,  998.4, 1011.1, 1011.6, 1017.4, 1004.5,
             1001.9, 1005.4, 1000.1, 1005.3, 1011.0, 1004.2, 1005.2, 1014.2, 1005.3, 1005.0)
m <- mean(bascula); s <- sd(bascula)     # estimamos mu y sigma con los datos
round(c(n = length(bascula), media = m, sd = s), 2)
summary(bascula)
# Histograma con la normal ajustada encima
hist(bascula, freq = FALSE, breaks = seq(996, 1020, by = 3), col = "grey90",
     main = "60 pesadas", xlab = "gramos")
curve(dnorm(x, m, s), add = TRUE, lwd = 2, col = "red")
# Gráfico cuantil-cuantil: puntos sobre la recta = normal
qqnorm(bascula); qqline(bascula, col = "red", lwd = 2)
# Lo que dice el modelo frente a lo que dicen los datos
round(c(datos = mean(bascula < 1000), modelo = pnorm(1000, m, s)), 4)
round(c(datos = mean(abs(bascula - m) <= s), modelo = pnorm(1) - pnorm(-1)), 4)
