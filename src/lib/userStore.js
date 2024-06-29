// Importing necessary modules and functions from Firebase, toastify, and Zustand
import { doc, getDoc } from "firebase/firestore"; // Functions for Firestore document operations
import { toast } from "react-toastify"; // Library for displaying toast notifications
import { create } from "zustand"; // Zustand library for state management
import { db } from "./firebase"; // Firebase database instance

// Creating a Zustand store for managing user state
export const useUserStore = create((set) => ({
  // Initial state for the current user
  currentUser: null,

  // Initial loading state
  isLoading: true,

  // Function to fetch user information based on user ID (uid)
  fetchUserInfo: async (uid) => {
    // If no user ID is provided, set current user to null and loading to false
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      // Reference to the user document in Firestore
      const docRef = doc(db, "users", uid);

      // Fetch the document snapshot
      const docSnap = await getDoc(docRef);

      // If the document exists, update the state with user data
      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // If the document does not exist, set current user to null and loading to false
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      // If an error occurs, show a toast notification and update the state
      toast.error(error.message);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
