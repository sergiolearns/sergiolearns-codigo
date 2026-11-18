# Para tu script: las funciones del bloque, comentadas y sin enunciados
# Del artículo «Intensivo de R 1: descriptiva — ejercicios con el súper del piso, una función resumen() y gráficos bien rotulados (y el NA que se comió todo el mes)»
# https://sergiolearns.com/r-intensivo-descriptiva-ejercicios/

# ===================== Bloque R1: funciones propias y descriptiva =====================

# resumen(x, digitos): n, media, cuartiles, sd, CV (%) y nº de atípicos (regla 1,5·RIC)
resumen <- function(x, digitos = 2) {
  stopifnot(is.numeric(x), length(x) > 0)          # entrada numérica y no vacía
  faltan <- sum(is.na(x))
  if (faltan > 0) {                                # quitar NA avisando
    message("Aviso: quito ", faltan, " dato(s) NA")
    x <- x[!is.na(x)]
  }
  q <- quantile(x, c(0.25, 0.5, 0.75), names = FALSE)
  ric <- q[3] - q[1]
  atip <- sum(x < q[1] - 1.5 * ric | x > q[3] + 1.5 * ric)
  round(c(n = length(x), media = mean(x), Q1 = q[1], mediana = q[2], Q3 = q[3],
          sd = sd(x), CV = sd(x) / mean(x) * 100, atipicos = atip), digitos)
}

# resumen_grupos(x, g): una columna de resumen() por grupo
resumen_grupos <- function(x, g, digitos = 2) {
  stopifnot(length(x) == length(g))
  sapply(split(x, g), resumen, digitos = digitos)
}

# atipicos(df, var, grupo): filas de df que el boxplot marca como atípicas dentro de su grupo
atipicos <- function(df, var, grupo) {
  b <- boxplot(df[[var]] ~ df[[grupo]], plot = FALSE)
  if (length(b$out) == 0) return(df[0, ])          # sin atípicos: tabla vacía
  df[df[[var]] %in% b$out, ]
}

# reparto(gasto, quien): saldo de cada uno para que todos paguen lo mismo (suma 0)
reparto <- function(gasto, quien) {
  stopifnot(is.numeric(gasto), length(gasto) == length(quien))
  pagado <- tapply(gasto, quien, sum, na.rm = TRUE)
  saldo <- round(pagado - mean(pagado), 2)
  stopifnot(abs(sum(saldo)) < 0.05)
  saldo
}

# Uso típico (cambia df, "x" y "g" por tus nombres):
# df <- df[!is.na(df$x), ]                         # quitar filas incompletas
# resumen(df$x)
# resumen_grupos(df$x, df$g)
# boxplot(x ~ g, data = df, main = "…", xlab = "…", ylab = "… (unidades)")
# atipicos(df, "x", "g")
# hist(df$x, breaks = seq(…), main = "…", xlab = "…", ylab = "Frecuencia")
