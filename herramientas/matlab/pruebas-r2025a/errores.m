msgs = {};
try, [1 2]*[3 4]; catch e, disp(e.message); end
try, [1 2]+[1 2 3]; catch e, disp(e.message); end
try, v=[1 2 3]; v(5); catch e, disp(e.message); end
try, v=[1 2 3]; v(0); catch e, disp(e.message); end
try, v=[1 2 3]; v(1.5); catch e, disp(e.message); end
try, A=magic(3); A(4,1); catch e, disp(e.message); end
try, noexiste + 1; catch e, disp(e.message); end
try, det([1 2 3]); catch e, disp(e.message); end
try, inv([1 2 3]); catch e, disp(e.message); end
try, [1 2; 3]; catch e, disp(e.message); end
try, [[1;2] [1;2;3]]; catch e, disp(e.message); end
try, A=[1 2;3 4]; A^0.5; catch e, disp(e.message); end
try, [1 2 3]^2; catch e, disp(e.message); end
try, eig([1 2 3]); catch e, disp(e.message); end
try, A=[1 2;3 4]; b=[1;2;3]; A\b; catch e, disp(e.message); end
try, x = 1; x(2,:) = [1 2]; catch e, disp(e.message); end
try, s.a = 1; s.b; catch e, disp(e.message); end
try, cross([1 2],[3 4]); catch e, disp(e.message); end
try, dot([1 2],[1 2 3]); catch e, disp(e.message); end
try, rank(); catch e, disp(e.message); end
try, eval('x = [1 2 3](2)'); catch e, disp(e.message); end
try, eval('x = (1 + 2'); catch e, disp(e.message); end
try, eval('x = 1 +'); catch e, disp(e.message); end
try, eval('if x > 1, disp(1)'); catch e, disp(e.message); end
try, eval('y = 3 3'); catch e, disp(e.message); end
try, eval('A(1,2 = 3'); catch e, disp(e.message); end
try, eval('disp(''hola)'); catch e, disp(e.message); end
try, eval('plott(1:3)'); catch e, disp(e.message); end
try, eval('Rref([1 2;3 4])'); catch e, disp(e.message); end
