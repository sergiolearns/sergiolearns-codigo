format short
A=[2 -1 0;1 3 -1;1 0 1]; B=[-7;5;0]; AB=[A B]
p=rank(A), q=rank(AB), n=size(A,2)
x=A\B
rref(AB)
format rat
[~,U]=lu(AB)
format short
A2=[1 2 -1;1 1 1;2 3 0];B2=[0;1;1];AB2=[A2 B2];
rref(AB2)
S=[1 2 -1;2 -1 -2;-1 0 -5]; null(S,'r')
S=[1 1 1 0;-1 0 0 1]; null(S,'r')
format rat; S=[1 2 -1 0]; null(S,'r')
format short
A=[2 1;1 2]; [V,D]=eig(A)
eig([1 2;3 4])
eig([0 -1;1 0])
x = 1.5
v = [1.5 2.25 -3]
w = [1000.5 2]
det([1 2;3 4])
inv([1 2;3 4])
z = 3+4i
abs(z), angle(z)
[1+2i 3-1i]
format long
pi
format short
A=[2 1;1 2];
A=[0 0 -2;1 2 1;1 0 3]; eig(A)
D=det([5 0 5;-5 3 -8;2 0 2])
v = linspace(1,10,5)
w2 = [1000 2]
w3 = [100 -2]
w4 = [123456 1]
k = 0.001
k2 = [0.001 0.5]
k3 = 1e-5
k4 = 123456.789
L = [true false true]
s = 'hola'
E = zeros(3,0)
E2 = []
f = @(x) x.^2+1
c = {1, 'dos'}
st.a = 1; st.b = [1 2 3]
format rat
[1/3 0.25; -2 7]
1/3
format short
M = magic(3); M/7
-0.5
[1 -1]*0.5
