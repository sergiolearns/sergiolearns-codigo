# Para tu script: las funciones del bloque, comentadas y sin enunciados
# Del artículo «Intensivo de R 2: probabilidad y simulación — ejercicios con el álbum de cromos, los dados del parchís y tu propia variable aleatoria (y las mil partidas que eran la misma)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion-ejercicios/

# ===================== Bloque R2: probabilidad y simulación =====================

# frec_vs_teo(x, valores, prob): frecuencias simuladas frente a las teóricas, en una tabla
frec_vs_teo <- function(x, valores, prob, digitos = 4) {
  stopifnot(length(valores) == length(prob), abs(sum(prob) - 1) < 1e-8)
  sim <- as.vector(table(factor(x, levels = valores))) / length(x)
  data.frame(valor = valores, teorica = round(prob, digitos), simulada = round(sim, digitos))
}

# esperanza(valores, prob) y varianza(valores, prob) de una variable discreta
esperanza <- function(valores, prob) sum(valores * prob)
varianza  <- function(valores, prob) sum((valores - esperanza(valores, prob))^2 * prob)

# elegir(x, n): n elementos de x al azar, aunque x tenga un solo elemento
elegir <- function(x, n = 1, ...) x[sample(length(x), n, ...)]

# simular(f, B, semilla): repetir B veces un experimento f() con semilla
simular <- function(f, B = 10000, semilla = NULL) {
  if (!is.null(semilla)) set.seed(semilla)
  replicate(B, f())
}

# Familia d/p/q/r (cambia geom por binom, pois, nbinom, hyper…):
# dgeom(k, p)  P(X = k)  (k fracasos antes del primer éxito)
# pgeom(k, p)  P(X <= k)      qgeom(a, p)  menor k con P(X <= k) >= a      rgeom(n, p)  simula n
