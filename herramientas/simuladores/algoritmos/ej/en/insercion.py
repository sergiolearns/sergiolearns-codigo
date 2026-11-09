def insertion_sort(items):
    for i in range(1, len(items)):
        key = items[i]
        j = i - 1
        while j >= 0 and items[j] > key:
            items[j + 1] = items[j]
            j = j - 1
        items[j + 1] = key


marks = [7, 3, 9, 5, 10, 4, 8, 6]
insertion_sort(marks)
print(marks)
