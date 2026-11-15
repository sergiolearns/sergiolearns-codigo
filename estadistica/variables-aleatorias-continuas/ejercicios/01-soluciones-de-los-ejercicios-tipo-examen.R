# Soluciones de los ejercicios tipo examen
# Del artículo «Variables aleatorias continuas — ejercicios tipo examen con el microondas de la cafetería, una densidad con constante y tres formas de pagar (y el uniroot que no encontraba la mediana)»
# https://sergiolearns.com/variables-aleatorias-continuas-ejercicios/

# ---- Ejercicio 1 ----
f <- function(x) ifelse(x > 0 & x < 1, 12 * x^2 * (1 - x), 0)
integrate(f, 0, 1)$value                            # (a) comprobación: integra 1
media <- integrate(function(x) x * f(x), 0, 1)$value
varianza <- integrate(function(x) x^2 * f(x), 0, 1)$value - media^2
round(c(media = media, varianza = varianza), 2)    # (b) comprobación
curve(f, from = 0, to = 1, lwd = 2, ylab = "f(x)", xlab = "proporción caliente")   # (d)
F <- function(x) 4 * x^3 - 3 * x^4                 # F en el tramo (0, 1)
mediana <- uniroot(function(x) F(x) - 0.5, c(0, 1))$root   # (e)
round(mediana, 2)
round(1 - F(0.8), 2)                               # (f) P(X > 0,8)

# ---- Ejercicio 2 ----
lambda <- 1 / 0.75                         # personas por minuto
round(1 - pexp(1, lambda), 2)              # (a) P(T > 1)
round(qexp(0.9, lambda), 2)                # (a) cuantil 0,9
round(c(condicionada = (1 - pexp(2, lambda)) / (1 - pexp(1.5, lambda)),
        sin_esperar = 1 - pexp(0.5, lambda)), 2)    # (b)
round(c(media = 4 / lambda, varianza = 4 / lambda^2), 2)   # (c)
round(pgamma(3, 4, lambda), 2)             # (c) P(S < 3)
alfa <- 2.4^2 / 1.2^2; beta <- 2.4 / 1.2^2
round(c(alfa = alfa, beta = beta), 2)      # (d)
round(pgamma(3, alfa, beta) - pgamma(2, alfa, beta), 2)    # (d) P(2 < T < 3)

# ---- Ejercicio 3 ----
p <- c(tarjeta = 0.60, efectivo = 0.25, app = 0.15)
Fk <- function(t) c(tarjeta = pexp(t, 2), efectivo = punif(t, 0.5, 2.5),
                    app = pgamma(t, 2, 2))
Fmezcla <- function(t) sum(p * Fk(t))       # (a) probabilidad total
round(Fk(1), 4)                             # cada F en un minuto
round(Fmezcla(1), 4)                        # P(T < 1)
round(p * Fk(1) / Fmezcla(1), 4)            # (b) Bayes
sum(p * c(1 / 2, (0.5 + 2.5) / 2, 2 / 2))   # (c) la media de la mezcla
mediana <- uniroot(function(t) Fmezcla(t) - 0.5, c(0, 3))$root   # (d)
round(mediana, 2)
curve(Vectorize(Fmezcla)(x), from = 0, to = 3, lwd = 2, ylab = "P(T < t)", xlab = "minutos")
abline(h = 0.5, lty = 2)
