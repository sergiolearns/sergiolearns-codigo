# Programa 1: una semana simulada del filtro
# Del artículo «Probabilidad — práctica en R con el filtro de spam: simular una semana, contar códigos repetidos y Bayes en una tabla (y el prob que puse al revés)»
# https://sergiolearns.com/probabilidad-practica/

set.seed(2026)
n <- 5000                                      # correos de la semana simulada
es_spam <- runif(n) < 0.25                     # TRUE con probabilidad 0.25: el correo es spam
prop <- cumsum(es_spam) / seq_len(n)           # proporción de spam tras cada correo (cumsum cuenta los TRUE)
round(prop[c(10, 100, 1000, 5000)], 4)         # la proporción a los 10, 100, 1000 y 5000 correos
max(which(abs(prop - 0.25) > 0.02))            # último correo en que estaba a más de 0.02 de 0.25
plot(prop, type = "l", ylim = c(0, 0.5),
     xlab = "Correos recibidos", ylab = "Proporción de spam")
abline(h = 0.25, lty = 2, col = "red")         # la probabilidad de verdad

# el filtro: cada correo usa la probabilidad de su rama del árbol
marcado <- ifelse(es_spam, runif(n) < 0.90, runif(n) < 0.02)
table(spam = es_spam, marcado = marcado)       # la tabla de 2 x 2 de la semana
round(mean(es_spam[marcado]), 4)               # P(spam | marcado) estimada: spam entre los marcados
round(mean(marcado), 4)                        # P(marcado) estimada
