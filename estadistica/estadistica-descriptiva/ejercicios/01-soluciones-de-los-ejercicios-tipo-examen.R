# Soluciones de los ejercicios 1, 2 y 3
# Del artículo «Estadística descriptiva — ejercicios tipo examen de ME1 con la guagua del campus: tablas con cut, mediana por interpolación y varianza de varios grupos (y la mediana que se me salió de su clase)»
# https://sergiolearns.com/estadistica-descriptiva-ejercicios/

trayecto <- c(38.4, 31.4, 28.9, 27.3, 34.0, 40.7, 35.6, 37.6, 39.8, 31.8,
              44.6, 31.8, 37.1, 43.9, 35.2, 36.0, 33.4, 36.9, 26.6, 32.8,
              42.6, 36.4, 34.5, 37.1, 37.2, 36.1, 37.9, 28.5, 38.0, 32.7,
              38.8, 35.4, 31.3, 35.2, 52.4, 58.6)

round(c(media = mean(trayecto), mediana = median(trayecto)), 2)

cortes <- c(25, 30, 35, 40, 45, 60)
f <- table(cut(trayecto, cortes))
sum(f)                                  # comprobación: 36
tabla <- data.frame(clase = names(f), f = as.vector(f),
                    fr = round(as.vector(f) / 36, 2),
                    Fr = round(cumsum(as.vector(f)) / 36, 2))
tabla

fa <- as.vector(f); m <- c(27.5, 32.5, 37.5, 42.5, 52.5); n <- sum(fa)
media_ag <- sum(fa * m) / n
s_ag <- sqrt(sum(fa * (m - media_ag)^2) / (n - 1))
M_ag <- 35 + 5 / 17 * (n / 2 - 13)
round(rbind(agrupados  = c(media = media_ag, s = s_ag, mediana = M_ag),
            originales = c(mean(trayecto), sd(trayecto), median(trayecto))), 2)

q <- quantile(trayecto, c(0.25, 0.75)); RI <- IQR(trayecto)
q; RI
vallas <- unname(c(q[1] - 1.5 * RI, q[2] + 1.5 * RI))
round(vallas, 2)
trayecto[trayecto < vallas[1] | trayecto > vallas[2]]
round(c(media_sin = mean(trayecto[trayecto < 50]),
        mediana_sin = median(trayecto[trayecto < 50])), 2)

fn <- c(36, 58, 31, 23, 12); mn <- c(2, 6, 10, 16, 25); nn <- sum(fn)
xn <- sum(fn * mn) / nn
round(c(media = xn, s2 = (sum(fn * mn^2) - nn * xn^2) / (nn - 1)), 2)
cumsum(fn)
round(c(mediana = 4 + 4 / 58 * (nn / 2 - 36),
        p90 = 12 + 8 / 23 * (0.9 * nn - 125),
        mas_de_15 = (23 * 5 / 8 + 12) / nn * 100), 2)

nj <- c(25, 20, 15); mj <- c(10.4, 5.6, 9.8); vj <- c(12.25, 4.41, 16.00)
xbar <- sum(nj * mj) / sum(nj)
s2 <- (sum((nj - 1) * vj) + sum(nj * (mj - xbar)^2)) / (sum(nj) - 1)
round(c(media = xbar, varianza = s2, s = sqrt(s2)), 2)

round(c(media_s = 90 + 60 * xbar, var_s = 60^2 * s2, s_s = 60 * sqrt(s2)), 2)
