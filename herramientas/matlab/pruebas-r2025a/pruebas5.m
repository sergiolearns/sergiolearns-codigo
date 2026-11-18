format short
A=[2 -1 0;1 3 -1;1 0 1]; B=[-7;5;0];
syms x y z real
sol=solve(2*x-y==-7,x+3*y-z==5,x+z==0,[x y z])
sol.x
X=[x y z]';
sol2=solve(A*X==B)
S=[sol.x;sol.y;sol.z]
A*S
A2=[1 2 -1;1 1 1;2 3 0];
syms z real; x=-3*z+2;y=2*z-1;
sol=[x;y;z]
A2*subs(sol,z,0)
syms x y
e = solve(x+y==1, x-y==3)
p = solve(x^2-5*x+6==0, x)
r = solve(x^2-2==0, x)
q = solve(x^2+1==0,x)
syms l
A=[2 1;1 2];
det(A-l*eye(2))
charpoly(A,l)
eig(sym(A))
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
syms a b c real
s = solve(a + 2*b - c == 0, a + b + c == 1, [a b c])
