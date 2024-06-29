// Importing necessary functions and components from Firebase, React, and other libraries
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"; // Firebase Firestore functions
import { db } from "../../lib/firebase"; // Firebase database instance
import "./add.css"; // CSS styles for the Add component
import { useState } from "react"; // React hook for managing local state
import { useUserStore } from "../../lib/userStore"; // Custom hook for user state management
import { toast } from "react-toastify"; // Library for displaying toast notifications

// Add component
const Add = () => {
  // Local state management
  const [addLoading, setAddLoading] = useState(false); // State for loading indicator
  const [user, setUser] = useState(null); // State for storing searched user
  const { currentUser } = useUserStore(); // Getting current user from user store

  // Handle search for user
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.target); // Get form data
    const username = formData.get("username"); // Get username from form data

    try {
      // Query Firestore for user with the given username
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      // If user is found, set user state
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err); // Log error if any
    }
  };

  // Handle adding a new chat
  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      setAddLoading(true); // Set loading state

      // Create a new chat document in Firestore
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update userchats for the found user
      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Update userchats for the current user
      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      toast.success("User added!"); // Show success message
    } catch (error) {
      toast.error(error.message); // Show error message
      console.log(error); // Log error
    } finally {
      setAddLoading(false); // Reset loading state
    }
  };

  return (
    <div className="add">
      <div className="add-box">
        <div className="input-box">
          <div className="input">
            <form onSubmit={handleSearch}>
              <img src="./images/search.png" alt="Search Icon" />
              <input
                type="text"
                placeholder="Search username"
                name="username"
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        {user && (
          <div className="find-user">
            <div className="user---item">
              <img
                src={user.avatar || "./images/avatar.png"}
                alt="User Avatar"
              />
              <div className="name---user">{user.username}</div>
              <button
                onClick={handleAdd}
                className={addLoading ? "loading-btn" : "addUser"}
              >
                {addLoading ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Add;
