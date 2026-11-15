# Funciones «para tu script»
# Del artículo «Variables aleatorias discretas — ejercicios tipo examen con el grupo de WhatsApp, modelos que hay que reconocer y una función de masa con parámetro (y el 1 - pbinom(5) que me costó un punto)»
# https://sergiolearns.com/variables-aleatorias-discretas-ejercicios/

# ===== Variables aleatorias discretas (ME1, tema 3) =====

# --- Una variable dada por su tabla ---
# x: valores; p: probabilidades. Devuelve media, varianza y desviación típica.
va_resumen <- function(x, p) {
  stopifnot(abs(sum(p) - 1) < 1e-8, all(p >= 0))   # que sea una función de masa
  m <- sum(x * p)
  v <- sum(x^2 * p) - m^2
  round(c(media = m, varianza = v, sd = sqrt(v)), 2)
}
# Masa desde la función de distribución (F en el orden de x)
masa_desde_F <- function(F) diff(c(0, F))
# Asimetría y curtosis a partir de la tabla
va_forma <- function(x, p) {
  m <- sum(x * p); s <- sqrt(sum((x - m)^2 * p))
  round(c(asimetria = sum((x - m)^3 * p) / s^3,
          curtosis = sum((x - m)^4 * p) / s^4), 2)
}
# Dibujo de F con los saltos en su sitio
dibuja_F <- function(x, p, ...) {
  F <- cumsum(p)
  plot(c(min(x) - 1, x, max(x) + 1), c(0, F, 1), type = "s", ylab = "F(x)", ...)
  points(x, F, pch = 19)
}

# --- fgm: comprobar momentos con derivadas numéricas ---
# fgm: función de t. Devuelve aproximaciones de E(X) y E(X^2).
momentos_fgm <- function(fgm, h = 1e-4) {
  d1 <- (fgm(h) - fgm(-h)) / (2 * h)
  d2 <- (fgm(h) - 2 * fgm(0) + fgm(-h)) / h^2
  round(c(EX = d1, EX2 = d2, var = d2 - d1^2), 2)
}

# --- Probabilidades de cola sin equivocarse de borde ---
# fp: la función p... del modelo (pbinom, pgeom, pnbinom, ppois); ...: sus parámetros
al_menos <- function(k, fp, ...) 1 - fp(k - 1, ...)     # P(X >= k)
mas_de   <- function(k, fp, ...) 1 - fp(k, ...)         # P(X > k)
entre    <- function(a, b, fp, ...) fp(b, ...) - fp(a - 1, ...)   # P(a <= X <= b)
# Moda (o modas) de una función de masa en los valores x
modas <- function(x, p) x[abs(p - max(p)) < 1e-12]

# --- Una serie de masa con parámetro: comprobar suma, media y fgm ---
comprueba_masa <- function(px, x = 1:200, t = 0.1) {
  p <- px(x)
  round(c(suma = sum(p), media = sum(x * p), fgm_t = sum(exp(t * x) * p)), 4)
}

# ===== Ejercicios resueltos =====
# Ejercicio 1: audios de Marcos
x1 <- c(0, 1, 2, 4); F1 <- c(0.35, 0.65, 0.85, 1)
p1 <- masa_desde_F(F1); p1
va_resumen(x1, p1)
momentos_fgm(function(t) sum(exp(t * x1) * p1))
dibuja_F(x1, p1, xlab = "Audios al día")
# Ejercicio 2: preguntas sobre la práctica
round(c(P3 = dbinom(3, 20, 0.15), al_menos_5 = al_menos(5, pbinom, 20, 0.15)), 2)
round(mas_de(6, pgeom, 0.15), 2)
round(pnbinom(10, 3, 0.15), 2); qnbinom(0.9, 3, 0.15)
round(entre(4, 8, ppois, 6), 2)
modas(0:16, dpois(0:16, 6))
# Ejercicio 3: Poisson truncada en cero, theta = 2
comprueba_masa(function(x) 2^x / (factorial(x) * (exp(2) - 1)), x = 1:60)
# Bonus: E(2^X) con X ~ Pois(4) es la fgm en log(2)
exp(4 * (exp(log(2)) - 1))
