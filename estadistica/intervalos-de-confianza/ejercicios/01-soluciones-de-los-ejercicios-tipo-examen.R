# Soluciones de los ejercicios tipo examen
# Del artículo «Intervalos de confianza — ejercicios tipo examen con plátanos, riego y averías (y el pivote exacto que cae en la EC2)»
# https://sergiolearns.com/intervalos-de-confianza-ejercicios/

# Datos de los enunciados
calibre <- c(20.0, 20.7, 20.7, 20.4, 19.2, 23.4, 21.0, 20.4, 18.5, 22.1,
             23.0, 18.9, 19.8, 19.5, 21.5, 22.3)
goteo <- c(47.6, 36.6, 42.0, 43.3, 32.0, 48.2, 42.5, 42.8, 36.0, 39.7, 40.3, 36.8, 42.4, 28.7)
asper <- c(24.9, 42.8, 40.2, 41.3, 31.4, 40.4, 33.6, 33.7, 30.8, 37.0, 46.6, 36.4, 30.7)
cinta <- c(25.3, 17.3, 39.9, 0.9, 1.7, 9.5, 9.4, 4.4, 81.8, 0.9, 30.1, 14.4)

# ---- Ejercicio 1

**1.** Con σ conocida, el pivote es \( Z = (\bar X - \mu)/(\sigma/\sqrt n) \sim N(0,1) \) y el intervalo, \( \bar x \pm z_{1-\alpha/2}\,\sigma/\sqrt n \). Al 90 %, \( \alpha = 0{,}10 \) y el cuantil es \( z_{0{,}95} \).

```r
n <- length(calibre); alpha <- 0.10
margen <- qnorm(1 - alpha / 2) * 1.8 / sqrt(n)
round(c(media = mean(calibre), z = qnorm(1 - alpha / 2), margen = margen), 3)
round(mean(calibre) + c(-1, 1) * margen, 2)
```

@@RUN@@

El margen es \( 1{,}645 \cdot 1{,}8/\sqrt{16} = 1{,}645 \cdot 0{,}45 = 0{,}74 \) cm y el intervalo, **(19,97; 21,45) cm**: con un 90 % de confianza, el calibre medio de la partida está entre 19,97 y 21,45 cm.

**2.** Con σ desconocida, \( T = (\bar X - \mu)/(S/\sqrt n) \sim t(n-1) \) y el intervalo es \( \bar x \pm t_{15,\,0{,}975}\,s/\sqrt n \).

```r
s <- sd(calibre)
round(c(s = s, t = qt(0.975, n - 1)), 3)
round(mean(calibre) + c(-1, 1) * qt(0.975, n - 1) * s / sqrt(n), 2)
round(t.test(calibre, conf.level = 0.95)$conf.int, 2)
```

@@RUN@@

**(19,95; 21,48) cm**, igual con la fórmula y con `t.test`. Es más ancho que si usáramos \( z_{0{,}975} = 1{,}96 \) con la misma s, porque el cuantil de la t(15) es 2,131: al estimar σ con S se añade incertidumbre, y la t, con colas más gordas, la recoge. Si usaras z con s, el intervalo prometería un 95 % y acertaría menos (lo medimos en la práctica).

**3.** El pivote es \( (n-1)S^2/\sigma^2 \sim \chi^2(15) \) y el intervalo, \( \big(15 s^2/q_{0{,}975},\ 15 s^2/q_{0{,}025}\big) \), con el cuantil grande abajo.

```r
q <- qchisq(c(0.975, 0.025), n - 1)
round(c(s2 = var(calibre), q_grande = q[1], q_chico = q[2]), 3)
round((n - 1) * var(calibre) / q, 2)            # sigma^2
round(sqrt((n - 1) * var(calibre) / q), 2)      # sigma
```

@@RUN@@

Para \( \sigma^2 \), **(1,13; 4,96) cm²**, y para σ, **(1,06; 2,23) cm**. El valor σ = 1,8 está dentro del intervalo de σ, así que los datos son coherentes con él (aunque la s de esta partida, 1,44, salga más baja).

**4.** Por la fórmula del tamaño muestral, \( n \ge (z_{0{,}975}\,\sigma/\delta)^2 \):

```r
(qnorm(0.975) * 1.8 / 0.5)^2
ceiling((qnorm(0.975) * 1.8 / 0.5)^2)
```

@@RUN@@

\( (1{,}96 \cdot 1{,}8/0{,}5)^2 = 49{,}79 \), así que hacen falta **50 plátanos** (siempre hacia arriba).

**Cómo se corrige** (orientativo, no oficial): 1) cuantil \( z_{0{,}95} \) bien elegido 1, intervalo y margen 1. 2) fórmula con t y 15 grados 1, intervalo 1, la explicación del ancho 1. 3) cuantiles en su sitio 1, intervalo de \( \sigma^2 \) 1, el de σ y la coherencia 1. 4) fórmula 1, el 50 redondeando hacia arriba 1.

### Ejercicio 2

**1.** Con R, al 90 %:

