// Import necessary functions and components from Firebase, React, and other libraries
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"; // Firestore functions for array operations and document updates
import { useChatStore } from "../../lib/chatStore"; // Custom hook for managing chat-related state
import "./detail.css"; // CSS styles for the Detail component
import { db } from "../../lib/firebase"; // Firebase database instance
import { useUserStore } from "../../lib/userStore"; // Custom hook for managing user-related state

// Detail component for displaying user profile information and blocking functionality
const Detail = () => {
  // Access chat-related states and functions from chat store
  const { user, isReceiverBlocked, isCurrentUserBlocked, changeBlock } =
    useChatStore();
  // Access current user information from user store
  const { currentUser } = useUserStore();

  // Function to handle blocking/unblocking user
  const handleBlock = async () => {
    if (!user) return; // If no user is selected, return early

    const userDocRef = doc(db, "users", currentUser.id); // Reference to current user document in Firestore

    try {
      // Update the blocked users list based on current block status
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock(); // Call changeBlock function to update block status in chat store
    } catch (err) {
      console.log(err); // Log any errors that occur during the update process
    }
  };

  // Render JSX for displaying user profile information and block button
  return (
    <div className="detail">
      <h1>Profile Info</h1>
      <div className="user">
        <img src={user?.avatar || "./images/avatar.png"} alt="" />
        <h3>{user?.username}</h3>
      </div>
      <button className="blockBtn" onClick={handleBlock}>
        {/* Display appropriate text based on block status */}
        {isCurrentUserBlocked
          ? "You are blocked!"
          : isReceiverBlocked
          ? "User Blocked"
          : "Block User"}
      </button>
    </div>
  );
};

export default Detail; // Export Detail component as default
