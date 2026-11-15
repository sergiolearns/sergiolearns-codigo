# Soluciones de los ejercicios tipo examen
# Del artículo «Distribuciones en el muestreo — ejercicios tipo examen con el Campus Virtual, la batería del portátil y dos impresoras (y los grados de libertad que puse al revés)»
# https://sergiolearns.com/distribuciones-en-el-muestreo-ejercicios/

# ---- Ejercicio 1 ----
1 - pnorm(2.6, 2.4, 0.5 / sqrt(16))    # P(media > 2.6)
qchisq(0.95, 16)
a <- 0.25 * qchisq(0.05, 15) / 15
b <- 0.25 * qchisq(0.95, 15) / 15
round(c(a = a, b = b), 2)
1 - pchisq(15 * 0.4 / 0.25, 15)

# ---- Ejercicio 2 ----
brillo100 <- c(5.23, 5.72, 4.49, 4.61, 6.64, 4.95, 6.76, 6.20, 5.66, 4.90)
n <- length(brillo100)
t_obs <- sqrt(n) * (mean(brillo100) - 6) / sd(brillo100)
round(c(media = mean(brillo100), s = sd(brillo100), t_obs = t_obs), 2)
pt(t_obs, n - 1)              # P(T <= t_obs) si mu = 6
brillo50 <- c(5.49, 6.15, 4.50, 5.07, 6.79, 5.50, 7.23, 7.06, 6.00, 5.22)
d <- brillo50 - brillo100
t_d <- sqrt(n) * mean(d) / sd(d)          # mu_D = 0
round(c(media_d = mean(d), s_d = sd(d), t_d = t_d), 3)
1 - pt(t_d, n - 1)                         # P(T >= t_d)
round(c(con_F = 1 - pf(t_obs^2, 1, n - 1), con_t = 2 * (1 - pt(abs(t_obs), n - 1))), 4)
set.seed(2026)
t_sim <- replicate(10000, { x <- rnorm(10, 6, 0.8); sqrt(10) * (mean(x) - 6) / sd(x) })
round(c(q975 = unname(quantile(t_sim, 0.975)), t9 = qt(0.975, 9), normal = qnorm(0.975)), 3)
hist(t_sim, freq = FALSE, breaks = 50, main = "", xlab = "t")
curve(dt(x, 9), add = TRUE, lwd = 2, col = "red")

# ---- Ejercicio 3 ----
a <- 2 * qf(0.05, 12, 8); b <- 2 * qf(0.95, 12, 8)
round(c(a = a, b = b), 3)
round(c(a_directo = 2 * qf(0.05, 12, 8), a_sin_cola_izq = 2 / qf(0.95, 8, 12)), 3)
A <- c(7.7, 10.1, 7.2, 8.7, 10.5, 7.9, 8.1, 7.9, 8.3, 8.8, 10.0, 7.7, 7.4)
B <- c(7.5, 6.5, 7.5, 7.0, 5.3, 8.0, 7.4, 8.7, 8.7)
m <- length(A); n <- length(B)
sp <- sqrt(((m - 1) * var(A) + (n - 1) * var(B)) / (m + n - 2))
t_obs <- (mean(A) - mean(B)) / (sp * sqrt(1 / m + 1 / n))
round(c(media_A = mean(A), media_B = mean(B), sp = sp, t_obs = t_obs), 3)
2 * (1 - pt(abs(t_obs), m + n - 2))       # P(|T| >= |t_obs|)
f_obs <- var(A) / var(B)
round(c(f_obs = f_obs, q05 = qf(0.05, 12, 8), q95 = qf(0.95, 12, 8), p = pf(f_obs, 12, 8)), 3)

# ---- Bonus ----
k <- 9
c(E_1_entre_Y = integrate(function(y) dchisq(y, k) / y, 0, Inf)$value, formula = 1 / (k - 2))
c(var_t = integrate(function(x) x^2 * dt(x, k), -Inf, Inf)$value, formula = k / (k - 2))
