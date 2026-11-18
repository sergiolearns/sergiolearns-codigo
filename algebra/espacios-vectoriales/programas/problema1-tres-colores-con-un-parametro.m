% Problema 1: tres colores con un parámetro
% Del artículo «Espacios vectoriales — práctica guiada con colores: independencia, cambio de base, vectores originales y el ejercicio de subespacios del examen (y la base que no salía de rref)»
% https://sergiolearns.com/espacios-vectoriales-practica/

format rat
syms k
det([1 2 0; 0 1 1; 2 k 1])      % el determinante en función de k
A = [1 2 0; 0 1 1; 2 0 1];       % los vectores con k = 0, por filas
A' \ [3; 4; 3]                   % coordenadas: los vectores, por columnas
