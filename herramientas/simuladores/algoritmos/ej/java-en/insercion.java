import java.util.Arrays;

public class Main {
    static void insertionSort(int[] items) {
        for (int i = 1; i < items.length; i++) {
            int key = items[i];
            int j = i - 1;
            while (j >= 0 && items[j] > key) {
                items[j + 1] = items[j];
                j = j - 1;
            }
            items[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        insertionSort(marks);
        System.out.println(Arrays.toString(marks));
    }
}
