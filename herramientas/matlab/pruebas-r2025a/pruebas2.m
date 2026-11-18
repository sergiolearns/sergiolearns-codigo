format short
syms x y z t real
A=[1 2 -1 0;1 1 1 1]; X=[x;y;z;t]; B=[0;1];
sol=solve(A*X==B,[x y z t])
syms a
p = a^2 - 3*a + 2
q = (3*a)/2 - a/2 + 1/3
M = sym([1 2;3 4])
inv(M)
det(M)
rref(sym([1 2 3;4 5 6]))
v = [1;0;1]; u = [0;0;1];
c = dot(u,v)/(norm(u)*norm(v))
cross(u,v)
nrm = norm([2 -3])
[Q,R] = qr([1 2;3 4])
[L,U,P] = lu([1 2;3 4])
null([1 2;2 4])
orth([1 2;2 4])
rank(magic(4))
A=[4 1;2 3]; [V,D]=eig(A)
