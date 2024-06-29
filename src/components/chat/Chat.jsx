// Import necessary functions and components from Firebase, React, and other libraries
import { db } from "../../lib/firebase"; // Firebase database instance
import { useEffect, useRef, useState } from "react"; // React hooks for managing state and lifecycle
import "./chat.css"; // CSS styles for the Chat component
import EmojiPicker from "emoji-picker-react"; // Component for picking emojis
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"; // Firebase Firestore functions
import { useChatStore } from "../../lib/chatStore"; // Custom hook for chat state management
import { useUserStore } from "../../lib/userStore"; // Custom hook for user state management
import upload from "../../lib/upload"; // Function for uploading files

// Chat component
const Chat = () => {
  // Local state management
  const [loadingSend, setSend] = useState(false); // State for send button loading indicator
  const [openEmoji, setOpenEmoji] = useState(false); // State for toggling emoji picker
  const [text, setText] = useState(""); // State for chat input text
  const [chat, setChat] = useState([]); // State for storing chat messages
  const [img, setImg] = useState({
    file: null,
    url: "",
  }); // State for image to be sent
  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore(); // Getting chat related states from chat store
  const { currentUser } = useUserStore(); // Getting current user from user store
  const endRef = useRef(null); // Reference to the end of the chat for scrolling

  // Scroll to the end of the chat messages when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Listen for chat updates from Firestore
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  // Handle emoji selection
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  // Handle image selection
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file); // Upload image if exists
      }
      setSend(true); // Set loading state for send button
      console.log("sending message ...");
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id, // Use senderId for consistency
          text,
          createAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      setText(""); // Clear input text

      // Update user chat lists for both users
      const userIDs = [user.id, currentUser.id];
      for (const id of userIDs) {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapShot = await getDoc(userChatRef);

        if (userChatSnapShot.exists()) {
          const userChatData = userChatSnapShot.data();
          const chatIndex = userChatData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      }
    } catch (error) {
      console.log(error); // Log error if any
    } finally {
      setSend(false); // Reset loading state for send button
    }
    setImg({
      file: null,
      url: "",
    }); // Reset image state
  };

  return (
    <div className="chat">
      <div className="header">
        <div className="user">
          <div className="senImge">
            <label htmlFor="file">
              <img src={user.avatar || "./images/profile.jpeg"} alt="" />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImg}
            />
          </div>
          <div className="info">
            <div className="name">{user.username}</div>
            <p>{user.bio}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./images/info.png" alt="" />
        </div>
      </div>
      <div className="chat-box">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message self" : "message"
            }
            key={message?.createAt}
          >
            <div className="text-message">
              {message.img && <img src={message.img} className="shared-img" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message self">
            <div className="text-message">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="chat-input">
        <label htmlFor="file">
          <img src="./images/images.png" alt="" className="sharePhoto" />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImg}
        />
        <div className="emoji">
          <img
            src="./images/emoji.png"
            alt="emoji icon"
            onClick={() => {
              setOpenEmoji(!openEmoji);
            }}
          />
          <div className="emoji-picker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You can't send a message!"
              : "Send Message...."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <button
          type="submit"
          onClick={handleSend}
          className={loadingSend ? "loading-send" : "sendBtn"}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          {loadingSend ? "sending...." : "send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
