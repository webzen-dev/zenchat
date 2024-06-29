// Importing necessary modules and components from React and react-router-dom
import { Route, Routes, Navigate } from "react-router-dom";
<<<<<<< HEAD
// Importing custom style
import "./index.css"; // Global CSS styles
// Importing custom components
import Sidebar from "./components/Sidebar/Sidebar"; // Sidebar component
import Container from "./components/Container"; // Main container component
import Add from "./components/add/Add"; // Add component for adding items
import Login from "./components/login/Login"; // Login component
import Notification from "./components/notification/Notifiacation"; // Notification component
import { useEffect } from "react"; // React hook for side effects
import { onAuthStateChanged } from "firebase/auth"; // Firebase authentication state change listener
import { auth } from "./lib/firebase"; // Firebase authentication instance
import { useUserStore } from "./lib/userStore"; // Custom hook for user state management
import Loading from "./components/loading/Loading"; // Loading component
=======
import Sidebar from "./components/Sidebar/Sidebar";
import "./index.css";
import Container from "./components/Container";
import Add from "./components/add/Add";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notifiacation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUseStore } from "./lib/userStore";
import Loading from "./components/loading/Loading";
>>>>>>> 35fa9c2fed6f9332a7261942ebc45eb0ddf653a6

const App = () => {
  // Using custom hook to get user state and actions
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  // Placeholder user object (replace with actual user logic)
  const user = true;

  useEffect(() => {
    // Setting up a listener for authentication state changes
    const unSubmit = onAuthStateChanged(auth, (user) => {
      // Fetch user info when authentication state changes
      fetchUserInfo(user?.uid);
    });
    return () => {
      // Clean up the listener when the component unmounts
      unSubmit();
    };
  }, [fetchUserInfo]);

  // Display loading screen while user info is being fetched
  if (isLoading)
    return (
      <div className="container">
        <Loading />
      </div>
    );

  return (
    <div className="app">
      {/* Routes configuration */}
      <Routes>
        {/* Redirect root path to main container */}
        <Route path="/" element={<Navigate to="zenchat/Container" />} />
      </Routes>
      {currentUser ? (
        // If user is logged in, show main app structure
        <section className="container">
          <Sidebar /> {/* Sidebar component */}
          <Routes>
<<<<<<< HEAD
            {/* Route to main container */}
            <Route
              path="zenchat/Container"
              element={<Container user={user} />}
            />
            {/* Route to add item */}
=======
            <Route path="zenchat/Container" element={<Container user={user} />} />
>>>>>>> 35fa9c2fed6f9332a7261942ebc45eb0ddf653a6
            <Route path="zenchat/Add" element={<Add />} />
          </Routes>
        </section>
      ) : (
        // If user is not logged in, show login page
        <Login />
      )}
      <Notification /> {/* Notification component */}
    </div>
  );
};

export default App;
