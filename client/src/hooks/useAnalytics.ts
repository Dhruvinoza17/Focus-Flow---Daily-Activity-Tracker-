import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../contexts/authStore';

export const useHabitHeatmap = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['habitHeatmap'],
        queryFn: async () => {
            if (!user) return [];

            const tasksRef = collection(db, 'tasks');
            const q = query(
                tasksRef,
                where('userId', '==', user.uid),
                where('status', '==', 'Completed'),
                // where('date', '>=', startStr) // Requires composite index. Omitting for simplicity in MVP.
            );

            const snapshot = await getDocs(q);

            // Client-side aggregation
            const heatmapData: { [key: string]: number } = {};

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.date) {
                    // Ensure date strings are consistently formatted YYYY-MM-DD
                    const dateStr = data.date.split('T')[0];
                    heatmapData[dateStr] = (heatmapData[dateStr] || 0) + 1;
                }
            });

            return Object.entries(heatmapData).map(([date, count]) => ({ date, count }));
        },
        enabled: !!user
    });
};
