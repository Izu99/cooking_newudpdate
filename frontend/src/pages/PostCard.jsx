import React, { useState, useEffect } from "react";
import { 
  Card, Avatar, Button, Dropdown, Menu, Modal, 
  Input, List, Divider, Badge, message, Tooltip 
} from "antd";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined
} from "@ant-design/icons";
import UserService from "../Services/UserService";
import LikeService from "../Services/LikeService";
import CommentService from "../Services/CommentService";
import PostService from "../Services/PostService";
import { useSnapshot } from "valtio";
import state from "../Utils/Store";
// import CommentCard from "./CommentCard";
// import "./PostCard.css";

const PostCard = ({ post, currentUserId, onPostDeleted, onNavigateToUpdate }) => {
  const snap = useSnapshot(state);
  const [userData, setUserData] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [commentAdding, setCommentAdding] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!post.id) {
      console.warn("Post without ID detected:", post);
      return;
    }

    fetchUserData();
    fetchLikes();
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    const userLiked = likes.some((like) => like.userId === currentUserId);
    setIsLiked(userLiked);
  }, [likes, currentUserId]);

  const fetchUserData = async () => {
    try {
      const data = await UserService.getProfileById(post.userId);
      setUserData(data);
    } catch (err) {
      console.error(`Error getting user data: ${err}`);
    }
  };

  const fetchLikes = async () => {
    try {
      const result = await LikeService.getLikesByPostId(post.id);
      setLikes(result);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const result = await CommentService.getCommentsByPostId(post.id);
      setComments(result);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      await LikeService.createLike(
        {
          postId: post.id,
          userId: currentUserId,
        },
        snap.currentUser?.username,
        post.userId
      );
      await fetchLikes();
    } catch (error) {
      message.error("Error liking post");
    }
  };

  const handleUnlike = async () => {
    try {
      const likeToRemove = likes.find(like => like.userId === currentUserId);
      if (likeToRemove) {
        await LikeService.deleteLike(likeToRemove.id);
        await fetchLikes();
      }
    } catch (error) {
      message.error("Error unliking post");
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  const createComment = async () => {
    if (comment.trim()) {
      try {
        setCommentAdding(true);
        const body = {
          postId: post.id,
          userId: currentUserId,
          commentText: comment,
        };
        await CommentService.createComment(
          body,
          snap.currentUser?.username,
          snap.currentUser?.uid
        );
        setComment("");
        await fetchComments();
      } catch (error) {
        message.error("Failed to add comment");
      } finally {
        setCommentAdding(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await PostService.deletePost(post.id);
      message.success("Post deleted successfully");
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      message.error("Failed to delete post");
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteVisible(false);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item 
        key="edit" 
        icon={<EditOutlined />}
        onClick={onNavigateToUpdate}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => setConfirmDeleteVisible(true)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      })
    : 'Recently';

  return (
    <Card className="post-card" bordered={false}>
      <div className="post-header">
        <div className="user-info">
          <Avatar
            src={userData?.image}
            size={48}
            className="user-avatar"
            onClick={() => {
              if (userData?.profileVisibility) {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              } else {
                message.info("Profile is private");
              }
            }}
          />
          <div className="user-details">
            <h3 className="username">{userData?.username || "User"}</h3>
            <span className="post-time">{formattedDate}</span>
          </div>
        </div>
        
        {post.userId === currentUserId && (
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              className="more-options" 
            />
          </Dropdown>
        )}
      </div>

      {post.contentDescription && (
        <div className="post-content">
          <p>{post.contentDescription}</p>
        </div>
      )}

      {post.mediaType === "image" && post.mediaLink && (
        <div className="post-media">
          <img 
            src={post.mediaLink} 
            alt="Post content" 
            className="post-image"
          />
        </div>
      )}

      {post.mediaType === "video" && post.mediaLink && (
        <div className="post-media">
          <video 
            controls 
            src={post.mediaLink} 
            className="post-video"
          />
        </div>
      )}

      <div className="post-stats">
        <div className="likes-count">
          <Badge count={likes.length} showZero color="#1890ff" offset={[10, 0]}>
            <LikeOutlined style={{ fontSize: '16px' }} />
          </Badge>
        </div>
        <div 
          className="comments-count cursor-pointer" 
          onClick={() => setShowCommentModal(true)}
        >
          <Badge count={comments.length} showZero color="#52c41a" offset={[10, 0]}>
            <CommentOutlined style={{ fontSize: '16px' }} />
          </Badge>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div className="post-actions">
        <div className="action-buttons">
          <button 
            className={`interaction-button ${isLiked ? 'liked' : ''}`}
            onClick={toggleLike}
          >
            {isLiked ? <LikeFilled /> : <LikeOutlined />}
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button 
            className="interaction-button"
            onClick={() => setShowCommentModal(true)}
          >
            <CommentOutlined />
            <span>Comment</span>
          </button>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div className="comment-input">
        <Avatar src={snap.currentUser?.image} size={36} />
        <Input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onPressEnter={createComment}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={createComment}
          disabled={!comment}
          loading={commentAdding}
        />
      </div>

      <Modal
        title="Comments"
        open={showCommentModal}
        footer={null}
        onCancel={() => setShowCommentModal(false)}
        className="comments-modal"
      >
        {comments.length > 0 ? (
          <List
            className="comments-list"
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <CommentCard 
                comment={comment} 
                currentUserId={currentUserId}
                onCommentUpdated={fetchComments}
              />
            )}
          />
        ) : (
          <Empty description="No comments yet" />
        )}
      </Modal>

      <Modal
        title="Delete Post"
        open={confirmDeleteVisible}
        onCancel={() => setConfirmDeleteVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmDeleteVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            loading={deleteLoading}
            onClick={handleDelete}
          >
            Delete
          </Button>
        ]}
      >
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default PostCard;