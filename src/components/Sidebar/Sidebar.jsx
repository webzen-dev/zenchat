import "./sidebar.css";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../../lib/userStore";
import { auth } from "../../lib/firebase";

const Sidebar = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="profile">
        <img src={currentUser.avatar || "./images/profile.jpeg"} alt="Profile" />
        <div className="full-name">{currentUser.username}</div>
      </div>

      {/* Navigation Links */}
      <div className="chat-item-box">
        {/* Chat Link */}
        <div className="chat-item">
          <NavLink to={"/zenchat/Container"}>
<<<<<<< HEAD
          <img src="./images/chat-active.png" alt=""className="active-image" />

=======
>>>>>>> 35fa9c2fed6f9332a7261942ebc45eb0ddf653a6
            <img src="./images/chat.png" alt="Chat" />
            <span>Chat</span>
          </NavLink>
        </div>

        {/* Add User Link */}
        <div className="chat-item add-user">
          <NavLink to={"/zenchat/Add"}>
            <img src="./images/add.png" alt="Add User" />
            <img src="./images/add-active.png" alt=""className="active-image" />
            <span>Add User</span>
          </NavLink>
        </div>
        {/* Logout Button */}
        <div
          className="chat-item logout"
          onClick={() => {
            if (window.confirm("Do you really want to logout?")) {
              auth.signOut();
            }
          }}
        >
          <img src="./images/logout.png" alt="Logout" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
