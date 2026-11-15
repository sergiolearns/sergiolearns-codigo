# Programa 2: tres tuppers que suman una gamma
# Del artículo «Variables aleatorias continuas — práctica en R con la cola del microondas simulada, tres tuppers que suman una gamma y un modelo que se ajusta a los datos (y el rgamma que me dio tiempos cuatro veces más cortos)»
# https://sergiolearns.com/variables-aleatorias-continuas-practica/

set.seed(2026)
n <- 10000
w <- rexp(n, 0.5) + rexp(n, 0.5) + rexp(n, 0.5)   # tres esperas seguidas, sumadas una a una
# 1. Media y varianza: la gamma(3; 0,5) dice 6 y 12
round(c(media = mean(w), varianza = var(w)), 2)
# 2. Comer en 5 minutos o menos: contado frente a pgamma
round(c(simulado = mean(w <= 5), teorico = pgamma(5, 3, 0.5)), 4)
# 3. La mediana y el cuantil 90: de los datos frente a qgamma
round(quantile(w, c(0.5, 0.9)), 2)
round(qgamma(c(0.5, 0.9), 3, 0.5), 2)
# 4. El error del gancho: el tercer argumento es el RITMO
mal <- rgamma(n, 3, 2)                   # ritmo 2: cada persona, medio minuto
bien <- rgamma(n, shape = 3, scale = 2)  # escala 2: cada persona, 2 minutos
round(c(mal = mean(mal), bien = mean(bien)), 2)
# 5. Histograma de la suma con la densidad gamma encima
hist(w, breaks = seq(0, ceiling(max(w)), by = 1), freq = FALSE, xlim = c(0, 25),
     main = "Espera con tres personas delante", xlab = "minutos", ylab = "densidad")
curve(dgamma(x, 3, 0.5), add = TRUE, lwd = 2, col = "red")
