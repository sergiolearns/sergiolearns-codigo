# Programa 3: cuándo falla el asintótico y cuántos datos hacen falta
# Del artículo «Intervalos de confianza en R — práctica con la cobertura simulada, las dos fincas y cuándo falla el asintótico»
# https://sergiolearns.com/intervalos-de-confianza-practica/

set.seed(17)
p <- 0.115; tamanos <- c(20, 40, 80, 160, 320)
cob <- sapply(tamanos, function(n) {
  r <- replicate(4000, {
    x  <- rbinom(1, n, p); ph <- x / n                          # rechazados en n racimos
    w  <- ph + c(-1, 1) * qnorm(0.975) * sqrt(ph * (1 - ph) / n) # Wald
    pt <- suppressWarnings(prop.test(x, n)$conf.int)            # Wilson con corrección
    c(wald = w[1] <= p & p <= w[2], prop_test = pt[1] <= p & p <= pt[2])
  })
  rowMeans(r)
})
colnames(cob) <- tamanos
round(cob, 3)
plot(tamanos, cob["wald", ], type = "b", log = "x", ylim = c(0.85, 1),
     xlab = "n", ylab = "cobertura")
lines(tamanos, cob["prop_test", ], type = "b", col = "blue")
abline(h = 0.95, lty = 2)

# Tamaños muestrales (siempre hacia arriba)
n_media <- function(sigma, delta, nivel = 0.95) ceiling((qnorm(1 - (1 - nivel) / 2) * sigma / delta)^2)
n_prop  <- function(delta, p = 0.5, nivel = 0.95) ceiling((qnorm(1 - (1 - nivel) / 2) / delta)^2 * p * (1 - p))
c(media_1kg = n_media(4, 1), media_05kg = n_media(4, 0.5),
  prop_peor = n_prop(0.03), prop_piloto = n_prop(0.03, 0.115))

# ¿Y si sigma no se conoce? Margen real de 4000 muestras de 62 racimos con S y t
set.seed(18)
margen_s <- replicate(4000, { x <- rnorm(62, 38, 4); qt(0.975, 61) * sd(x) / sqrt(62) })
round(c(media = mean(margen_s), prop_menor_1 = mean(margen_s <= 1)), 3)
