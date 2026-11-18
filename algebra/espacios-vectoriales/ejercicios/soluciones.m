% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Espacios vectoriales — ejercicios tipo examen con colores y subespacios de R⁴: bases, implícitas, Grassmann y un test como el del Campus (y el parámetro que fallé)»
% https://sergiolearns.com/espacios-vectoriales-ejercicios/

format rat
%% Ejercicio 1
S = [1 0 1; 0 1 1; 1 1 2; 1 -1 0];
rank(S)
null(S(1:2, :), 'r')'          % coeficientes de la implícita de U
%% Ejercicio 2
syms a
det([1 2 1 0; 0 1 1 1; 1 a 2 1; 1 0 0 0])   % se anula si v está en U (con a = 3)
null([1 2 1 0; 0 1 1 1; 1 0 2 1], 'r')'      % c) implícita de W con a = 0

%% Ejercicio 3
S1 = [1 -1 0 1; 0 1 1 0; 1 0 1 1; 2 -3 -1 2];
[R1, p1] = rref(S1'); B1 = S1(p1, :)       % base de U1 con vectores originales
E1 = null(B1, 'r')'                        % implícitas de U1
B2 = null([1 1 0 0; 0 1 0 1], 'r')'        % base de U2
rank([B1; B2])                             % dim(U1 + U2)
null([E1; 1 1 0 0; 0 1 0 1], 'r')'         % base de la intersección
