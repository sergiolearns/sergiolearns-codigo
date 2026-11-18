# Para tu script: las funciones del bloque, comentadas y sin enunciados
# Del artículo «Intensivo de R 3: normal y conjuntas — ejercicios con la máquina de café de la facultad, ifelse, sapply y un millón de vasos (y el && que ya no perdona)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas-ejercicios/

# ===================== Bloque R3: vectorización, normal y conjuntas =====================

# clasificar3(x, a, b): "bajo" (< a), "alto" (> b) o "bien", sin bucles
clasificar3 <- function(x, a, b, etiquetas = c("bajo", "bien", "alto")) {
  stopifnot(is.numeric(x), a < b)
  ifelse(x < a, etiquetas[1], ifelse(x > b, etiquetas[3], etiquetas[2]))
}

# prob_normal(a, b, media, sd): P(X < a), P(a <= X <= b) y P(X > b) de una normal
prob_normal <- function(a, b, media, sd, digitos = 4) {
  stopifnot(sd > 0, a < b)
  pa <- pnorm(a, media, sd); pb <- 1 - pnorm(b, media, sd)
  round(c(debajo = pa, entre = 1 - pa - pb, encima = pb), digitos)
}

# media_para_riesgo(limite, sd, riesgo): media que deja 'riesgo' por encima de 'limite'
media_para_riesgo <- function(limite, sd, riesgo = 0.01) limite - qnorm(1 - riesgo) * sd

# resumen_conjunta(m): medias, desviaciones, covarianzas y correlaciones de las columnas de m
resumen_conjunta <- function(m, digitos = 2) {
  m <- as.matrix(m)
  list(media = round(apply(m, 2, mean), digitos), sd = round(apply(m, 2, sd), digitos),
       cov = round(cov(m), digitos), cor = round(cor(m), digitos))
}

# var_suma(vx, vy, cxy): varianza teórica de X + Y
var_suma <- function(vx, vy, cxy = 0) vx + vy + 2 * cxy
