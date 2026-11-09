import java.util.Arrays;

public class Main {
    static int[] mergeSort(int[] items) {
        if (items.length <= 1) {
            return items;
        }
        int mid = items.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(items, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(items, mid, items.length));
        return merge(left, right);
    }

    static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0;
        int j = 0;
        int k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        while (i < left.length) {
            result[k++] = left[i++];
        }
        while (j < right.length) {
            result[k++] = right[j++];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] marks = {7, 3, 9, 5, 10, 4, 8, 6};
        marks = mergeSort(marks);
        System.out.println(Arrays.toString(marks));
    }
}
