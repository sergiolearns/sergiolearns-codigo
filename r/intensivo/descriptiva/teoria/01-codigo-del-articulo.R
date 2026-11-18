# Todo el código del artículo, en orden (sin los errores a propósito)
# Del artículo «Intensivo de R 1: descriptiva — funciones propias, tapply y gráficos con los MB de mi móvil (y el cv que copié de la línea de arriba)»
# https://sergiolearns.com/r-intensivo-descriptiva/

# Los MB de datos móviles que gasté cada día de un mes de 30 días (empieza en lunes)
mb <- c(412, 380, 455, 398, 520, 870, 940, 401, 377, 430, 465, 510, 905, 1020,
        389, 415, 442, 398, 560, 1310, 880, 420, 395, 410, 478, 530, 950, 990,
        405, 2240)
dia <- rep(c("lun", "mar", "mié", "jue", "vie", "sáb", "dom"), length.out = 30)
tipo <- ifelse(dia %in% c("sáb", "dom"), "finde", "diario")
semana <- ceiling(seq_along(mb) / 7)   # días 1-7 = semana 1, 8-14 = semana 2…
length(mb)
table(tipo)

# Una función mínima: recibe un vector y devuelve su recorrido
recorrido <- function(x) {
  max(x) - min(x)          # la última expresión es lo que devuelve
}
recorrido(mb)
recorrido(c(10, 4, 7))

# Argumentos con valor por defecto: si no los das, se usan esos
en_gb <- function(x, digitos = 2, binario = TRUE) {
  divisor <- if (binario) 1024 else 1000
  round(x / divisor, digitos)
}
en_gb(2240)                     # usa digitos = 2 y binario = TRUE
en_gb(2240, 1)                  # por posición: digitos = 1
en_gb(2240, binario = FALSE)    # por nombre: salta digitos

# return() para salir antes; stopifnot() para no tragarse basura
cv <- function(x) {
  stopifnot(is.numeric(x), length(x) >= 2)
  if (mean(x) == 0) return(NA)   # sin media no hay cociente que valga
  sd(x) / mean(x)
}
round(cv(mb), 2)
cv(c(0, 0, 0))

# table: cuántas veces sale cada valor (o cada pareja)
table(tipo)
table(tipo, gasto_alto = mb > 500)

# tapply: aplica una función a cada grupo de un vector
tapply(mb, tipo, mean)
round(tapply(mb, semana, median), 1)

# aggregate: lo mismo, pero con un data frame y una fórmula
datos <- data.frame(mb, dia, tipo, semana)
aggregate(mb ~ tipo, data = datos, FUN = median)

hist(mb, breaks = seq(0, 2400, by = 300),
     main = "Datos móviles en un mes", xlab = "MB al día",
     ylab = "Número de días", col = "#A99EF5", border = "white")

# Versión 1: copiar y pegar para cada grupo (con un error escondido)
mb_diario <- mb[tipo == "diario"]
mb_finde <- mb[tipo == "finde"]
media_diario <- mean(mb_diario)
cv_diario <- sd(mb_diario) / mean(mb_diario)
media_finde <- mean(mb_finde)
cv_finde <- sd(mb_diario) / mean(mb_finde)     # ¡copiado de arriba!
round(c(media_diario, cv_diario, media_finde, cv_finde), 2)

# Versión 2: una función que hace el resumen de cualquier vector
resumen <- function(x) {
  q <- quantile(x, c(0.25, 0.5, 0.75))
  c(n = length(x), media = mean(x), Q1 = q[[1]], mediana = q[[2]],
    Q3 = q[[3]], cv = sd(x) / mean(x))
}
round(resumen(mb), 2)
round(resumen(mb[tipo == "finde"]), 2)

# Versión 3: comprueba la entrada, quita los NA y busca atípicos
resumen <- function(x, na.rm = TRUE, k = 1.5, digitos = 2) {
  stopifnot(is.numeric(x))
  if (na.rm) x <- x[!is.na(x)]
  stopifnot(length(x) >= 2)
  q <- quantile(x, c(0.25, 0.5, 0.75))
  ric <- q[[3]] - q[[1]]
  vallas <- c(q[[1]] - k * ric, q[[3]] + k * ric)
  atipicos <- x[x < vallas[1] | x > vallas[2]]
  tabla <- c(n = length(x), media = mean(x), Q1 = q[[1]], mediana = q[[2]],
             Q3 = q[[3]], cv = sd(x) / mean(x), atipicos = length(atipicos))
  list(tabla = round(tabla, digitos), vallas = vallas, atipicos = atipicos)
}
r <- resumen(c(mb, NA))      # un día sin dato: el móvil se quedó sin batería
r$tabla
r$vallas
r$atipicos

# Versión 4: la misma función para cada grupo, de una vez
por_tipo <- sapply(split(mb, tipo), function(g) resumen(g)$tabla)
por_tipo

boxplot(mb ~ tipo, data = datos, main = "MB al día según el tipo de día",
        xlab = "", ylab = "MB", col = c("#A99EF5", "#FFB4A3"))
