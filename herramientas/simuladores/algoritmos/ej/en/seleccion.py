def selection_sort(items):
    n = len(items)
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            if items[j] < items[i_min]:
                i_min = j
        items[i], items[i_min] = items[i_min], items[i]


marks = [7, 3, 9, 5, 10, 4, 8, 6]
selection_sort(marks)
print(marks)
