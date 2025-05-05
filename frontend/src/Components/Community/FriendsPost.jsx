import React, { useState, useEffect } from "react";
import UserService from "../../Services/UserService";
import LikeService from "../../Services/LikeService";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import CommentService from "../../Services/CommentService";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined
} from "@ant-design/icons";
import {
  Button,
  Modal,
  List,
  Row,
  Input,
  Col,
  Avatar,
  Dropdown,
  Menu,
  message,
  Divider,
  Tooltip,
  Badge
} from "antd";
import PostService from "../../Services/PostService";
import CommentCard from "./CommentCard";

const FriendsPost = ({ post }) => {
  const snap = useSnapshot(state);
  const [userData, setUserData] = useState();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentAdding, setCommentAdding] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [updatingCommentText, setUpdatingCommentText] = useState();
  const [updatingCommentId, setUpdatingCommentId] = useState();
  const [commentUploading, setCommentUploading] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState(false);
  const [editFocused, setEditFocused] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [isLiked, setIsLiked] = useState(false);

  // Function declarations moved to the top
  const updatePost = () => {
    state.selectedPost = post;
    state.updatePostModalOpened = true;
  };

  const deletePost = async () => {
    try {
      await PostService.deletePost(post.id);
      state.posts = await PostService.getPosts();
      message.success("Post deleted successfully");
    } catch (error) {
      message.error("Failed to delete post");
    }
  };

  const updateComment = async (id) => {
    try {
      setCommentUploading(true);
      await CommentService.updateComment(id, {
        commentText: updatingCommentText,
      });
      await getCommentsRelatedToPost();
      setUpdatingCommentText("");
      setEditFocused(false);
    } catch (error) {
      message.error("Failed to update comment");
    } finally {
      setCommentUploading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      setCommentDeleting(true);
      await CommentService.deleteComment(id);
      await getCommentsRelatedToPost();
      message.success("Comment deleted");
    } catch (error) {
      message.error("Failed to delete comment");
    } finally {
      setCommentDeleting(false);
    }
  };

  const getLikesRelatedToPost = async () => {
    try {
      const result = await LikeService.getLikesByPostId(post.id);
      setLikes(result);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const getCommentsRelatedToPost = async () => {
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
          userId: snap.currentUser?.uid,
        },
        snap.currentUser?.username,
        post.userId
      );
      getLikesRelatedToPost();
    } catch (error) {
      message.error("Error liking post");
    }
  };

  const handleUnlike = async () => {
    try {
      const likeToRemove = likes.find(
        (like) => like.userId === snap.currentUser?.uid
      );
      if (likeToRemove) {
        await LikeService.deleteLike(likeToRemove.id);
        getLikesRelatedToPost();
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
    if (comment) {
      try {
        setCommentAdding(true);
        const body = {
          postId: post.id,
          userId: snap.currentUser?.uid,
          commentText: comment,
        };
        await CommentService.createComment(
          body,
          snap.currentUser?.username,
          snap.currentUser?.uid
        );
        setComment("");
        await getCommentsRelatedToPost();
      } catch (error) {
        message.error("Failed to add comment");
      } finally {
        setCommentAdding(false);
      }
    }
  };

  useEffect(() => {
    const userLiked = likes.some((like) => like.userId === snap.currentUser?.uid);
    setIsLiked(userLiked);
  }, [likes, snap.currentUser]);

  useEffect(() => {
    if (!post.id) {
      console.warn("Post without ID detected:", post);
    }
  }, [post]);

  useEffect(() => {
    UserService.getProfileById(post.userId)
      .then((value) => {
        setUserData(value);
      })
      .catch((err) => {
        console.log(`error getting user data ${err}`);
      });
    getLikesRelatedToPost();
    getCommentsRelatedToPost();
  }, [post]);

  const menu = (
    <Menu
      items={[
        {
          key: 'edit',
          icon: <EditOutlined className="text-blue-500" />,
          label: 'Edit',
          className: 'hover:bg-blue-50',
          onClick: updatePost
        },
        {
          key: 'delete',
          icon: <DeleteOutlined className="text-red-500" />,
          label: 'Delete',
          className: 'hover:bg-red-50 text-red-500',
          onClick: deletePost
        }
      ]}
      className="bg-white rounded-lg shadow-xl"
    />
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-all duration-300 mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-50">
        <div className="flex items-center space-x-3">
          <Avatar
            src={userData?.image}
            size={48}
            className="cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all"
            onClick={() => {
              if (userData?.profileVisibility) {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              } else {
                message.info("Profile is locked");
              }
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">{userData?.username}</h3>
            <span className="text-sm text-blue-400">Posted recently</span>
          </div>
        </div>
        {post.userId === snap.currentUser?.uid && (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button 
              type="text" 
              icon={<MoreOutlined className="text-blue-500" />} 
              className="hover:bg-blue-50"
            />
          </Dropdown>
        )}
      </div>

      {/* Post Content */}
      {post.contentDescription && (
        <div className="p-4 text-gray-700">
          <p>{post.contentDescription}</p>
        </div>
      )}

      {/* Media */}
      {post.mediaType === "image" && (
        <div className="w-full">
          <img 
            src={post?.mediaLink} 
            alt="Post content" 
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
          />
        </div>
      )}

      {post.mediaType === "video" && (
        <div className="w-full bg-gray-50">
          <video 
            controls 
            src={post?.mediaLink} 
            className="w-full h-auto max-h-96"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 border-b border-blue-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-blue-500">
            <Badge 
              count={likes.length} 
              showZero 
              color="#3b82f6" 
              offset={[5, 0]}
              className="font-medium"
            >
              <LikeOutlined className="text-lg" />
            </Badge>
          </div>
          <div 
            className="flex items-center text-blue-500 cursor-pointer"
            onClick={() => setShowCommentModal(true)}
          >
            <Badge 
              count={comments.length} 
              showZero 
              color="#3b82f6" 
              offset={[5, 0]}
              className="font-medium"
            >
              <CommentOutlined className="text-lg" />
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-b border-blue-50">
        <button 
          className={`flex-1 py-2 flex items-center justify-center space-x-2 transition-colors ${
            isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-blue-50'
          }`}
          onClick={toggleLike}
        >
          {isLiked ? (
            <LikeFilled className="text-blue-600 text-lg" />
          ) : (
            <LikeOutlined className="text-lg" />
          )}
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>
        
        <button 
          className="flex-1 py-2 flex items-center justify-center space-x-2 text-gray-500 hover:bg-blue-50 transition-colors"
          onClick={() => setShowCommentModal(true)}
        >
          <CommentOutlined className="text-lg" />
          <span>Comment</span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex items-center p-3 space-x-2">
        <Avatar src={snap.currentUser?.image} size={36} className="border border-blue-200" />
        <Input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onPressEnter={createComment}
          className="rounded-full bg-blue-50 border-none hover:bg-blue-100 focus:bg-blue-100"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={createComment}
          disabled={!comment}
          loading={commentAdding}
          className="bg-blue-500 border-none hover:bg-blue-600"
        />
      </div>

      {/* Comments Modal */}
      <Modal
        title={<span className="text-blue-800 font-semibold">Comments</span>}
        open={showCommentModal}
        footer={null}
        onCancel={() => {
          setShowCommentModal(false);
          setEditFocused(false);
        }}
        className="rounded-lg"
        styles={{ body: { padding: 0 } }}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => {
              if (comment.userId !== snap.currentUser.uid) {
                return <CommentCard comment={comment} key={comment.id} />;
              }
              return (
                <div key={comment.id} className="p-4 hover:bg-blue-50 transition-colors">
                  <Row align="middle">
                    <Col span={editFocused && selectedCommentId === comment.id ? 16 : 19}>
                      {editFocused && selectedCommentId === comment.id ? (
                        <Input
                          defaultValue={comment.commentText}
                          onChange={(e) => {
                            setUpdatingCommentId(comment.id);
                            setUpdatingCommentText(e.target.value);
                          }}
                          autoFocus
                          className="bg-blue-50 border-none"
                        />
                      ) : (
                        <div className="flex items-start">
                          <Avatar src={snap.currentUser?.image} size={36} className="mr-3" />
                          <div>
                            <div className="font-medium text-blue-800">{snap.currentUser?.username}</div>
                            <div className="text-gray-700">{comment.commentText}</div>
                          </div>
                        </div>
                      )}
                    </Col>
                    {editFocused && selectedCommentId === comment.id ? (
                      <Col span={8} className="flex justify-end space-x-2">
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => updateComment(comment.id)}
                          loading={commentUploading}
                          className="bg-blue-500 border-none"
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => deleteComment(comment.id)}
                          loading={commentDeleting}
                        />
                      </Col>
                    ) : (
                      <Col span={5} className="flex justify-end">
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          onClick={() => {
                            setSelectedCommentId(comment.id);
                            setEditFocused(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              );
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default FriendsPost;