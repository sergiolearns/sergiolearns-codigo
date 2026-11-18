# Solución del nivel 1
# Del artículo «Intensivo de R 2: probabilidad y simulación — ejercicios con el álbum de cromos, los dados del parchís y tu propia variable aleatoria (y las mil partidas que eran la misma)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion-ejercicios/

set.seed(2026)
dado <- sample(1:6, 600, replace = TRUE)
table(dado)
round(table(dado) / 600, 3)
mean(dado == 5)

barplot(table(dado) / 600, main = "600 tiradas del dado", xlab = "Cara", ylab = "Frecuencia relativa")
abline(h = 1/6, lty = 2)

round(dgeom(0:3, prob = 1/6), 4)
round(pgeom(2, prob = 1/6), 4)
qgeom(0.9, prob = 1/6)
set.seed(7)
rgeom(5, prob = 1/6) + 1
