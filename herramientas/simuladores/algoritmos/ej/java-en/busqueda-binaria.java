public class Main {
    static int binarySearch(int[] items, int target) {
        int low = 0;
        int high = items.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (items[mid] == target) {
                return mid;
            } else if (items[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] tickets = {3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85, 90};
        int target = 58;
        System.out.println("Ticket at position " + binarySearch(tickets, target));
    }
}
