% Todos los ejemplos del artículo, en orden (necesita las funciones de esta carpeta)
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
sofa = [0 2 2   0   0;      % x de las esquinas (y vuelta a la primera)
        0 0 0.9 0.9 0];     % y de las esquinas
size(sofa)

estirar = @(v) [1.5*v(1); v(2)];                 % 50 % más largo en x
cizalla = @(v) [v(1) + 0.5*v(2); v(2)];          % inclinar hacia la derecha
espejo  = @(v) [v(2); v(1)];                     % simetría respecto a y = x
girar30 = @(v) [cosd(30)*v(1) - sind(30)*v(2);   % giro de 30 grados
                sind(30)*v(1) + cosd(30)*v(2)];
mover   = @(v) v + [1; 0];                       % trasladar un metro a la derecha
cizalla([2; 0.9])

C = matriz_de(cizalla, 2)
G = matriz_de(girar30, 2)
E = matriz_de(espejo, 2)

es_lineal(cizalla, 2)
es_lineal(girar30, 2)
es_lineal(mover, 2)
M = matriz_de(mover, 2)

nuevo = C * sofa                  % todas las esquinas con la cizalla
con_bucle = zeros(size(sofa));
for k = 1:size(sofa, 2)
    con_bucle(:, k) = cizalla(sofa(:, k));   % una a una, con la regla
end
diferencia = norm(nuevo - con_bucle)

figure
fill(sofa(1,:), sofa(2,:), 'b', 'FaceAlpha', 0.3)     % antes
hold on
fill(nuevo(1,:), nuevo(2,:), 'r', 'FaceAlpha', 0.3)   % después
quiver([0 0], [0 0], C(1,:), C(2,:), 0, 'k')          % las columnas de C
axis equal
grid on
legend('antes', 'después', 'columnas de C')
title('El sofá con la cizalla')
xlabel('x (m)'), ylabel('y (m)')

figure
dibujar_cuadricula(G)
title('El giro de 30 grados deforma la cuadrícula')

A = [2 1; 1 2];
[P, D] = eig(A)
comprobacion = norm(A*P - P*D)

A10 = potencia_diag(A, 10)
diferencia = norm(A10 - A^10) / norm(A^10)

formas = {[2 1; 1 2], [-3 1; 1 -2], [1 2; 2 1], [1 1; 1 1]};
for k = 1:numel(formas)
    F = formas{k};
    fprintf('%-20s %-22s %s\n', mat2str(F), clasificar(F), clasificar_eig(F));
end
