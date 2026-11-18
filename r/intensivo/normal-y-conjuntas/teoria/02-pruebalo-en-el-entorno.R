# Pruébalo en el entorno de R
# Del artículo «Intensivo de R 3: normal y conjuntas — vectorizar, pnorm en tus funciones y simular mis 5 km y 10 km (y el bucle que tardaba 40 veces más)»
# https://sergiolearns.com/r-intensivo-normal-y-conjuntas/

simular <- function(n, media = 26, desv = 1.5, ruido = 1.5) {
  stopifnot(n >= 1, desv > 0, ruido >= 0)
  t5 <- rnorm(n, mean = media, sd = desv)
  t10 <- 2 * t5 + 1 + rnorm(n, mean = 0, sd = ruido)
  data.frame(t5, t10, nivel = ifelse(t10 < 50, "sub-50", "normal"))
}

set.seed(99)
d <- simular(20000)
cor(d$t5, d$t10)
mean(d$t10 < 50)
plot(d$t5[1:300], d$t10[1:300], pch = 19, col = "#5B4BDB80",
     xlab = "5 km (min)", ylab = "10 km (min)")
abline(a = 1, b = 2, col = "#FF6B4A", lwd = 2)

d3 <- simular(20000, ruido = 4)   # un 10 km mucho más imprevisible
cor(d3$t5, d3$t10)
