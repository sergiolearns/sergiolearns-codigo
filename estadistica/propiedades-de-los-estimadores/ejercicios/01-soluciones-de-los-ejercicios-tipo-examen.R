# Soluciones de los ejercicios tipo examen
# Del artículo «Propiedades de los estimadores — ejercicios tipo examen con la flota de patinetes, el máximo que mejor acierta, el velocímetro y Cramér–Rao (y el «más eficiente» que no era)»
# https://sergiolearns.com/propiedades-de-los-estimadores-ejercicios/

# Datos de los enunciados
espera <- c(10.1, 18.3, 8.3, 17.1, 29.5, 21.2, 12.3, 6.4, 19.9, 6.2, 24.1, 10.6, 11.5, 4.8, 22.2)
canteras <- c(1715, 1479, 2351, 1621, 264, 1262, 2929, 991, 2677, 1254)
error <- c(-1.18, 0.08, -1.76, -0.25, -2.80, -0.18, 1.24, 1.79, -1.64, -0.56, -1.40, 0.05)
noche <- c(17.3, 8.2, 7.0, 2.1, 24.8, 10.9, 1.1, 65.4, 9.7, 0.4, 6.4, 48.6, 14.9,
           12.3, 19.5, 0.2, 50.7, 2.5, 34.3, 27.9, 12.8, 75.3, 13.5, 26.0, 48.2)

# ---- Ejercicio 1 ----
n <- length(espera)
theta_mv <- mean(espera) / 2
round(c(theta = theta_mv, error_est = theta_mv / sqrt(2 * n)), 2)

# ---- Ejercicio 2 ----
n <- length(canteras)
round(c(momentos  = 2 * mean(canteras),
        maximo    = max(canteras),
        corregido = (n + 1) / n * max(canteras)), 2)

set.seed(55)
theta <- 3000; n <- 10
sims <- replicate(10000, {
  x <- runif(n, 0, theta)
  c(momentos = 2 * mean(x), maximo = max(x), corregido = (n + 1) / n * max(x),
    optimo = (n + 2) / (n + 1) * max(x))
})
ecm_sim <- apply(sims, 1, function(v) mean((v - theta)^2))    # 1: por estimador
ecm_teo <- theta^2 * c(1 / (3 * n), 2 / ((n + 1) * (n + 2)), 1 / (n * (n + 2)), 1 / (n + 1)^2)
round(rbind(ecm_sim, ecm_teo))

round((n + 2) / (n + 1) * max(canteras), 2)

# ---- Ejercicio 3 ----
n <- length(error)
round(c(v_mv = mean(error^2), S2 = var(error), sigma_mv = sqrt(mean(error^2))), 2)

set.seed(66)
sim <- replicate(10000, { x <- rnorm(12, 0, 1.5); c(v_mv = mean(x^2), S2 = var(x)) })
round(rbind(media = apply(sim, 1, mean), varianza = apply(sim, 1, var),
            teo_var = c(2 * 1.5^4 / 12, 2 * 1.5^4 / 11)), 3)

# ---- Bonus ----
n <- length(noche)
lambda_mv <- 1 / mean(noche)
logver <- function(l) n * log(l) - l * sum(noche)
o <- optim(lambda_mv, logver, method = "Brent", lower = 0.001, upper = 1,
           control = list(fnscale = -1), hessian = TRUE)
data.frame(lambda = round(lambda_mv, 4),
           var_formula = signif(lambda_mv^2 / n, 3),
           var_optim   = signif(-1 / o$hessian[1, 1], 3),
           error_est   = round(sqrt(lambda_mv^2 / n), 4),
           insesgado   = round((n - 1) / (n * mean(noche)), 4))
