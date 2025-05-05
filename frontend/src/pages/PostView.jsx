import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import { postState, PostActions } from "../../PostStore";
import state from "../Utils/Store"; // Your main app state
import { Empty, Spin, Button, message, Dropdown, Menu, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import PostService from "../Services/PostService";

const PostView = () => {
  const snap = useSnapshot(state);
  const postSnap = useSnapshot(postState);

  // Load posts when component mounts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        postState.loading = true;
        const posts = await PostService.getPosts();
        state.posts = posts; // Store in your main app state
      } catch (error) {
        console.error("Failed to load posts:", error);
        message.error("Failed to load posts");
      } finally {
        postState.loading = false;
      }
    };
    
    loadPosts();
  }, []);

  // Post actions
  const handleUpdatePost = (post) => {
    state.selectedPost = post; // Store in main state
    state.updatePostModalOpened = true;
  };

  const handleDeletePost = async (postId) => {
    try {
      await PostService.deletePost(postId);
      state.posts = state.posts.filter(p => p.id !== postId);
      message.success("Post deleted successfully");
    } catch (error) {
      message.error("Failed to delete post");
    }
  };

  // Post menu component
  const PostMenu = ({ post }) => (
    <Menu>
      <Menu.Item 
        onClick={() => handleUpdatePost(post)} 
        icon={<EditOutlined />}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => handleDeletePost(post.id)}
        icon={<DeleteOutlined />}
        danger
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  if (postSnap.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {state.posts.length === 0 ? (
        <Empty description="No posts available" />
      ) : (
        state.posts.map(post => (
          <div
            key={post.id}
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px",
              padding: "16px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Post header content */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar src={post.user?.image} size={48} />
                <div>
                  <h3 style={{ margin: 0 }}>{post.user?.username}</h3>
                  <span style={{ color: "#888", fontSize: "12px" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Three-dot menu - CRUCIAL PART */}
              {post.userId === snap.currentUser?.uid && (
                <Dropdown 
                  overlay={<PostMenu post={post} />}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              )}
            </div>

            {/* Post content */}
            {post.contentDescription && (
              <div style={{ margin: "16px 0" }}>
                <p>{post.contentDescription}</p>
              </div>
            )}

            {/* Media content */}
            {post.mediaType === "image" && (
              <img src={post.mediaLink} alt="Post" style={{ width: "100%" }} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostView;