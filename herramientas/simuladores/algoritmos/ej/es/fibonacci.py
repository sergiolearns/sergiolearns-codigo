def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


n = 5
print(f"fibonacci({n}) = {fibonacci(n)}")
