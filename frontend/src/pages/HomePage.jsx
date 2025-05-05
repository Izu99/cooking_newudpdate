import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Navbar from "../Components/Navbar"; // Adjust the path to your Navbar component

const { Content } = Layout;

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      // Assuming localStorage has "userId" when logged in
      const isAuthenticated = localStorage.getItem("userId");
      setIsLoggedIn(!!isAuthenticated);
    };

    checkLoginStatus();

    // Add event listeners to check login status on focus or localStorage changes
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("focus", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("focus", checkLoginStatus);
    };
  }, []);

  return (
    <Layout className="bg-blue-400 mt-40">
      <Navbar isLoggedIn={isLoggedIn} /> {/* Pass isLoggedIn to Navbar */}
      <Content style={{ padding: "20px" }}>
        <h1>Welcome to Home Page</h1>
        <p>This is your dashboard after login.</p>
      </Content>
    </Layout>
  );
};

export default HomePage;
