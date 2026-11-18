% Prueba en el entorno de MATLAB
% Del artículo «Espacios vectoriales — práctica guiada con colores: independencia, cambio de base, vectores originales y el ejercicio de subespacios del examen (y la base que no salía de rref)»
% https://sergiolearns.com/espacios-vectoriales-practica/

format rat
U1 = [1 -1 1 0; 0 1 1 -1];                  % implícitas de U1 (una fila por ecuación)
S2 = [1 0 1 1; 0 1 1 0; 1 1 2 1; 2 1 3 1];   % generadores de U2 (uno por fila)
B1 = null(U1, 'r')';
[R2, p2] = rref(S2'); B2 = S2(p2, :);
E2 = null(B2, 'r')'                          % implícitas de U2: una fila por ecuación
dim_suma = rank([B1; B2])
dim_inter = size(B1, 1) + size(B2, 1) - dim_suma   % Grassmann
