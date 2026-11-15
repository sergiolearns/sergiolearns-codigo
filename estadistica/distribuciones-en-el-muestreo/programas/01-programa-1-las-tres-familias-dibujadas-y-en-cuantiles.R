# Programa 1: las tres familias, dibujadas y en cuantiles
# Del artículo «Distribuciones en el muestreo — práctica en R con el wifi del campus, replicate, histogramas, qchisq, qt y qf (y la curva que no encajaba por un grado de libertad)»
# https://sergiolearns.com/distribuciones-en-el-muestreo-practica/

par(mfrow = c(1, 3))                              # tres gráficos en una fila
# 1. Ji cuadrado: media k, varianza 2k
curve(dchisq(x, 3), 0, 30, lwd = 2, ylab = "f(x)", main = "Ji cuadrado")
curve(dchisq(x, 8), add = TRUE, lwd = 2, col = "red")
curve(dchisq(x, 15), add = TRUE, lwd = 2, col = "blue")
# 2. t de Student frente a la N(0, 1)
curve(dnorm(x), -4, 4, lty = 2, ylab = "f(x)", main = "t de Student")
curve(dt(x, 2), add = TRUE, lwd = 2)
curve(dt(x, 14), add = TRUE, lwd = 2, col = "red")
# 3. F de Snedecor
curve(df(x, 5, 10), 0, 4, lwd = 2, ylab = "f(x)", main = "F de Snedecor")
curve(df(x, 14, 11), add = TRUE, lwd = 2, col = "red")
par(mfrow = c(1, 1))                              # volver a un gráfico
# 4. La tabla de cuantiles de examen
gl <- c(2, 5, 10, 14, 30, 100)
cuantiles <- data.frame(gl,
                        chi_95  = qchisq(0.95, gl),       # deja el 5 % a la derecha
                        t_975   = qt(0.975, gl),          # deja el 2,5 % en cada cola
                        F_95_10 = qf(0.95, gl, 10))       # gl arriba, 10 abajo
round(cuantiles, 3)
qnorm(0.975)                                      # el de la normal, para comparar
