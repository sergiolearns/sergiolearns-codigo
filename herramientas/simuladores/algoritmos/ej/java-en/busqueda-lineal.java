public class Main {
    static int find(int[] items, int target) {
        for (int i = 0; i < items.length; i++) {
            if (items[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        int target = 10;
        System.out.println("Found at position " + find(marks, target));
    }
}
