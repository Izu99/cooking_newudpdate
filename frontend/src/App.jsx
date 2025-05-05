import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Views/Home';
import Community from './Views/Community';
import OAuthCallback from './Components/Home/OAuthCallbackHandler';
import AuthPage from './pages/AuthPage';
import CenterSection from './Components/CenterSection';
import UserProfilePage from './pages/UserProfilePage';
import HomePage from './pages/HomePage';
import Navbar from './Components/Navbar';
import PostView from './pages/PostView';
import PostCreate from './pages/PostCreate';
import FriendsPost from './Components/Community/FriendsPost';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userId') && localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/create-post" element={<PostCreate />} />
          <Route path="/posts" element={<PostView />} />
          {/* <Route path="/post" element={<FriendsPost />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
