# Programa 1: el resumen de las mañanas
# Del artículo «Estadística descriptiva — práctica en R con las esperas de la guagua por franjas: summary, tablas con cut y boxplots por grupos (y el cut() que se comió la espera más corta)»
# https://sergiolearns.com/estadistica-descriptiva-practica/

manana <- c(8.5, 12.0, 6.5, 14.5, 9.0, 21.5, 7.5, 11.0, 10.5, 13.0,
            5.5, 9.5, 16.0, 8.0, 12.5, 6.5, 10.0, 15.5, 9.0, 11.5)
n <- length(manana)

# Centro y dispersión en un vector con nombres: la salida dice qué es cada número
resumen <- c(n = n, media = mean(manana), mediana = median(manana),
             s2 = var(manana), s = sd(manana), RI = IQR(manana))
round(resumen, 2)

quantile(manana)        # los cuartiles con la regla de R (tipo 7)
fivenum(manana)         # las «bisagras» que usa boxplot()

# Vallas de 1.5 RI; unname() quita el nombre "25%" que arrastra quantile
q1 <- quantile(manana, 0.25); q3 <- quantile(manana, 0.75)
vallas <- unname(c(q1 - 1.5 * IQR(manana), q3 + 1.5 * IQR(manana)))
vallas
manana[manana < vallas[1] | manana > vallas[2]]   # posibles atípicos
which(manana > vallas[2])                          # en qué posición están

# ¿Cuánto pesa el atípico? El mismo resumen sin el dato 6
round(c(media_sin = mean(manana[-6]), mediana_sin = median(manana[-6]),
        s_sin = sd(manana[-6])), 2)
stem(manana)
boxplot(manana, horizontal = TRUE, xlab = "Minutos de espera (mañana)")
