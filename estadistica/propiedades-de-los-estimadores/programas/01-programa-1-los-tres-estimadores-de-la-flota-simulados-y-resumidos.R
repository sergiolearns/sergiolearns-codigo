# Programa 1: los tres estimadores de la flota, simulados y resumidos
# Del artículo «Propiedades de los estimadores — práctica en R con simulaciones del sesgo, el ECM, la cota de Cramér–Rao y la consistencia (y las 10.000 varianzas que no pedí)»
# https://sergiolearns.com/propiedades-de-los-estimadores-practica/

simular <- function(theta, n, B = 10000) {
  replicate(B, {
    x <- runif(n, 0, theta)                     # n números de serie de una flota de theta
    c(momentos  = 2 * mean(x),                  # los tres estimadores de esta muestra
      maximo    = max(x),
      corregido = (n + 1) / n * max(x))
  })                                            # matriz 3 x B: un estimador por fila
}

resumen <- function(sims, theta) {
  media    <- apply(sims, 1, mean)              # 1 = por filas: un valor por estimador
  sesgo    <- media - theta
  varianza <- apply(sims, 1, function(v) mean((v - mean(v))^2))   # entre B, no B - 1
  ecm      <- apply(sims, 1, function(v) mean((v - theta)^2))
  round(data.frame(media, sesgo, varianza, ecm, raiz_ecm = sqrt(ecm)), 1)
}

set.seed(19)
sims <- simular(2400, 12)
dim(sims)
resumen(sims, 2400)

par(mfrow = c(1, 3))                            # tres gráficos en una fila
for (k in 1:3) {
  hist(sims[k, ], breaks = seq(0, 4400, by = 100), freq = FALSE,
       xlim = c(1000, 3600), main = rownames(sims)[k], xlab = "patinetes")
  abline(v = 2400, col = "red", lwd = 2)        # la flota de verdad
}
