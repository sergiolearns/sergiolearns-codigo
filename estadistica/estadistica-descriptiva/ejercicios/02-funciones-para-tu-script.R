# Para tu script: el tema 1 en funciones
# Del artículo «Estadística descriptiva — ejercicios tipo examen de ME1 con la guagua del campus: tablas con cut, mediana por interpolación y varianza de varios grupos (y la mediana que se me salió de su clase)»
# https://sergiolearns.com/estadistica-descriptiva-ejercicios/

trayecto <- c(38.4, 31.4, 28.9, 27.3, 34.0, 40.7, 35.6, 37.6, 39.8, 31.8,
              44.6, 31.8, 37.1, 43.9, 35.2, 36.0, 33.4, 36.9, 26.6, 32.8,
              42.6, 36.4, 34.5, 37.1, 37.2, 36.1, 37.9, 28.5, 38.0, 32.7,
              38.8, 35.4, 31.3, 35.2, 52.4, 58.6)
summary(trayecto)
boxplot(trayecto, horizontal = TRUE)
f <- table(cut(trayecto, seq(25, 60, by = 5)))
f
hist(trayecto, breaks = seq(25, 60, by = 5))
```

Qué mirar:

1. `summary` ya te da casi todo el apartado (a) y los cuartiles del (d).
2. En **Plots**, el boxplot: el bigote acaba en 44,6 y hay dos puntos sueltos.
3. Con clases de 5 en 5 hasta 60, la tabla tiene 7 clases: ¿en cuáles hay 0 datos?
4. En el histograma de clases iguales, el eje vertical es `Frequency`: compáralo con el de `breaks = c(25, 30, 35, 40, 45, 60)`.

## Chuletario: estadística descriptiva {#chuletario}

Solo resultados, sin demostraciones: es lo que se puede llevar a la EC1.

**Lo esencial en 30 segundos:** media y mediana para el centro (si se separan, hay asimetría o atípicos), \( s \) y \( RI \) para la dispersión, vallas \( Q_1 - 1{,}5RI \) y \( Q_3 + 1{,}5RI \) para los atípicos, y con tablas, marcas de clase e interpolación. Varianza **siempre** con \( n - 1 \). Resultados con 2 decimales.

| Medida | Datos | Datos agrupados |
|---|---|---|
| Media | \( \bar{x} = \frac{1}{n}\sum x_i \) | \( \bar{x} = \frac{1}{n}\sum f_i m_i \) |
| Varianza | \( s^2 = \frac{\sum x_i^2 - n\bar{x}^2}{n-1} \) | \( s^2 = \frac{\sum f_i m_i^2 - n\bar{x}^2}{n-1} \) |
| Mediana | Valor central (media de los dos centrales si \( n \) es par) | \( M = L + \frac{w}{f_m}\left(\frac{n}{2} - F_b\right) \) |
| Percentil \( p \) | `quantile(x, p)` | \( P = L + \frac{w}{f}\,(p\,n - F_b) \) |

**Otros resultados:**

- \( \sum (x_i - \bar{x}) = 0 \); \( \sum f_i(m_i - \bar{x}) = 0 \).
- Si \( y = a + bx \): \( \bar{y} = a + b\bar{x} \), \( s_y^2 = b^2 s_x^2 \), \( s_y = |b|\,s_x \).
- Varios grupos: \( \bar{x} = \frac{\sum n_j\bar{x}_j}{n} \), \( s^2 = \frac{\sum (n_j - 1)s_j^2 + \sum n_j(\bar{x}_j - \bar{x})^2}{n-1} \).
- \( \sum (x_i - a)^2 = \sum (x_i - \bar{x})^2 + n(\bar{x} - a)^2 \): mínimo en \( a = \bar{x} \).
- Regla empírica (datos en campana): 68 %, 95 % y 99,7 % en \( \bar{x} \pm s \), \( \pm 2s \), \( \pm 3s \).
- Muestreo sistemático: \( K = N/n \); muestra \( r, r + K, \dots, r + (n-1)K \).

| Quiero… | Código | Resultado |
|---|---|---|
| Media, mediana | `mean(x)`, `median(x)` | Un número |
| Varianza y desviación típica | `var(x)`, `sd(x)` | Con \( n - 1 \) |
| Cuartiles y \( RI \) | `quantile(x)`, `IQR(x)` | 0 %, 25 %, 50 %, 75 %, 100 % |
| Todo junto | `summary(x)` | Mín., Q1, mediana, media, Q3, máx. |
| Tabla de frecuencias | `table(cut(x, cortes))` | Clases `(a,b]` y sus \( f_i \) |
| Relativas y acumuladas | `prop.table(f)`, `cumsum(...)` | Proporciones |
| Atípicos | `boxplot(x)$out` | Los puntos sueltos |
| Por grupos | `tapply(x, g, mean)` | Una media por grupo |
| Proporciones por fila | `prop.table(tabla, margin = 1)` | Cada fila suma 1 |

| Síntoma | Causa probable |
|---|---|
| La tabla de `cut` suma menos que \( n \) | Un dato en el primer corte o fuera del rango |
| Mi varianza no cuadra con `var()` | He dividido entre \( n \) |
| La mediana interpolada se sale de su clase | \( F_b \) con la propia clase o \( L \) equivocado |
| La etiqueta de una clase sale recortada (`14.2]`) | Falta `dig.lab` en `cut` |
| El histograma pone `Density` | Clases de distinto ancho: lo que cuenta es el área |

**Antes de entregar, pregúntate:**

1. ¿He dado cada resultado con 2 decimales y sus unidades?
2. ¿He comprobado que las frecuencias suman \( n \) y que la mediana interpolada cae dentro de su clase?
3. ¿He comentado la diferencia entre lo agrupado y lo original, y he interpretado en el contexto (minutos, guaguas)?
4. ¿Está todo el código de cada ejercicio en mi `.R`?

## Para tu script {#para-tu-script}

El código del tema en funciones, comentado y sin enunciados, para copiarlo a tu fichero `.R` del examen. Está probado con los datos de este artículo.

```r
## ===== ME1 · Tema 1: estadística descriptiva (sergiolearns.com) =====

