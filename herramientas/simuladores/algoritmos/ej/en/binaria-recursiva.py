def find(items, target):
    return find_between(items, target, 0, len(items) - 1)


def find_between(items, target, low, high):
    if low > high:
        return -1
    mid = (low + high) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return find_between(items, target, mid + 1, high)
    return find_between(items, target, low, mid - 1)


tickets = [3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90]
target = 17
print("Ticket at position", find(tickets, target))
