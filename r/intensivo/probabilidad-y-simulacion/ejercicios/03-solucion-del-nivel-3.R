# Solución del nivel 3
# Del artículo «Intensivo de R 2: probabilidad y simulación — ejercicios con el álbum de cromos, los dados del parchís y tu propia variable aleatoria (y las mil partidas que eran la misma)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion-ejercicios/

# ==== Ejercicio 3a: un turno del parchís ====
turno <- function() {
  avance <- 0
  for (seises in 0:2) {        # como mucho tres tiradas
    d <- sample(1:6, 1)
    avance <- avance + d
    if (d < 6) return(avance)  # sin 6: el turno acaba aquí
  }
  0                            # tres seises seguidos: vuelve a casa, avanza 0
}

# ==== Ejercicio 3b: simulación ====
set.seed(2027)
X <- replicate(10000, turno())
round(table(X) / 10000, 4)
round(mean(X), 2)

# ==== Ejercicio 3c: distribución teórica ====
valores <- c(0, 1:5, 7:11, 13:17)
prob <- c((1/6)^3,            # 6, 6, 6: vuelve a casa
          rep(1/6, 5),        # 1 a 5 a la primera
          rep((1/6)^2, 5),    # un 6 y luego 1 a 5
          rep((1/6)^3, 5))    # dos 6 y luego 1 a 5
sum(prob)
round(sum(valores * prob), 2)

# ==== Ejercicio 3d: P(X >= 10) y comparación ====
round(sum(prob[valores >= 10]), 4)   # teórica
mean(X >= 10)                         # simulada
simulada <- table(factor(X, levels = valores)) / 10000
barplot(rbind(prob, simulada), beside = TRUE, names.arg = valores,
        col = c("grey80", "orange"), legend.text = c("Teórica", "Simulada"),
        main = "Casillas que avanzas en un turno", xlab = "X", ylab = "Probabilidad")
