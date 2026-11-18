# Solución del nivel 2
# Del artículo «Intensivo de R 3: normal y conjuntas — ejercicios con la máquina de café de la facultad, ifelse, sapply y un millón de vasos (y el && que ya no perdona)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas-ejercicios/

# ajustar(): la media que deja un 'riesgo' de vasos por encima de 'limite', y los cortos que resultan
ajustar <- function(sd, limite = 165, riesgo = 0.01, minimo = 140) {
  stopifnot(sd > 0, riesgo > 0, riesgo < 1)
  media <- limite - qnorm(1 - riesgo) * sd        # mu = limite - z_(1 - riesgo) * sigma
  c(sd = sd, media = round(media, 2), p_corto = round(pnorm(minimo, media, sd), 4))
}
ajustar(8)
t(sapply(c(4, 6, 8, 10), ajustar))
