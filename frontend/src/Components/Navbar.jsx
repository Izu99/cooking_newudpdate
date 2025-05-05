import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove userId from localStorage on logout
    setIsLoggedIn(false); // Update the login state
  };

  return (
    <nav className="navbar bg-green-400">
      <div className="nav__container">
        <div className="nav__logo">
          <span className="logo__text">Cooking</span>
        </div>

        <ul className="nav__links">
          <li className="nav__item">
            <Link to="/home" className="nav__link">
              Home
            </Link>
          </li>

          {isLoggedIn && (
            <>
              <li className="nav__item">
                <Link to="/user-profile" className="nav__link">
                  Profile
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/post" className="nav__link">
                  Post
                </Link>
              </li>
              <li className="nav__item">
                <button onClick={handleLogout} className="nav__link">
                  Logout
                </button>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li className="nav__item">
              <Link to="/auth" className="nav__link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
