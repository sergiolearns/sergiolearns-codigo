format short
[Q,R] = qr([1 2;3 4])
[L,U,P] = lu([1 2;3 4])
[L2,U2] = lu([1 2;3 4])
null([1 2;2 4])
orth([1 2;2 4])
rank(magic(4))
A=[4 1;2 3]; [V,D]=eig(A)
B=[1 2 0;0 1 0;2 -1 3]; [V2,D2]=eig(B)
eig([2 0 0;1 2 0;0 0 3])
eig([1 1;-1 1])
norm([1 2;3 4])
norm([1 2;3 4],1), norm([1 2;3 4],'fro'), norm([1 2;3 4],Inf)
trace(magic(3)), diag([1 2 3]), diag(magic(3))'
triu(magic(3)), kron([1 2],[1;1])
v = 0:0.25:1
x = 1:0
sum([1 2;3 4]), prod([1 2 3 4]), mean([1 2;3 4])
[m,i] = min([4 2 8])
sort([3 1 2],'descend')
find([0 1 0 1])
A = magic(4); A(2:3,[1 4])
A(end,:)
num2str(pi), num2str(2), num2str(1/3), mat2str([1.5 -2; 0 3])
fprintf('%d %5.2f %s\n', 3, pi, 'hola')
disp([1 2;3 4]), disp(pi), disp('texto')
format long
[1/3 2/3]
format short
1e10
[1e-5 1]
[1 NaN Inf]
-Inf
c = 1:3 == 2
r = rref([1 2 3;4 5 6;7 8 10])
inv([1 2;2 4])
x = [1 2 3]/[4 5 6]
y = [1 2;3 4]\[5;6]
ls = [1 1;1 2;1 3]\[1;2;2]
pinv([1 2;2 4])
cond([1 2;3 4])
det(magic(3))
poly([1 2;3 4])
roots([1 -3 2])
polyval([1 -3 2], 4)
cross([1 2 3],[4 5 6])
dot([1 2 3],[4 5 6])
abs(-3+4i), conj(2+3i), real(2+3i), imag(2+3i)
sqrt(-4)
(-8)^(1/3)
exp(1i*pi)
z = [1+2i; 3-4i]
z'
z.'
a = 2; a(3) = 5
b = []; b(2,3) = 1
