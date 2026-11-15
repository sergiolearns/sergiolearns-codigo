# Funciones «para tu script»
# Del artículo «Variables aleatorias continuas — ejercicios tipo examen con el microondas de la cafetería, una densidad con constante y tres formas de pagar (y el uniroot que no encontraba la mediana)»
# https://sergiolearns.com/variables-aleatorias-continuas-ejercicios/

# ===== Variables aleatorias continuas (ME1, tema 4) =====
# --- Una densidad dada por una fórmula ---
# g: la densidad sin la constante; a, b: el soporte. Devuelve la constante k.
constante <- function(g, a, b) 1 / integrate(g, a, b)$value
# Media, varianza y desviación típica de una densidad f en (a, b)
momentos <- function(f, a, b) {
  m <- integrate(function(x) x * f(x), a, b)$value
  v <- integrate(function(x) x^2 * f(x), a, b)$value - m^2
  round(c(media = m, varianza = v, sd = sqrt(v)), 2)
}
# Cuantil p de una densidad f en (a, b), sin F a mano
cuantil <- function(f, p, a, b) {
  F <- function(x) integrate(f, a, x)$value
  uniroot(function(x) F(x) - p, c(a + 1e-6, b - 1e-6))$root
}
# Moda: dónde es máxima la densidad
moda <- function(f, a, b) optimize(f, c(a, b), maximum = TRUE)$maximum
# --- Modelos ---
# Gamma a partir de la media y la varianza
gamma_par <- function(m, v) c(alfa = m^2 / v, beta = m / v)
# Exponencial a partir de la media: el ritmo
ritmo <- function(media) 1 / media
# --- Mezclas: probabilidad total y Bayes ---
# p: pesos; Fs: lista de funciones de distribución
mezcla_F <- function(t, p, Fs) sum(p * sapply(Fs, function(F) F(t)))
mezcla_bayes <- function(t, p, Fs) {
  r <- p * sapply(Fs, function(F) F(t))
  round(r / sum(r), 4)
}
# --- Ejercicio 1 ---
g1 <- function(x) x^2 * (1 - x)
k1 <- constante(g1, 0, 1)
f1 <- function(x) k1 * g1(x)
k1
momentos(f1, 0, 1)
round(c(mediana = cuantil(f1, 0.5, 0, 1), moda = moda(f1, 0, 1)), 2)
# --- Ejercicio 2 ---
round(1 - pexp(1, ritmo(0.75)), 2)
gamma_par(2.4, 1.2^2)
# --- Ejercicio 3 ---
p3 <- c(tarjeta = 0.60, efectivo = 0.25, app = 0.15)
F3 <- list(function(t) pexp(t, 2), function(t) punif(t, 0.5, 2.5), function(t) pgamma(t, 2, 2))
round(mezcla_F(1, p3, F3), 4)
mezcla_bayes(1, p3, F3)
