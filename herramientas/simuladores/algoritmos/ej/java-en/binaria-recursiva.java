public class Main {
    static int find(int[] items, int target) {
        return findBetween(items, target, 0, items.length - 1);
    }

    static int findBetween(int[] items, int target, int low, int high) {
        if (low > high) {
            return -1;
        }
        int mid = (low + high) / 2;
        if (items[mid] == target) {
            return mid;
        }
        if (items[mid] < target) {
            return findBetween(items, target, mid + 1, high);
        }
        return findBetween(items, target, low, mid - 1);
    }

    public static void main(String[] args) {
        int[] tickets = {3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90};
        int target = 17;
        System.out.println("Ticket at position " + find(tickets, target));
    }
}
