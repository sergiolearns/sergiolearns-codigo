# Solución del nivel 1 (con los datos y las funciones que necesita)
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

table(tickets$super)
round(tapply(tickets$gasto, tickets$quien, sum, na.rm = TRUE), 2)
aggregate(gasto ~ super, data = tickets, FUN = mean)

hist(tickets$gasto, breaks = seq(0, 100, by = 10),
     main = "Tickets del súper en octubre", xlab = "Importe (euros)", ylab = "Número de tickets",
     col = "lightblue")
