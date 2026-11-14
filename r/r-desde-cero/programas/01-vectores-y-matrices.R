# R desde cero (1): la consola como calculadora, variables, vectores y matrices
# Del artículo «R desde cero — la consola como calculadora, variables, vectores y matrices (y el día que c(1, 2) + c(1, 2, 3) casi no dio error)»
# https://sergiolearns.com/r-desde-cero-vectores-y-matrices/

## La consola como calculadora
3 + 4 * 2      # primero la multiplicación, como en matemáticas
(3 + 4) * 2    # los paréntesis cambian el orden
2^10           # potencia: 2 elevado a 10
17 / 5         # división normal, con decimales
17 %/% 5       # división entera: cuántas veces cabe el 5 en el 17
17 %% 5        # el resto de esa división

sqrt(81)                  # raíz cuadrada
exp(1)                    # el número e
log(100)                  # ¡ojo! logaritmo NEPERIANO (ln)
log(100, base = 10)       # logaritmo en base 10
log10(1000)               # atajo para la base 10
round(3.14159, 2)         # redondea a 2 decimales
abs(-7)                   # valor absoluto
factorial(5)              # 5! = 5 · 4 · 3 · 2 · 1
choose(5, 2)              # combinaciones de 5 elementos tomados de 2 en 2

## Variables y tipos
nota_teoria <- 6.5
nota_practica <- 8
final <- 0.7 * nota_teoria + 0.3 * nota_practica
final

x <- 6.5
n <- 3L                      # la L final lo marca como entero
asignatura <- "ME1"          # el texto va entre comillas
aprobado <- final >= 5       # una comparación da TRUE o FALSE
class(x)
class(n)
class(asignatura)
class(aprobado)
aprobado

sum(c(TRUE, FALSE, TRUE, TRUE))
mean(c(TRUE, FALSE, TRUE, TRUE))
edades <- c(19, NA, 21)
mean(edades)
mean(edades, na.rm = TRUE)

## Vectores
notas <- c(4.5, 7, 8.25, 5, 6.5, 9, 3.75, 7.5)
length(notas)                    # cuántos valores tiene
1:8                              # del 1 al 8, de uno en uno
seq(0, 10, by = 2.5)             # de 0 a 10 de 2,5 en 2,5
seq(1, 2, length.out = 5)        # 5 valores repartidos entre 1 y 2
rep(c("A", "B"), times = 3)      # repite el vector entero 3 veces
rep(c("A", "B"), each = 3)       # repite cada elemento 3 veces

notas[1]              # el primero
notas[c(2, 4)]        # el segundo y el cuarto
notas[-1]             # todos MENOS el primero
notas >= 5            # la comparación, elemento a elemento
notas[notas >= 5]     # solo los que cumplen la condición
which(notas >= 5)     # en qué posiciones están

notas * 10                                      # cada nota por 10
notas - mean(notas)                             # cada nota menos la media
(notas - mean(notas))^2                         # y cada diferencia al cuadrado
sum((notas - mean(notas))^2) / (length(notas) - 1)
var(notas)                                      # la cuasivarianza de R

c(1, 2, 3, 4) + c(10, 20)
c(1, 2, 3) + c(10, 20)       # recicla y avisa: las longitudes no son múltiplos

sort(notas)
sum(notas)
mean(notas)
median(notas)
range(notas)
sd(notas)
summary(notas)

## Matrices
m <- matrix(1:6, nrow = 2)
m
matrix(1:6, nrow = 2, byrow = TRUE)
dim(m)

m[2, 3]     # fila 2, columna 3
m[1, ]      # toda la fila 1
m[, 2]      # toda la columna 2
t(m)        # la traspuesta: filas por columnas
m * 2       # cada elemento por 2
m %*% t(m)  # producto de matrices (2x3 por 3x2 = 2x2)

tabla <- matrix(c(12, 8, 5, 15), nrow = 2,
                dimnames = list(c("Aprueba", "Suspende"), c("Grupo A", "Grupo B")))
tabla
rowSums(tabla)       # total de cada fila
colSums(tabla)       # total de cada columna
prop.table(tabla)    # cada casilla entre el total (40)

## Todo junto: mis notas de prácticas de ME1
notas <- c(4.5, 7, 8.25, 5, 6.5, 9, 3.75, 7.5)
media <- mean(notas)
desvios <- notas - media             # cada nota menos la media
cuadrados <- desvios^2               # cada desvío al cuadrado
varianza <- sum(cuadrados) / (length(notas) - 1)
aprobadas <- notas[notas >= 5]       # el filtro con la máscara lógica
cat("Media:", media, "\n")
cat("Suma de los desvíos:", sum(desvios), "\n")
cat("Varianza:", varianza, " (var() da", var(notas), ")\n")
cat("Aprobadas:", length(aprobadas), "de", length(notas), "\n")
