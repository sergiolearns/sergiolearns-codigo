def bubble_sort(items):
    n = len(items)
    for lap in range(n - 1):
        swapped = False
        for j in range(n - 1 - lap):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            break


marks = [7, 3, 9, 5, 10, 4, 8, 6]
bubble_sort(marks)
print(marks)
