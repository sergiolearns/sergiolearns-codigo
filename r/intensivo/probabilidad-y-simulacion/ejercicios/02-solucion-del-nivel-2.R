# Solución del nivel 2
# Del artículo «Intensivo de R 2: probabilidad y simulación — ejercicios con el álbum de cromos, los dados del parchís y tu propia variable aleatoria (y las mil partidas que eran la misma)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion-ejercicios/

# sobres_hasta_completar(): cuántos sobres hacen falta para llenar un álbum
sobres_hasta_completar <- function(n_cromos = 50, por_sobre = 5) {
  stopifnot(n_cromos >= 1, por_sobre >= 1)
  tengo  <- rep(FALSE, n_cromos)   # TRUE en los cromos que ya están pegados
  sobres <- 0
  while (!all(tengo)) {            # mientras falte alguno
    sobre <- sample(1:n_cromos, por_sobre, replace = TRUE)   # 5 cromos, pueden repetirse
    tengo[sobre] <- TRUE           # pegarlos (un repetido no cambia nada)
    sobres <- sobres + 1
  }
  sobres
}
set.seed(11)
x <- replicate(1000, sobres_hasta_completar())
summary(x)
quantile(x, 0.9)
round(50 * sum(1 / (1:50)) / 5, 2)   # media teórica en sobres

hist(x, breaks = seq(20, 120, by = 10), main = "1000 álbumes simulados",
     xlab = "Sobres hasta completar", ylab = "Número de álbumes")

# Lo mismo con un bucle for: con la misma semilla, el mismo resultado
set.seed(11)
y <- numeric(1000)                 # reservar el vector antes del bucle
for (i in 1:1000) {
  y[i] <- sobres_hasta_completar()
}
identical(x, y)
