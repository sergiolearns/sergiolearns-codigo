import java.util.Arrays;

public class Main {
    static void selectionSort(int[] items) {
        int n = items.length;
        for (int i = 0; i < n - 1; i++) {
            int iMin = i;
            for (int j = i + 1; j < n; j++) {
                if (items[j] < items[iMin]) {
                    iMin = j;
                }
            }
            int tmp = items[i];
            items[i] = items[iMin];
            items[iMin] = tmp;
        }
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        selectionSort(marks);
        System.out.println(Arrays.toString(marks));
    }
}
