# Programa 3: Bayes en una tabla, con una función que sirve para todo
# Del artículo «Probabilidad — práctica en R con el filtro de spam: simular una semana, contar códigos repetidos y Bayes en una tabla (y el prob que puse al revés)»
# https://sergiolearns.com/probabilidad-practica/

bayes <- function(prior, verosim) {
  conjunta <- prior * verosim                     # cada rama del árbol: P(causa y dato)
  data.frame(prior = prior, verosim = verosim,
             conjunta = conjunta,
             posterior = conjunta / sum(conjunta)) # Bayes: dividir entre la probabilidad total
}

# 1) ¿De dónde viene un spam?
origen <- bayes(prior = c(campus = 0.50, listas = 0.30, externo = 0.20),
                verosim = c(0.02, 0.10, 0.60))
round(origen, 4)
sum(origen$conjunta)                               # probabilidad total de spam

# 2) El mismo filtro (sensibilidad 0.90, falsa alarma 0.02) con tres tasas de spam
tasas <- c(0.05, 0.25, 0.50)
round(0.90 * tasas / (0.90 * tasas + 0.02 * (1 - tasas)), 4)
curve(0.90 * x / (0.90 * x + 0.02 * (1 - x)), from = 0, to = 1,
      xlab = "proporción de spam (a priori)", ylab = "P(spam | marcado)")

# 3) Dos filtros: lo marca el primero y después también el segundo
paso1 <- bayes(c(spam = 0.25, legítimo = 0.75), c(0.90, 0.02))
paso2 <- bayes(setNames(paso1$posterior, rownames(paso1)), c(0.80, 0.05))
round(paso1, 4)
round(paso2, 4)
