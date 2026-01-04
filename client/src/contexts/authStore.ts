import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    accentColor?: string;
}

interface AuthState {
    user: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    initialize: () => () => void; // Returns unsubscribe
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    isAuthenticated: false,
    logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
    },
    initialize: () => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional profile data from Firestore if needed
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                const userData = userDoc.data();

                set({
                    user: {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || userData?.name,
                        accentColor: userData?.accentColor || '#14B8A6'
                    },
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        });
    }
}));
