// Importing necessary functions from Zustand and userStore
import { create } from "zustand"; // Zustand library for state management
import { useUserStore } from "./userStore"; // Custom hook for user state management

// Creating a Zustand store for managing chat state
export const useChatStore = create((set) => ({
  // Initial states for the chat store
  chatId: null, // ID of the current chat
  user: null, // User object of the chat receiver
  isCurrentUserBlocked: false, // Flag indicating if the current user is blocked by the receiver
  isReceiverBlocked: false, // Flag indicating if the receiver is blocked by the current user
  isLoading: true, // Loading state

  // Function to change the current chat
  changeChat: (chatId, user) => {
    // Get the current user from the user store
    const currentUser = useUserStore.getState().currentUser;

    // Check if the current user is blocked by the receiver
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
      
    // Check if the receiver is blocked by the current user
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      // If no one is blocked, set the chat and user normally
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  // Function to toggle the receiver's blocked state
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
}));
