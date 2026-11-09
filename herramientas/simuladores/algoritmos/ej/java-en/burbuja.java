import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] items) {
        int n = items.length;
        for (int lap = 0; lap < n - 1; lap++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - lap; j++) {
                if (items[j] > items[j + 1]) {
                    int tmp = items[j];
                    items[j] = items[j + 1];
                    items[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        bubbleSort(marks);
        System.out.println(Arrays.toString(marks));
    }
}
