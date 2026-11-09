def quick_sort(items, low, high):
    if low < high:
        p = partition(items, low, high)
        quick_sort(items, low, p - 1)
        quick_sort(items, p + 1, high)


def partition(items, low, high):
    pivot = items[high]
    i = low
    for j in range(low, high):
        if items[j] <= pivot:
            items[i], items[j] = items[j], items[i]
            i = i + 1
    items[i], items[high] = items[high], items[i]
    return i


marks = [7, 3, 9, 5, 10, 4, 8, 6]
quick_sort(marks, 0, len(marks) - 1)
print(marks)
