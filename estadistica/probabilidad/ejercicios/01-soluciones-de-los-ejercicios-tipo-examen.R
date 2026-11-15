# Soluciones de los ejercicios tipo examen
# Del artículo «Probabilidad — ejercicios tipo examen de ME1 con el filtro de spam: conteo, tablas, probabilidad total y Bayes (y la fila que tenía que ser una columna)»
# https://sergiolearns.com/probabilidad-ejercicios/

# ---- Ejercicio 1 ----
colision <- function(n, N) 1 - prod((N - n + 1):N / N)   # factor a factor: nunca se desborda
round(colision(100, N = 10000), 4)                       # P(algún código repetido) con 100 correos
p4 <- sapply(1:200, colision, N = 10000)                 # para n = 1, ..., 200
which(p4 > 0.5)[1]                                       # primer n con P > 0.5
round(p4[c(117, 118, 119, 120)], 4)                      # alrededor del cruce

# ---- Ejercicio 2 ----
semana <- matrix(c(120, 360, 150, 50, 96, 24), nrow = 3, byrow = TRUE,
                 dimnames = list(carpeta = c("principal", "promociones", "spam"),
                                 enlace = c("con enlace", "sin enlace")))
round(prop.table(semana, margin = 2), 4)   # P(carpeta | enlace): cada columna suma 1
round(prop.table(semana, margin = 1), 4)   # P(enlace | carpeta): cada fila suma 1

# ---- Ejercicio 3 ----
bayes <- function(prior, verosim) {
  conjunta <- prior * verosim
  data.frame(prior = prior, verosim = verosim, conjunta = conjunta,
             posterior = conjunta / sum(conjunta))
}
srv <- bayes(prior = c(ulpgc = 0.60, gmail = 0.25, otros = 0.15),
             verosim = c(0.01, 0.08, 0.40))
round(srv, 4)
sum(srv$conjunta)   # probabilidad total de spam (apartado a)

f1 <- bayes(c(spam = 0.086, legítimo = 0.914), c(0.95, 0.03))         # primer filtro
f2 <- bayes(setNames(f1$posterior, rownames(f1)), c(0.85, 0.04))       # segundo: la posterior pasa a prior
round(f1, 4)
round(f2, 4)

# ---- Bonus ----
g <- function(f) 0.9 * 0.25 / (0.9 * 0.25 + f * 0.75) - 0.95   # vale 0 en la f buscada
r <- uniroot(g, interval = c(0.0001, 0.5))
round(r$root, 4)
curve(0.225 / (0.225 + 0.75 * x), from = 0, to = 0.1,
      xlab = "falsa alarma f", ylab = "P(spam | marcado)")
abline(h = 0.95, lty = 2, col = "red")