```r
m <- length(goteo); n <- length(asper)
round(c(m = m, n = n, s2_goteo = var(goteo), s2_asper = var(asper),
        cociente = var(goteo) / var(asper)), 3)
round(qf(c(0.95, 0.05), m - 1, n - 1), 3)
round(var.test(goteo, asper, conf.level = 0.90)$conf.int, 2)
```

@@RUN@@

El cociente de las varianzas de la muestra es 29,948/36,263 = 0,826 y el intervalo, **(0,31; 2,15)**. Contiene al 1: con un 90 % de confianza se pueden suponer varianzas iguales.

**2.** Con \( f_p \) los cuantiles de la \( F(13, 12) \), por ser F un pivote:

\[ P\left(f_{\alpha/2} \le \frac{S_1^2}{S_2^2}\cdot\frac{\sigma_2^2}{\sigma_1^2} \le f_{1-\alpha/2}\right) = 1-\alpha \]

Dividiendo los tres miembros entre \( S_1^2/S_2^2 > 0 \) (no cambia el sentido):

\[ \frac{S_2^2}{S_1^2}f_{\alpha/2} \le \frac{\sigma_2^2}{\sigma_1^2} \le \frac{S_2^2}{S_1^2}f_{1-\alpha/2} \]

Los tres son positivos; al tomar inversos, las desigualdades se invierten:

\[ \frac{S_1^2}{S_2^2}\cdot\frac{1}{f_{1-\alpha/2}} \le \frac{\sigma_1^2}{\sigma_2^2} \le \frac{S_1^2}{S_2^2}\cdot\frac{1}{f_{\alpha/2}} \]

Comprobación con los números del apartado 1: 0,826/2,660 = 0,31 y 0,826/0,384 = 2,15.

**3.** Con \( s_p^2 = \frac{13 s_1^2 + 12 s_2^2}{25} \) y la t(25):

```r
sp2 <- ((m - 1) * var(goteo) + (n - 1) * var(asper)) / (m + n - 2)
round(c(dif = mean(goteo) - mean(asper), sp2 = sp2, sp = sqrt(sp2), t = qt(0.975, m + n - 2)), 3)
round((mean(goteo) - mean(asper)) + c(-1, 1) * qt(0.975, m + n - 2) * sqrt(sp2 * (1 / m + 1 / n)), 2)
round(t.test(goteo, asper, var.equal = TRUE)$conf.int, 2)
```

@@RUN@@

\( s_p = 5{,}743 \) kg y el cuantil es 2,060. El margen es \( 2{,}060 \cdot 5{,}743 \cdot \sqrt{1/14 + 1/13} = 2{,}060 \cdot 5{,}743 \cdot 0{,}385 = 4{,}55 \), y el intervalo, **(−0,77; 8,34) kg**, el mismo con `t.test`.

**4.**

```r
round(t.test(goteo, asper)$conf.int, 2)
round(t.test(goteo, asper)$parameter, 2)
```

@@RUN@@

Welch da **(−0,80; 8,36)**, casi igual (con 24,28 grados de libertad en lugar de 25): como las varianzas son parecidas, da lo mismo un método que otro. Los dos intervalos **contienen al 0**: aunque en la muestra el goteo produce 3,78 kg más por planta, con un 95 % de confianza los datos no permiten afirmar que produzca más. Hacen falta más plantas.

**5.** Con muestras de igual tamaño n y la aproximación normal, el margen es \( z\,\sigma\sqrt{2/n} \). Imponiendo que no pase de δ = 2:

\[ z\,\sigma\sqrt{\frac2n} \le \delta \iff n \ge 2\left(\frac{z\,\sigma}{\delta}\right)^2 \]

```r
2 * (qnorm(0.975) * sqrt(sp2) / 2)^2
ceiling(2 * (qnorm(0.975) * sqrt(sp2) / 2)^2)
```

@@RUN@@

\( 2(1{,}96 \cdot 5{,}743/2)^2 = 63{,}34 \): **64 plantas por grupo**, unas 128 en total.

**Cómo se corrige** (orientativo, no oficial): 1) intervalo 2, conclusión 1. 2) planteamiento con el pivote 1, división 1, inversión con el cambio de sentido 2. 3) \( s_p \) y cuantil 1, intervalo 1, comprobación 1. 4) Welch 1, conclusión con el 0 1. 5) margen con igual n 1, despeje 1, 64 hacia arriba 1.

### Ejercicio 3

**1.** La fgm de la exponencial es \( M_X(s) = E(e^{sX}) = \int_0^\infty \lambda e^{-(\lambda - s)x}\,dx = \frac{\lambda}{\lambda - s} \), para \( s < \lambda \). Como las \( X_i \) son independientes, la fgm de la suma es el producto:

\[ M_T(s) = \prod_{i=1}^{n} \frac{\lambda}{\lambda - s} = \left(\frac{\lambda}{\lambda - s}\right)^n \]

que es la fgm de una gamma\( (n, \lambda) \). Por la unicidad de la fgm, \( T \sim \text{gamma}(n,\lambda) \).

**2.** Con \( f_T(t) = \frac{\lambda^n}{\Gamma(n)}t^{n-1}e^{-\lambda t} \) y \( U = 2\lambda T \), la inversa es \( t = u/(2\lambda) \) con derivada \( 1/(2\lambda) \):

