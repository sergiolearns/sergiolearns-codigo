# Programa 3: comparar las tres franjas
# Del artículo «Estadística descriptiva — práctica en R con las esperas de la guagua por franjas: summary, tablas con cut y boxplots por grupos (y el cut() que se comió la espera más corta)»
# https://sergiolearns.com/estadistica-descriptiva-practica/

manana <- c(8.5, 12.0, 6.5, 14.5, 9.0, 21.5, 7.5, 11.0, 10.5, 13.0,
            5.5, 9.5, 16.0, 8.0, 12.5, 6.5, 10.0, 15.5, 9.0, 11.5)
mediodia <- c(4.5, 6.0, 3.5, 7.0, 5.5, 2.5, 6.5, 4.0, 8.0, 5.0,
              3.0, 7.5, 4.5, 6.0, 5.5, 9.0, 3.5, 5.0, 6.5, 4.0)
tarde <- c(7.0, 10.5, 5.5, 12.0, 8.5, 31.0, 9.5, 6.5, 11.5, 7.5,
           13.5, 8.0, 10.0, 6.0, 9.0, 12.5, 7.5, 14.0, 8.5, 10.5)
minutos <- c(manana, mediodia, tarde)            # las 60 esperas del mes

esperas <- data.frame(
  franja  = rep(c("mañana", "mediodía", "tarde"), each = 20),
  minutos = minutos,
  llena   = c(rep("sí", 11), rep("no", 9),    # mañana: 11 llenas
              rep("sí", 3),  rep("no", 17),   # mediodía: 3
              rep("sí", 7),  rep("no", 13)))  # tarde: 7
str(esperas)
# factor con el orden del día (si no, R las ordena alfabéticamente)
esperas$franja <- factor(esperas$franja, levels = c("mañana", "mediodía", "tarde"))

round(tapply(esperas$minutos, esperas$franja, mean), 2)   # media por franja
round(tapply(esperas$minutos, esperas$franja, sd), 2)     # sd por franja
aggregate(minutos ~ franja, data = esperas, FUN = median) # mediana por franja

# La varianza de todo, a partir de los resúmenes de cada grupo
nj <- tapply(esperas$minutos, esperas$franja, length)
mj <- tapply(esperas$minutos, esperas$franja, mean)
vj <- tapply(esperas$minutos, esperas$franja, var)
xbar <- sum(nj * mj) / sum(nj)
s2 <- (sum((nj - 1) * vj) + sum(nj * (mj - xbar)^2)) / (sum(nj) - 1)
round(c(media_grupos = xbar, media_todo = mean(esperas$minutos),
        var_grupos = s2, var_todo = var(esperas$minutos)), 2)
round(c(dentro = sum((nj - 1) * vj), entre = sum(nj * (mj - xbar)^2)), 2)

# La variable categórica: ¿llegó llena?
tl <- table(esperas$franja, esperas$llena)
tl
round(prop.table(tl, margin = 1), 2)       # proporciones por fila (por franja)
boxplot(minutos ~ franja, data = esperas, ylab = "Minutos de espera")
barplot(t(tl), beside = TRUE, legend.text = TRUE, ylab = "Número de guaguas")
