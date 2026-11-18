# Solución del nivel 1
# Del artículo «Intensivo de R 3: normal y conjuntas — ejercicios con la máquina de café de la facultad, ifelse, sapply y un millón de vasos (y el && que ya no perdona)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas-ejercicios/

set.seed(27)
ml <- round(rnorm(12, mean = 150, sd = 8), 1)
ml
estado <- ifelse(ml < 140, "corto", ifelse(ml > 165, "derrama", "bien"))
estado
table(estado)

round(pnorm(140, mean = 150, sd = 8), 4)
round(1 - pnorm(165, mean = 150, sd = 8), 4)
round(qnorm(0.95, mean = 150, sd = 8), 2)
