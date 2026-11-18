# Todo el código del artículo, en orden (sin los errores a propósito)
# Del artículo «Intensivo de R 3: normal y conjuntas — vectorizar, pnorm en tus funciones y simular mis 5 km y 10 km (y el bucle que tardaba 40 veces más)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas/

# Mis tiempos (en minutos) en las 8 carreras de 5 km de la temporada
t5 <- c(27.4, 26.1, 25.8, 26.9, 24.9, 25.6, 26.3, 25.2)
t5 / 5               # ritmo en min/km: cada tiempo entre 5, sin bucle
t5 - mean(t5)        # cuánto se aleja cada carrera de la media
sum(t5 < 26)         # cuántas bajan de 26 minutos

# ifelse: un if para cada elemento, de una vez
ifelse(t5 < 26, "buena", "normal")
# Reciclaje: el vector corto se repite para encajar con el largo
t5[1:4] - c(0, 1)

# Muchas funciones de R ya son vectoriales: pnorm con tres desviaciones a la vez
pnorm(25, mean = 26, sd = c(1, 1.5, 2))

# Matrices: 4 semanas (filas) x 3 entrenamientos (columnas), en minutos de 5 km
M <- matrix(c(27.9, 27.2, 26.8, 26.5,
              27.1, 26.9, 26.2, 25.9,
              28.3, 27.6, 27.0, 26.4), nrow = 4,
            dimnames = list(paste0("sem", 1:4), c("lun", "mié", "vie")))
M
apply(M, 1, mean)    # 1 = por filas: la media de cada semana
apply(M, 2, min)     # 2 = por columnas: el mejor tiempo de cada día

# sapply: aplicar una función a cada elemento y juntar los resultados
objetivos <- c(24, 25, 26, 27)
sapply(objetivos, function(o) round(pnorm(o, mean = 26, sd = 1.5), 3))

# Una función con la normal dentro: probabilidad de bajar de una marca
prob_bajar_de <- function(marca, media, desv) {
  stopifnot(desv > 0)
  pnorm(marca, mean = media, sd = desv)
}
round(prob_bajar_de(25, media = 26, desv = 1.5), 4)
qnorm(0.9, mean = 26, sd = 1.5)     # el tiempo que solo supero el 10 % de las veces

# Simular una transformación: la velocidad media en km/h si T5 ~ N(26, 1.5)
set.seed(21)
tiempos <- rnorm(10000, mean = 26, sd = 1.5)
velocidad <- 5 / (tiempos / 60)     # km/h, para los 10.000 a la vez
round(c(media = mean(velocidad), teorica_ingenua = 5 / (26 / 60)), 3)
round(quantile(velocidad, c(0.05, 0.5, 0.95)), 2)

hist(velocidad, breaks = 40, freq = FALSE, main = "Velocidad media en 5 km",
     xlab = "km/h", ylab = "Densidad", col = "#A99EF5", border = "white")

# Versión 1: simular la temporada de 10 km con un bucle y un if por carrera
simular_v1 <- function(n) {
  t5 <- numeric(n); t10 <- numeric(n); nivel <- character(n)
  for (i in 1:n) {
    t5[i] <- rnorm(1, mean = 26, sd = 1.5)
    t10[i] <- 2 * t5[i] + 1 + rnorm(1, mean = 0, sd = 1.5)
    if (t10[i] < 50) {
      nivel[i] <- "sub-50"
    } else {
      nivel[i] <- "normal"
    }
  }
  data.frame(t5, t10, nivel)
}
set.seed(3)
head(simular_v1(5), 3)

# Versión 2: lo mismo, vectorizado (sin bucle)
simular_v2 <- function(n, media = 26, desv = 1.5, ruido = 1.5) {
  stopifnot(n >= 1, desv > 0, ruido >= 0)
  t5 <- rnorm(n, mean = media, sd = desv)
  t10 <- 2 * t5 + 1 + rnorm(n, mean = 0, sd = ruido)
  nivel <- ifelse(t10 < 50, "sub-50", "normal")
  data.frame(t5, t10, nivel)
}
set.seed(3)
head(simular_v2(5), 3)

# ¿Cuánto se gana? Medimos con system.time
set.seed(1); system.time(d1 <- simular_v1(200000))
set.seed(1); system.time(d2 <- simular_v2(200000))

# Las conjuntas: covarianza, correlación y una probabilidad, simuladas frente a teóricas
set.seed(99)
d <- simular_v2(100000)
round(c(cov = cov(d$t5, d$t10), cor = cor(d$t5, d$t10)), 3)
round(c(cov_teorica = 2 * 1.5^2, cor_teorica = 2 * 1.5^2 / (1.5 * sqrt(4 * 1.5^2 + 1.5^2))), 3)
round(c(simulada = mean(d$t10 < 50), teorica = pnorm(50, mean = 53, sd = sqrt(11.25))), 4)
table(d$nivel)

plot(d$t5[1:300], d$t10[1:300], pch = 19, col = "#5B4BDB80",
     main = "Mis 5 km frente a mis 10 km (300 carreras simuladas)",
     xlab = "Tiempo en 5 km (min)", ylab = "Tiempo en 10 km (min)")
abline(a = 1, b = 2, col = "#FF6B4A", lwd = 2)
