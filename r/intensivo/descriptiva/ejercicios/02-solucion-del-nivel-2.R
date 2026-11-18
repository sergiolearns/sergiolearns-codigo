# Solución del nivel 2 (con los datos y las funciones que necesita)
# Del artículo «Intensivo de R 1: descriptiva — ejercicios con el súper del piso, una función resumen() y gráficos bien rotulados (y el NA que se comió todo el mes)»
# https://sergiolearns.com/r-intensivo-descriptiva-ejercicios/

# Los 40 tickets de octubre (importe en euros; NA = ticket sin importe)
tickets <- data.frame(
  dia   = c(1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12, 13, 14, 15, 15,
            16, 17, 18, 18, 19, 20, 21, 22, 22, 23, 24, 25, 25, 26, 27, 28, 29, 29, 30, 31),
  quien = c("Laura", "Sergio", "Dani", "Marta", "Laura", "Dani", "Sergio", "Marta", "Laura", "Dani",
            "Sergio", "Marta", "Laura", "Sergio", "Dani", "Marta", "Laura", "Sergio", "Dani", "Marta",
            "Laura", "Sergio", "Dani", "Marta", "Laura", "Sergio", "Dani", "Marta", "Laura", "Sergio",
            "Dani", "Marta", "Laura", "Sergio", "Dani", "Marta", "Laura", "Sergio", "Dani", "Marta"),
  super = c("Grande", "Barrio", "Barrio", "Grande", "Online", "Barrio", "Barrio", "Grande", "Barrio", "Grande",
            "Barrio", "Online", "Grande", "Barrio", "Barrio", "Grande", "Barrio", "Grande", "Barrio", "Online",
            "Grande", "Barrio", "Barrio", "Grande", "Barrio", "Barrio", "Grande", "Barrio", "Online", "Barrio",
            "Barrio", "Grande", "Barrio", "Grande", "Barrio", "Online", "Barrio", "Barrio", "Grande", "Grande"),
  gasto = c(42.80, 9.35, 14.20, 51.60, 38.90, 7.45, 12.10, 47.25, 11.60, 55.30,
            8.90, 36.40, 49.75, 13.25, 6.80, 44.10, 10.95, 58.20, 15.40, 41.15,
            46.30, 7.95, NA, 53.80, 12.45, 9.60, 96.40, 11.20, 39.70, 14.85,
            8.25, 48.90, 10.30, 52.45, 13.70, 37.85, 9.15, 12.60, 45.50, 50.20)
)
str(tickets)

# resumen(): ocho números que describen un vector, con 'digitos' decimales
resumen <- function(x, digitos = 2) {
  # 1. Comprobar la entrada: si no es un número o está vacío, parar con un error claro
  stopifnot(is.numeric(x), length(x) > 0)
  # 2. Los NA: quitarlos, pero avisando (nunca en silencio)
  faltan <- sum(is.na(x))
  if (faltan > 0) {
    message("Aviso: quito ", faltan, " dato(s) NA")
    x <- x[!is.na(x)]
  }
  # 3. Cuartiles sin nombres (names = FALSE) para no arrastrar "25%" al resultado
  q <- quantile(x, c(0.25, 0.5, 0.75), names = FALSE)
  ric <- q[3] - q[1]
  # 4. Atípicos: los que quedan fuera de las vallas Q1 - 1,5 RIC y Q3 + 1,5 RIC
  atip <- sum(x < q[1] - 1.5 * ric | x > q[3] + 1.5 * ric)
  # 5. El resultado: un vector con nombre, redondeado. Es la última expresión: es lo que devuelve
  round(c(n = length(x), media = mean(x), Q1 = q[1], mediana = q[2], Q3 = q[3],
          sd = sd(x), CV = sd(x) / mean(x) * 100, atipicos = atip), digitos)
}
resumen(tickets$gasto)
