import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AuthModal from "../Modals/AuthModal";
import AuthService from "../../Services/AuthService";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    };
    
    // Check on component mount
    checkLoginStatus();
    
    // Add event listener to detect localStorage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Also check every time the component is focused
    window.addEventListener('focus', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);

  const authButtonClicked = () => {
    if (isLoggedIn) {
      navigate("/community"); // Navigate to kitchen portal if logged in
    } else {
      setIsAuthModalOpened(true); // Open the login modal if not logged in
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpened(false);
    setIsLoggedIn(true); // Set logged in state to true after successful login
    navigate("/"); // Redirect to home
  };

  return (
    <header className={`header ${isLoggedIn ? 'header--logged-in' : ''}`}>
      {/* Added cooking-themed animations */}
      <div className="spice-particle"></div>
      <div className="spice-particle"></div>
      
      <Navbar />
      <div className="section__container">
        <div className="header__container">
          <div className="header__content">
            <h1>FLAVOR YOUR WORLD</h1>
            <h2>TASTE. PASSION. CREATIVITY.</h2>
            <p>
              Join our community of chefs and food enthusiasts.
              Discover delicious recipes, connect with culinary experts,
              and take control of your cooking journey.
            </p>
            <div className="header__btn">
              <button className="btn btn__primary" onClick={authButtonClicked}>
                {isLoggedIn ? "Access My Kitchen" : "START COOKING NOW"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        onSuccess={handleAuthSuccess} // Pass success handler to AuthModal
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;