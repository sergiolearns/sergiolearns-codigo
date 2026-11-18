# Solución del nivel 3
# Del artículo «Intensivo de R 3: normal y conjuntas — ejercicios con la máquina de café de la facultad, ifelse, sapply y un millón de vasos (y el && que ya no perdona)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas-ejercicios/

# ==== Ejercicio 3a: simular 10.000 vasos ====
set.seed(30)
cafe  <- rnorm(10000, mean = 60, sd = 4)
leche <- 90 + 0.5 * (cafe - 60) + rnorm(10000, mean = 0, sd = 5)   # sin bucle: 10.000 a la vez
vasos <- cbind(cafe, leche)                                        # matriz 10000 x 2 con nombres
dim(vasos)
round(apply(vasos, 2, mean), 2)
round(apply(vasos, 2, sd), 2)

# ==== Ejercicio 3b: relación entre café y leche ====
round(cov(vasos), 2)
round(cor(vasos), 2)
plot(vasos[1:500, "cafe"], vasos[1:500, "leche"],
     main = "Café y leche en 500 vasos", xlab = "Café (ml)", ylab = "Leche (ml)", pch = 20)

# ==== Ejercicio 3c: T = X + Y sin bucles ====
total <- vasos[, "cafe"] + vasos[, "leche"]
round(c(media = mean(total), var = var(total)), 2)
round(mean(total > 165), 4)                 # simulada
round(1 - pnorm(165, 150, sqrt(61)), 4)     # teórica: T es normal (suma de normales)

# ==== Ejercicio 3d: bucle frente a ifelse ====
set.seed(1)
millon <- rnorm(1e6, mean = 150, sd = 8)
system.time({
  e1 <- character(1e6)                     # reservar el vector antes
  for (i in seq_along(millon)) {
    e1[i] <- if (millon[i] > 165) "derrama" else "ok"
  }
})
system.time(e2 <- ifelse(millon > 165, "derrama", "ok"))
identical(e1, e2)
