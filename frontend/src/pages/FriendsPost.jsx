import React from "react";

const FriendsPost = () => {
  return <div>
    // Add these safety checks to the FriendsPost component

// 1. Update the renderItem function in the modal to handle cases where snap.currentUser might be null:
renderItem={(comment) => {
  // Check if current user exists
  if (!snap.currentUser || comment.userId !== snap.currentUser.uid) {
    return <CommentCard comment={comment} key={comment.id} />;
  }
  
  return (
    <Row className="comment-item" key={comment.id}>
      {/* Rest of your existing code */}
    </Row>
  );
}}

// 2. Add null checking for post.userId:
useEffect(() => {
  if (!post || !post.userId) {
    console.warn("Post missing required data:", post);
    return;
  }
  
  UserService.getProfileById(post.userId)
    .then((value) => {
      setUserData(value);
    })
    .catch((err) => {
      console.log(`error getting user data ${err}`);
    });
    
  if (post.id) {
    getLikesRelatedToPost();
    getCommentsRelatedToPost();
  }
}, [post]);

// 3. Add null checks in functions that use post.id:
const getLikesRelatedToPost = async () => {
  if (!post || !post.id) return;
  
  try {
    const result = await LikeService.getLikesByPostId(post.id);
    setLikes(result || []);
  } catch (error) {
    console.error("Error fetching likes:", error);
    setLikes([]);
  }
};

const getCommentsRelatedToPost = async () => {
  if (!post || !post.id) return;
  
  try {
    const result = await CommentService.getCommentsByPostId(post.id);
    setComments(result || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    setComments([]);
  }
};

// 4. Add checks for snap.currentUser in functions that use it:
const createComment = async () => {
  if (!comment) return;
  if (!snap.currentUser) {
    message.info("Please sign in to comment");
    return;
  }
  
  try {
    setCommentAdding(true);
    const body = {
      postId: post.id,
      userId: snap.currentUser.uid,
      commentText: comment,
    };
    await CommentService.createComment(
      body,
      snap.currentUser.username,
      snap.currentUser.uid
    );
    setComment("");
    await getCommentsRelatedToPost();
  } catch (error) {
    message.error("Failed to add comment");
  } finally {
    setCommentAdding(false);
  }
};

const toggleLike = () => {
  if (!snap.currentUser) {
    message.info("Please sign in to like posts");
    return;
  }
  
  if (isLiked) {
    handleUnlike();
  } else {
    handleLike();
  }
};

// 6. Add null checking in the render section:
// Replace this line:
{post.userId === snap.currentUser?.uid && (
  <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
    <Button type="text" icon={<MoreOutlined />} className="more-options" />
  </Dropdown>
)}

// Add null checking for comment section:
<div className="comment-input">
  <Avatar src={snap.currentUser?.image} size={36} />
  <Input
    placeholder={snap.currentUser ? "Write a comment..." : "Sign in to comment"}
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    onPressEnter={snap.currentUser ? createComment : null}
    disabled={!snap.currentUser}
  />
  <Button
    type="primary"
    shape="circle"
    icon={<SendOutlined />}
    onClick={createComment}
    disabled={!comment || !snap.currentUser}
    loading={commentAdding}
  />
</div>
};


export default FriendsPost;
