# Soluciones de los ejercicios tipo examen
# Del artículo «Variables aleatorias discretas — ejercicios tipo examen con el grupo de WhatsApp, modelos que hay que reconocer y una función de masa con parámetro (y el 1 - pbinom(5) que me costó un punto)»
# https://sergiolearns.com/variables-aleatorias-discretas-ejercicios/

# ---- Ejercicio 1 (c): media, varianza y gráfico de F ----
x <- c(0, 1, 2, 4)
F <- c(0.35, 0.65, 0.85, 1)
p <- diff(c(0, F))                  # saltos de F: la función de masa
p
media <- sum(x * p)
varianza <- sum(x^2 * p) - media^2
round(c(media = media, varianza = varianza, sd = sqrt(varianza)), 2)
plot(c(-1, x, 5), c(0, F, 1), type = "s", xlab = "Audios al día",
     ylab = "F(x)", xaxt = "n")
axis(1, at = c(-1, x, 5))
points(x, F, pch = 19)

# ---- Ejercicio 2: binomial, geométrica, binomial negativa y Poisson ----
# (a)
round(c(P3 = dbinom(3, 20, 0.15), al_menos_5 = 1 - pbinom(4, 20, 0.15),
        media = 20 * 0.15, var = 20 * 0.15 * 0.85), 2)
# (b)
round(c(mas_de_6 = 1 - pgeom(6, 0.15), formula = 0.85^7, media = 0.85 / 0.15), 2)
# (c)
round(pnbinom(10, 3, 0.15), 2)
qnbinom(0.9, 3, 0.15)
# (d)
round(ppois(8, 6) - ppois(3, 6), 2)
round(dpois(4:8, 6), 4)
plot(0:16, dpois(0:16, 6), type = "h", lwd = 4,
     xlab = "Preguntas en una hora", ylab = "P(W = k)")

# ---- Ejercicio 3 (c): comprobar la media sumando la serie ----
theta <- 2
x <- 1:60                                       # la cola más allá de 60 es despreciable
p <- theta^x / (factorial(x) * (exp(theta) - 1))
round(c(suma = sum(p), media_serie = sum(x * p),
        media_formula = theta * exp(theta) / (exp(theta) - 1)), 2)

# ---- Bonus: E(2^X) con X ~ Pois(4) ----
sum(2^(0:60) * dpois(0:60, 4)); exp(4)
