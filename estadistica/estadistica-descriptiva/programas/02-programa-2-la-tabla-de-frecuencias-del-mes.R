# Programa 2: la tabla de frecuencias del mes, sin perder ningún dato
# Del artículo «Estadística descriptiva — práctica en R con las esperas de la guagua por franjas: summary, tablas con cut y boxplots por grupos (y el cut() que se comió la espera más corta)»
# https://sergiolearns.com/estadistica-descriptiva-practica/

manana <- c(8.5, 12.0, 6.5, 14.5, 9.0, 21.5, 7.5, 11.0, 10.5, 13.0,
            5.5, 9.5, 16.0, 8.0, 12.5, 6.5, 10.0, 15.5, 9.0, 11.5)

mediodia <- c(4.5, 6.0, 3.5, 7.0, 5.5, 2.5, 6.5, 4.0, 8.0, 5.0,
              3.0, 7.5, 4.5, 6.0, 5.5, 9.0, 3.5, 5.0, 6.5, 4.0)
tarde <- c(7.0, 10.5, 5.5, 12.0, 8.5, 31.0, 9.5, 6.5, 11.5, 7.5,
           13.5, 8.0, 10.0, 6.0, 9.0, 12.5, 7.5, 14.0, 8.5, 10.5)
minutos <- c(manana, mediodia, tarde)            # las 60 esperas del mes
c(n = length(minutos), min = min(minutos), max = max(minutos))
R <- max(minutos) - min(minutos)                 # recorrido
c(R = R, R_entre_5 = R / 5, longitud = ceiling(R / 5))

cortes_mal <- seq(min(minutos), by = 6, length.out = 6)   # empiezan EN el mínimo
cortes_mal
t_mal <- table(cut(minutos, cortes_mal))
t_mal
sum(t_mal)                                       # ¡59, no 60!
table(cut(minutos, cortes_mal), useNA = "ifany") # el que falta es un NA

# Bien hecho: los cortes empiezan por debajo del mínimo
cortes <- seq(2.25, by = 6, length.out = 6)      # 2.25, 8.25, ..., 32.25
clases <- cut(minutos, cortes, dig.lab = 4)      # dig.lab = 4: etiquetas sin recortar
f <- table(clases)
sum(f)                                           # ahora sí: 60
marca <- (head(cortes, -1) + tail(cortes, -1)) / 2   # punto medio de cada clase
tabla <- data.frame(clase = names(f), marca = marca, f = as.vector(f),
                    fr = round(as.vector(f) / 60, 3),
                    Fr = round(cumsum(as.vector(f)) / 60, 3))
tabla

# Medidas con los datos agrupados
fa <- as.vector(f); ng <- sum(fa)
media_ag <- sum(fa * marca) / ng
s2_ag <- sum(fa * (marca - media_ag)^2) / (ng - 1)
k <- which(cumsum(fa) >= ng / 2)[1]              # clase de la mediana
Fb <- sum(fa[seq_len(k - 1)]); L <- cortes[k]; w <- 6
M_ag <- L + w / fa[k] * (ng / 2 - Fb)            # mediana interpolada
round(rbind(agrupados  = c(media = media_ag, var = s2_ag, mediana = M_ag),
            originales = c(mean(minutos), var(minutos), median(minutos))), 2)
hist(minutos, breaks = cortes, main = "Esperas del mes", xlab = "Minutos")
