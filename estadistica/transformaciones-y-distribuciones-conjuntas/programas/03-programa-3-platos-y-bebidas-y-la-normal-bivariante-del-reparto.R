# Programa 3: platos y bebidas, y la normal bivariante del reparto
# Del artículo «Transformaciones y distribuciones conjuntas en R — práctica con runif, integrate dentro de integrate y la normal bivariante del reparto (y el Vectorize que me faltaba)»
# https://sergiolearns.com/transformaciones-y-distribuciones-conjuntas-practica/

# 1. La tabla conjunta de platos (filas) y bebidas (columnas)
p <- matrix(c(0.20, 0.15, 0.05,
              0.10, 0.20, 0.10,
              0.02, 0.08, 0.10), nrow = 3, byrow = TRUE,
            dimnames = list(platos = 1:3, bebidas = 0:2))
pX <- rowSums(p); pY <- colSums(p)
round(p - outer(pX, pY), 3)               # conjunta menos producto de marginales
EX <- sum(1:3 * pX); EY <- sum(0:2 * pY)
EXY <- sum(outer(1:3, 0:2) * p)           # suma de x * y * p(x, y)
VX <- sum((1:3)^2 * pX) - EX^2; VY <- sum((0:2)^2 * pY) - EY^2
round(c(EX = EX, EY = EY, EXY = EXY, cov = EXY - EX * EY,
        rho = (EXY - EX * EY) / sqrt(VX * VY)), 3)
# 2. La normal bivariante (D, R): la densidad escrita a mano
dbiv <- function(d, r, md = 3, mr = 15, sd = 1, sr = 4, rho = 0.8) {
  q <- ((d - md) / sd)^2 + ((r - mr) / sr)^2 - 2 * rho * (d - md) * (r - mr) / (sd * sr)
  exp(-q / (2 * (1 - rho^2))) / (2 * pi * sd * sr * sqrt(1 - rho^2))
}
fD5 <- integrate(function(r) dbiv(5, r), -Inf, Inf)$value   # marginal de D en d = 5
round(c(fD5, dnorm(5, 3, 1)), 5)
rr <- c(18, 21.4, 25)                                          # condicionada R | D = 5
round(rbind(cociente = dbiv(5, rr) / fD5, normal = dnorm(rr, 21.4, 2.4)), 4)
round(c(1 - pnorm(25, 21.4, 2.4), 1 - pnorm(25, 15, 4)), 4)
d <- seq(0, 6, length = 61); r <- seq(3, 27, length = 61)
z <- outer(d, r, dbiv)
contour(d, r, z, xlab = "distancia (km)", ylab = "reparto (min)")
abline(v = 5, lty = 2, col = "red")                           # el corte D = 5
