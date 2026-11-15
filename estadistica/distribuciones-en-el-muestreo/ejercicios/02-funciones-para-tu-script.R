# Funciones «para tu script» del tema
# Del artículo «Distribuciones en el muestreo — ejercicios tipo examen con el Campus Virtual, la batería del portátil y dos impresoras (y los grados de libertad que puse al revés)»
# https://sergiolearns.com/distribuciones-en-el-muestreo-ejercicios/

# ===== Tema 8: distribuciones en el muestreo (chi^2, t, F) =====
# --- Media muestral (sigma conocida) ---
p_media <- function(x, mu, sigma, n, cola = "izq")          # P(media <= x) o P(media > x)
  if (cola == "izq") pnorm(x, mu, sigma / sqrt(n)) else 1 - pnorm(x, mu, sigma / sqrt(n))
# --- Varianza muestral: (n - 1) S^2 / sigma^2 ~ chi^2(n - 1) ---
p_s2_mayor <- function(c, sigma, n) 1 - pchisq((n - 1) * c / sigma^2, n - 1)   # P(S^2 > c)
b_s2 <- function(alpha, sigma, n) sigma^2 * qchisq(1 - alpha, n - 1) / (n - 1)  # P(S^2 > b) = alpha
ab_s2 <- function(conf, sigma, n) {                          # P(a <= S^2 <= b) = conf, colas iguales
  al <- 1 - conf
  sigma^2 * qchisq(c(a = al / 2, b = 1 - al / 2), n - 1) / (n - 1)
}
# --- Suma de cuadrados con mu y sigma conocidas: chi^2(n) ---
q_suma_cuadrados <- function(p, n) qchisq(p, n)
# --- t de una muestra (sigma estimada) ---
t_una <- function(x, mu0) sqrt(length(x)) * (mean(x) - mu0) / sd(x)   # ~ t(n - 1)
t_pareados <- function(x, y, mu_d = 0) t_una(x - y, mu_d)             # las diferencias
# --- Dos muestras: F y t con varianza combinada ---
ab_cociente <- function(conf, m, n, r = 1) {                 # P(a <= S1^2/S2^2 <= b), sigma1^2 = r sigma2^2
  al <- 1 - conf
  r * qf(c(a = al / 2, b = 1 - al / 2), m - 1, n - 1)       # m = tamaño de la muestra de ARRIBA
}
sp <- function(x, y) sqrt(((length(x) - 1) * var(x) + (length(y) - 1) * var(y)) / (length(x) + length(y) - 2))
t_dos <- function(x, y, dif0 = 0)                            # ~ t(m + n - 2) si sigmas iguales
  ((mean(x) - mean(y)) - dif0) / (sp(x, y) * sqrt(1 / length(x) + 1 / length(y)))
p_dos_colas_t <- function(t, gl) 2 * (1 - pt(abs(t), gl))  # P(|T| >= |t|)
# --- Comprobar una distribución simulando (la muestra se fabrica DENTRO) ---
ver_dist <- function(estadistico, m = 10000, densidad, ...) {
  v <- replicate(m, estadistico())
  hist(v, freq = FALSE, breaks = 50, main = "")
  curve(densidad(x, ...), add = TRUE, col = "red", lwd = 2)
  invisible(v)
}
# ejemplo: ver_dist(function() 14 * var(rnorm(15, 40, 6)) / 36, densidad = dchisq, df = 14)
# --- Ejercicios resueltos ---
# Campus Virtual: N(2.4, 0.5), 16 cargas
p_media(2.6, 2.4, 0.5, 16, "der")                 # 0.05
q_suma_cuadrados(0.95, 16)                        # 26.30
round(ab_s2(0.90, 0.5, 16), 2); p_s2_mayor(0.4, 0.5, 16)   # 0.12, 0.42 y 0.07
# Batería: t de una muestra y pareados
brillo100 <- c(5.23, 5.72, 4.49, 4.61, 6.64, 4.95, 6.76, 6.20, 5.66, 4.90)
brillo50  <- c(5.49, 6.15, 4.50, 5.07, 6.79, 5.50, 7.23, 7.06, 6.00, 5.22)
pt(t_una(brillo100, 6), 9)                        # 0.047
1 - pt(t_pareados(brillo50, brillo100), 9)        # 0.0003
# Impresoras: F con sigma_A^2 = 2 sigma_B^2 y t de dos muestras
round(ab_cociente(0.90, 13, 9, r = 2), 3)         # 0.702 y 6.568
A <- c(7.7, 10.1, 7.2, 8.7, 10.5, 7.9, 8.1, 7.9, 8.3, 8.8, 10.0, 7.7, 7.4)
B <- c(7.5, 6.5, 7.5, 7.0, 5.3, 8.0, 7.4, 8.7, 8.7)
p_dos_colas_t(t_dos(A, B), 13 + 9 - 2)            # 0.031
pf(var(A) / var(B), 12, 8)                         # 0.497
