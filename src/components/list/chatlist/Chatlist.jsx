// Importing necessary hooks and functions from React and Firebase
import { useEffect, useState } from "react"; // React hooks for side effects and state management
import { useUserStore } from "../../../lib/userStore"; // Custom hook for user state management
import "./chatlist.css"; // CSS styles for chat list component
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"; // Firebase Firestore functions
import { db } from "../../../lib/firebase"; // Firebase database instance
import { useChatStore } from "../../../lib/chatStore"; // Custom hook for chat state management

const Chatlist = ({ searchTerm, open }) => {
  const { currentUser } = useUserStore(); // Get the current user from the user store
  const { changeChat } = useChatStore(); // Function to change the current chat in the chat store
  const [chats, setChats] = useState([]); // State to hold the list of chats
  
  useEffect(() => {
    // Subscribe to changes in the user's chats document
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats; // Get the chats array from the user's chats document
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId); // Reference to the other user's document
          const userDocSnap = await getDoc(userDocRef); // Fetch the other user's document
          const user = userDocSnap.data(); // Get the user data
          return { ...item, user }; // Merge the chat item with the user data
        });
        const chatData = await Promise.all(promises); // Resolve all promises
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt)); // Sort chats by updatedAt in descending order
      }
    );

    return () => {
      unSub(); // Unsubscribe from the onSnapshot listener when the component unmounts
    };
  }, [currentUser.id]); // Run the effect when the current user's ID changes

  // Filter chats based on the search term
  const filteredChats = chats.filter((chat) =>
    chat.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async (chat) => {
    // Handle selecting a chat
    const userChats = chats.map((item) => {
      const { user, ...rest } = item; // Extract the user from each chat item
      return rest; // Return the chat item without the user
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    ); // Find the selected chat index
    userChats[chatIndex].isSeen = true; // Mark the selected chat as seen
    const userChatRef = doc(db, "userchats", currentUser.id); // Reference to the user's chats document
    try {
      await updateDoc(userChatRef, {
        chats: userChats, // Update the chats array with the modified chat
      });
      changeChat(chat.chatId, chat.user); // Change the current chat in the chat store
    } catch (err) {
      console.log(err); // Log any errors
    }
  };

  return (
    <div className="chatlist">
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => {
            handleSelect(chat); // Handle selecting the chat when clicked
          }}
          style={{
            background: chat?.isSeen ? "#1A2130" : "#0C1844", // Highlight unseen chats
          }}
        >
          <img src={chat.user.avatar || "./images/avatar.png"} alt="" />
          <div className="message">
            <p className="name">{chat.user.username}</p>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chatlist;