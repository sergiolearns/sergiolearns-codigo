def find(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1


marks = [7, 3, 9, 5, 10, 4, 8, 6]
target = 10
print("Found at position", find(marks, target))
