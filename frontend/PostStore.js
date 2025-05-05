// src/stores/PostStore.js
import { proxy } from 'valtio';
import PostService from './src/Services/PostService';
import LikeService from './src/Services/LikeService';
import CommentService from './src/Services/CommentService';

export const postState = proxy({
  currentPost: null,
  likes: [],
  comments: [],
  loading: false,
  error: null
});

export const PostActions = {
  async fetchPostData(postId) {
    postState.loading = true;
    postState.error = null;
    
    try {
      // First fetch just the post data
      const post = await PostService.getPostById(postId);
      postState.currentPost = post;
      
      // Then fetch likes and comments in parallel
      const [likes, comments] = await Promise.all([
        LikeService.getLikesByPostId(postId),
        CommentService.getCommentsByPostId(postId)
      ]);
      
      postState.likes = likes;
      postState.comments = comments;
      
    } catch (error) {
      console.error("Post fetch error:", error);
      postState.error = "Failed to load post data";
    } finally {
      postState.loading = false;
    }
  },

  // Like/Unlike actions
  async toggleLike(postId, userId) {
    const existingLike = postState.likes.find(like => like.userId === userId);
    
    try {
      if (existingLike) {
        await LikeService.deleteLike(existingLike.id);
        postState.likes = postState.likes.filter(like => like.id !== existingLike.id);
      } else {
        const newLike = await LikeService.createLike({
          postId,
          userId
        });
        postState.likes = [...postState.likes, newLike];
      }
    } catch (error) {
      message.error("Failed to update like");
    }
  },

  // Comment actions
  async addComment(postId, userId, commentText) {
    postState.commentAdding = true;
    try {
      const newComment = await CommentService.createComment({
        postId,
        userId,
        commentText
      });
      postState.comments = [...postState.comments, newComment];
    } catch (error) {
      message.error("Failed to add comment");
    } finally {
      postState.commentAdding = false;
    }
  },

  async updateComment(commentId, newText) {
    try {
      await CommentService.updateComment(commentId, { commentText: newText });
      postState.comments = postState.comments.map(comment => 
        comment.id === commentId ? {...comment, commentText: newText} : comment
      );
    } catch (error) {
      message.error("Failed to update comment");
    }
  },

  async deleteComment(commentId) {
    try {
      await CommentService.deleteComment(commentId);
      postState.comments = postState.comments.filter(c => c.id !== commentId);
    } catch (error) {
      message.error("Failed to delete comment");
    }
  }
};