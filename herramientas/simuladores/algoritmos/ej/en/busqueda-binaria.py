def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


tickets = [3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90]
target = 58
print("Ticket at position", binary_search(tickets, target))
