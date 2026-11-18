% Todos los ejemplos del artículo, en orden (necesita las funciones de esta carpeta)
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
precios = [1.20 0.95 4.50];
coste([2 6 1], precios)            % el ticket 1
t3 = coste([3 2 1], precios);      % con ; no se enseña
t3

[total, caro] = analizar_ticket([1 4 2], precios)
solo_total = analizar_ticket([1 4 2], precios)

coste_iva([2 6 1], precios)          % con el 7 % por defecto
coste_iva([2 6 1], precios, 0)       % sin impuesto

A = [2 6 1; 1 4 2; 3 2 1];
b = [12.60; 14.00; 10.00];
M = [A b];               % la matriz ampliada (A | b)
M([1 3], :) = M([3 1], :)

col = [0; -7; 3; 5];
[mayor, p] = max(abs(col(2:end)))   % p cuenta desde la fila 2
p = p + 1                            % posición en la columna entera

M = [A b];
M(1,:) = M(1,:) / M(1,1);             % pivote de la columna 1 a 1
M(2,:) = M(2,:) - M(2,1)*M(1,:);      % ceros en la columna 1
M(3,:) = M(3,:) - M(3,1)*M(1,:);
M(2,:) = M(2,:) / M(2,2);             % columna 2
M(1,:) = M(1,:) - M(1,2)*M(2,:);
M(3,:) = M(3,:) - M(3,2)*M(2,:);
M(3,:) = M(3,:) / M(3,3);             % columna 3
M(1,:) = M(1,:) - M(1,3)*M(3,:);
M(2,:) = M(2,:) - M(2,3)*M(3,:);
precios = M(:, end)'

gj_simple([A b])

T = [0 5 1 9.25; 1 4 2 14; 3 2 1 10];
gj_simple(T)

[R, piv] = gauss_jordan(T)

[R1, piv1] = gauss_jordan([A b]);
[R2, piv2] = rref([A b]);
diferencia = norm(R1 - R2)
mismos_pivotes = isequal(piv1, piv2)
x = A \ b;
residuo = norm(A*x - b)

[x, tipo] = resolver(A, b)
[x, tipo] = resolver([1 1; 2 2], [3; 6])
[x, tipo] = resolver([A; 1 1 1], [b; 6.70])

[d, llamadas] = det_cofactores(A)
det(A)

for n = 2:7
    [~, c] = det_cofactores(ones(n));
    fprintf('Orden %d: %5d llamadas\n', n, c);
end

det(magic(4))
det_cofactores(magic(4))
