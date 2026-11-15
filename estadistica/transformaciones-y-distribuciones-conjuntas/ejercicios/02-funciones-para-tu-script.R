# Funciones «para tu script»
# Del artículo «Ejercicios de transformaciones y distribuciones conjuntas — tipo examen con R, un triángulo, una fgm conjunta y un jacobiano (y la covarianza 0 que me costó un apartado)»
# https://sergiolearns.com/transformaciones-y-distribuciones-conjuntas-ejercicios/

# ---------- Transformaciones y distribuciones conjuntas (ME1, tema 6) ----------
# Integral doble de f(x, y) con x entre a y b, e y entre ylo(x) e yhi(x) (límites que dependen de x)
# (no llames c a un argumento: taparías la función c() de R)
doble <- function(f, a, b, ylo, yhi) integrate(Vectorize(function(x)
  integrate(function(y) f(x, y), ylo(x), yhi(x))$value), a, b)$value
# Constante K: f0 es la densidad SIN la K
constante <- function(f0, a, b, ylo, yhi) 1 / doble(f0, a, b, ylo, yhi)
# Marginales en un punto (límites del soporte, como funciones)
marg_x <- function(f, x, ylo, yhi) integrate(function(y) f(x, y), ylo(x), yhi(x))$value
marg_y <- function(f, y, xlo, xhi) integrate(function(x) f(x, y), xlo(y), xhi(y))$value
# Momentos, covarianza y correlación con la conjunta
momentos <- function(f, a, b, ylo, yhi) {
  E <- function(g) doble(function(x, y) g(x, y) * f(x, y), a, b, ylo, yhi)
  EX <- E(function(x, y) x); EY <- E(function(x, y) y); EXY <- E(function(x, y) x * y)
  VX <- E(function(x, y) x^2) - EX^2; VY <- E(function(x, y) y^2) - EY^2
  round(c(EX = EX, EY = EY, EXY = EXY, cov = EXY - EX * EY, rho = (EXY - EX * EY) / sqrt(VX * VY)), 4)
}
# Tabla conjunta discreta: marginales, covarianza, correlación e independencia
tabla <- function(p, xv, yv) {
  pX <- rowSums(p); pY <- colSums(p)
  EX <- sum(xv * pX); EY <- sum(yv * pY); EXY <- sum(outer(xv, yv) * p)
  VX <- sum(xv^2 * pX) - EX^2; VY <- sum(yv^2 * pY) - EY^2
  list(pX = pX, pY = pY, cov = EXY - EX * EY, rho = (EXY - EX * EY) / sqrt(VX * VY),
       independientes = isTRUE(all.equal(c(p), c(outer(pX, pY)))))
}
# Comprobar una transformación por simulación: histograma de g(x) con la densidad propuesta
comprueba_cambio <- function(x, g, fY, ...) {
  y <- g(x); hist(y, freq = FALSE, breaks = 40, main = "Cambio de variable", ...)
  curve(fY(x), add = TRUE, col = "red", lwd = 2, n = 400)
}
# Normal bivariante: densidad y condicionada Y | X = x
dbiv <- function(x, y, mx, my, sx, sy, rho) {
  q <- ((x - mx) / sx)^2 + ((y - my) / sy)^2 - 2 * rho * (x - mx) * (y - my) / (sx * sy)
  exp(-q / (2 * (1 - rho^2))) / (2 * pi * sx * sy * sqrt(1 - rho^2))
}
cond_biv <- function(x, mx, my, sx, sy, rho) c(media = my + rho * sy / sx * (x - mx), sd = sy * sqrt(1 - rho^2))

# ---------- Ejemplos (los ejercicios de este artículo) ----------
f2 <- function(x, y) 2 * (x + y) * (x < y)
uno <- function(x) 1; cero <- function(x) 0; id <- function(x) x
round(constante(function(x, y) (x + y) * (x < y), 0, 1, id, uno), 2)     # ej. 2 (a): K = 2
round(doble(f2, 0, 0.5, function(x) x + 0.5, uno), 2)                   # ej. 2 (c): 0,25
momentos(f2, 0, 1, id, uno)                                              # ej. 2 (e)
round(1 - pgamma(20, 3, 0.2), 2)                                         # ej. 3 (b)
p <- matrix(c(0.20, 0.15, 0.05, 0.10, 0.20, 0.10, 0.02, 0.08, 0.10), 3, byrow = TRUE)
str(tabla(p, 1:3, 0:2))                                                  # platos y bebidas
round(cond_biv(5, 3, 15, 1, 4, 0.8), 2)                                  # R | D = 5
