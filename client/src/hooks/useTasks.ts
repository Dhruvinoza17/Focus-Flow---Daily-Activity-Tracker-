import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../contexts/authStore';

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string; // Firestore ID
    title: string;
    category: 'Learning' | 'Fitness' | 'Work' | 'Personal';
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Completed';
    date: string; // ISO String
    timeEstimate?: number;
    userId: string;
    createdAt: string;
    subtasks?: SubTask[];
}

export const useTasks = (date?: Date) => {
    const { user } = useAuthStore();
    const dateStr = date ? date.toISOString().split('T')[0] : null;

    return useQuery({
        queryKey: ['tasks', dateStr],
        queryFn: async () => {
            if (!user) return [];

            const tasksRef = collection(db, 'tasks');
            let q = query(
                tasksRef,
                where('userId', '==', user.uid)
            );

            if (dateStr) {
                q = query(
                    tasksRef,
                    where('userId', '==', user.uid),
                    where('date', '==', dateStr)
                );
            }

            const snapshot = await getDocs(q);
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];

            // Client-side sort to avoid Firestore index requirements
            return tasks.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        },
        enabled: !!user
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (newTask: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status'>) => {
            if (!user) throw new Error("User not authenticated");

            const taskData = {
                ...newTask,
                userId: user.uid,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'tasks'), taskData);
            return { id: docRef.id, ...taskData };
        },
        onSuccess: (_, variables) => {
            // Invalidate queries for the specific date
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.date] });
            queryClient.invalidateQueries({ queryKey: ['tasks', null] }); // Invalidate "all tasks" if we had that query
            queryClient.invalidateQueries({ queryKey: ['habitHeatmap'] });
        }
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
            const taskRef = doc(db, 'tasks', id);
            await updateDoc(taskRef, updates);
            return { id, ...updates };
        },
        onSuccess: () => {
            // We'd ideally need the date to invalidate the specific query, but iterating all active queries is safer or carrying date in variables
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['habitHeatmap'] });
        }
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteDoc(doc(db, 'tasks', id));
            return id;
        },
        onSuccess: () => {
            // Ideally invalidate usage based on date if we had it, but simpler to invalidate all tasks
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['habitHeatmap'] });
        }
    });
};