\[ f_U(u) = f_T\!\left(\frac{u}{2\lambda}\right)\frac{1}{2\lambda} = \frac{\lambda^n}{\Gamma(n)}\frac{u^{n-1}}{(2\lambda)^{n-1}}e^{-u/2}\frac{1}{2\lambda} = \frac{1}{2^n\Gamma(n)}u^{n-1}e^{-u/2},\quad u > 0 \]

Es la gamma\( (n, 1/2) \), es decir, una \( \chi^2(2n) \). No depende de λ.

**3.** U depende de la muestra y de λ, y su distribución no depende de λ: es un pivote. Con \( q_p \) los cuantiles de la \( \chi^2(2n) \):

\[ P\left(q_{\alpha/2} \le 2\lambda T \le q_{1-\alpha/2}\right) = 1-\alpha \iff P\left(\frac{q_{\alpha/2}}{2T} \le \lambda \le \frac{q_{1-\alpha/2}}{2T}\right) = 1-\alpha \]

Para \( 1/\lambda \), tomando inversos (se invierte el sentido): \( \left(\frac{2T}{q_{1-\alpha/2}},\ \frac{2T}{q_{\alpha/2}}\right) \).

**4.** El EMV es \( \hat\lambda = 1/\bar X = n/T \). Con \( i(\lambda) = 1/\lambda^2 \), su varianza asintótica es \( 1/(n\,i(\lambda)) = \lambda^2/n \), y cambiando λ por \( \hat\lambda \):

\[ \frac{\hat\lambda - \lambda}{\hat\lambda/\sqrt n} \approx N(0, 1) \implies \hat\lambda \pm z_{1-\alpha/2}\frac{\hat\lambda}{\sqrt n} \]

**5.** Al 90 %, con n = 12 los cuantiles son de la \( \chi^2(24) \):

```r
n <- length(cinta); T <- sum(cinta); lambda <- n / T
round(c(T = T, media = mean(cinta), lambda = lambda), 4)
q <- qchisq(c(0.05, 0.95), 2 * n)                     # 2n = 24 grados
round(q, 3)
round(q / (2 * T), 4)                                 # exacto, lambda
round(2 * T / rev(q), 2)                              # exacto, 1/lambda
asin <- lambda + c(-1, 1) * qnorm(0.95) * lambda / sqrt(n)
round(asin, 4)                                        # asintótico, lambda
round(1 / rev(asin), 2)                               # asintótico, 1/lambda
```

@@RUN@@

@@SVG e11-cinta@@

| Intervalo al 90 % | λ (averías por hora) | 1/λ (horas) |
|---|---|---|
| Exacto | (0,0294; 0,0773) | (12,94; 34,03) |
| Asintótico | (0,0267; 0,0751) | (13,31; 37,38) |

Con 12 datos me fío más del **exacto**: su confianza es la que dice para cualquier n, porque U tiene exactamente una \( \chi^2(24) \). El asintótico se apoya en que \( \hat\lambda \) sea casi normal, y con 12 datos \( \hat\lambda = 1/\bar X \) todavía es asimétrico; en el dibujo se ve que el exacto está desplazado a la derecha respecto al asintótico, que es simétrico alrededor de \( \hat\lambda = 0{,}0509 \). En la media, entre 12,94 y 34,03 horas entre averías con un 90 % de confianza.

**Cómo se corrige** (orientativo, no oficial): 1) fgm de la exponencial 1, producto por independencia 1, identificación y unicidad 1. 2) cambio de variable con el jacobiano 2, identificar la \( \chi^2(2n) \) 1. 3) pivote y despeje de λ 2, intervalo de 1/λ 1. 4) varianza asintótica 1, intervalo 1. 5) exacto con 24 grados 1,5, asintótico 1, intervalos de la media 0,5, elección razonada 1.

### Bonus

```r
p1 <- 18 / 150; p2 <- 29 / 160
round(c(p1 = p1, p2 = p2, dif = p1 - p2), 4)
c(150 * p1, 150 * (1 - p1), 160 * p2, 160 * (1 - p2))     # condiciones: todas >= 5
round((p1 - p2) + c(-1, 1) * qnorm(0.995) * sqrt(p1 * (1 - p1) / 150 + p2 * (1 - p2) / 160), 3)
round(prop.test(c(18, 29), c(150, 160), conf.level = 0.99)$conf.int, 3)
```

@@RUN@@

\( \hat p_1 = 0{,}12 \), \( \hat p_2 = 0{,}181 \) y las cuatro cantidades (18, 132, 29, 131) pasan de 5. El intervalo al 99 % es **(−0,165; 0,043)**, y con `prop.test`, (−0,172; 0,049), algo más ancho por la corrección. Los dos contienen al 0: con un 99 % de confianza no se puede decir que un turno rechace más que el otro.

**Cómo se corrige** (orientativo, no oficial): proporciones y condiciones 0,5, cuantil \( z_{0{,}995} \) 0,5, intervalo 1, `prop.test` y conclusión 0,5.

 ----
