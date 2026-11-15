# Para tu script: el tema 2 en funciones
# Del artículo «Probabilidad — ejercicios tipo examen de ME1 con el filtro de spam: conteo, tablas, probabilidad total y Bayes (y la fila que tenía que ser una columna)»
# https://sergiolearns.com/probabilidad-ejercicios/

# ===== Tema 2: probabilidad =====

# Conteo
variaciones     <- function(n, r) prod((n - r + 1):n)            # sin repetición, con orden
variaciones_rep <- function(n, r) n^r                            # con repetición, con orden
comb_rep        <- function(n, r) choose(n + r - 1, r)           # sin orden, con repetición
multinomial     <- function(n, grupos) factorial(n) / prod(factorial(grupos))   # grupos = c(n1, n2, ...)

# Probabilidad de "exactamente k buenos" al sacar r de una urna (sin reemplazamiento)
urna <- function(k, r, buenos, total) choose(buenos, k) * choose(total - buenos, r - k) / choose(total, r)

# Algún valor repetido entre n, con N valores igual de probables (no se desborda)
colision <- function(n, N) 1 - prod((N - n + 1):N / N)
primer_n <- function(N, umbral = 0.5) {                          # menor n con P(repetido) > umbral
  n <- 1
  while (colision(n, N) <= umbral) n <- n + 1
  n
}

# Tablas de contingencia: t es una matriz con nombres en filas y columnas
conjuntas      <- function(t) prop.table(t)                      # P(fila y columna)
cond_columna   <- function(t) prop.table(t, margin = 2)          # P(fila | columna)
cond_fila      <- function(t) prop.table(t, margin = 1)          # P(columna | fila)
independientes <- function(t, fila, col) {                       # compara P(A y B) con P(A)P(B)
  p <- prop.table(t)
  c(conjunta = p[fila, col], producto = sum(p[fila, ]) * sum(p[, col]))
}

# Probabilidad total y Bayes con una partición
bayes <- function(prior, verosim) {
  conjunta <- prior * verosim
  data.frame(prior = prior, verosim = verosim, conjunta = conjunta,
             posterior = conjunta / sum(conjunta))
}
# Actualizar en dos pasos: la posterior del primero es la prior del segundo
# paso2 <- bayes(setNames(paso1$posterior, rownames(paso1)), verosim2)

# Un test o filtro con sensibilidad s, falsa alarma f y prevalencia p
p_positivo  <- function(s, f, p) s * p + f * (1 - p)
p_causa_pos <- function(s, f, p) s * p / p_positivo(s, f, p)

# Simular para comprobar (frecuencia relativa)
estimar <- function(experimento, veces = 10000) mean(replicate(veces, experimento()))
# ejemplo: estimar(function() any(duplicated(sample(1:1000, 38, replace = TRUE))))

c(variaciones(10, 4), multinomial(10, c(5, 3, 2)), round(urna(1, 4, 5, 20), 4))
primer_n(10000)
round(p_causa_pos(0.95, 0.03, 0.086), 4)
