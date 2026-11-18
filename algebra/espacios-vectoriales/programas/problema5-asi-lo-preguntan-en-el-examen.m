% Problema 5: así lo preguntan en el examen
% Del artículo «Espacios vectoriales — práctica guiada con colores: independencia, cambio de base, vectores originales y el ejercicio de subespacios del examen (y la base que no salía de rref)»
% https://sergiolearns.com/espacios-vectoriales-practica/

U1 = [1 -1 1 0; 0 1 1 -1];                       % implícitas de U1
S2 = [1 0 1 1; 0 1 1 0; 1 1 2 1; 2 1 3 1];        % generadores de U2
B1 = null(U1, 'r')'                              % base de U1 (en filas)
[R2, p2] = rref(S2');  B2 = S2(p2, :)            % base de U2 con vectores originales
rank([B1; B2])                                   % dim(U1 + U2)
null([U1; 1 1 -1 0], 'r')'                       % base de la intersección
