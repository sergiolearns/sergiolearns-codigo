# Programa 3: ajustar la máquina y llenar cajas de 12
# Del artículo «La distribución normal — práctica en R con 10.000 paquetes de gofio, una báscula y cajas de 12 (y la curva que se quedó pegada al suelo)»
# https://sergiolearns.com/distribucion-normal-practica/

sigma <- 6
# 1) ¿Dónde poner la media para que solo el 1 % pese menos de 1000 g?
mu_nueva <- 1000 - qnorm(0.01) * sigma
round(mu_nueva, 2)
# Lo que se regala por paquete y por cada 10.000 paquetes, en kilos
round(c(por_paquete = mu_nueva - 1000, kilos_10000 = (mu_nueva - 1000) * 10000 / 1000), 2)
# 2) Las cajas de 12 paquetes con la máquina ajustada
set.seed(2026)
cajas <- replicate(10000, sum(rnorm(12, mu_nueva, sigma)))
round(c(media = mean(cajas), sd = sd(cajas)), 2)
round(c(teorica_media = 12 * mu_nueva, teorica_sd = sqrt(12) * sigma, mal = 12 * sigma), 2)
# La caja declara 12 kg: ¿cuántas pesan menos de 12000 g?
c(simulada = mean(cajas < 12000),
  teorica = pnorm(12000, 12 * mu_nueva, sqrt(12) * sigma))
# Y por debajo de 12.150 g (1012,5 g por paquete de media)
round(c(simulada = mean(cajas < 12150),
        teorica = pnorm(12150, 12 * mu_nueva, sqrt(12) * sigma)), 4)
hist(cajas, freq = FALSE, breaks = 40, col = "grey90",
     main = "10.000 cajas de 12", xlab = "gramos")
curve(dnorm(x, 12 * mu_nueva, sqrt(12) * sigma), add = TRUE, lwd = 2, col = "red")
# 3) ¿Y si en vez de subir la media se compra una máquina más precisa?
sigma_nueva <- (1004 - 1000) / qnorm(0.99)   # sigma con media 1004 y 1 % debajo
round(sigma_nueva, 2)
pnorm(1000, 1004, sigma_nueva)
