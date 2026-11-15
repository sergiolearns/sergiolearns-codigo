# Programa 2: ¿cuánto hay que leer hasta el mensaje útil?
# Del artículo «Variables aleatorias discretas — práctica en R con el grupo de WhatsApp simulado, esperas hasta el mensaje útil y una Poisson que se ajusta a los datos (y el rgeom que creí roto)»
# https://sergiolearns.com/variables-aleatorias-discretas-practica/

p <- 0.2                                  # 20 % de mensajes útiles

# --- geométrica: inútiles antes del primero útil ---
round(dgeom(0:6, p), 4)                   # P(X = 0), ..., P(X = 6)
pgeom(9, p)                               # P(X <= 9): como mucho 9 inútiles
1 - pgeom(4, p)                           # P(X >= 5): al menos 5 inútiles
(1 - p)^5                                 # lo mismo con la fórmula de la cola
qgeom(c(0.5, 0.9), p)                     # mediana y cuantil 0,9

# intentos frente a fracasos: «el primer útil es el mensaje número 3»
dgeom(2, p)                               # 2 inútiles antes: lo correcto
dgeom(3, p)                               # 3 inútiles antes: el mensaje 4

# --- binomial negativa: inútiles antes del tercer útil ---
r <- 3
round(dnbinom(0:5, r, p), 4)
c(media = r * (1 - p) / p, var = r * (1 - p) / p^2)
qnbinom(c(0.5, 0.9), r, p)
pnbinom(10, r, p)                         # P(X <= 10)
(0:60)[which.max(dnbinom(0:60, r, p))]    # la moda: el valor más probable

set.seed(7)
esperas <- rnbinom(5000, r, p)            # 5000 lecturas simuladas
c(media_sim = mean(esperas), var_sim = var(esperas))

plot(0:40, dnbinom(0:40, r, p), type = "h", lwd = 3,
     xlab = "Inútiles antes del tercer útil", ylab = "P(X = k)")
