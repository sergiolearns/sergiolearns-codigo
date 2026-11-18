% Ejercicio 1: girar, estirar y cizallar el sticker
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

cas = [0 2 2 1 0 0; 0 0 2 3 2 0];

R = [cosd(90) -sind(90); sind(90) cosd(90)]
E = [2 0; 0 1];
C = [1 0.5; 0 1];
techo = [1; 3];
R*techo, E*techo, C*techo
det(R), det(E), det(C)
isequal(R*E, E*R)
