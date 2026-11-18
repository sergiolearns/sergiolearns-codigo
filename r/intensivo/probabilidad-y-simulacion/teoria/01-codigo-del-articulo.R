# Todo el código del artículo, en orden (sin los errores a propósito)
# Del artículo «Intensivo de R 2: probabilidad y simulación — sample, set.seed y replicate con los sobres de cromos de un álbum (y la semilla que se me olvidó poner)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion/

# Un sobre: 5 cromos distintos de un álbum de 50
sample(1:50, 5)
sample(1:50, 5)

# Con set.seed el azar se puede repetir: misma semilla, mismo sobre
set.seed(2026)
sample(1:50, 5)
set.seed(2026)
sample(1:50, 5)

# replace = TRUE: cada extracción vuelve a la bolsa (un dado lanzado 10 veces)
set.seed(1)
sample(1:6, 10, replace = TRUE)
# prob: valores con probabilidades distintas
set.seed(1)
sample(c("normal", "brillante"), 10, replace = TRUE, prob = c(0.8, 0.2))

# replicate(n, expresión): repite la expresión n veces y junta los resultados
set.seed(7)
replicate(6, 1 %in% sample(1:50, 5))   # ¿trae el sobre el cromo dorado (el 1)?

# La frecuencia relativa se acerca a la probabilidad (5/50 = 0.1)
set.seed(11)
dorado <- replicate(5000, 1 %in% sample(1:50, 5))
frec <- cumsum(dorado) / seq_along(dorado)   # frecuencia relativa tras cada sobre
round(frec[c(10, 100, 1000, 5000)], 3)

plot(frec, type = "l", log = "x", ylim = c(0, 0.3),
     main = "¿Cuántos sobres traen el dorado?", xlab = "Sobres abiertos",
     ylab = "Frecuencia relativa")
abline(h = 0.1, lty = 2, col = "#FF6B4A")

# La familia d/p/q/r: dorados en 20 sobres ~ Binomial(20, 0.1)
dbinom(2, size = 20, prob = 0.1)     # P(X = 2)
pbinom(2, size = 20, prob = 0.1)     # P(X <= 2)
qbinom(0.9, size = 20, prob = 0.1)   # el menor x con P(X <= x) >= 0.9
set.seed(3)
rbinom(8, size = 20, prob = 0.1)     # 8 simulaciones de X

# Una variable discreta propia: cromos brillantes en un sobre
valores <- 0:2
p <- c(0.70, 0.25, 0.05)
sum(valores * p)                       # E[X] teórica
set.seed(5)
x <- sample(valores, 10000, replace = TRUE, prob = p)
mean(x)                                # media simulada
round(table(x) / length(x), 3)         # frecuencias relativas

# Cromos que ya tengo en un sobre nuevo cuando llevo 30 de 50: simulada frente a teórica
set.seed(8)
tengo <- 1:30
repes <- replicate(10000, sum(sample(1:50, 5) %in% tengo))
simulada <- table(factor(repes, levels = 0:5)) / 10000
teorica <- dhyper(0:5, m = 30, n = 20, k = 5)
round(rbind(simulada, teorica), 3)

barplot(rbind(simulada, teorica), beside = TRUE, names.arg = 0:5,
        col = c("#A99EF5", "#FF6B4A"), legend.text = c("simulada", "teórica"),
        main = "Repetidos en un sobre (tengo 30 de 50)",
        xlab = "Cromos repetidos", ylab = "Probabilidad")

# Versión 1: un álbum, a mano, con while
set.seed(42)
album <- rep(FALSE, 50)      # FALSE = me falta ese cromo
sobres <- 0
while (!all(album)) {
  album[sample(1:50, 5)] <- TRUE
  sobres <- sobres + 1
}
sobres

# Versión 2: la misma simulación dentro de una función
sobres_para_completar <- function(n_cromos = 50, por_sobre = 5) {
  stopifnot(por_sobre <= n_cromos)
  album <- rep(FALSE, n_cromos)
  sobres <- 0
  while (!all(album)) {
    album[sample(n_cromos, por_sobre)] <- TRUE
    sobres <- sobres + 1
  }
  sobres
}
set.seed(42)
sobres_para_completar()
sobres_para_completar(n_cromos = 10, por_sobre = 5)

# Versión 3a: repetirla 2000 veces con un for (vector creado antes)
set.seed(100)
res_for <- numeric(2000)
for (i in 1:2000) {
  res_for[i] <- sobres_para_completar()
}
# Versión 3b: lo mismo con replicate
set.seed(100)
res <- replicate(2000, sobres_para_completar())
identical(res_for, res)

summary(res)
round(sd(res), 2)
mean(res <= 45)                       # P(completar con 45 sobres o menos)
quantile(res, 0.9)                    # con cuántos sobres lo completa el 90 %

hist(res, breaks = seq(20, 120, by = 5), main = "Sobres para completar el álbum",
     xlab = "Sobres", ylab = "Número de simulaciones", col = "#A99EF5", border = "white")
abline(v = mean(res), col = "#FF6B4A", lwd = 2)
