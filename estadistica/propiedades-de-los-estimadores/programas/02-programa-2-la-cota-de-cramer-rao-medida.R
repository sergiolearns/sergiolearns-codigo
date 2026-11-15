# Programa 2: la cota de Cramér–Rao, medida
# Del artículo «Propiedades de los estimadores — práctica en R con simulaciones del sesgo, el ECM, la cota de Cramér–Rao y la consistencia (y las 10.000 varianzas que no pedí)»
# https://sergiolearns.com/propiedades-de-los-estimadores-practica/

ns <- c(5, 10, 20, 40, 80)

set.seed(32)
pois <- t(sapply(ns, function(n) {
  e <- replicate(5000, { x <- rpois(n, 3); c(mean(x), var(x)) })   # fila 1: medias, fila 2: S^2
  c(n = n, var_media = var(e[1, ]), var_S2 = var(e[2, ]), cota = 3 / n)
}))
round(pois, 4)

set.seed(33)
lam <- 1 / 12
expo <- t(sapply(ns, function(n) {
  l <- replicate(5000, (n - 1) / sum(rexp(n, lam)))   # lambda* = (n - 1) / (n * media)
  c(n = n, media = mean(l), var_sim = var(l), var_teo = lam^2 / (n - 2), cota = lam^2 / n)
}))
signif(expo, 3)

plot(ns, pois[, "var_S2"], log = "xy", pch = 17, ylim = c(0.03, 6),
     xlab = "n (horas)", ylab = "varianza", main = "Poisson(3): dos insesgados y la cota")
points(ns, pois[, "var_media"], pch = 19)
lines(ns, pois[, "cota"], lty = 2, col = "red")
legend("topright", c("S^2", "media", "cota"), pch = c(17, 19, NA), lty = c(NA, NA, 2), col = c(1, 1, 2))
