# Programa 3: ¿se ajusta una Poisson a los mensajes del grupo?
# Del artículo «Variables aleatorias discretas — práctica en R con el grupo de WhatsApp simulado, esperas hasta el mensaje útil y una Poisson que se ajusta a los datos (y el rgeom que creí roto)»
# https://sergiolearns.com/variables-aleatorias-discretas-practica/

x <- 0:9                                    # mensajes en una franja
f <- c(1, 4, 9, 11, 12, 10, 7, 3, 2, 1)     # número de franjas con ese valor
mensajes <- rep(x, f)                       # los 60 conteos, uno por franja
length(mensajes)

lambda <- mean(mensajes)                    # estimación de lambda
c(media = lambda, varianza = var(mensajes))

esperada <- 60 * dpois(x, lambda)           # franjas que esperaría el modelo
tabla <- cbind(x, observada = f, esperada = round(esperada, 2))
tabla
sum(esperada)                               # no llega a 60: falta la cola de 10 o más

# usar el modelo
c(modelo = 1 - ppois(7, lambda), datos = mean(mensajes >= 8))
c(media_hora = 6 * lambda, P_mas_de_30_en_una_hora = 1 - ppois(30, 6 * lambda))

barplot(rbind(f, esperada), beside = TRUE, names.arg = x,
        col = c("grey", "tomato"), legend.text = c("observada", "Poisson"),
        xlab = "Mensajes en 10 minutos", ylab = "Franjas")