# Resumen numérico con nombres y 2 decimales
resumen <- function(x) {
  round(c(n = length(x), media = mean(x), mediana = median(x),
          s2 = var(x), s = sd(x), Q1 = unname(quantile(x, 0.25)),
          Q3 = unname(quantile(x, 0.75)), RI = IQR(x)), 2)
}

# Vallas de 1.5 RI y posibles atípicos
atipicos <- function(x) {
  q <- quantile(x, c(0.25, 0.75)); RI <- IQR(x)
  v <- unname(c(q[1] - 1.5 * RI, q[2] + 1.5 * RI))
  list(vallas = round(v, 2), atipicos = x[x < v[1] | x > v[2]])
}

# Tabla de frecuencias completa (comprueba que no se pierde ningún dato)
tabla_frec <- function(x, cortes) {
  f <- table(cut(x, cortes, dig.lab = 6))
  if (sum(f) != length(x)) warning("hay datos fuera de las clases")
  fa <- as.vector(f)
  data.frame(clase = names(f), marca = (head(cortes, -1) + tail(cortes, -1)) / 2,
             f = fa, fr = round(fa / sum(fa), 4), Fr = round(cumsum(fa) / sum(fa), 4))
}

# Medidas con datos agrupados: f = frecuencias, cortes = extremos de las clases
agrupados <- function(f, cortes) {
  m <- (head(cortes, -1) + tail(cortes, -1)) / 2; n <- sum(f)
  media <- sum(f * m) / n
  s2 <- (sum(f * m^2) - n * media^2) / (n - 1)
  round(c(media = media, s2 = s2, s = sqrt(s2)), 2)
}

# Percentil p (0.5 = mediana) por interpolación en datos agrupados
percentil_ag <- function(f, cortes, p) {
  n <- sum(f); k <- which(cumsum(f) >= p * n)[1]
  Fb <- sum(f[seq_len(k - 1)]); L <- cortes[k]; w <- cortes[k + 1] - cortes[k]
  round(L + w / f[k] * (p * n - Fb), 2)
}

# Media y varianza de varios grupos a partir de sus resúmenes
grupos <- function(nj, mj, vj) {
  n <- sum(nj); xbar <- sum(nj * mj) / n
  s2 <- (sum((nj - 1) * vj) + sum(nj * (mj - xbar)^2)) / (n - 1)
  round(c(media = xbar, s2 = s2, s = sqrt(s2)), 2)
}

# Cambio de origen y escala y = a + b x
transforma <- function(media, s, a, b) round(c(media = a + b * media, s2 = (b * s)^2, s = abs(b) * s), 2)

# Muestreo sistemático: N elementos, n en la muestra, inicio r entre 1 y K
sistematico <- function(N, n, r) { K <- N / n; r + K * (0:(n - 1)) }

# Comprobación con los datos del ejercicio 1
trayecto <- c(38.4, 31.4, 28.9, 27.3, 34.0, 40.7, 35.6, 37.6, 39.8, 31.8,
              44.6, 31.8, 37.1, 43.9, 35.2, 36.0, 33.4, 36.9, 26.6, 32.8,
              42.6, 36.4, 34.5, 37.1, 37.2, 36.1, 37.9, 28.5, 38.0, 32.7,
              38.8, 35.4, 31.3, 35.2, 52.4, 58.6)
resumen(trayecto)
atipicos(trayecto)
agrupados(c(36, 58, 31, 23, 12), c(0, 4, 8, 12, 20, 30))
c(mediana = percentil_ag(c(36, 58, 31, 23, 12), c(0, 4, 8, 12, 20, 30), 0.5),
  p90 = percentil_ag(c(36, 58, 31, 23, 12), c(0, 4, 8, 12, 20, 30), 0.9))
grupos(c(25, 20, 15), c(10.4, 5.6, 9.8), c(12.25, 4.41, 16.00))
head(sistematico(1200, 40, 17), 5)
