import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import NotificationsDropdown from "./NotificationsDropdown";

const Navbar = () => {
  const snap = useSnapshot(state);
  
  // Safely access currentUser properties with fallbacks
  const userName = snap.currentUser?.name || "User";
  const userImage = snap.currentUser?.image || "./assets/default-user.png";
  const username = snap.currentUser?.username || "username";

  const handleClick = (index) => {
    state.activeIndex = index;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/logo section */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img 
              src="./assets/icon.png"  
              alt="Cooking Logo" 
              className="h-8 w-auto rounded-full border-2 border-white"
            />
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-500">
              Cooking
            </h3>
          </div>

          {/* Navigation items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {[
                "Posts",
                "Skill Plans",
                "Learning Tracking",
                "Friends",
                "Notifications",
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index + 1)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    snap.activeIndex === index + 1 
                      ? "text-white bg-blue-800 bg-opacity-40"
                      : "text-blue-100 hover:text-white hover:bg-blue-600 hover:bg-opacity-20"
                  }`}
                >
                  {item}
                  {snap.activeIndex === index + 1 && (
                    <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - User profile and notifications */}
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            
            <div className="flex items-center space-x-2 group relative">
              <span className="hidden md:inline text-sm font-medium text-blue-100 group-hover:text-white transition-colors">
                {userName}
              </span>
              <img
                onClick={() => { state.profileModalOpend = true; }}
                alt="User profile"
                src={userImage}
                className="h-8 w-8 rounded-full border-2 border-blue-200 group-hover:border-teal-300 transition-all duration-300 shadow-sm"
              />
              
              {/* Dropdown menu */}
              <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-md shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Sign out
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile menu button (hidden by default) */}
            <div className="md:hidden flex items-center ml-2">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {[
            "Posts",
            "Skill Plans",
            "Learning Tracking",
            "Friends",
            "Notifications",
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleClick(index + 1)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                snap.activeIndex === index + 1
                  ? "text-white bg-blue-800 bg-opacity-40"
                  : "text-blue-100 hover:text-white hover:bg-blue-600 hover:bg-opacity-20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 