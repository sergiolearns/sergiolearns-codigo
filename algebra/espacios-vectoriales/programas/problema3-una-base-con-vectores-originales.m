% Problema 3: una base con vectores originales
% Del artículo «Espacios vectoriales — práctica guiada con colores: independencia, cambio de base, vectores originales y el ejercicio de subespacios del examen (y la base que no salía de rref)»
% https://sergiolearns.com/espacios-vectoriales-practica/

S = [1 0 2 1; 2 1 3 1; 0 -1 1 1; 0 1 0 2; 1 1 2 3];   % por filas, como se leen
rank(S)
[R, piv] = rref(S')    % S' los pone en columnas
S(piv, :)              % la base: las filas piv de S, los vectores originales
