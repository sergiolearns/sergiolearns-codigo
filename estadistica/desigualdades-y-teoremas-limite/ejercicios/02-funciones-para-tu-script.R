# Funciones «para tu script» del tema
# Del artículo «Ejercicios de desigualdades y teoremas límite — tipo examen con R, Chebyshev, el TCL y la corrección por continuidad (y el 12,5 que me costó un apartado)»
# https://sergiolearns.com/desigualdades-y-teoremas-limite-ejercicios/

# ===== Tema 7: desigualdades y teoremas límite =====
# --- Cotas ---
cota_markov <- function(media, t) media / t                 # P(X >= t) <= E(X)/t, X >= 0
cota_cheb_fuera <- function(k) 1 / k^2                      # P(|X - mu| >= k sigma) <= 1/k^2
cota_cheb_dentro <- function(k) 1 - 1 / k^2                 # P(|X - mu| < k sigma) >= 1 - 1/k^2
k_intervalo <- function(a, b, mu, sigma) min(mu - a, b - mu) / sigma   # intervalo no simétrico
cota_lgn <- function(sigma, n, c) 1 - sigma^2 / (n * c^2)   # P(|media - mu| < c) >= ...

# --- TCL ---
tcl_suma <- function(s, n, mu, sigma, cola = "izq")         # P(S <= s) o P(S > s)
  if (cola == "izq") pnorm(s, n * mu, sigma * sqrt(n)) else 1 - pnorm(s, n * mu, sigma * sqrt(n))
tcl_media <- function(x, n, mu, sigma, cola = "izq")        # P(media <= x) o P(media > x)
  if (cola == "izq") pnorm(x, mu, sigma / sqrt(n)) else 1 - pnorm(x, mu, sigma / sqrt(n))
tcl_binom_menor <- function(k, n, p) pnorm(k + 0.5, n * p, sqrt(n * p * (1 - p)))       # P(S <= k)
tcl_binom_mayor <- function(k, n, p) 1 - pnorm(k - 0.5, n * p, sqrt(n * p * (1 - p)))   # P(S >= k)
tcl_pois_entre <- function(a, b, m) pnorm(b + 0.5, m, sqrt(m)) - pnorm(a - 0.5, m, sqrt(m))  # P(a <= T <= b)

# --- Tamaño de muestra (redondeado hacia arriba) ---
# round(…, 8) antes de ceiling: con sqrt() y ^2, 320 puede salir 320.0000001 y subir a 321
n_cheb <- function(sigma, c, alpha = 0.05) ceiling(round(sigma^2 / (alpha * c^2), 8))
n_tcl  <- function(sigma, c, alpha = 0.05) ceiling(round((qnorm(1 - alpha / 2) * sigma / c)^2, 8))

# --- Comprobar el TCL simulando (genera los datos DENTRO de la función) ---
ver_tcl <- function(genera, n, mu, sigma, m = 10000) {
  medias <- replicate(m, mean(genera(n)))
  par(mfrow = c(1, 2))
  hist(medias, freq = FALSE, breaks = 40, main = paste("n =", n))
  curve(dnorm(x, mu, sigma / sqrt(n)), add = TRUE, col = "red", lwd = 2)
  qqnorm(medias); qqline(medias, col = "red")
  c(media = mean(medias), sd = sd(medias), sd_teorica = sigma / sqrt(n))
}
# ejemplo: ver_tcl(function(n) rexp(n, 2), 30, 0.5, 0.5)

# --- Ejercicios resueltos ---
# Pasos: N(8000, 1500) frente a Chebyshev; media de 30 días
pnorm(11000, 8000, 1500) - pnorm(5000, 8000, 1500)          # 0.95 (cota: 0.75)
cota_lgn(1500, 30, 500); 2 * pnorm(500 / (1500 / sqrt(30))) - 1     # 0.70 y 0.93
# Batería: densidad 12 x^2 (1 - x), 30 sesiones
f <- function(x) 12 * x^2 * (1 - x)
mu <- integrate(function(x) x * f(x), 0, 1)$value
s2 <- integrate(function(x) x^2 * f(x), 0, 1)$value - mu^2
tcl_suma(19, 30, mu, sqrt(s2), cola = "der")                 # 0.18
n_tcl(sqrt(s2), 0.05); n_cheb(sqrt(s2), 0.05)                # 62 y 320
# Notificaciones: Poisson(1.5) por sesión, 40 sesiones
tcl_pois_entre(51, 70, 60); ppois(70, 60) - ppois(50, 60)    # 0.80
p <- dpois(0, 1.5)
tcl_binom_mayor(12, 40, p); 1 - pbinom(11, 40, p)            # 0.16
