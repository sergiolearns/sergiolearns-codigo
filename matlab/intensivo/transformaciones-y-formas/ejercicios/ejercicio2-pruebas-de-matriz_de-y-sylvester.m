% Ejercicio 2: pruebas de matriz_de y sylvester
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

C = matriz_de(@(v) [v(1) + 0.5*v(2); v(2)], 2)
sylvester([2 -1; -1 3])
sylvester([0 1; 1 0])
sylvester([1 2; 2 4])
