// Import necessary libraries and styles
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import Loading from "../loading/Loading";

// Login component definition
const Login = () => {
  // State variables for managing avatar image, loading state, and form toggle
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);

  // Handle avatar file selection
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      // Update avatar state with selected file and its URL
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Handle login form submission
  const loginHandel = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const { email, password } = Object.fromEntries(formData);

    // Validate email and password inputs
    if (!email) {
      setLoading(false);
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      setLoading(false);
      toast.error("Please enter your password.");
      return;
    }

    try {
      // Sign in user using Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You have logged in.");
      // Refresh the page on successful login
      window.location.reload();
    } catch (error) {
      // Display error message in case of authentication failure
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // Handle registration form submission
  const siginHandel = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const { username, email, password } = Object.fromEntries(formData);

    // Validate avatar, username, email, and password inputs
    if (!avatar.file) {
      setLoading(false);
      toast.error("Please select a profile image.");
      return;
    }

    if (!avatar.file.type.startsWith("image/")) {
      setLoading(false);
      toast.error("Please select a valid image file.");
      return;
    }

    if (!username) {
      setLoading(false);
      toast.error("Please enter your username.");
      return;
    }

    if (!email) {
      setLoading(false);
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      setLoading(false);
      toast.error("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Create user with email and password using Firebase authentication
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Upload avatar image and get the URL
      const imgUrl = await upload(avatar.file);
      // Store user data in Firestore under 'users' collection
      await setDoc(doc(db, "users", result.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: result.user.uid,
        blocked: [],
      });
      // Initialize 'userchats' collection for the user
      await setDoc(doc(db, "userchats", result.user.uid), {
        chats: [],
      });
      // Display success message after account creation
      toast.success("Account created! You can now log in.");
      // Refresh the page on successful account creation
      window.location.reload();
    } catch (error) {
      // Log and display error message if any error occurs during registration
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // JSX structure for rendering login and registration forms based on 'login' state
  return (
    <div className="login-page">
      {loading ? ( // Display loading indicator if 'loading' is true
        <Loading />
      ) : (
        <>
          {" "}
          {/* Fragment to contain conditional rendering based on 'login' state */}
          {login ? ( // Display login form if 'login' state is true
            <div className="login">
              <h2>Login</h2>
              <form onSubmit={loginHandel}>
                <img src="./images/avatar-login.png" alt="" />
                <div className="input-box">
                  <img src="./images/email.png" alt="" />
                  <input
                    type="email"
                    placeholder="Enter Email ID"
                    name="email"
                  />
                </div>
                <div className="input-box">
                  <img src="./images/lock.png" alt="" />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                  />
                </div>
                <p onClick={() => setLogin(!login)}>
                  Don't have an account? <p>Click here</p>
                </p>
                <button>Login</button>
              </form>
            </div>
          ) : (
            // Display registration form if 'login' state is false
            <div className="login signin">
              <h2>Create Account</h2>
              <form onSubmit={siginHandel}>
                <label htmlFor="file">
                  <img src={avatar.url || "./images/none-image.png"} alt="" />
                  Choose Profile
                </label>
                <input
                  type="file"
                  onChange={handleAvatar}
                  id="file"
                  style={{ display: "none" }}
                  name="file"
                />
                <div className="input-box">
                  <img src="./images/username.png" alt="" />
                  <input
                    type="text"
                    placeholder="Enter Username"
                    name="username"
                  />
                </div>
                <div className="input-box">
                  <img src="./images/email.png" alt="" />
                  <input
                    type="text"
                    placeholder="Enter Email ID"
                    name="email"
                  />
                </div>
                <div className="input-box">
                  <img src="./images/lock.png" alt="" />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                  />
                </div>
                <button>Sign Up</button>
                <p onClick={() => setLogin(!login)} className="backText">
                  Back to login page
                </p>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Export the Login component as the default export
export default Login;
