# Pruébalo en el entorno de R
# Del artículo «Intensivo de R 2: probabilidad y simulación — sample, set.seed y replicate con los sobres de cromos de un álbum (y la semilla que se me olvidó poner)»
# https://sergiolearns.com/r-intensivo-probabilidad-y-simulacion/

sobres_para_completar <- function(n_cromos = 50, por_sobre = 5) {
  stopifnot(por_sobre <= n_cromos)
  album <- rep(FALSE, n_cromos)
  sobres <- 0
  while (!all(album)) {
    album[sample(n_cromos, por_sobre)] <- TRUE
    sobres <- sobres + 1
  }
  sobres
}

set.seed(100)
res <- replicate(2000, sobres_para_completar())
summary(res)
mean(res <= 45)
hist(res, breaks = seq(20, 120, by = 5), main = "Sobres para completar el álbum",
     xlab = "Sobres", col = "#A99EF5", border = "white")
abline(v = mean(res), col = "#FF6B4A", lwd = 2)
