// src/stores/StateStore.js
import { proxy } from 'valtio';
import PostService from '../Services/PostService';
import SkillPlanService from '../Services/SkillPlanService';
import UserService from '../Services/UserService';

// Centralized state for ALL features
export const appState = proxy({
  // Posts
  posts: [],
  loadingPosts: false,
  
  // Skill Plans
  skillPlans: [],
  loadingSkillPlans: false,
  
  // User Data
  currentUser: null,
  users: [],
  
  // UI State
  activeTab: 'feed', // 'feed' | 'skills' | 'friends' | 'notifications'
});

// All actions that modify state
export const AppActions = {
  // Fetch all posts (for feed)
  async fetchPosts() {
    appState.loadingPosts = true;
    try {
      const posts = await PostService.getPosts();
      appState.posts = [...new Map(posts.map(post => [post.id, post])].map(([, post]) => post); // Remove duplicates
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      appState.loadingPosts = false;
    }
  },

  // Fetch single post (for PostView page)
  async fetchPostById(postId) {
    appState.loadingPosts = true;
    try {
      const post = await PostService.getPostById(postId);
      // Update posts array to include this post (or update if exists)
      const postExists = appState.posts.some(p => p.id === postId);
      if (!postExists) {
        appState.posts.push(post);
      }
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      appState.loadingPosts = false;
    }
  },

  // Fetch current user
  async fetchCurrentUser() {
    try {
      const user = await UserService.getProfile();
      appState.currentUser = user;
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }
};