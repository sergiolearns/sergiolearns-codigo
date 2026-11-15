# Programa 1: diez mil tandas de diez mensajes
# Del artículo «Variables aleatorias discretas — práctica en R con el grupo de WhatsApp simulado, esperas hasta el mensaje útil y una Poisson que se ajusta a los datos (y el rgeom que creí roto)»
# https://sergiolearns.com/variables-aleatorias-discretas-practica/

set.seed(2026)                       # misma simulación cada vez
n <- 10; p <- 0.3; tandas <- 10000
memes <- rbinom(tandas, n, p)        # memes en cada una de las 10 000 tandas
head(memes, 12)                      # las 12 primeras, para ver qué hay dentro

# frecuencia relativa de cada valor, con los 11 niveles aunque alguno no salga
frec <- table(factor(memes, levels = 0:n)) / tandas
comparacion <- rbind(simulada = as.numeric(frec),
                     teorica  = dbinom(0:n, n, p))
colnames(comparacion) <- 0:n
round(comparacion, 3)

# media y varianza: simuladas frente a las fórmulas
c(media = mean(memes), np = n * p, var = var(memes), npq = n * p * (1 - p))

# la apuesta: al menos 5 memes
c(simulada = mean(memes >= 5), teorica = 1 - pbinom(4, n, p))

# asimetría y curtosis de una variable discreta a partir de su tabla
forma <- function(x, px) {
  m <- sum(x * px); s <- sqrt(sum((x - m)^2 * px))
  c(asimetria = sum((x - m)^3 * px) / s^3, curtosis = sum((x - m)^4 * px) / s^4)
}
round(forma(0:n, dbinom(0:n, n, p)), 3)          # la binomial de los memes
round(forma(0:3, c(0.4, 0.3, 0.2, 0.1)), 3)      # «¿mañana hay clase?»

barplot(comparacion, beside = TRUE, col = c("grey", "tomato"),
        legend.text = c("simulada", "teórica"),
        xlab = "Memes en 10 mensajes", ylab = "Frecuencia relativa")
