# Programa 2: la densidad conjunta del pedido con integrate
# Del artículo «Transformaciones y distribuciones conjuntas en R — práctica con runif, integrate dentro de integrate y la normal bivariante del reparto (y el Vectorize que me faltaba)»
# https://sergiolearns.com/transformaciones-y-distribuciones-conjuntas-practica/

f <- function(x, y) 0.01 * exp(-0.1 * y) * (x < y)
fX <- Vectorize(function(x) integrate(function(y) f(x, y), x, Inf)$value)  # marginal de X
fY <- Vectorize(function(y) integrate(function(x) f(x, y), 0, y)$value)    # marginal de Y
integrate(fX, 0, Inf)$value                         # la conjunta integra 1
round(rbind(fX = fX(c(5, 10, 20)), dexp = dexp(c(5, 10, 20), 0.1)), 4)
round(rbind(fY = fY(c(5, 20, 40)), dgamma = dgamma(c(5, 20, 40), 2, 0.1)), 4)
# P(X <= 10, Y <= 30): para cada x, y va de x a 30
pr <- Vectorize(function(x) integrate(function(y) f(x, y), x, 30)$value)
P <- integrate(pr, 0, 10)$value
# Momentos con la conjunta (integrales dobles en el triángulo)
doble <- function(g) integrate(Vectorize(function(x)
  integrate(function(y) g(x, y) * f(x, y), x, Inf)$value), 0, Inf)$value
EX <- doble(function(x, y) x); EY <- doble(function(x, y) y)
EXY <- doble(function(x, y) x * y)
VX <- doble(function(x, y) x^2) - EX^2; VY <- doble(function(x, y) y^2) - EY^2
cova <- EXY - EX * EY
round(c(P = P, EX = EX, EY = EY, EXY = EXY, cov = cova, rho = cova / sqrt(VX * VY)), 4)
# Lo mismo con 10.000 pedidos simulados
set.seed(2026)
x <- rexp(10000, 0.1); y <- x + rexp(10000, 0.1)
round(c(P = mean(x <= 10 & y <= 30), EX = mean(x), EY = mean(y), EXY = mean(x * y),
        cov = cov(x, y), rho = cor(x, y)), 4)
plot(x[1:300], y[1:300], pch = 20, xlab = "cocina (min)", ylab = "llegada (min)")
abline(0, 1, col = "red", lwd = 2)                  # la diagonal y = x
