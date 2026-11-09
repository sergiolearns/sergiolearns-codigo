import java.util.Arrays;

public class Main {
    static void quickSort(int[] items, int low, int high) {
        if (low < high) {
            int p = partition(items, low, high);
            quickSort(items, low, p - 1);
            quickSort(items, p + 1, high);
        }
    }

    static int partition(int[] items, int low, int high) {
        int pivot = items[high];
        int i = low;
        for (int j = low; j < high; j++) {
            if (items[j] <= pivot) {
                int tmp = items[i];
                items[i] = items[j];
                items[j] = tmp;
                i = i + 1;
            }
        }
        int tmp = items[i];
        items[i] = items[high];
        items[high] = tmp;
        return i;
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        quickSort(marks, 0, marks.length - 1);
        System.out.println(Arrays.toString(marks));
    }
}
